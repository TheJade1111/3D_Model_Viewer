# 3D Model Viewer - Deployment Documentation (Render)

This document outlines the steps to deploy the 3D Model Viewer application to the internet using **Render** for both the backend (Node.js/Express server) and the frontend (React application).

## Prerequisites

Before you begin deployment, ensure you have the following:

*   **A GitHub Repository:** Your project code (including frontend and backend folders) should be hosted on a GitHub repository.
*   **A Render Account:** Sign up for a free Render account at [https://render.com/](https://render.com/).
*   **Firebase Project Setup:** You should have a Firebase project set up with Firestore enabled and your `serviceAccountKey.json` file downloaded.
*   **Node.js and npm (or yarn) installed locally:** For building the frontend.

## Deployment Steps

We will deploy the application in two parts:

1.  **Backend Deployment (Node.js/Express to Render)**
2.  **Frontend Deployment (React to Render Static Site)**

**1. Backend Deployment (Node.js/Express to Render)**

1.  **Prepare your Backend Code:**
    *   Ensure your `server.js` is configured to:
        *   Initialize Firebase Admin SDK using environment variables.
        *   Define API endpoints (`/models`, `/upload`).
        *   Serve static files from the `frontend/build` folder (as described in previous steps).
        *   Include a `start` script in your backend's `package.json` (e.g., `"start": "node server.js"`).

2.  **Create a New Web Service on Render:**
    *   Go to the Render Dashboard ([https://dashboard.render.com/](https://dashboard.render.com/)) and log in.
    *   Click on **"+ New Web Service"**.
    *   **Connect your GitHub Repository:** Choose "GitHub" and select the repository containing your project (`ikarus3d-app`).
    *   **Configure your Web Service:**
        *   **Name:** Choose a name for your backend service (e.g., `ikarus3d-backend`).
        *   **Environment:** Select `Node`.
        *   **Region:** Choose a region closest to your users.
        *   **Branch:** Select the branch you want to deploy (e.g., `main`).
        *   **Root Directory:** Leave blank (or specify the root of your backend if it's in a subdirectory).
        *   **Runtime:** `docker` or `process`, `process` is usually simpler for Node.js.
        *   **Build Command:** Leave blank (Render will usually detect Node.js and run `npm install` or `yarn install` automatically).
        *   **Start Command:**  `node server.js` (or `npm start` if you prefer using `npm start` in your `package.json`).
        *   **Instance Type:** Choose a suitable instance type (e.g., Free or Starter for testing).

3.  **Set Environment Variables for Firebase:**
    *   In the "Environment" section of your Render Web Service settings, click "Add Environment Variable".
    *   Add the following environment variables using the credentials from your Firebase `serviceAccountKey.json` file:
        *   `FIREBASE_PROJECT_ID`:  Your Firebase Project ID.
        *   `FIREBASE_PRIVATE_KEY`:  The entire content of your `private_key` field from `serviceAccountKey.json`.
        *   `FIREBASE_CLIENT_EMAIL`: Your Firebase `client_email`.
    *   Click "Save Changes".

4.  **Create Web Service:** Click **"Create Web Service"** at the bottom. Render will start deploying your backend.

5.  **Verify Backend Deployment:**
    *   Once deployed, Render will provide you with a **Service URL**.
    *   Open your browser and go to `<your-render-backend-url>/models` (replace `<your-render-backend-url>` with the Service URL provided by Render).
    *   You should see the JSON response from your `/models` API endpoint, confirming your backend is running on Render.

**2. Frontend Deployment (React to Render Static Site)**

1.  **Build your React Frontend:**
    *   Ensure you have built your React frontend locally: `cd frontend` then `npm run build` or `yarn build`.

2.  **Create a New Static Site on Render:**
    *   Go back to your Render Dashboard and click **"+ New Static Site"**.
    *   **Connect your GitHub Repository:** Choose "GitHub" and select the **same repository** containing your project (`ikarus3d-app`).
    *   **Configure your Static Site:**
        *   **Name:** Choose a name for your frontend site (e.g., `ikarus3d-frontend`).
        *   **Region:** Choose a region.
        *   **Branch:** Select the branch you want to deploy (e.g., `main`).
        *   **Root Directory:**  Leave blank.
        *   **Publish directory:**  `frontend/build` (This is crucial! Tell Render to serve files from the built frontend folder).
        *   **Build Command:** Leave blank (or you can put `npm run build` or `yarn build` if Render doesn't detect it automatically, though usually not needed for static sites).

3.  **Update API URL in Frontend Code:**
    *   **Important:** Before creating the Static Site, ensure you have updated the API URLs in your `frontend/src/App.js` (or wherever you make `fetch` calls) to point to your **Render-deployed Backend URL** (from Step 1.5). For example:
        *   Change `http://localhost:5000/models` to `<your-render-backend-url>/models`
        *   Change `http://localhost:5000/upload` to `<your-render-backend-url>/upload`
    *   **Rebuild Frontend:** After updating API URLs, rebuild your frontend: `cd frontend` then `npm run build` or `yarn build`.
    *   **Commit and Push:** Commit and push these frontend changes to your GitHub repository.

4.  **Create Static Site:** Click **"Create Static Site"** at the bottom. Render will start deploying your frontend.

5.  **Verify Frontend Deployment:**
    *   Once deployed, Render will provide you with a **Site URL** for your static site.
    *   Open your browser and go to the **Site URL** provided by Render (e.g., `<your-render-frontend-url>.onrender.com`).
    *   You should now see your **3D Model Viewer User Interface**. Test all functionalities to ensure it's working correctly and communicating with your Render-deployed backend.

## Verification

After deployment, verify the following:

*   **Backend:** Access `<your-render-backend-url>/models` in your browser and confirm you see the JSON model data.
*   **Frontend:** Access `<your-render-frontend-url>.onrender.com` and confirm you see the 3D Model Viewer UI and can interact with it.
*   **Full Application Functionality:** Test all features of the deployed application (model loading, search, upload) to ensure everything is working correctly in the production environment.

**Congratulations!** Your IKARUS 3D Model Viewer application is now deployed on Render and accessible over the internet. You can share your Render Static Site URL to showcase your application.
