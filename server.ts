import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { MessageModel } from "./src/db/Message.ts";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Lazy initialize GoogleGenAI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Falling back to local static query parser.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-memory fallback database for visitor messages when MongoDB is not connected
const fallbackDb: any[] = [];

// Configure mongoose global settings to prevent buffering hangs in serverless environments
mongoose.set("bufferCommands", false);

// Lazy MongoDB Connection helper optimized for serverless environments
let cachedDbConnection: any = null;

async function connectToMDB(): Promise<boolean> {
  const mongoUri = process.env.MONGO_URI?.trim();
  if (!mongoUri || (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://"))) {
    return false;
  }

  if (cachedDbConnection && (mongoose.connection.readyState as any) === 1) {
    return true;
  }

  try {
    if ((mongoose.connection.readyState as any) === 2) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if ((mongoose.connection.readyState as any) === 1) return true;
    }

    cachedDbConnection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000, 
    });
    console.log("SUCCESS: Securely synced with MongoDB data cluster.");
    return true;
  } catch (err: any) {
    console.error("WARNING: MongoDB connection failed or timed out. Falling back to local system database memory.", err.message);
    return false;
  }
}

// Nodemailer Transporter Configuration with custom SMTP support
const getMailTransporter = () => {
  let smtpHost = (process.env.SMTP_HOST || "").trim().replace(/^['"]|['"]$/g, "");
  let smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = (process.env.SMTP_USER || "").trim().replace(/^['"]|['"]$/g, "");
  const smtpPass = (process.env.SMTP_PASS || "").trim().replace(/^['"]|['"]$/g, "");
  const smtpService = (process.env.SMTP_SERVICE || "").trim().replace(/^['"]|['"]$/g, "");

  const user = smtpUser || (process.env.EMAIL_USER || "").trim().replace(/^['"]|['"]$/g, "");
  const pass = smtpPass || (process.env.EMAIL_PASS || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");

  if (user && (user.includes("brevo") || user.includes("sib") || pass.startsWith("xsmtpsib-"))) {
    if (!smtpHost) {
      smtpHost = "smtp-relay.brevo.com";
      smtpPort = 587;
      console.log(`[SMTP_DIAGNOSTICS] Auto-detected Brevo SMTP credentials! routing through smtp-relay.brevo.com:587`);
    }
  }

  if (smtpHost && user && pass) {
    console.log(`[SMTP_DIAGNOSTICS] Configuring custom SMTP transporter: host=${smtpHost}, port=${smtpPort}`);
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465 || process.env.SMTP_SECURE === "true",
      auth: { user, pass },
      connectionTimeout: 4000,
      greetingTimeout: 3000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  if (user && pass) {
    console.log(`[SMTP_DIAGNOSTICS] Configuring Gmail/Service transporter for user: "${user}"`);
    return nodemailer.createTransport({
      service: smtpService || "gmail",
      auth: { user, pass },
      connectionTimeout: 2500,
      greetingTimeout: 2000,
      socketTimeout: 3000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  console.warn("[SMTP_DIAGNOSTICS] Transporter offline. Real email credentials are missing in environment.");
  return null;
};

async function triggerSMTPDirect(subject: string, text: string, ownerEmail: string, cleanUser: string, brevoApiKey: string): Promise<string> {
  const customSmtpUser = (process.env.SMTP_USER || "").trim().replace(/^['"]|['"]$/g, "");
  const customSmtpPass = (process.env.SMTP_PASS || "").trim().replace(/^['"]|['"]$/g, "");

  const smtpPass = customSmtpPass || (brevoApiKey && brevoApiKey.startsWith("xsmtpsib-") ? brevoApiKey : "xsmtpsib-46fe898fd95374763dbe775d168f776a6e59c776d162c1dca8a7c84f13057d9b-w58VltfA5ovQJIKa");
  
  const smtpHost = "smtp-relay.brevo.com";
  const smtpPort = 587;

  let resolvedSmtpUser = "";
  let resolvedFromEmail = "gauravkr11311@gmail.com";

  try {
    const currentKey = brevoApiKey || "xsmtpsib-46fe898fd95374763dbe775d168f776a6e59c776d162c1dca8a7c84f13057d9b-w58VltfA5ovQJIKa";
    console.log(`[SMTP_FALLBACK] Dynamically querying Brevo API /v3/account for correct SMTP Login username.`);
    const res = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api-key": currentKey,
      }
    });
    if (res.ok) {
      const data: any = await res.json();
      if (data.relay?.data?.userName) {
        resolvedSmtpUser = data.relay.data.userName;
      }
      if (data.email) {
        resolvedFromEmail = data.email;
      }
    }
  } catch (apiErr: any) {
    console.warn(`[SMTP_FALLBACK] /v3/account query exception: ${apiErr.message}. Using smart fallback.`);
  }

  const candidates = [
    customSmtpUser,
    resolvedSmtpUser,
    "aeb436001@smtp-brevo.com",
    cleanUser,
    ownerEmail,
    "gauravkr11311@gmail.com"
  ].filter((u): u is string => typeof u === "string" && u.trim().length > 0);

  const uniqueCandidates = Array.from(new Set(candidates));
  let lastErrorMsg = "";

  for (const smtpUserCandidate of uniqueCandidates) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: { user: smtpUserCandidate, pass: smtpPass },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 6000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const fromEmail = (cleanUser && cleanUser.includes("@")) ? cleanUser : resolvedFromEmail;
      const mailOptions = {
        from: `"Portfolio Alert" <${fromEmail}>`,
        to: ownerEmail,
        subject: subject,
        text: text,
      };

      const info = await transporter.sendMail(mailOptions);
      return "dispatched_successfully";
    } catch (err: any) {
      lastErrorMsg = err.message;
      const lower = err.message.toLowerCase();
      if (!lower.includes("login") && !lower.includes("auth") && !lower.includes("535") && !lower.includes("credentials")) {
        break;
      }
    }
  }

  return `failed_error: Brevo SMTP Relay failed - ${lastErrorMsg}`;
}

// POST Endpoint: Form Despatch
app.post("/api/recruiter/despatch", async (req: Request, res: Response): Promise<void> => {
  try {
    const { recruiterName, companyEmail, messageBody } = req.body;

    if (!recruiterName || !companyEmail || !messageBody) {
      res.status(400).json({
        success: false,
        error: "Compilation Error: All fields are required.",
      });
      return;
    }

    const payload = {
      recruiterName,
      companyEmail,
      messageBody,
      timestamp: new Date(),
    };

    let savedData = null;
    const isDbConnected = await connectToMDB();
    if (isDbConnected && mongoose.connection.readyState === 1) {
      try {
        const newMessage = new MessageModel(payload);
        savedData = await newMessage.save();
      } catch (dbErr: any) {
        fallbackDb.push(payload);
        savedData = { ...payload, _id: "fallback_" + Math.random().toString(36).substr(2, 9) };
      }
    } else {
      fallbackDb.push(payload);
      savedData = { ...payload, _id: "local_" + Math.random().toString(36).substr(2, 9) };
    }

    const resendApiKey = (process.env.RESEND_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const sendgridApiKey = (process.env.SENDGRID_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const brevoApiKey = (process.env.BREVO_API_KEY || "xsmtpsib-46fe898fd95374763dbe775d168f776a6e59c776d162c1dca8a7c84f13057d9b-w58VltfA5ovQJIKa").trim().replace(/^['"]|['"]$/g, "");
    const web3formsAccessKey = (process.env.WEB3FORMS_ACCESS_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const ownerEmail = (process.env.RECEIVER_EMAIL || "gauravkr11311@gmail.com").trim().replace(/^['"]|['"]$/g, "");
    const cleanUser = (process.env.EMAIL_USER || "").trim().replace(/^['"]|['"]$/g, "");

    const emailSubject = `💼 Gaurav's Portfolio: Contact Alert from ${recruiterName} (${companyEmail})`;
    const emailText = `SYSTEM MESSAGE CONSOLE: NEW ENQUIRY DESPATCHED\nFrom Recruiter : ${recruiterName}\nCompany Email  : ${companyEmail}\n\nMESSAGE BODY:\n${messageBody}`;

    let emailStatus = "simulated_offline";

    if (resendApiKey) {
      try {
        let fromSender = cleanUser;
        if (!fromSender || fromSender.includes("gmail") || !fromSender.includes("@")) {
          fromSender = "onboarding@resend.dev";
        }
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `Portfolio Alert <${fromSender}>`,
            to: [ownerEmail],
            subject: emailSubject,
            text: emailText,
          }),
        });
        if (resendResponse.ok) emailStatus = "dispatched_successfully";
      } catch (err: any) {
        emailStatus = `failed_error: ${err.message}`;
      }
    } else if (sendgridApiKey) {
      try {
        let fromSender = cleanUser || "onboarding@resend.dev";
        const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sendgridApiKey}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: ownerEmail }] }],
            from: { email: fromSender },
            subject: emailSubject,
            content: [{ type: "text/plain", value: emailText }],
          }),
        });
        if (sgResponse.ok) emailStatus = "dispatched_successfully";
      } catch (err: any) {
        emailStatus = `failed_error: ${err.message}`;
      }
    } else if (brevoApiKey) {
      if (brevoApiKey.startsWith("xsmtpsib-")) {
        emailStatus = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
      } else {
        try {
          let fromSender = cleanUser || ownerEmail;
          const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "accept": "application/json",
              "api-key": brevoApiKey,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sender: { name: "Portfolio Alert", email: fromSender },
              to: [{ email: ownerEmail }],
              subject: emailSubject,
              textContent: emailText,
            }),
          });
          const brevoJson: any = await brevoResponse.json();
          if (brevoResponse.ok) {
            emailStatus = "dispatched_successfully";
          } else {
            const errmsg = brevoJson.message || JSON.stringify(brevoJson);
            if (errmsg.includes("IP") || errmsg.includes("authorized_ips")) {
              emailStatus = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
            } else {
              emailStatus = `failed_error: Brevo API reject - ${errmsg}`;
            }
          }
        } catch (err: any) {
          emailStatus = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
        }
      }
    } else if (web3formsAccessKey) {
      try {
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            name: recruiterName,
            email: companyEmail,
            message: messageBody,
            subject: emailSubject,
          }),
        });
        const web3Json: any = await web3Response.json();
        if (web3Response.ok && web3Json.success) emailStatus = "dispatched_successfully";
      } catch (err: any) {
        emailStatus = `failed_error: ${err.message}`;
      }
    } else {
      const transporter = getMailTransporter();
      if (transporter) {
        try {
          const mailOptions = {
            from: cleanUser.includes("@") ? cleanUser : `"Portfolio Alert" <no-reply@portfolio.com>`,
            to: ownerEmail,
            subject: emailSubject,
            text: emailText,
          };
          const sendMailPromise = transporter.sendMail(mailOptions);
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("SMTP timeout.")), 2200)
          );
          await Promise.race([sendMailPromise, timeoutPromise]);
          emailStatus = "dispatched_successfully";
        } catch (emailErr: any) {
          emailStatus = `failed_error: ${emailErr.message}`;
        }
      }
    }

    res.status(200).json({
      success: true,
      messageId: savedData._id,
      emailStatus,
      payload: savedData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Internal Kernel Exception: ${err.message}`,
    });
  }
});

// Helper static data lookup
function getStaticFallback(normalizedQuery: string, matchSkills: string[], matchProjects: string[], matchInternship: string[], matchSpi: string[], matchNcc: string[], matchCertifications: string[], matchSocial: string[]): string {
  const containsKeyword = (text: string, keywords: string[]) => keywords.some((kw) => text.includes(kw));
  if (containsKeyword(normalizedQuery, matchSkills)) {
    return `[SYSTEM::TECHNICAL_COMPETENCIES]\n> Software Programming : Python, JavaScript, Java, Verilog, VHDL, Embedded Software Dev\n> Hardware & EDA Toolsets: LTspice, Proteus, Multisim, Logisim, Quartus, Arduino, MATLAB`;
  } else if (containsKeyword(normalizedQuery, matchProjects)) {
    return `[SYSTEM::DEPLOYED_ARCHITECTURES]\n> AlgoFlow Analyzer : Built an AI-driven visual data structures platform.\n> Jarvis Assistant  : Asynchronous concurrent Python broker under 200ms benchmark.`;
  } else if (containsKeyword(normalizedQuery, matchInternship)) {
    return `[SYSTEM::FIELD_EXPERIENCE]\n> Wireless Systems @ RINL VSP : Optimized VHF base configurations, increasing signal gain by 15%.`;
  } else if (containsKeyword(normalizedQuery, matchSpi)) {
    return `[SYSTEM::ACADEMIC_PROFILES]\n> Degree & Focus        : Bachelor of Technology (ECE) @ NIT Manipur\n> Performance Trajectory : Active progression with an SPI of 7.94.`;
  } else if (containsKeyword(normalizedQuery, matchNcc)) {
    return `[SYSTEM::LEADERSHIP_REGISTERS]\n> NCC Wing & Cadence: Cadet leader holding Grade 'A' NCC Certifications.`;
  } else if (containsKeyword(normalizedQuery, matchCertifications)) {
    return `[SYSTEM::ACCREDITED_CREDENTIALS]\n> Certified in Embedded System Design (C / Open-Source VLSI tools).`;
  } else if (containsKeyword(normalizedQuery, matchSocial)) {
    return `[SYSTEM::DIGITAL_NETWORKS]\n> LinkedIn: gaurav-chaudhary76\n> GitHub: Gauravchaudhary76`;
  }
  return `[SYSTEM::FALLBACK] Ready for primary registers.`;
}

// POST Endpoint: Kernel Query AI
app.post("/api/kernel/query", async (req: Request, res: Response) => {
  const { query, history } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ success: false, response: "Query must be a non-empty string." });
  }

  const normalizedQuery = query.toLowerCase().trim();
  const matchSkills = ["skill", "skills", "languages", "programming", "frameworks", "tools", "competencies", "hardware", "verilog", "vhdl"];
  const matchProjects = ["project", "projects", "algoflow", "jarvis", "system", "embedded"];
  const matchInternship = ["internship", "rinl", "visakhapatnam", "research", "steel plant"];
  const matchSpi = ["spi", "cgpa", "grades", "percentage", "academic", "academics", "education"];
  const matchNcc = ["ncc", "national cadet corps", "cadet", "military", "discipline"];
  const matchCertifications = ["certification", "certifications", "certificate", "certificates", "courses", "training"];
  const matchSocial = ["instagram", "insta", "social", "contact", "linkedin", "github", "profile", "profiles"];

  let responseText = "";

  if (normalizedQuery === "skills") {
    responseText = `[SYSTEM::TECHNICAL_COMPETENCIES]\n> Software Programming : Python, JavaScript, Java, Verilog, VHDL, Embedded Software Dev\n> Hardware & EDA Toolsets: LTspice, Proteus, Multisim, Logisim, Quartus, Arduino, MATLAB`;
  } else if (normalizedQuery === "projects") {
    responseText = `[SYSTEM::DEPLOYED_ARCHITECTURES]\n> AlgoFlow Analyzer : Visual data structures platform.\n> Jarvis Assistant  : Concurrent Python broker.`;
  } else if (normalizedQuery === "internship") {
    responseText = `[SYSTEM::FIELD_EXPERIENCE]\n> Wireless Systems @ RINL VSP : Optimized VHF base configurations.`;
  } else if (normalizedQuery === "spi" || normalizedQuery === "grades") {
    responseText = `[SYSTEM::ACADEMIC_PROFILES]\n> B.Tech (ECE) @ NIT Manipur. 6th Sem SPI: 7.94.`;
  } else if (normalizedQuery === "ncc") {
    responseText = `[SYSTEM::LEADERSHIP_REGISTERS]\n> NCC Cadet Leader, Grade 'A' Certification.`;
  } else if (normalizedQuery === "certifications") {
    responseText = `[SYSTEM::ACCREDITED_CREDENTIALS]\n> Embedded System Design & Drone Assembly Bootcamp.`;
  } else if (normalizedQuery === "social") {
    responseText = `[SYSTEM::DIGITAL_NETWORKS]\n> GitHub: Gauravchaudhary76\n> LinkedIn: gaurav-chaudhary76`;
  } else {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const formattedHistory = Array.isArray(history)
          ? history.map((item: any) => ({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            }))
          : [];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", // Corrected model namespace here
          contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: query }] }
          ],
          config: {
            systemInstruction: `You are GAURAV_KERNEL_AI_SHELL v4.2 representing Gaurav Kumar Chaudhary. Focus on ECE and full-stack expertise short response styles. Max 2-3 sentences.`,
          },
        });
        responseText = response.text || "NO INPUT REGISTERED.";
      } catch (err: any) {
        responseText = getStaticFallback(normalizedQuery, matchSkills, matchProjects, matchInternship, matchSpi, matchNcc, matchCertifications, matchSocial);
      }
    } else {
      responseText = getStaticFallback(normalizedQuery, matchSkills, matchProjects, matchInternship, matchSpi, matchNcc, matchCertifications, matchSocial);
    }
  }

  res.json({ success: true, response: responseText });
});

// ----------------------------------------------------
// LOCAL DEV BINDINGS ONLY (Safely bypassed on Vercel)
// ----------------------------------------------------
if (!process.env.VERCEL) {
  (async () => {
    try {
      if (process.env.NODE_ENV !== "production") {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
        console.log("Vite development server linked to Express middleware.");
      } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req: Request, res: Response) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Port Ingress online. Listening at: http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Kernel Panic during local initialization:", error);
    }
  })();
}

export default app;
