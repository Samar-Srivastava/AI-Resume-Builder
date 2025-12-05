#  AI Resume Builder App

A powerful, full-stack application for building and managing professional resumes. This tool uses AI to assist with content creation, provides real-time customization, and features a secure dashboard for user management.

---

##  Features

The application provides comprehensive tools for building, customizing, and exporting high-quality resumes:

* **Intelligent Content Generation:** Leverages the **Gemini API** to generate professional summaries and work experience details, accelerating the resume creation process.
* **Secure User Management:** Implements **Clerk** for robust user sign-up and sign-in functionality.
* **Real-Time Preview:** Instantly see your resume update as you enter information into the forms.
* **Customizable Design:** Easily change the resume's color theme and overall design from the editor.
* **Rich Text Editing:** Use a built-in rich text editor for granular control over the formatting of experience descriptions.
* **Dynamic Data Fields:** Add unlimited sections for **Work Experience**, **Education**, and **Skills**.
* **Export and Sharing:** Download the final resume as a clean **PDF file** or generate a **unique, public URL** for easy sharing.

---

##  How It Works

The application guides the user through a straightforward and secure workflow:

1.  **Authentication:** The user must first **Authenticate** using the secure **Clerk** sign-up or sign-in process.
2.  **Dashboard Access:** Upon successful authentication, the user is redirected to the **Dashboard**.
3.  **Resume Management:** The Dashboard serves as the central hub where the user can:
    * View all previously saved resumes in a list format.
    * **Edit** any existing resume to make updates.
    * **Delete** old or unwanted resumes.
    * **Create New Resume** to start a fresh project.
4.  **Creation/Editing:** When creating or editing a resume, the user interacts with the form, utilizes the AI content generation feature, and sees the live preview before saving the data.

---

##  Tech Stack

This project is built using a modern, scalable, and full-stack architecture.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React** (with **Vite**) | Core framework for the fast, interactive user interface. |
| | **Tailwind CSS** & **Shadcn/UI** | Utility-first styling for responsive design and UI components. |
| **Backend/CMS** | **Strapi** | Headless CMS used to model, manage, and serve the resume data via an API. |
| **Database** | **PostgreSQL** | The persistent, relational database used by Strapi. |
| **AI Integration** | **Google Gemini API** | Engine driving the intelligent text generation features. |
| **Authentication** | **Clerk** | Provides secure, managed user authentication and identity services. |
| **Deployment** | **Vercel** / **Render** | Hosting for the client (Vercel) and backend services (Render). |

---

##  Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

You must have the following installed:

* Node.js (LTS version)
* npm or yarn
* Access to a running **PostgreSQL** database instance.
* A **Gemini API Key**.
* **Clerk API Keys** (Publishable and Secret/Private).

### 1. Backend (Strapi) Setup

1.  **Clone the Strapi Repository:**
    ```bash
    git clone <YOUR-STRAPI-REPO-URL>
    cd ai-resume-builder-backend
    ```

2.  **Install Dependencies and Configure:**
    ```bash
    npm install
    # Ensure all required Strapi PostgreSQL dependencies are installed
    ```
3.  **Database Configuration:**
    Configure the database connection settings in your Strapi configuration files (e.g., `./config/database.js`) to connect to your **PostgreSQL** instance.

4.  **Start the Server:**
    ```bash
    npm run develop
    ```
    The Strapi admin panel will be accessible at `http://localhost:1337`.

### 2. Frontend (React) Setup

1.  **Clone the Client Repository:**
    ```bash
    git clone <YOUR-CLIENT-REPO-URL>
    cd ai-resume-builder-client
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the client root directory and populate it with your API keys and endpoints:

    ```env
    # Clerk Authentication
    VITE_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>

    # Strapi API Connection (Use your local or deployed Strapi URL)
    VITE_STRAPI_BASE_URL=http://localhost:1337
    VITE_STRAPI_API_KEY=<YOUR_STRAPI_FULL_ACCESS_TOKEN>

    # Gemini AI Integration
    VITE_GOOGLE_AI_API_KEY=<YOUR_GEMINI_API_KEY>
    ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will launch on `http://localhost:5173`.

---

##  Deployment

The application utilizes a distributed deployment model:

* **Backend (Strapi):** Deployed to **Render**. Render is used to host the Strapi Node.js application and maintains the connection to the remote PostgreSQL database.
* **Frontend (React):** Deployed to **Vercel**. Vercel hosts the static client application built with Vite and React. Environment variables are configured on Vercel to point to the live Strapi URL hosted on Render.

---

##  Future Works

Potential enhancements and features planned for future iterations:

1.  **Template Library:** Implement a selection of different professional resume templates for users to choose from.
2.  **Resume Scoring:** Provide a feedback mechanism that gives the user a score or detailed suggestions on content improvement.
3.  **Icon Inclusion:** Enable the option for users to include custom icons (e.g., social media, contact) alongside text in the resume sections.

---

Developed by **Samar Kumar Srivastava**

Special thanks to open-source contributors and the research community.
