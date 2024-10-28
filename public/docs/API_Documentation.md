### **API Documentation**

---

### Overview

The API provides endpoints for managing contracts, nodes, and events. The API is built with authentication and validation mechanisms to ensure security and data integrity. All endpoints are protected with JWT-based authentication.

- **Base URL**: `http://localhost:3000/api` (or as specified in your environment variables)
- **Authentication**: All routes require a Bearer token (`Authorization: Bearer <token>`).

### Table of Contents

1. **Contracts**
   - [Create a Contract](#create-a-contract)
   - [Get All Contracts](#get-all-contracts)
   - [Get Contract by ID](#get-contract-by-id)
   - [Update a Contract](#update-a-contract)
   - [Delete a Contract](#delete-a-contract)
2. **Nodes**
   - [Register a Node](#register-a-node)
   - [Get All Nodes](#get-all-nodes)
   - [Get Node by ID](#get-node-by-id)
   - [Update a Node](#update-a-node)
   - [Delete a Node](#delete-a-node)
   - [Check Node Health](#check-node-health)
3. **Events**
   - [Trigger an Event](#trigger-an-event)
   - [Get All Events](#get-all-events)
   - [Get Event by ID](#get-event-by-id)
   - [Update an Event](#update-an-event)
   - [Delete an Event](#delete-an-event)

### Contracts

#### 1. Create a Contract

- **Endpoint**: `POST /contracts`
- **Description**: Creates a new contract.
- **Authentication**: Bearer token required.
- **Request Body**:
  ```json
  {
      "name": "Service Agreement",
      "conditions": ["Payment on delivery", "No prior damage"],
      "actions": ["Release payment", "Track shipment"],
      "creator": "user123",
      "autoExecute": true
  }
  ```
- **Response**:
  - **201 Created**
    ```json
    {
        "id": "contract123",
        "name": "Service Agreement",
        "conditions": ["Payment on delivery", "No prior damage"],
        "actions": ["Release payment", "Track shipment"],
        "status": "PENDING",
        "createdAt": "2024-10-28T12:00:00Z",
        "updatedAt": "2024-10-28T12:00:00Z"
    }
    ```
  - **400 Bad Request**
    ```json
    {
        "error": "Validation error: [message]"
    }
    ```

#### 2. Get All Contracts

- **Endpoint**: `GET /contracts`
- **Description**: Retrieves a list of all contracts.
- **Authentication**: Bearer token required.
- **Response**:
  - **200 OK**
    ```json
    [
        {
            "id": "contract123",
            "name": "Service Agreement",
            "status": "ACTIVE",
            "createdAt": "2024-10-27T12:00:00Z"
        },
        {
            "id": "contract124",
            "name": "Non-Disclosure Agreement",
            "status": "COMPLETED",
            "createdAt": "2024-10-25T14:00:00Z"
        }
    ]
    ```

#### 3. Get Contract by ID

- **Endpoint**: `GET /contracts/:id`
- **Description**: Retrieves a contract by its ID.
- **Authentication**: Bearer token required.
- **Response**:
  - **200 OK**
    ```json
    {
        "id": "contract123",
        "name": "Service Agreement",
        "status": "ACTIVE",
        "conditions": ["Payment on delivery", "No prior damage"],
        "actions": ["Release payment", "Track shipment"],
        "createdAt": "2024-10-28T12:00:00Z",
        "updatedAt": "2024-10-28T12:00:00Z"
    }
    ```
  - **404 Not Found**
    ```json
    {
        "error": "Contract not found"
    }
    ```

#### 4. Update a Contract

- **Endpoint**: `PUT /contracts/:id`
- **Description**: Updates an existing contract by ID.
- **Authentication**: Bearer token required.
- **Request Body**:
  ```json
  {
      "name": "Updated Service Agreement",
      "conditions": ["Updated condition"],
      "actions": ["Updated action"]
  }
  ```
- **Response**:
  - **200 OK**
    ```json
    {
        "id": "contract123",
        "name": "Updated Service Agreement",
        "status": "ACTIVE",
        "conditions": ["Updated condition"],
        "actions": ["Updated action"],
        "updatedAt": "2024-10-28T13:00:00Z"
    }
    ```
  - **404 Not Found**
    ```json
    {
        "error": "Contract not found or update failed"
    }
    ```

#### 5. Delete a Contract

- **Endpoint**: `DELETE /contracts/:id`
- **Description**: Deletes a contract by ID.
- **Authentication**: Bearer token required.
- **Response**:
  - **200 OK**
    ```json
    {
        "message": "Contract deleted successfully"
    }
    ```
  - **404 Not Found**
    ```json
    {
        "error": "Contract not found or delete failed"
    }
    ```

### Nodes

#### 1. Register a Node

- **Endpoint**: `POST /nodes/register`
- **Description**: Registers a new node.
- **Authentication**: Bearer token required.
- **Request Body**:
  ```json
  {
      "ip": "192.168.1.10",
      "port": 4000,
      "status": "ACTIVE"
  }
  ```
- **Response**:
  - **201 Created**
    ```json
    {
        "id": "node123",
        "ip": "192.168.1.10",
        "port": 4000,
        "status": "ACTIVE",
        "createdAt": "2024-10-28T12:00:00Z"
    }
    ```

#### 2. Get All Nodes

- **Endpoint**: `GET /nodes`
- **Description**: Retrieves a list of all registered nodes.
- **Authentication**: Bearer token required.

### Events

#### 1. Trigger an Event

- **Endpoint**: `POST /events/trigger`
- **Description**: Triggers a new event in the system.
- **Authentication**: Bearer token required.
- **Request Body**:
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
- **Response**:
  - **201 Created**
    ```json
    {
        "id": "event123",
        "type": "CONTRACT_EXECUTION",
        "status": "PENDING",
        "createdAt": "2024-10-28T12:00:00Z"
    }
    ```

#### 2. Get All Events

- **Endpoint**: `GET /events`
- **Description**: Retrieves all events.
- **Authentication**: Bearer token required.

#### 3. Get Event by ID

- **Endpoint**: `GET /events/:id`
- **Description**: Retrieves an event by ID.
- **Authentication**: Bearer token required.

### Common Error Responses

- **401 Unauthorized**
  ```json
  {
      "error": "Unauthorized access. No token provided."
  }
  ```
- **500 Internal Server Error**
  ```json
  {
      "error": "Internal server error."
  }
  ```

### Notes

- **Date and Time**: All dates are returned in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).
- **Pagination**: For endpoints returning lists (like `/contracts` or `/nodes`), pagination parameters (`page` and `limit`) may be added in future updates.