# The Intelligent Bistro

The Intelligent Bistro is a full-stack, AI-powered restaurant ordering app built with React Native Expo and a Node.js API. Users can browse a polished mobile menu, manage a cart, and use a conversational assistant to add, remove, update, or clear items through structured AI actions.

The project is designed as a recruiter-ready engineering showcase: clean mobile UX, deterministic cart state, validated AI output, and a small production-minded API boundary.

## Screenshots And Demo

| Menu | AI Ordering | Cart |
| --- | --- | --- |
| Add menu screenshot | Add chat screenshot | Add cart screenshot |

Demo links:
- Loom walkthrough: add link here
- GitHub repository: add link here

## Feature Highlights

- Mobile menu browsing with loading, error, empty, and retry states
- Zustand cart state with deterministic quantity and total calculations
- AI chat assistant for natural-language ordering
- OpenAI SDK integration with OpenAI or Gemini-compatible endpoints
- Zod validation for AI responses, chat requests, and frontend API responses
- Safe AI-to-cart execution that resolves item IDs against real menu data
- Expo + NativeWind styling for a polished mobile-first interface
- Lightweight Jest coverage for cart and AI validation behavior

## Architecture

```text
intelligent-bistro/
├── packages/
│   ├── api/
│   │   ├── src/data/          # Menu source of truth
│   │   ├── src/prompts/       # AI system prompt generation
│   │   ├── src/routes/        # Express routes for menu and chat
│   │   ├── src/services/ai/   # OpenAI-compatible parser
│   │   └── src/validators/    # Zod request/response schemas
│   └── app/
│       ├── src/components/    # Menu, cart, and chat UI
│       ├── src/screens/       # Menu and cart screens
│       ├── src/services/      # Axios API clients and response validation
│       ├── src/store/         # Zustand cart store
│       └── src/types/         # Shared frontend types
├── package.json               # npm workspace scripts
└── README.md
```

## AI Orchestration

The assistant is intentionally not allowed to mutate cart state directly.

1. The frontend sends the user message plus current cart state to `/api/chat`.
2. The backend validates the request with Zod.
3. The backend builds a system prompt with the real menu IDs and current cart context.
4. The LLM must return strict JSON actions such as `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, or `CLEAR_CART`.
5. The backend validates the AI response with Zod.
6. The frontend validates the HTTP response again.
7. The chat UI resolves every AI `itemId` against the real menu data before touching the Zustand cart.

This keeps AI behavior useful while preventing hallucinated menu items from corrupting cart totals or item metadata.

## Tech Stack

- React Native Expo
- TypeScript
- NativeWind
- Zustand
- TanStack React Query
- Node.js
- Express
- Zod
- OpenAI SDK
- Jest

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create backend environment variables:

```bash
cp packages/api/.env.example packages/api/.env
```

Use OpenAI:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_MODEL=gpt-4o-mini
```

Or use Gemini through its OpenAI-compatible endpoint:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_MODEL=gemini-1.5-flash
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai/
```

Run the API:

```bash
npm run api
```

Run the Expo app in a second terminal:

```bash
npm run app
```

For iOS simulator, the app defaults to:

```text
http://localhost:3001/api
```

For Android emulator, the app defaults to:

```text
http://10.0.2.2:3001/api
```

For a physical device, start Expo with your Mac's LAN IP:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_MAC_IP:3001/api npm run app
```

## Verification

Run all tests:

```bash
npm test
```

Run TypeScript checks:

```bash
npm run typecheck
```

Manual QA flows:

- Open the menu and confirm items, images, categories, prices, and retry behavior.
- Add an item manually and verify cart count and total.
- Ask the assistant: `Add 2 spicy chicken sandwiches`.
- Ask the assistant: `Add dragon pizza` and verify the cart does not mutate.
- Ask the assistant to remove or update an item that is not in the cart and verify a graceful message.
- Clear the cart from chat and confirm the empty cart state.
- Turn off the API and confirm the menu/chat fail gracefully.

## Technical Decisions

- Zustand is used for cart state because cart mutations are local, synchronous, and small.
- React Query is used for menu fetching to get loading, error, retry, and cache behavior with minimal code.
- AI actions are treated as untrusted input until both backend and frontend validation pass.
- The real menu record is the only source of truth for cart item metadata.
- The backend keeps the menu in local static data for demo simplicity; the boundary is ready for a database later.

## Loom Demo Guide

Suggested 5-minute structure:

1. Product overview: show menu browsing and the cart.
2. AI demo: add valid items through chat.
3. Safety demo: ask for an unavailable item and show that the cart stays correct.
4. Architecture: explain frontend, backend, AI parser, Zod validation, and Zustand.
5. Engineering polish: mention tests, typechecks, env setup, and failure handling.

Do not spend time on dependency installation, Expo QR details, or reading every file. Keep the focus on the user experience and the AI safety boundary.

## Future Improvements

- Persist menus and orders in Postgres with Prisma.
- Add user accounts and order history.
- Add checkout/payment integration.
- Add E2E tests for the core ordering journey.
- Add observability for AI failures and invalid action attempts.
- Deploy the API and configure production environment variables.
