# Tea-Harvest-Digital-Management-System
THDMS - Frontend (Tea Harvest Digital Management System)
This repository contains the frontend client for the Tea Harvest Digital Management System (THDMS). Built with React and styled with Tailwind CSS, this application provides an intuitive, mobile-responsive interface for tea farmers, workers, and cooperative managers in Rwanda to manage harvest data in real-time.

 # Live Demo
The application is deployed and can be accessed at:

# https://thdms-frontend-cnow.vercel.app/

 # Features
Role-Based Dashboards: Custom interfaces for Super Admins, Admins, Field Owners, and Workers.

Harvest Management: Real-time recording and tracking of tea harvest quantities with decimal precision.

Verification Workflow: Status-based management (Pending, Verified, Approved, Rejected) for harvest records.

Mobile-First Design: Fully responsive layout optimized for smartphones and tablets used in the field.

Secure Authentication: Integrated JWT-based login and session management.

Data Visualization: Interactive charts (using Recharts) to visualize yield performance and productivity.

# 🛠️ Tech Stack
Framework: React.js (Vite)

Styling: Tailwind CSS

State Management: React Context API (AuthContext)

HTTP Client: Axios (with centralized interceptors for JWT injection)

Routing: React Router DOM

Deployment: Vercel

# 📦 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/[your-username]/thdms-frontend.git
cd thdms-frontend
Install dependencies:

Bash
npm install
Environment Configuration:
Create a .env file in the root directory and add your backend API URL:

Code snippet
VITE_API_BASE_URL=https://your-backend-api.com
Run locally:

Bash
npm run dev
# 📂 Project Structure
src/contexts/: Authentication and global state management.

src/lib/: Axios configurations and API helper functions.

src/pages/: Main view components (Dashboard, Harvest Records, User Management).

src/components/: Reusable UI elements (Buttons, Tables, Form Inputs).

# 🛡️ Security
The frontend implements Role-Based Access Control (RBAC). Navigation links and specific action buttons are conditionally rendered based on the user's role stored in the AuthContext. All protected routes are wrapped in a security component that redirects unauthorized users to the login page.

