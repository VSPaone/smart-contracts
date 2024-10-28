### **Application Usage Guide**

---

This guide provides a comprehensive walkthrough for using the application, covering essential operations like contract creation, event management, and node operations. It includes instructions on how to authenticate, manage resources, and troubleshoot common issues.

### Table of Contents

1. **Getting Started**
   - [Setting Up the Environment](#setting-up-the-environment)
   - [Running the Application](#running-the-application)
   - [Authentication](#authentication)
2. **Contract Management**
   - [Creating a Contract](#creating-a-contract)
   - [Viewing All Contracts](#viewing-all-contracts)
   - [Retrieving a Specific Contract](#retrieving-a-specific-contract)
   - [Updating a Contract](#updating-a-contract)
   - [Deleting a Contract](#deleting-a-contract)
3. **Node Operations**
   - [Registering a Node](#registering-a-node)
   - [Viewing All Nodes](#viewing-all-nodes)
   - [Retrieving a Node by ID](#retrieving-a-node-by-id)
   - [Updating a Node](#updating-a-node)
   - [Deleting a Node](#deleting-a-node)
   - [Checking Node Health](#checking-node-health)
4. **Event Management**
   - [Triggering an Event](#triggering-an-event)
   - [Viewing All Events](#viewing-all-events)
   - [Retrieving a Specific Event](#retrieving-a-specific-event)
   - [Updating an Event](#updating-an-event)
   - [Deleting an Event](#deleting-an-event)
5. **Troubleshooting and Tips**

---

### **1. Getting Started**

#### Setting Up the Environment

1. **Install Dependencies**:
   Ensure that you have Node.js and MongoDB installed on your system. Clone the application repository and run:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   - Create a `.env` file in the root directory and set up the following variables:
     ```
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/smartcontracts
     JWT_SECRET=your-secret-key
     ```

#### Running the Application

1. **Start MongoDB**:
   Ensure that your MongoDB server is running locally or at the specified URI.
   
2. **Run the Application**:
   ```bash
   npm start
   ```
   - The application should now be running at `http://localhost:3000`.

#### Authentication

- All API requests require a valid Bearer token. Obtain this token through your login mechanism or test accounts configured within the application.
- **Format**: 
   ```
   Authorization: Bearer <token>
   ```

---

### **2. Contract Management**

#### Creating a Contract

1. **Endpoint**: `POST /contracts`
2. **Steps**:
   - Make a POST request to `/contracts` with the following JSON payload:
     ```json
     {
         "name": "Service Agreement",
         "conditions": ["Payment upon delivery", "No prior damage"],
         "actions": ["Release payment", "Track shipment"],
         "creator": "user123",
         "autoExecute": true
     }
     ```
   - Ensure your request includes a valid token in the headers.
3. **Response**:
   - On success, the server returns the details of the created contract, including its unique ID.

#### Viewing All Contracts

1. **Endpoint**: `GET /contracts`
2. **Steps**:
   - Make a GET request to `/contracts` with the token in the headers.
   - The response will be an array of contracts. You can filter contracts based on status (e.g., `PENDING`, `ACTIVE`) in your client-side application.

#### Retrieving a Specific Contract

1. **Endpoint**: `GET /contracts/:id`
2. **Steps**:
   - Replace `:id` with the contract's ID (e.g., `/contracts/12345`) and make a GET request with the token.
   - The server responds with the details of the specified contract.

#### Updating a Contract

1. **Endpoint**: `PUT /contracts/:id`
2. **Steps**:
   - Replace `:id` with the contract’s ID.
   - Make a PUT request with the following body:
     ```json
     {
         "name": "Updated Agreement",
         "conditions": ["Updated condition"]
     }
     ```
   - A successful update returns the modified contract details.

#### Deleting a Contract

1. **Endpoint**: `DELETE /contracts/:id`
2. **Steps**:
   - Replace `:id` with the contract’s ID.
   - Make a DELETE request with the token.
   - A success message confirms deletion.

---

### **3. Node Operations**

#### Registering a Node

1. **Endpoint**: `POST /nodes/register`
2. **Steps**:
   - Make a POST request to `/nodes/register` with the following payload:
     ```json
     {
         "ip": "192.168.1.10",
         "port": 3000,
         "status": "ACTIVE"
     }
     ```
   - Ensure you have a valid token in the headers.
3. **Response**:
   - The server returns the details of the registered node, including its unique ID.

#### Viewing All Nodes

1. **Endpoint**: `GET /nodes`
2. **Steps**:
   - Make a GET request to `/nodes` with your token.
   - The response includes all registered nodes with their status, IP address, and ports.

#### Retrieving a Node by ID

1. **Endpoint**: `GET /nodes/:id`
2. **Steps**:
   - Replace `:id` with the node ID and send a GET request with the token.
   - The server responds with the details of the node.

#### Updating a Node

1. **Endpoint**: `PUT /nodes/:id`
2. **Steps**:
   - Replace `:id` with the node ID.
   - Make a PUT request with the following body:
     ```json
     {
         "ip": "192.168.1.11",
         "status": "ACTIVE"
     }
     ```
   - The response contains the updated node information.

#### Deleting a Node

1. **Endpoint**: `DELETE /nodes/:id`
2. **Steps**:
   - Replace `:id` with the node’s ID and send a DELETE request with the token.
   - A confirmation message indicates successful deletion.

#### Checking Node Health

1. **Endpoint**: `GET /nodes/:id/health`
2. **Steps**:
   - Make a GET request to `/nodes/:id/health` with the node ID.
   - The response shows the node’s health status, including uptime and last health check.

---

### **4. Event Management**

#### Triggering an Event

1. **Endpoint**: `POST /events/trigger`
2. **Steps**:
   - Make a POST request with the following payload:
     ```json
     {
         "type": "CONTRACT_EXECUTION",
         "payload": {
             "contractId": "contract123",
             "executor": "node-01"
         },
         "timestamp": "2024-10-28T12:00:00Z"
     }
     ```
   - The server responds with details of the triggered event.

#### Viewing All Events

1. **Endpoint**: `GET /events`
2. **Steps**:
   - Make a GET request with the token in the headers.
   - The response contains a list of all events, including their status and types.

#### Retrieving a Specific Event

1. **Endpoint**: `GET /events/:id`
2. **Steps**:
   - Replace `:id` with the event ID.
   - A GET request returns the event’s details.

#### Updating an Event

1. **Endpoint**: `PUT /events/:id`
2. **Steps**:
   - Replace `:id` with the event ID.
   - Make a PUT request with updated event information.
   - The server returns the modified event details.

#### Deleting an Event

1. **Endpoint**: `DELETE /events/:id`
2. **Steps**:
   - Replace `:id` with the event ID and send a DELETE request with the token.
   - A success message confirms the event deletion.

---

### **5. Troubleshooting and Tips**

- **Invalid Token**: Ensure that your Bearer token is valid and has not expired. If you encounter a `401 Unauthorized` error, try refreshing your token.
- **Server Error (500)**: If you see a `500` error, check the server logs for detailed error messages. Ensure your database connection is active and correctly configured.
- **Contract or Node Not Found**: Ensure you are using the correct ID when retrieving or updating a contract or node. If you receive a `404 Not Found` error, the ID may be incorrect or the resource may not exist.

### Tips for Efficient Use:

- **Testing and Development**: Use tools like Postman or Insomnia to quickly test API endpoints with different payloads.
- **Environment Variables**: Set up environment variables for different environments (development, staging, production) to manage configurations easily.
- **Automated Scripts**: Consider writing scripts to automate common operations like creating contracts or registering nodes for large-scale testing.