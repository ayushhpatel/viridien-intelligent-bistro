# The Intelligent Bistro 🍽️✨

The Intelligent Bistro is a modern, full-stack, AI-powered restaurant ordering application. It combines a premium mobile-first user experience with an advanced natural language processing backend, allowing users to build and modify their carts conversationally.

---

## 📸 Screenshots & Demo

*(Placeholder for Loom Demo Link - e.g., [Watch the 5-Minute Technical Walkthrough here](https://loom.com/))*

| Menu Browsing | Conversational Ordering | Cart Checkout |
|:---:|:---:|:---:|
| *(Add screenshot of MenuScreen here)* | *(Add screenshot of ChatInterface here)* | *(Add screenshot of CartScreen here)* |

---

## 🚀 Key Features

1. **AI Conversational Ordering**: Users can type complex requests like "Add 2 spicy chicken sandwiches, but remove one if it's over $20", and the backend orchestrates deterministic cart mutations.
2. **Premium Fluid UX**: Features a fully custom design system using TailwindCSS, glassmorphism elements, native layout animations, and robust safe-area handling.
3. **Optimized State Management**: Powered by Zustand for zero-boilerplate, high-performance local state, and React Query for reliable remote data synchronization.
4. **Resilient Architecture**: Robust error handling, strict TypeScript boundaries, and Zod-validated data parsing ensure the application never crashes from unexpected input.

---

## 🧠 Architecture Summary

The application is structured as a modern Monorepo using npm workspaces, separating the mobile client from the Node.js API.

### Tech Stack
- **Frontend**: React Native, Expo, NativeWind (Tailwind CSS), Zustand, TanStack Query.
- **Backend**: Node.js, Express, TypeScript, Zod, Google Gemini AI (via OpenAI SDK compatibility).
- **Tooling**: Jest for unit testing, ESLint/Prettier for formatting.

### AI Architecture
To achieve reliable natural language ordering without hallucinated cart mutations:
1. **Context Injection**: The client sends the user's message *alongside* the current cart state to the Node.js backend.
2. **System Prompting**: The backend injects a strict system prompt instructing the LLM to act as a structured parser, returning ONLY a specific JSON schema.
3. **Validation Boundary**: The LLM's response is caught by `Zod`. If the JSON is malformed or hallucinates unallowed actions, it fails gracefully.
4. **Deterministic Execution**: The validated structured actions (`ADD_ITEM`, `UPDATE_QUANTITY`, `REMOVE_ITEM`) are returned to the client and deterministically executed against the Zustand store.

---

## 📂 Folder Structure

```text
intelligent-bistro/
├── packages/
│   ├── api/                  # Express.js Backend
│   │   ├── src/
│   │   │   ├── data/         # Mock database/menu items
│   │   │   ├── prompts/      # LLM System Prompts
│   │   │   ├── routes/       # API endpoints (/menu, /chat)
│   │   │   ├── services/     # AI parsing logic
│   │   │   └── validators/   # Zod Schemas
│   └── app/                  # React Native Mobile App
│       ├── src/
│       │   ├── components/   # Reusable UI (CartItemRow, ChatInterface)
│       │   ├── screens/      # Main Views (Menu, Cart)
│       │   ├── services/     # API Clients (Axios)
│       │   └── store/        # Zustand state
└── package.json              # Monorepo configuration
```

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Expo Go app on your physical device (or iOS Simulator / Android Emulator)

### 2. Installation
Clone the repository and install dependencies from the root:
```bash
npm install
```

### 3. Environment Configuration
Navigate to `packages/api/` and copy the example environment file:
```bash
cd packages/api
cp .env.example .env
```
Add your **Gemini API Key** to the `.env` file.

### 4. Running the Project Locally
From the root directory, start both the backend and frontend simultaneously:
```bash
npm run dev
```
- The API will start on `http://localhost:3001`
- Expo will start and display a QR code. Scan it with the Expo Go app to launch the mobile client!

*Note: If you are testing on a physical device and experience connection issues to the local backend, you can run `npm run dev:tunnel` to expose the frontend via Ngrok.*

---

## 🧪 Testing
The project features lightweight unit testing to verify critical AI parsing boundaries and cart logic correctness.
```bash
# Test the backend AI parsing logic
npm run test --workspace=api

# Test the frontend Cart reducers
npm run test --workspace=app
```

---

## 🔮 Future Improvements

If this prototype were to be scaled to a production environment, the following enhancements would be prioritized:
1. **Persistent Database**: Migrate from in-memory arrays to a Postgres/Prisma setup for menu and order persistence.
2. **Authentication**: Implement JWT or NextAuth to allow users to save their order history and favorite meals.
3. **Payment Integration**: Hook the final cart screen up to the Stripe React Native SDK for real transactions.
4. **CI/CD Pipeline**: Add GitHub Actions to automate the Jest test suite and deploy the API to a service like Render or Neon.

---
*Developed as an advanced engineering showcase.*
