# Claude Relay Service

## Project Overview

This project is a Claude API relay service written in Node.js. It allows multiple users to share Claude accounts, providing features like API key management, usage statistics, and intelligent account switching. The service is designed to be deployed with Docker and uses Redis for data storage.

The project consists of a backend service built with Express.js and a frontend admin panel built with Vue.js.

## Building and Running

### Prerequisites

*   Node.js >= 18
*   Redis >= 6
*   Docker (for containerized deployment)

### Manual Build and Run

1.  **Install dependencies:**
    ```bash
    npm install
    npm run install:web
    ```

2.  **Configure the application:**
    *   Copy `.env.example` to `.env` and fill in the required values.
    *   Copy `config/config.example.js` to `config/config.js` and customize the settings.

3.  **Build the frontend:**
    ```bash
    npm run build:web
    ```

4.  **Start the service:**
    ```bash
    npm run service:start:daemon
    ```

### Docker Deployment

The project includes a `docker-compose.yml` file for easy deployment.

1.  **Configure environment variables:**
    Create a `.env` file and set the required environment variables, especially `JWT_SECRET` and `ENCRYPTION_KEY`.

2.  **Start the services:**
    ```bash
    docker-compose up -d
    ```

## Development Conventions

*   **Linting:** The project uses ESLint for code linting. Run `npm run lint` to check and fix code style.
*   **Formatting:** The project uses Prettier for code formatting. Run `npm run format` to format the code.
*   **Testing:** The project uses Jest for testing. Run `npm test` to run the tests.

## Key Files

*   `src/app.js`: The main entry point for the backend application.
*   `web/admin-spa`: The source code for the frontend admin panel.
*   `package.json`: Defines the project's dependencies and scripts.
*   `docker-compose.yml`: Defines the services for Docker deployment.
*   `Dockerfile`: Defines the Docker image for the application.
*   `config/config.example.js`: An example configuration file with all available options.
*   `README.md`: Provides a detailed overview of the project.
