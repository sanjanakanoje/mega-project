# Smart Textile Lab Management System

## 1. Project Overview

The **Smart Textile Lab Management System** is a web-based application designed to simplify and digitize textile laboratory operations. It provides a centralized platform for managing customer sample requests, textile testing activities, sample tracking, test reports, and communication between customers and laboratory staff.

The system replaces manual record management with a digital workflow, improving data organization, accessibility, efficiency, and transparency throughout the textile testing process.

The application provides separate functionalities for customers, laboratory staff, and administrators according to their roles and access permissions. It also includes an AI-powered chatbot to assist users in accessing relevant project information.

## 2. Objectives

- Create a centralized digital record for samples and associated testing activity.
- Support organized entry and retrieval of test reports linked to a sample.
- Maintain test method, date, result, observation, remarks, and notes as structured fields.
- Provide a web interface that separates presentation from backend processing and database storage.
- Integrate an AI-assisted interface for natural-language help where the service and context are available.
- Provide a foundation for barcode tracking, customer self-service, and workflow expansion.

## 3. Key Features

### 3.1 User Authentication and Authorization

- Secure login functionality.
- Role-based access for different types of users.
- Authentication using tokens.
- Role-specific navigation and application access.
- Separate customer and laboratory staff workflows.

### 3.2 Customer Management

- Customer login and access to customer-specific functionality.
- Submission of textile sample testing requests.
- Entry of company, contact, and sample information.
- Selection of required tests and other request details.
- Access to the customer's own sample requests.
- Viewing available test reports associated with submitted samples.

### 3.3 Sample and Test Request Management

The system manages textile sample requests and their associated information.

Sample request information can include:

- Company and customer details.
- Sample identification and request number.
- Style, season, and textile specifications.
- Fibre composition and fabric weight.
- Fabric colour and construction.
- Finish type and intended end use.
- Required tests, priority, and submission date.

These details help laboratory staff understand the testing requirements and manage requests efficiently.

### 3.4 Laboratory Staff Dashboard and Test Management

Laboratory staff can access sample requests and manage textile testing activities.

The functionality includes:

- Viewing available sample and test request records.
- Accessing sample-specific testing information.
- Reviewing required tests.
- Updating testing progress and completion status.
- Managing test-related information.
- Accessing the report entry functionality associated with a test.

### 3.5 Test Report Management

The application provides functionality for creating and maintaining textile test reports.

Report information includes:

- Test name.
- Test method or standard.
- Test date.
- Test result.
- Observations.
- Remarks.
- Additional notes.
- Report creation and update information.

Laboratory staff can add reports and update existing report records. Previously used test methods can be reused when supported by the report interface.

Reports are associated with the relevant sample and test, allowing related testing information to be organized systematically.

### 3.6 Sample Tracking

The sample tracking functionality helps users follow sample-related activities and review available status information.

It provides a centralized way to access sample records and supports better visibility into the laboratory testing workflow.

### 3.7 Customer Report Viewing

Customers can access reports associated with their own sample requests.

The feature connects sample information with its corresponding test reports, making it easier to review testing outcomes without relying entirely on manual communication with laboratory staff.

### 3.8 AI Chatbot

The application includes an AI-powered chatbot designed to provide conversational assistance within the system.

Depending on the user's permissions and the available application context, the chatbot can assist with queries related to sample information, testing status, requests, and reports.

The AI functionality is integrated with the backend through dedicated API endpoints.

### 3.9 Database Management

PostgreSQL is used to store and manage application data, including user information, sample requests, tracking information, and test reports.

The backend uses database queries to retrieve, insert, and update records required by the application.

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular |
| Programming Language | TypeScript |
| User Interface | HTML5 and CSS3 |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| Database Connectivity | Node PostgreSQL client (`pg`) |
| Authentication | Token-based authentication |
| API Communication | REST APIs |
| Cross-Origin Support | CORS |
| Development Tools | Visual Studio Code |
| Version Control | Git and GitHub |

