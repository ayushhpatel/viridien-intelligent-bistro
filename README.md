# The Intelligent Bistro

An AI-powered restaurant ordering app utilizing React Native (Expo) and a Node.js backend.

## Architecture

*   **Frontend**: React Native with Expo, utilizing NativeWind for styling, Zustand for state management, and React Navigation for routing.
*   **Backend**: Node.js with Express and TypeScript, handling AI interactions and menu routing.
*   **Monorepo**: Uses npm workspaces to manage both frontend and backend in a unified repository.

## Setup Instructions

1.  **Install dependencies** from the root folder:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    *   Create a `.env` file in the `packages/api` directory.
    *   Add any necessary API keys (e.g., `OPENAI_API_KEY=your_key`).

## Running the Application

You can run both the frontend and backend simultaneously using the root dev script:
```bash
npm run dev
```

Alternatively, you can run them individually:

*   **Run only the Expo app**:
    ```bash
    npm run app
    ```
    Press `i` to open in iOS simulator, `a` for Android, or scan the QR code with Expo Go.

*   **Run only the Node API server**:
    ```bash
    npm run api
    ```
    The backend will be available at `http://localhost:3001`.
    *   Test health endpoint: `http://localhost:3001/health`
