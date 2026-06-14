import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { MessageModel } from "./src/db/Message";
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

  // Reuse existing connection if healthy
  if (cachedDbConnection && (mongoose.connection.readyState as any) === 1) {
    return true;
  }

  try {
    // If connection status is currently busy connecting, wait up to 1 second
    if ((mongoose.connection.readyState as any) === 2) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if ((mongoose.connection.readyState as any) === 1) return true;
    }

    cachedDbConnection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000, // Short timeout prevents Vercel lambda gateway freezes
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
    .replace(/\s+/g, ""); // Automatically remove spaces (e.g. 'xxxx xxxx xxxx xxxx')

  // AUTOMATIC BREVO DETECTION & AUTO-CONFIGURATION
  // If the user puts their Brevo SMTP login/password into EMAIL_USER/EMAIL_PASS, automatically use Brevo Relay!
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

/**
 * Direct fallback driver routing directly through verified Brevo SMTP Relay.
 * Bypasses the IP restrictions of Brevo HTTP REST queries.
 */
async function triggerSMTPDirect(subject: string, text: string, ownerEmail: string, cleanUser: string, brevoApiKey: string): Promise<string> {
  const customSmtpUser = (process.env.SMTP_USER || "").trim().replace(/^['"]|['"]$/g, "");
  const customSmtpPass = (process.env.SMTP_PASS || "").trim().replace(/^['"]|['"]$/g, "");

  // Fallback SMTP credentials: use the provided SMTP key as fallback if no pass exists
  const smtpPass = customSmtpPass || (brevoApiKey && brevoApiKey.startsWith("xsmtpsib-") ? brevoApiKey : "xsmtpsib-46fe898fd95374763dbe775d168f776a6e59c776d162c1dca8a7c84f13057d9b-w58VltfA5ovQJIKa");
  
  const smtpHost = "smtp-relay.brevo.com";
  const smtpPort = 587;

  // Let's attempt to fetch correct SMTP user and verified sender from Brevo API first
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
        console.log(`[SMTP_FALLBACK] Dynamic SMTP username resolved: "${resolvedSmtpUser}"`);
      }
      if (data.email) {
        resolvedFromEmail = data.email;
        console.log(`[SMTP_FALLBACK] Dynamic Sender Email resolved: "${resolvedFromEmail}"`);
      }
    } else {
      const errText = await res.text();
      console.warn(`[SMTP_FALLBACK] /v3/account query failed (IP restrictions might prevent API calls): ${errText}. Using smart fallback.`);
    }
  } catch (apiErr: any) {
    console.warn(`[SMTP_FALLBACK] /v3/account query exception: ${apiErr.message}. Using smart fallback.`);
  }

  // Construct a list of candidates to try for authentication
  const candidates = [
    customSmtpUser,
    resolvedSmtpUser,
    "aeb436001@smtp-brevo.com",
    cleanUser,
    ownerEmail,
    "gauravkr11311@gmail.com"
  ].filter((u): u is string => typeof u === "string" && u.trim().length > 0);

  // Remove duplicates to avoid redundant retry overhead
  const uniqueCandidates = Array.from(new Set(candidates));
  console.log(`[SMTP_FALLBACK] Initiating dispatch retry loop with candidate users:`, uniqueCandidates);

  let lastErrorMsg = "";
  for (const smtpUserCandidate of uniqueCandidates) {
    console.log(`[SMTP_FALLBACK] Attempting SMTP sending fallback using user: "${smtpUserCandidate}"`);
    console.log(`[SMTP_FALLBACK] smtpPass: "${smtpPass.substring(0, 12)}...${smtpPass.substring(smtpPass.length - 8)}"`);

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
      console.log(`[SMTP_FALLBACK] Transmitted successfully via Brevo SMTP Relay fallback with user "${smtpUserCandidate}":`, info.messageId);
      return "dispatched_successfully";
    } catch (err: any) {
      console.error(`[SMTP_FALLBACK] Brevo SMTP authentication error for user "${smtpUserCandidate}":`, err.message);
      lastErrorMsg = err.message;
      const lower = err.message.toLowerCase();
      // If it is a network socket or server connection error, do not retry other candidates as they will also fail similarly
      if (!lower.includes("login") && !lower.includes("auth") && !lower.includes("535") && !lower.includes("credentials")) {
        console.warn(`[SMTP_FALLBACK] Connection issue detected. Aborting remainder of retry loop.`);
        break;
      }
    }
  }

  return `failed_error: Brevo SMTP Relay failed - ${lastErrorMsg}`;
}

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

