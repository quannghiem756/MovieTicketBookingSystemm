# Tech Stack - Movie Ticket Booking System

## Frontend
- **Framework:** React.js (v19+)
- **UI Library:** Material UI (MUI v7+) for Material Design principles.
- **Routing:** React Router (v7+) for navigation.
- **State Management & API:** Axios for HTTP requests, React Context for global state (Auth, I18n).
- **Real-time:** Socket.io-client for live seat updates.

## Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM.
- **Real-time:** Socket.io for server-side WebSocket management.
- **Payments:** MoMo E-Wallet API integration.
- **Security:** JWT for authentication, bcryptjs for password hashing, express-rate-limit.

## AI & Vector Service
- **Runtime:** Python
- **API Framework:** Flask
- **Vector Database:** ChromaDB for storing and querying movie embeddings.
- **Orchestration:** LangChain for AI workflow management.
- **LLM Integration:** Google Generative AI (Gemini) and OpenAI for embeddings and natural language processing.

## Infrastructure & Tools
- **Architecture:** Modular Monolith (Node.js) with a sidecar Vector Service (Python).
- **Package Management:** npm (Node.js), pip (Python).
- **Environment Management:** dotenv for configuration.
- **Testing:** Jest for backend and frontend unit testing.
