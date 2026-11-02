# MedVerseAI

MedVerseAI is a healthcare operations and clinical-workflow demo built with Next.js, Firebase, and Genkit. It provides role-based dashboards, patient chart views, and an AI-generated patient summary. The repository also contains broader product concepts that are not yet implemented; see [Current scope](#current-scope-and-limitations).

> **Important:** This project is a prototype, not a medical device or production EHR. Do not use it to diagnose or treat patients, or enter real patient information. AI output can be inaccurate and must not replace clinical judgment. The sample-data seeder writes to the Firebase project configured by the app and is intended only for isolated development/test projects.

## UI overview

After signing in, the dashboard layout presents a role-specific left navigation, a top bar with the signed-in user and department, search, notifications, and logout. An AI Assistant opens from the navigation. The available workspaces include:

- **Physician (`/dashboard/physician`)** — patient list and search, patient details, allergies and vital-sign panels, problem and medication tabs, and controls for adding patients and orders.
- **Nurse (`/dashboard/nurse`)** — an at-a-glance view of assigned patients, vital alerts, medication schedule, and quick-action cards. Some dashboard values and patient examples are currently static demo content.
- **Patient portal (`/dashboard/patient-portal`)** — health summary plus cards for appointments, results, bills, and messaging.
- **Radiology, lab, pharmacy, and billing** — role-specific worklist/dashboard routes.
- **Administration** — user directory and departmental workspaces for system administration, HR/credentialing, medical affairs, department heads, IT, cybersecurity, HIS/EMR, and compliance.
- **AI Patient Summary (`/dashboard/ai-summary`)** — searches for a patient and asks Genkit/Google AI to summarize chart information, including conditions, medications, allergies, and recent notes.

The app uses a clean, light clinical interface with teal/blue accents, cards, badges, and healthcare-oriented icons. Navigation and initial dashboard routing depend on the user's Firebase Auth account and corresponding Firestore `users` document.

## Technology

- Next.js 14 (App Router), React 18, and TypeScript
- Firebase Authentication and Cloud Firestore
- Genkit with the Google AI plugin for patient-chart summarization
- Tailwind CSS, Radix UI, and Lucide icons

## Requirements

- Node.js 20 (see `.idx/dev.nix`) and npm
- A Firebase project with Email/Password Authentication enabled and a Cloud Firestore database
- A Google AI API key for AI-powered features

## Installation and configuration

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/roime81/MedVerseAI.git
   cd MedVerseAI
   npm ci
   ```

2. Create or select a **dedicated development/test Firebase project**. Enable **Email/Password** in Firebase Authentication and create a Firestore database.

3. Register a web app in Firebase Console and copy its web-app configuration into `src/firebase/config.ts`, replacing the existing project values. Review `firestore.rules` and publish those rules to your Firestore database before using the app. The checked-in Firebase configuration is project-specific; use your own project for development.

4. Add the Google AI API key to a local `.env.local` file in the repository root:

   ```dotenv
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```

   Keep this key private and do not prefix it with `NEXT_PUBLIC_` or commit `.env.local`. The rest of the app can be explored without configuring the AI key, but AI-powered requests will need it.

## Seed development data

To populate the configured Firebase project with the sample users and clinical records, run:

```bash
npm run seed
```

The script uses `src/lib/sample-data.ts` and creates Firebase Authentication users as well as Firestore data. It can overwrite seeded Firestore documents when run again. **Only run it against an isolated test project**; do not use it against production or a database containing real patient data. Seeded account details are defined in the source data file.

## Run locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with an account created by the seed script or an account whose Firebase Auth user and Firestore `users/{uid}` profile are both configured. The profile's role and department determine the workspace shown after login.

For a production build and local production server:

```bash
npm run build
npm run start
```

The start command serves the build on port 3000 by default. Available package scripts are `dev`, `build`, `start`, `lint`, and `seed`.

## Current scope and limitations

The working application currently includes Firebase-backed authentication and patient/chart data flows, role-based workspaces, and an AI patient-summary flow. Some screen content is demonstration data, and not every visible action is connected to a complete backend workflow.

The product blueprint also describes intelligent appointment scheduling, real-time bed management, medication reconciliation and interaction checking, telehealth/remote monitoring, and DICOM image archiving. These are roadmap concepts, not claims of complete functionality in this repository. Verify implementation and integration requirements before relying on any workflow.

## Repository structure

```text
src/
  ai/                 Genkit setup and AI flows
  app/                Next.js routes and role-based workspaces
  components/         Shared UI, auth, and dashboard components
  firebase/           Firebase initialization, providers, and Firestore hooks
  lib/                Types, schemas, sample data, and database seeder
docs/                 Product blueprint and backend notes
firestore.rules       Firestore security rules
```

## Data and security notes

This application handles healthcare-shaped data and should be treated as a demo. Review and adapt the Firestore security rules, authentication, authorization, privacy, audit logging, retention, and deployment configuration before any real-world use. The included Firestore rules are not a substitute for a security or compliance review, and this project makes no regulatory-compliance claim.
