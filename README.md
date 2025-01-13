## Inventory Management App
This project is a server-side application for an Inventory Management System. It is built using **Node.js**, **Express**, and **TypeScript**, and includes features like user authentication, inventory management, payment integration (via Paystack), and more.

### Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Environment Variables](#environment-variables)  
4. [Running the Project](#running-the-project)  
5. [API Documentation](#api-documentation)  
6. [Available Scripts](#available-scripts)  
7. [Technologies Used](#technologies-used)

---

### Prerequisites
Before setting up the project, ensure you have the following installed:


- **Node.js** (v16 or higher)  
- **npm** (Node Package Manager)  
- **MongoDB** (as the database) 

---

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/judekennywise/task-backend.git
   cd server
   ```

2. **Install Dependencies**:
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Install TypeScript Globally (Optional)**:
   If you do not have TypeScript installed globally, you can install it using:
   ```bash
   npm install -g typescript
   ```

---

### Environment Variables

Create a `.env` file in the root of your project and add the following keys:

```env
PORT=8000
DATABASE_NODE_ENV = 
NODE_ENV = 
MONGODB_TEST_URI = 
MONGODB_DEVELOPMENT_URI = 


ACTIVATION_SECRET = 
SMPT_HOST = 
SMPT_PORT = 
SMPT_SERVICE = 
SMPT_MAIL = 
SMPT_PASSWORD = 
RESET_PASSWORD_SECRET =
ACCESS_TOKEN = 
REFRESH_TOKEN = 
ACCESS_TOKEN_EXPIRES = 20

DEVELOPMENT_CLIENT_URL = "http://localhost:3000"
DEVELOPMENT_URL = "http://localhost:8000"
```

Replace the values with your configuration.

### Running the Project
1. **Start MongoDB**:
   Ensure your MongoDB server is running. You can start it locally or use a cloud provider like MongoDB Atlas.

2. **Run the Development Server**:
   Use the following command to start the server in development mode:
   ```bash
   npm run dev
   ```
3. **Access the API**:
   The server will start on `http://localhost:8000` (or the port defined in the `.env` file).

---

### Running the Application with Docker


To containerize and run the application using Docker, follow the steps below:

### Prerequisites
- Install **Docker** and **Docker Compose** on your system.
  - [Download Docker](https://www.docker.com/products/docker-desktop)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)

---

### Steps to Run the Application

1. **Clone the Repository**  
   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/judekennywise/task-backend.git
   cd task-backend
   ```

2. **Build and Run the Containers**  
   Use `docker-compose` to build and run the application and its dependencies (e.g., MongoDB, Redis):
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**  
   Once the containers are running:
   - The application will be accessible at [http://localhost:8000](http://localhost:8000).

---

### Stopping the Application

To stop the application and remove the containers, run:
```bash
docker-compose down
```

---

### Logs and Debugging

To view application logs in real time:
```bash
docker-compose logs -f
```

---

### Optional: Running in Detached Mode

If you want to run the application in the background:
```bash
docker-compose up -d
```

Use the following to stop the background containers:
```bash
docker-compose down
```

---

### Environment Variables

Ensure all environment variables required by the application  are set correctly. You can configure them in the `docker-compose.yml` file or a `.env` file.

---

### Notes

- Make sure the `Dockerfile` and `docker-compose.yml` are present in the project root directory.
- You can customize the exposed ports in the `docker-compose.yml` file to avoid conflicts with other applications.

---

Here’s how you can update your **README.md** file to include clear instructions for running tests when using **Babel**, **TypeScript**, and **ts-jest**. 

---

## Running Tests

1. **Dependencies Installed**: Run the following command to install project dependencies:
   ```bash
   npm install
   ```

---

### Running Tests
To run the tests in your project, follow these steps:

#### 1. **Run All Tests**
Run all test suites with the following command:
```bash
npm test
```

#### 2. **Run Tests in Watch Mode**
To run tests in watch mode for continuous feedback while developing:
```bash
npm run test:watch
```

#### 3. **Run Tests with Coverage**
To generate a test coverage report:
```bash
npm run test:coverage
```
The coverage report will be available in the `coverage` folder.

---

### Testing Tools and Configuration
This project uses the following testing setup:
- **Jest**: For running the tests.
- **ts-jest**: A Jest preset to support TypeScript.
- **Babel**: For compiling modern JavaScript and TypeScript during tests.

#### Jest Configuration
The Jest configuration is defined in the `jest.config.js` file. Below is a summary of the key settings:
- **Preset**: `ts-jest` for TypeScript support.
- **Transform**: Using Babel to compile TypeScript and JavaScript files.

---

### Troubleshooting
If you encounter issues while running tests:
1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
2. Check the `jest.config.js` file for any misconfiguration.
3. Ensure `ts-jest` and `@babel/preset-typescript` are installed and correctly set up.

---

### Example Test Command Output
When you run `npm test`, you should see output similar to the following:

```plaintext
  PASS  ./server.test.ts (45.147 s)
  User Controller Tests
    RegisterUser                                                                                                                    
      √ should register a user and send an activation email (634 ms)
      √ should return an error if the email already exists (184 ms)                                                                 
    LoginUser
      √ should log in a user with valid credentials (134 ms)                                                                        
      √ should return an error for invalid credentials (88 ms)                                                                      

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        46.454 s
```

---

### Available Scripts
Here are the scripts available in the project:

- **`npm run dev`**: Runs the development server using `ts-node-dev`.
- **`npm test`**: Placeholder script for running tests (you can add your test suite).

---

### Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building APIs.
- **TypeScript**: Type-safe JavaScript for better development experience.
- **Mongoose**: ODM for MongoDB.
- **Paystack API**: For payment integration.
- **Nodemailer**: For sending emails.
- **bcryptjs**: For hashing passwords.

---