/**
 * Endpoint: POST /api/recruiter/despatch
 * Ingests recruiter details, saves to DB (or fallback), and sends notification email.
 */
app.post("/api/recruiter/despatch", async (req: Request, res: Response): Promise<void> => {
  try {
    const { recruiterName, companyEmail, messageBody } = req.body;

    if (!recruiterName || !companyEmail || !messageBody) {
      res.status(400).json({
        success: false,
        error: "Compilation Error: All fields (recruiterName, companyEmail, messageBody) are required.",
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

    // Secure database commit (lazy connecting inside lambda execution phase)
    const isDbConnected = await connectToMDB();
    if (isDbConnected && mongoose.connection.readyState === 1) {
      try {
        const newMessage = new MessageModel(payload);
        savedData = await newMessage.save();
      } catch (dbErr: any) {
        console.error("Database Save Interruption:", dbErr.message);
        fallbackDb.push(payload);
        savedData = { ...payload, _id: "fallback_" + Math.random().toString(36).substr(2, 9) };
      }
    } else {
      fallbackDb.push(payload);
      savedData = { ...payload, _id: "local_" + Math.random().toString(36).substr(2, 9) };
    }

    // Process notification email dispatch
    const resendApiKey = (process.env.RESEND_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const sendgridApiKey = (process.env.SENDGRID_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const brevoApiKey = (process.env.BREVO_API_KEY || "xsmtpsib-46fe898fd95374763dbe775d168f776a6e59c776d162c1dca8a7c84f13057d9b-w58VltfA5ovQJIKa").trim().replace(/^['"]|['"]$/g, "");
    const web3formsAccessKey = (process.env.WEB3FORMS_ACCESS_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    const ownerEmail = (process.env.RECEIVER_EMAIL || "gauravkr11311@gmail.com").trim().replace(/^['"]|['"]$/g, "");
    const cleanUser = (process.env.EMAIL_USER || "").trim().replace(/^['"]|['"]$/g, "");

    const emailSubject = `💼 Gaurav's Portfolio: Contact Alert from ${recruiterName} (${companyEmail})`;
    const emailText = `
SYSTEM MESSAGE CONSOLE: NEW ENQUIRY DESPATCHED
==================================================
From Recruiter : ${recruiterName}
Company Email  : ${companyEmail}
Timestamp      : ${payload.timestamp.toISOString()}
--------------------------------------------------
MESSAGE BODY:
${messageBody}
==================================================
Processed via interactive portfolio despatch protocol.
    `;

    let emailStatus = "simulated_offline";

    if (resendApiKey) {
      // 1. Prioritize HTTP REST API-based email sending via Resend (100% immune to SMTP firewalls on Vercel)
      try {
        console.log("[SMTP_FALLBACK] Prioritizing HTTP dispatch client: Resend Service");
        let fromSender = cleanUser;
        if (!fromSender || fromSender.includes("gmail") || !fromSender.includes("@")) {
          fromSender = "onboarding@resend.dev"; // Standard Resend sandbox sender
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
        const resendJson: any = await resendResponse.json();
        if (resendResponse.ok) {
          console.log("Resend API Email Transmitted Successfully:", resendJson);
          emailStatus = "dispatched_successfully";
        } else {
          console.error("Resend API rejected transmission request:", resendJson);
          emailStatus = `failed_error: Resend API reject - ${resendJson.message || JSON.stringify(resendJson)}`;
        }
      } catch (err: any) {
        console.error("Resend HTTP error:", err.message);
        emailStatus = `failed_error: Resend fetch panic - ${err.message}`;
      }
    } else if (sendgridApiKey) {
      // 2. HTTP REST API-based email sending via SendGrid
      try {
        console.log("[SMTP_FALLBACK] Prioritizing HTTP dispatch client: SendGrid Service");
        let fromSender = cleanUser;
        if (!fromSender || !fromSender.includes("@")) {
          fromSender = "onboarding@resend.dev";
        }
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
        if (sgResponse.ok) {
          console.log("SendGrid API Email Transmitted Successfully");
          emailStatus = "dispatched_successfully";
        } else {
          const errText = await sgResponse.text();
          console.error("SendGrid API rejected transmission request:", errText);
          emailStatus = `failed_error: SendGrid API reject - ${errText}`;
        }
      } catch (err: any) {
        console.error("SendGrid HTTP error:", err.message);
        emailStatus = `failed_error: SendGrid fetch panic - ${err.message}`;
      }
    } else if (brevoApiKey) {
      // 3. Email sending via Brevo (Sendinblue)
      if (brevoApiKey.startsWith("xsmtpsib-")) {
        console.log("[SMTP_FALLBACK] Dedicated Brevo SMTP Key detected. Routing directly to SMTP Relay.");
        const fallbackResult = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
        emailStatus = fallbackResult;
      } else {
        // HTTP REST API-based email sending via Brevo
        try {
          console.log("[SMTP_FALLBACK] Prioritizing HTTP dispatch client: Brevo Service");
          let fromSender = cleanUser;
          if (!fromSender || !fromSender.includes("@")) {
            fromSender = ownerEmail; // Auto-fallback to the verified account owner email
          }
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
            console.log("Brevo API Email Transmitted Successfully:", brevoJson);
            emailStatus = "dispatched_successfully";
          } else {
            console.error("Brevo API rejected transmission request:", brevoJson);
            const errmsg = brevoJson.message || JSON.stringify(brevoJson);
            // If the rejection is because of unregistered IP, use direct SMTP!
            if (errmsg.includes("IP") || errmsg.includes("unregistered") || errmsg.includes("unrecognized") || errmsg.includes("authorized_ips")) {
              console.log("[SMTP_FALLBACK] Brevo API rejected due to unregistered IP. Falling back to SMTP Relay!");
              const fallbackResult = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
              emailStatus = fallbackResult;
            } else {
              emailStatus = `failed_error: Brevo API reject - ${errmsg}`;
            }
          }
        } catch (err: any) {
          console.error("Brevo HTTP error:", err.message);
          console.log("[SMTP_FALLBACK] Brevo fetch error. Falling back to SMTP Relay!");
          const fallbackResult = await triggerSMTPDirect(emailSubject, emailText, ownerEmail, cleanUser, brevoApiKey);
          emailStatus = fallbackResult;
        }
      }
    } else if (web3formsAccessKey) {
      // 4. HTTP REST API-based email sending via Web3Forms (zero required setup outside of key)
      try {
        console.log("[SMTP_FALLBACK] Prioritizing HTTP dispatch client: Web3Forms");
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            name: recruiterName,
            email: companyEmail,
            message: messageBody,
            subject: emailSubject,
          }),
        });
        const web3Json: any = await web3Response.json();
        if (web3Response.ok && web3Json.success) {
          console.log("Web3Forms Email Transmitted Successfully:", web3Json);
          emailStatus = "dispatched_successfully";
        } else {
          console.error("Web3Forms API rejected transmission request:", web3Json);
          emailStatus = `failed_error: Web3Forms reject - ${web3Json.message || JSON.stringify(web3Json)}`;
        }
      } catch (err: any) {
        console.error("Web3Forms HTTP error:", err.message);
        emailStatus = `failed_error: Web3Forms fetch panic - ${err.message}`;
      }
    } else {
      // 3. Fall back to SMTP Nodemailer. Wrap in a strict promise timeout racer to prevent Vercel 500 lambda crashes.
      const transporter = getMailTransporter();
      if (transporter) {
        try {
          console.log("[SMTP_FALLBACK] Using classical socket SMTP Nodemailer with a strict execution timeout limit");
          const mailOptions = {
            from: cleanUser.includes("@") ? cleanUser : `"Portfolio Alert" <no-reply@portfolio.com>`,
            to: ownerEmail,
            subject: emailSubject,
            text: emailText,
          };

          // Wrap transporter.sendMail in a strict 2.2-second timeout so we respond fast instead of timing out on Vercel
          const sendMailPromise = transporter.sendMail(mailOptions);
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("SMTP connection attempt timed out. SMTP ports (587/465) are blocked by Vercel's firewalls. Please configure RESEND_API_KEY in Environment Variables for fast HTTPS transmission.")), 2200)
          );

          const info = await Promise.race([sendMailPromise, timeoutPromise]);
          console.log("SMTP Email Dispatched Successfully:", (info as any).messageId);
          emailStatus = "dispatched_successfully";
        } catch (emailErr: any) {
          console.error("Nodemailer Exception:", emailErr.message);
          emailStatus = `failed_error: ${emailErr.message}`;
        }
      } else {
        console.log("\n==============================================");
        console.log("📧 SIMULATED DISPATCH TRANSCRIPTION:");
        console.log(`FROM: ${companyEmail}`);
        console.log(`TO: ${ownerEmail}`);
        console.log(`SUBJECT: Gaurav's Portfolio Contact Alert`);
        console.log(`BODY: ${messageBody}`);
        console.log("==============================================\n");
      }
    }

    res.status(200).json({
      success: true,
      messageId: savedData._id,
      emailStatus,
      payload: savedData,
    });
  } catch (err: any) {
    console.error("Handler Exception:", err);
    res.status(500).json({
      success: false,
      error: `Internal Kernel Exception: ${err.message}`,
    });
  }
});

/**
 * Helper to produce fallback text if offline or matching error.
 */
function getStaticFallback(
  normalizedQuery: string,
  matchSkills: string[],
  matchProjects: string[],
  matchInternship: string[],
  matchSpi: string[],
  matchNcc: string[],
  matchCertifications: string[],
  matchSocial: string[]
): string {
  const containsKeyword = (text: string, keywords: string[]) => keywords.some((kw) => text.includes(kw));

  if (containsKeyword(normalizedQuery, matchSkills)) {
    return `[SYSTEM::TECHNICAL_COMPETENCIES]
> Software Programming : Python, JavaScript, Java, Verilog, VHDL, Embedded Software Dev
> Frontend & Interfaces  : React.js, Next.js, Redux, HTML5, CSS3, Tailwind CSS, Data Visualization
> Middleware & APIs      : Node.js, FastAPI, RESTful microservices, concurrent Python routines
> Hardware & EDA Toolsets: LTspice, Proteus, Multisim, Logisim, Quartus, Arduino, MATLAB
STATUS: STACK_FULLY_OPERATIONAL`;
  } else if (containsKeyword(normalizedQuery, matchProjects)) {
    return `[SYSTEM::DEPLOYED_ARCHITECTURES]
> AlgoFlow Analyzer : Built an AI-driven visual data structures platform reducing debug latency by 30%.
> Jarvis Assistant  : Crafted an asynchronous concurrent Python broker responding under 200ms benchmark.
STATUS: ACTIVE_BUILDS_VERIFIED`;
  } else if (containsKeyword(normalizedQuery, matchInternship)) {
    return `[SYSTEM::FIELD_EXPERIENCE]
> Wireless Systems @ VSP : Optimized VHF base configurations, increasing signal gain by 15%.
> SCADA & Division Logic : Mapped safety-critical emergency telecom links across a 7,000-acre plant.
STATUS: EXCELLENCE_RECORD_SYNCED`;
  } else if (containsKeyword(normalizedQuery, matchSpi)) {
    return `[SYSTEM::ACADEMIC_PROFILES]
> Degree & Focus        : Bachelor of Technology (ECE wing) @ NIT Manipur (Jan 2023 - Expected Apr 2027)
> Performance Trajectory : Outstanding active progression with a 6th Semester SPI of 7.94.
STATUS: ACADEMIC_METRICS_COMPLIANT`;
  } else if (containsKeyword(normalizedQuery, matchNcc)) {
    return `[SYSTEM::LEADERSHIP_REGISTERS]
> NCC Wing & Cadence: Cadet leader holding Grade 'A' NCC Certifications (Electronics Corps).
> Core Disciplines  : Rapid team action orchestration, fitness drill synchronization, and structured command.
STATUS: LEADERSHIP_AUTHENTICATED`;
  } else if (containsKeyword(normalizedQuery, matchCertifications)) {
    return `[SYSTEM::ACCREDITED_CREDENTIALS]
> Maven Silicon & VLSI : Certified in Embedded System Design using C and Open-Source VLSI tools.
> Drone Assembly & ML  : Completed MeitY Drone Bootcamp and ML Semiconductor Verification training.
STATUS: CREDENTIALS_CONFIRMED`;
  } else if (containsKeyword(normalizedQuery, matchSocial)) {
    return `[SYSTEM::DIGITAL_NETWORKS]
> Instagram Grid : Username: @gaurav_chaudhary76
> LinkedIn Sync  : https://linkedin.com/in/gaurav-chaudhary76
> GitHub Portal  : https://github.com/Gauravchaudhary76
STATUS: NETWORKS_FULLY_RESOLVED`;
  } else {
    return `[SYSTEM::FALLBACK_ALGORITHM]
> Identity Summary: Gaurav is an ECE undergraduate student merging physical hardware logic (SCADA, telecom) with modern full-stack web platforms.
> Action Register: Input parsed but fell outside primary registers. Please try suggested quick button registers below.
STATUS: READY_FOR_NEXT_REGISTER`;
  }
}

/**
 * Endpoint: POST /api/kernel/query
 * Acts as a micro-intelligent assistant analyzing recruiter queries.
 */
app.post("/api/kernel/query", async (req: Request, res: Response) => {
  const { query, history } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({
      success: false,
      response: "EXECUTION ERROR: Query parameter must be a non-empty string.",
    });
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Keyword categorization lists
  const matchSkills = ["skill", "skills", "languages", "programming", "frameworks", "tools", "competencies", "hardware", "verilog", "vhdl"];
  const matchProjects = ["project", "projects", "algoflow", "jarvis", "system", "embedded"];
  const matchInternship = ["internship", "rinl", "visakhapatnam", "research", "steel plant"];
  const matchSpi = ["spi", "cgpa", "grades", "percentage", "academic", "academics", "education"];
  const matchNcc = ["ncc", "national cadet corps", "cadet", "military", "discipline"];
  const matchCertifications = ["certification", "certifications", "certificate", "certificates", "courses", "training"];
  const matchSocial = ["instagram", "insta", "social", "contact", "linkedin", "github", "profile", "profiles"];

  let responseText = "";

  // Exact static commands for quick click actions (bypassing AI latency)
  if (normalizedQuery === "skills") {
    responseText = `[SYSTEM::TECHNICAL_COMPETENCIES]
> Software Programming : Python, JavaScript, Java, Verilog, VHDL, Embedded Software Dev
> Frontend & Interfaces  : React.js, Next.js, Redux, HTML5, CSS3, Tailwind CSS, Data Visualization
> Middleware & APIs      : Node.js, FastAPI, RESTful microservices, concurrent Python routines
> Hardware & EDA Toolsets: LTspice, Proteus, Multisim, Logisim, Quartus, Arduino, MATLAB
STATUS: STACK_FULLY_OPERATIONAL`;
  } else if (normalizedQuery === "projects") {
    responseText = `[SYSTEM::DEPLOYED_ARCHITECTURES]
> AlgoFlow Analyzer : Built an AI-driven visual data structures platform reducing debug latency by 30%.
> Jarvis Assistant  : Crafted an asynchronous concurrent Python broker responding under 200ms benchmark.
STATUS: ACTIVE_BUILDS_VERIFIED`;
  } else if (normalizedQuery === "internship") {
    responseText = `[SYSTEM::FIELD_EXPERIENCE]
> Wireless Systems @ VSP : Optimized VHF base configurations, increasing signal gain by 15%.
> SCADA & Division Logic : Mapped safety-critical emergency telecom links across a 7,000-acre plant.
STATUS: EXCELLENCE_RECORD_SYNCED`;
  } else if (normalizedQuery === "spi" || normalizedQuery === "grades") {
    responseText = `[SYSTEM::ACADEMIC_PROFILES]
> Degree & Focus        : Bachelor of Technology (ECE wing) @ NIT Manipur (Jan 2023 - Expected Apr 2027)
> Performance Trajectory : Outstanding active progression with a 6th Semester SPI of 7.94.
STATUS: ACADEMIC_METRICS_COMPLIANT`;
  } else if (normalizedQuery === "ncc") {
    responseText = `[SYSTEM::LEADERSHIP_REGISTERS]
> NCC Wing & Cadence: Cadet leader holding Grade 'A' NCC Certifications (Electronics Corps).
> Core Disciplines  : Rapid team action orchestration, fitness drill synchronization, and structured command.
STATUS: LEADERSHIP_AUTHENTICATED`;
  } else if (normalizedQuery === "certifications") {
    responseText = `[SYSTEM::ACCREDITED_CREDENTIALS]
> Maven Silicon & VLSI : Certified in Embedded System Design using C and Open-Source VLSI tools.
> Drone Assembly & ML  : Completed MeitY Drone Bootcamp and ML Semiconductor Verification training.
STATUS: CREDENTIALS_CONFIRMED`;
  } else if (normalizedQuery === "instagram" || normalizedQuery === "insta" || normalizedQuery === "social") {
    responseText = `[SYSTEM::DIGITAL_NETWORKS]
> Instagram Grid : Username: @gaurav_chaudhary76
> LinkedIn Sync  : https://linkedin.com/in/gaurav-chaudhary76
> GitHub Portal  : https://github.com/Gauravchaudhary76
STATUS: NETWORKS_FULLY_RESOLVED`;
  } else {
    // Dynamic Query using Gemini Chat
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
          model: "gemini-3.5-flash",
          contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: query }] }
          ],
          config: {
            systemInstruction: `You are GAURAV_KERNEL_AI_SHELL v4.2, an advanced cyber-physical system agent representing Gaurav Kumar Chaudhary.
Your role: Intelligently represent Gaurav as his extremely capable, technical portfolio AI assistant.
Gaurav's Background:
- ECE B.Tech candidate @ NIT Manipur (Jan 2023 - expected graduation Apr 2027), current SPI score is 7.94.
- Expertise: Embedded software systems, SCADA grids, wireless communication, PLC logic, combined with modern React.js, Node.js, FastAPI, and concurrent Python routines.
- Fieldwork Deployment: Research Intern at RINL Visakhapatnam Steel Plant, analyzing industrial wireless communication structures and SCADA systems, optimizing signal reliability by 15%.
- Key Projects:
  1. AlgoFlow: Real-time visual data structures and AI algorithm learning console built with React, Vite, and Groq (Llama 3), lowering algorithm debugging latency by 30%.
  2. Jarvis AI: High-speed speech-to-text / text-to-speech virtual personal assistant built with asynchronous concurrent Python loops yielding sub-200ms API queries.
- Extracurricular Achievements: NCC Cadet Leader holding Grade 'A' NCC qualifications, GDG NIT Manipur active member, Cygnus Robotics & IoT Club.
- Social Accounts: LinkedIn (gaurav-chaudhary76), GitHub (Gauravchaudhary76), and Instagram (@gaurav_chaudhary76).

Response Formatting Rules (CRITICAL):
1. Always behave as an expert, responsive portfolio chatbot.
2. Keep outputs highly clean, elegant, and extremely short — 2 to 3 sentences max unless a specific list is requested. No huge walls of text!
3. Format bullets or major parameters with dynamic arrow prefixes (e.g., '> Topic: Details').
4. Never use heavy columns of equals signs (====).
5. If the user asks about unrelated topics, answer in character professionally but steer them back to asking about Gaurav's ECE/full-stack expertise, experience, projects, or credentials.`,
          },
        });

        responseText = response.text || "NO INPUT REGISTERED BY DEPLOYED AGENTS.";
      } catch (err: any) {
        console.error("Gemini chatbot error:", err);
        responseText = getStaticFallback(normalizedQuery, matchSkills, matchProjects, matchInternship, matchSpi, matchNcc, matchCertifications, matchSocial);
      }
    } else {
      responseText = getStaticFallback(normalizedQuery, matchSkills, matchProjects, matchInternship, matchSpi, matchNcc, matchCertifications, matchSocial);
    }
  }

  res.json({
    success: true,
    response: responseText,
  });
});

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------
async function initializeServer() {
  if (process.env.VERCEL) {
    console.log("Vercel Serverless active. Routing through Vercel CDN and edge handler. Skipping local ports bindings.");
    return;
  }

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
    console.log("Static production assets mounted from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Port Ingress online. Server listening at: http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  initializeServer().catch((error) => {
    console.error("Kernel Panic during startup sequence:", error);
  });
}

export default app;
