### **Application Architecture Overview**

---

This document provides a comprehensive overview of the application architecture, explaining the interaction between various components, including contracts, nodes, events, middleware, and the database. The architecture is designed to ensure scalability, maintainability, and security while supporting essential operations like contract management, node registration, and event processing.

### Table of Contents

1. **Introduction**
2. **High-Level Architecture**
   - [Component Overview](#component-overview)
   - [Data Flow](#data-flow)
3. **Detailed Component Breakdown**
   - [Contracts](#contracts)
   - [Nodes](#nodes)
   - [Events](#events)
   - [State Management](#state-management)
   - [Security](#security)
4. **Middleware and Utilities**
   - [Middleware](#middleware)
   - [Utilities](#utilities)
5. **Database Design**
6. **Cron Jobs and Scheduled Tasks**
7. **API Design and Interaction**

---

### 1. **Introduction**

The application is a distributed, node-based system for managing contracts, events, and state synchronization across multiple nodes. The architecture is built with modularity and extensibility in mind, allowing for easy additions and modifications to features. It leverages technologies like Node.js, Express, MongoDB, and JWT for authentication.

### 2. **High-Level Architecture**

#### Component Overview

The application consists of several key components, each responsible for specific operations:

- **API Layer**: Handles HTTP requests and routes them to appropriate controllers for processing.
- **Contracts**: Manages creation, validation, execution, and logging of smart contracts.
- **Nodes**: Manages node registration, health monitoring, and state synchronization.
- **Events**: Manages event triggering, processing, and tracking.
- **State Management**: Ensures consistent state synchronization across all nodes.
- **Security**: Includes authentication, authorization, and encryption mechanisms.
- **Database**: Uses MongoDB to persist data for contracts, nodes, and events.

#### Data Flow

1. **API Requests**: Users or nodes send requests through the API layer.
2. **Controller Layer**: The API routes direct these requests to the appropriate controllers.
3. **Business Logic**: Controllers interact with models and services to process requests.
4. **Middleware**: Authentication and validation middleware ensure security and data integrity.
5. **Database Interaction**: Data is stored and retrieved from MongoDB using Mongoose models.
6. **Response**: Processed data is sent back as a response to the client.

![Architecture Diagram](architecture-diagram.png) *(Illustration of the high-level architecture showing components and their interactions)*

### 3. **Detailed Component Breakdown**

#### Contracts

- **Responsibilities**: The contracts component handles the entire lifecycle of a contract, from creation and validation to execution and logging.
- **Modules**:
  - `contractModel.js`: Defines the schema for contracts and interacts with the database.
  - `contractValidator.js`: Validates the conditions and actions of a contract before execution.
  - `contractExecutor.js`: Executes contract logic when conditions are met.
  - `contractLogger.js`: Logs contract events and status changes.
- **Interaction**:
  - Contracts are created through the API. Once validated, they are stored in the database using `contractModel.js`.
  - When specific events occur (e.g., contract conditions are met), `contractExecutor.js` executes the contract actions and updates the state.

#### Nodes

- **Responsibilities**: The node component manages the registration and health monitoring of nodes within the network.
- **Modules**:
  - `nodeManager.js`: Handles node registration, updates, and communication.
  - `nodeHealth.js`: Monitors the health of nodes and triggers recovery protocols when issues are detected.
  - `nodeSync.js`: Synchronizes state across nodes to ensure data consistency.
- **Interaction**:
  - Nodes register themselves with the API and are managed via the `nodeManager.js`.
  - Health checks are performed periodically using `nodeHealth.js`, and state synchronization occurs through `nodeSync.js`.

#### Events

- **Responsibilities**: The event component handles event processing and triggering within the system.
- **Modules**:
  - `eventListener.js`: Listens for events across nodes.
  - `eventProcessor.js`: Processes events and triggers contracts or updates state as needed.
  - `eventPublisher.js`: Publishes events to other nodes for synchronization.
- **Interaction**:
  - Events are created and processed through the API and are managed in `eventListener.js` and `eventProcessor.js`.
  - Events related to contract conditions or node state changes are processed, leading to contract executions or state updates.

#### State Management

- **Responsibilities**: The state management component synchronizes data across nodes, ensuring that the state remains consistent throughout the network.
- **Modules**:
  - `stateManager.js`: Manages state updates and synchronization.
  - `stateValidator.js`: Validates state changes before propagation.
  - `stateLogger.js`: Logs state changes for audit purposes.
- **Interaction**:
  - State updates are triggered by events or API actions. The `stateManager.js` propagates these updates to all nodes, ensuring consistency.
  - `stateValidator.js` ensures the integrity of state updates before they are applied across nodes.

#### Security

- **Responsibilities**: Security components ensure that all API requests and operations are authenticated and authorized properly.
- **Modules**:
  - `authentication.js`: Verifies tokens and node identities using JWT.
  - `authorization.js`: Manages access control and permissions for various operations.
  - `encryption.js`: Provides data encryption for secure communication and storage.
- **Interaction**:
  - Each API request passes through `authMiddleware.js`, which verifies tokens using `authentication.js` before processing.
  - Sensitive data is encrypted at rest and in transit using `encryption.js`.

### 4. **Middleware and Utilities**

#### Middleware

Middleware modules are used to manage request authentication, validation, and error handling.

- **`authMiddleware.js`**: Ensures that each request has a valid JWT before proceeding.
- **`errorHandler.js`**: Catches and standardizes API errors, providing consistent responses.
- **`logger.js`**: Logs all API requests and system events for monitoring and debugging purposes.

#### Utilities

Utility modules provide common functions used across various components:

- **`helper.js`**: Includes utility functions like date formatting, ID generation, and input validation.
- **`cronJobs.js`**: Schedules recurring tasks like state synchronization, contract validation, and node health checks.
- **`constants.js`**: Centralizes global constants used throughout the application.

### 5. **Database Design**

- **Database**: MongoDB is used for persistence, leveraging Mongoose models for interacting with the database.
- **Collections**:
  - **Contracts**: Stores all contract details, including conditions, actions, statuses, and timestamps.
  - **Nodes**: Stores information about registered nodes, including IP addresses, ports, and status.
  - **Events**: Stores all events that occur within the system, including their types and related metadata.
- **Schema Design**:
  - **Contracts Schema**: Includes fields like `name`, `conditions`, `actions`, `status`, `creator`, and timestamps for creation and updates.
  - **Nodes Schema**: Contains fields like `ip`, `port`, `status`, and `lastHealthCheck`.
  - **Events Schema**: Includes event type, payload, timestamp, and status.

### 6. **Cron Jobs and Scheduled Tasks**

- **Purpose**: Cron jobs automate repetitive tasks such as state synchronization, contract validation, and event processing.
- **Key Scheduled Tasks**:
  - **State Synchronization**: Ensures all nodes have consistent state information every 5 minutes.
  - **Contract Validation**: Periodically validates active contracts every hour to check for conditions that may trigger execution.
  - **Node Health Monitoring**: Runs health checks on all nodes every 10 minutes.

### 7. **API Design and Interaction**

- **Modular API Design**: The API is modularized into routes for contracts, nodes, and events.
- **Routing**:
  - **Contracts**: `/api/contracts`
  - **Nodes**: `/api/nodes`
  - **Events**: `/api/events`
- **Controllers**: Each route is connected to a controller that manages the business logic for handling API requests and responses.
- **Data Validation**: All incoming data is validated using validators before processing, ensuring that data integrity is maintained.

### Conclusion

The application architecture is designed with modularity and scalability in mind. By separating concerns into components like contracts, nodes, events, and state management, the system remains maintainable and extendable. The use of middleware, utilities, and security components ensures that the application is secure, reliable, and easy to manage. This architecture supports future growth, allowing new features to be added with minimal disruption to the existing system.