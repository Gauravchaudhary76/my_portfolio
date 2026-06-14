# Modern Developer Portfolio & Contact Console

A highly polished, responsive, full-stack personal portfolio application designed with a sleek, tech-forward aesthetic. It features an interactive layout, immersive typography, dynamic performance statistics, and an advanced **Secure Communications Recruiter Console** powered by Express and Nodemailer.

---

## 🎨 Design Concept & Visuals

- **Slate Cyber Theme**: A custom dark palette built with high-contrast emerald details, rich slate variations, and deep negative space.
- **Micro-interactions**: Outfitted with responsive hover frames, glowing indicators, and fluid transition layouts powered by `motion`.
- **Typographic System**: Features a strong pairing of high-legibility display elements with monospace accents for terminal-inspired labels.

---

## 🚀 Key Features

- **Recruiter Dispatch Console**: A secure gateway allowing recruiters to submit messages, seamlessly persist contacts, and trigger immediate email alerts to the administrator using a robust Gmail SMTP transport pipeline.
- **Fail-safe Dispatch Protocol**: If an offline state is detected or email credentials are not fully updated, the console gracefully preserves submitted payloads to the database and displays state-specific alerts with a direct device-native client bypass (`mailto:`).
- **Comprehensive Developer Index**: Beautiful showcase segments displaying technology stacks, project portfolios, professional milestones, and real-time interactive dashboards.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Motion/React, Lucide Icons
- **Backend / API**: Express, Node.js, Tsx (development server runner)
- **Email Pipeline**: Nodemailer with SMTP integration
- **Development Tooling**: TypeScript, Dotenv, Esbuild (production bundling pipeline)

---

## 📋 Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`) to set up your persistent services and email transmission pipeline:

```env
# Server Ingress Settings
PORT=3000

# Nodemailer Credentials (Sender Gmail Details)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"

# Target Mailbox (Where you want to receive emails)
RECEIVER_EMAIL="your-email@gmail.com"
```

> **Note on Gmail SMTP**: To use your Gmail account to send out form notifications, make sure to enable **2-Step Verification** in your Google Account settings, search for **App Passwords**, generate a new password (a 16-character code), and set it as `EMAIL_PASS`.

---

## 📦 Installation & Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will boot up and will be accessible at `http://localhost:3000`.

### 3. Production Build & Bundling
Compile the React single-page frontend application along with bundling the TypeScript backend into a CJS package:
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```