**Note:** The AI service provider and any additional libraries should be documented according to the actual configuration used in the project.

## 5. System Architecture

The application follows a client-server architecture.

1. **Frontend Layer:** The Angular application provides the user interface, forms, dashboards, navigation, and report views.
2. **Backend Layer:** The Node.js and Express.js server handles API requests, business logic, authentication-related processing, and database operations.
3. **Database Layer:** PostgreSQL stores and retrieves persistent application information.
4. **AI Integration Layer:** Dedicated backend endpoints handle chatbot requests and integrate the configured AI functionality.

The frontend communicates with the backend through HTTP requests. The backend processes the requests and interacts with PostgreSQL when data operations are required.

## 6. System Workflow

### Customer Workflow

1. The customer logs in to the application.
2. The customer creates a textile sample testing request.
3. The system stores the request information in the database.
4. Laboratory staff access the available request.
5. The customer views their sample information and associated reports when they become available.

### Laboratory Staff Workflow

1. Laboratory staff log in using their credentials.
2. They access sample requests and required testing information.
3. They perform the required textile tests.
4. They update the relevant testing progress.
5. After completing a test, they enter the test method, date, result, observations, remarks, and notes as applicable.
6. The report is saved or updated in the database.
7. The associated report becomes available through the relevant customer report-viewing functionality.

### AI Chatbot Workflow

1. The user opens the AI chatbot.
2. The user submits a question.
3. The Angular frontend sends the request to the backend AI endpoint.
4. The backend processes the request and retrieves relevant context where configured.
5. The configured AI service generates a response.
6. The response is returned to the frontend and displayed to the user.

## 7. Database Design

The application uses PostgreSQL for persistent data storage.

The main data entities and related information include:

- **Users:** User accounts, login-related information, and roles.
- **Samples and Test Requests:** Sample specifications, request details, customer association, and required testing information.
- **Sample Tracking:** Sample-related tracking and status information.
- **Test Reports:** Test names, methods, dates, results, observations, remarks, notes, and timestamps.
- **AI Conversations:** Conversation information, where supported by the configured AI module.

The `test_reports` table stores report information and associates reports with their respective sample records through the application's data model.

The exact relationships, constraints, and table definitions depend on the final database schema implemented in the project.

## 8. Backend API Structure

The Express.js backend organizes application functionality through dedicated API route modules.

| API Base Path | Purpose |
|---|---|
| `/api/auth` | Authentication-related operations |
| `/api/tracking` | Sample tracking operations |
| `/api/customer-tracking` | Customer-oriented tracking operations |
| `/api/reports` | Test report creation, retrieval, and updating |
| `/api/ai` | AI chatbot and conversation-related operations |

The exact endpoints and supported HTTP methods are defined in the corresponding backend route files.

The backend uses Express middleware for JSON request parsing and cross-origin communication.

## 9. Frontend Structure

The Angular frontend is organized into components, services, pages, and routing modules.

The main functional areas include:

- Authentication and login.
- Customer sample requests.
- Sample and test management.
- Laboratory staff test screens.
- Test report forms and report viewing.
- Sample tracking.
- AI chatbot interface.
- Route guards and role-based navigation.

Angular services handle communication with backend APIs, while components manage user interaction and display application data.

## 10. Installation and Setup

### Prerequisites

Install the following software before running the application:

- Node.js and npm.
- Angular CLI compatible with the project.
- PostgreSQL.
- Visual Studio Code or another code editor.
- Git, if cloning the repository.

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd mega-project
```

Replace the repository URL with the actual GitHub repository URL.

### Step 2: Configure the Backend

Open the backend project directory in the terminal.

```bash
cd Backend
npm install
```

Configure the database connection and other required environment variables using the project's existing configuration.

Do not commit database passwords, authentication secrets, AI API keys, or other sensitive values to GitHub.

### Step 3: Configure PostgreSQL

1. Install and start PostgreSQL.
2. Create the database required by the application.
3. Apply the project's database schema and required migrations.
4. Configure the backend connection settings.
5. Verify that the backend can connect to the database.

Use the actual database name and schema provided by the project configuration.

### Step 4: Start the Backend

From the backend directory, run:

```bash
npm run dev
```

The development server is configured to run on port `5000` in the current project setup.

### Step 5: Configure the Frontend

Open a separate terminal and navigate to the frontend directory.

```bash
cd Frontend
npm install
```

Ensure that the frontend API configuration points to the correct backend URL.

### Step 6: Start the Frontend

Run:

```bash
ng serve
```

Open the local development URL displayed by Angular CLI, typically:

`http://localhost:4200`

