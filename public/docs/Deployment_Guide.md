### **Deployment Guide**

---

This document provides a comprehensive, step-by-step guide for deploying the application using Docker and traditional methods. It includes instructions for configuring environment variables, setting up the database, and ensuring the application runs smoothly in various environments.

### Table of Contents

1. **Prerequisites**
2. **Deployment Options**
   - [Local Deployment](#local-deployment)
   - [Docker Deployment](#docker-deployment)
   - [Cloud Deployment](#cloud-deployment)
3. **Environment Configuration**
   - [Environment Variables](#environment-variables)
4. **Database Setup**
   - [Local MongoDB Setup](#local-mongodb-setup)
   - [Dockerized MongoDB Setup](#dockerized-mongodb-setup)
5. **Application Deployment**
   - [Local Deployment Instructions](#local-deployment-instructions)
   - [Docker Deployment Instructions](#docker-deployment-instructions)
   - [Cloud Deployment Instructions](#cloud-deployment-instructions)
6. **Testing and Verification**
7. **Scaling and Optimization**
8. **Troubleshooting**

---

### 1. **Prerequisites**

Before deploying the application, ensure the following software and tools are installed on your system:

- **Node.js** (v14+ recommended)
- **npm** (Node Package Manager)
- **MongoDB** (for local or remote database)
- **Docker** (for Docker-based deployment)
- **Git** (for cloning the repository)
- **Cloud Provider Account** (optional, for cloud deployments like AWS, GCP, or Azure)

### 2. **Deployment Options**

The application can be deployed in multiple ways:

1. **Local Deployment**: Running the application directly on your local machine.
2. **Docker Deployment**: Running the application using Docker for containerization.
3. **Cloud Deployment**: Deploying the application on cloud providers like AWS, GCP, or Azure.

### 3. **Environment Configuration**

#### Environment Variables

The application relies on several environment variables for configuration. Create a `.env` file in the root of the project and add the following variables:

```env
# Application Configuration
PORT=3000
API_BASE_URL=http://localhost:3000/api

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/smartcontracts

# Security Configuration
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# Node Configuration
MAX_NODE_CONNECTIONS=100
STATE_SYNC_INTERVAL=300

# Logging Configuration
LOG_DIRECTORY=./logs
```

Ensure to replace placeholder values (`your-jwt-secret-key`, `your-encryption-key`) with your actual keys.

### 4. **Database Setup**

#### Local MongoDB Setup

If you're using MongoDB locally:

1. **Install MongoDB**:
   - Follow the instructions for your operating system on [MongoDB’s official site](https://www.mongodb.com/try/download/community).

2. **Start MongoDB**:
   - Run the following command to start the MongoDB service:
     ```bash
     mongod
     ```

3. **Configure the Database URL**:
   - Set the `MONGO_URI` in your `.env` file to:
     ```
     MONGO_URI=mongodb://localhost:27017/smartcontracts
     ```

#### Dockerized MongoDB Setup

If you prefer to run MongoDB in a Docker container:

1. **Create a Docker Network** (optional for networking between app and MongoDB):
   ```bash
   docker network create smartcontracts-network
   ```

2. **Run MongoDB in Docker**:
   ```bash
   docker run --name mongodb --network smartcontracts-network -d -p 27017:27017 mongo
   ```

3. **Update the MongoDB URI**:
   - Set the `MONGO_URI` in your `.env` file to:
     ```
     MONGO_URI=mongodb://mongodb:27017/smartcontracts
     ```

### 5. **Application Deployment**

#### Local Deployment Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VSPaone/smart-contracts.git
   cd smart-contracts
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`.

#### Docker Deployment Instructions

1. **Build the Docker Image**:
   - Create a `Dockerfile` in the root directory if not present:
     ```Dockerfile
     FROM node:14
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     EXPOSE 3000
     CMD ["npm", "start"]
     ```

   - Build the Docker image:
     ```bash
     docker build -t smartcontracts-app .
     ```

2. **Run the Application Container**:
   - Make sure the MongoDB container is running (as mentioned in the [Dockerized MongoDB Setup](#dockerized-mongodb-setup)).
   - Run the application container:
     ```bash
     docker run --name smartcontracts-app --network smartcontracts-network -d -p 3000:3000 smartcontracts-app
     ```

3. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`.

#### Cloud Deployment Instructions

1. **Choose a Cloud Provider**:
   - Options include **AWS (EC2)**, **GCP (Compute Engine)**, or **Azure (VM)**.

2. **Provision a VM**:
   - Create a virtual machine with the necessary specifications (e.g., Ubuntu 20.04, 2 vCPUs, 4 GB RAM).

3. **Install Dependencies on the VM**:
   - SSH into your VM and install Node.js, npm, and MongoDB (or set up a managed MongoDB instance).

4. **Clone the Application Repository**:
   ```bash
   git clone https://github.com/VSPaone/smart-contracts.git
   cd smart-contracts
   ```

5. **Set Up Environment Variables**:
   - Use the cloud provider’s environment configuration or manually create a `.env` file.

6. **Run the Application**:
   ```bash
   npm start
   ```

7. **Configure Security Groups/Firewall**:
   - Open port `3000` on your VM to allow traffic.

8. **Access the Application**:
   - Visit `http://<your-vm-ip>:3000`.

### 6. **Testing and Verification**

After deploying the application:

1. **Verify Database Connectivity**:
   - Ensure the application can connect to MongoDB by checking logs for successful database connection messages.
   
2. **Access API Endpoints**:
   - Test API endpoints using Postman or Curl to confirm they respond as expected.
   
3. **Check Logs**:
   - Application logs are stored in the directory specified in `LOG_DIRECTORY`. Monitor logs for errors or warnings.

### 7. **Scaling and Optimization**

1. **Horizontal Scaling**:
   - Use Docker Swarm or Kubernetes to deploy multiple instances of the application, ensuring load balancing and failover capabilities.
   - Alternatively, deploy multiple EC2 instances behind a load balancer if using AWS.

2. **Database Scaling**:
   - Consider using a managed database solution like **AWS RDS**, **Azure Cosmos DB**, or **GCP Cloud Datastore** for automatic scaling, backups, and high availability.

3. **Caching**:
   - Integrate **Redis** as a caching layer for frequently accessed data to reduce database load.

4. **Performance Monitoring**:
   - Use monitoring tools like **Prometheus**, **Grafana**, or cloud-native solutions (e.g., AWS CloudWatch) to monitor application performance and health.

### 8. **Troubleshooting**

1. **Application Fails to Start**:
   - Check if MongoDB is running and accessible using the URI specified in `.env`.
   - Ensure all dependencies are correctly installed (`npm install`).

2. **API Endpoints Return `401 Unauthorized`**:
   - Verify that your Bearer token is correct and valid. Tokens may need to be refreshed if expired.

3. **Database Connection Errors**:
   - Confirm the `MONGO_URI` is correctly set and points to a running MongoDB instance.
   - If using Docker, ensure both MongoDB and the application are on the same network.

4. **Performance Issues**:
   - Check CPU and memory usage on your server/VM. Scale up resources if necessary.
   - Analyze logs for patterns indicating bottlenecks or heavy load.

5. **Docker Networking Issues**:
   - Ensure the Docker network (`smartcontracts-network`) is properly created and that containers are attached.

### Conclusion

This guide provides a detailed walkthrough for deploying the application locally, using Docker, or on cloud platforms. By following these steps and best practices, you can ensure that the application runs reliably, scales efficiently, and remains secure. For any additional assistance, consult the application’s technical support team or community forums.