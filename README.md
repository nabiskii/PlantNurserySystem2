
**🌱 Assessment 1 (Plant Nursery Management System)**

Assignment: **Software requirements analysis and design (**Full-Stack CRUD Application Development with DevOps Practices**)**

**Public URL:** http://3.25.226.31/

Login details to access Dashboard
Username: admin@gmail.com
Password: admin123


---

**Objective**

A full-stack web application designed to streamline nursery operations, including plant catalog management, employee administration, and user authentication.

* **Project Management with JIRA**
* **Requirement Diagram**, **Block Definition Diagram (**BDD), Parametric Diagram using**SysML**
* **Version Control using GitHub**
* **CI/CD Integration for Automated Deployment**

---

**Setup instructions**

* git clone https://github.com/your-username/plant-nursery-system.git
* cd plant-nursery-system
* npm install
* npm start
* pm2 start "npm run start" --name="backend"
* pm2 serve build/ 3000 --name "frontend" --spa

---

**Features**
* User Authentication – Secure login & registration system.
* Plant Management – Add, update, view, and delete plant records.
* Employee Management – CRUD operations for managing employee details.
* Global Messaging – Display success/error notifications for user actions.
* Responsive UI – Clean and consistent design across all pages.

---

**CI/CD Workflow**

This repository uses GitHub Actions with a self-hosted runner to automate testing, building, and deployment.

**Backend CI (Current Workflow)**

Trigger: Runs on every push to the main branch.

Steps:

* Checkout code from GitHub.
* Set up Node.js (v22).
* Install dependencies for both backend (./backend) and frontend (./frontend).
* Run backend tests (npm test).
* Build frontend using Yarn.
* Set environment variables from GitHub Secrets.
* Restart services using pm2.

**Deployment**

Deployment happens automatically on the self-hosted server after successful tests.
The workflow creates/updates a .env file and restarts all processes with pm2.