The frontend should be able to communicate with the backend running on port `5000`.

## 11. Environment Configuration

Configure the backend using the environment variables expected by the existing application.

Example configuration keys may include:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

These keys are examples. Use the exact variable names required by the project's database configuration.

If the AI module requires an API key, configure it through the backend environment without exposing it in frontend code or committing it to version control.

## 12. Security Considerations

- Keep database credentials and API keys private.
- Use appropriate authentication and authorization checks.
- Restrict access to customer-specific information.
- Validate incoming API request data.
- Use parameterized database queries where applicable.
- Avoid exposing internal errors or sensitive configuration details to users.
- Configure CORS according to the deployment environment.
- Use HTTPS and appropriate production security settings when deploying the application.
- Store passwords using an appropriate secure password-hashing mechanism.

## 13. Testing and Verification

The following areas should be verified during testing:

- User login and role-based navigation.
- Customer sample request submission.
- Correct association of requests with customers.
- Laboratory staff access to test requests.
- Test status updates and completion workflow.
- Report creation and updating.
- Retrieval of reports by sample and test.
- Customer access to the appropriate reports.
- Sample tracking functionality.
- AI chatbot requests and error handling.
- Backend and PostgreSQL connectivity.

Testing should confirm that users can access only the data and operations permitted by their roles.

## 14. Advantages

- Reduces manual paperwork.
- Centralizes textile testing information.
- Improves organization of sample requests.
- Simplifies test report management.
- Provides customers with access to available reports.
- Separates customer and laboratory staff workflows.
- Improves accessibility of stored information.
- Supports more efficient laboratory operations.
- Introduces AI-assisted interaction within the application.

## 15. Limitations

- The application requires a functioning backend and database connection.
- Features depend on correct configuration of the application environment.
- AI chatbot responses depend on the configured AI service and the context made available to it.
- Report accuracy depends on the correctness of the information entered by laboratory staff.
- Production deployment requires additional security, monitoring, backup, and operational configuration.

## 16. Future Enhancements

Potential future enhancements include:

- Automated email or notification updates.
- Advanced sample analytics and reporting dashboards.
- Exporting reports into PDF format.
- Improved audit logs and activity history.
- More detailed report approval workflows.
- Enhanced AI assistance for laboratory operations.
- Automated database backup and recovery.
- Cloud deployment and performance optimization.
- Additional testing and quality assurance automation.

These are possible future improvements and do not necessarily represent features already implemented.

## 17. Conclusion

The Smart Textile Lab Management System provides a digital platform for managing important textile laboratory activities. By integrating customer request management, sample tracking, laboratory testing workflows, report management, and AI-assisted interaction, the application helps organize the flow of information between customers and laboratory staff.

The use of Angular, Node.js, Express.js, and PostgreSQL provides a structured foundation for developing and maintaining the application. The project demonstrates the practical application of full-stack web development technologies to a real-world textile laboratory management scenario.

## 18. Project Information

**Project Name:** Smart Textile Lab Management System

**Project Type:** Full-Stack Web Application

**Frontend:** Angular

**Backend:** Node.js and Express.js

**Database:** PostgreSQL

**Development Environment:** Visual Studio Code

**Version Control:** Git

**Project Status:** Completed



*This documentation describes the project's intended functionality and technology stack. Update any configuration-specific details, repository links, and features according to the final deployed implementation.*
