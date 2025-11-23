# Dynamic StoryTelling - Choose Your Own Adventure (CYOA)

A lightweight, interactive platform that transforms structured **XML stories** into an immediate, clean "Choose Your Own Adventure" experience in the browser. Authors simply upload their story logic in XML after registering & logging in, and the platform handles the transformation, storage, and interactive playback.

---

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Technology Stack](#technology-stack)
3.  [Constraints & Architecture](#constraints--architecture)
4.  [Features](#features)
5.  [Prerequisites](#prerequisites)
6.  [Installation & Setup](#installation--setup)
7.  [Usage Guide (XML Format)](#usage-guide-xml-format)
8.  [Folder Structure](#folder-structure)

---

## Project Overview

This project is designed to bridge the gap between structured data (XML) and interactive web experiences. It serves as a player for branching narratives without the need for complex game engines. The core philosophy is simple: **Readable Stories -> Interactive Gameplay**.

The system uses an **XSLT (Extensible Stylesheet Language Transformations)** pipeline to convert uploaded XML story files into a canonical JSON format, which is then stored in a MongoDB database and served to a React frontend.

---

## Technology Stack

*   **Frontend:** React (v19), React Router DOM, Axios, CSS Modules.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ODM).
*   **Authentication:** JWT (JSON Web Tokens), Bcryptjs.
*   **Data Processing:** `xslt-processor` (XML to JSON transformation), `xml2js`.
*   **Validation:** Client-side (React state) and Server-side (Controller logic).

---

## Constraints & Architecture

This project was built adhering to a specific set of architectural constraints and requirements:

1.  **TRAF (Transient/Transformational XML):** The system handles multiple XML files as the source of truth for story logic.
2.  **XML with XSL/XSD:**
    *   **Data Modeling:** Stories are modeled in XML.
    *   **Transformation:** A dedicated module uses XSL to transform input XML into JSON data suitable for MongoDB storage.
3.  **Database:** MongoDB is used exclusively for storing the transformed JSON data and user information.
4.  **Separation of Concerns:**
    *   **Frontend:** React handles the UI and interactive player state.
    *   **Backend:** Node.js/Express serves the RESTful API.
5.  **Security:**
    *   **Authentication:** Implemented using JWT (stateless authentication).
    *   **Validation:** Input validation is performed on both the client and server sides.
6.  **Containerization:** *Designed to be container-ready for Docker Desktop (Phase 2).*
7.  **RESTful API:** Adheres to standard HTTP methods (GET, POST) and status codes.

---

## Features

*   **User Authentication:** Secure Register and Login functionality.
*   **Story Upload:** Users can upload `.xml` files. The backend validates and transforms them instantly.
*   **Interactive Player:** A polished React component that renders story nodes, choices, and images dynamically.
*   **Dashboard:** Browse all uploaded adventures and jump into any story.
*   **State Management:** Tracks the user's current path through the narrative.

---

## Prerequisites

Before running the project, ensure you have the following installed:

*   **Node.js** (v14 or higher)
*   **MongoDB** (Local instance running on port `27017` or a cloud URI)

---

## Installation & Setup

The project is divided into two main folders: `backend` and `frontend`. You will need two terminal windows.

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a .env file
# Add the following content:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/storytelling_cyoa
# JWT_SECRET=your_super_secret_key

# Start the server
npm start
```
*The server will run on `http://localhost:5000`.*

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
*The application will open at `http://localhost:3000`.*

---

## Usage Guide (XML Format)

To upload a story, create an XML file following this structure. A `sample_story.xml` is provided in the root directory.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<story>
  <title>My Adventure</title>
  <nodes>
    <!-- The 'id' is used for linking choices -->
    <node id="start">
      <text>You are at a crossroad.</text>
      <choices>
        <choice target="forest">Go to the forest</choice>
        <choice target="city">Go to the city</choice>
      </choices>
    </node>
    
    <node id="forest">
      <text>It is dark and spooky here.</text>
    </node>
    
    <node id="city">
      <text>The lights are bright.</text>
    </node>
  </nodes>
</story>
```

---

## Folder Structure

```
Dynamic-StoryTelling-CYOA/
├── backend/
│   ├── src/
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose Schemas (User, Story)
│   │   ├── routes/       # API Routes (auth, stories)
│   │   ├── schema/       # XSD and XSL files for transformation
│   │   ├── db.js         # Database connection
│   │   └── server.js     # Express app setup
│   ├── index.js          # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Header, StoryPlayer)
│   │   ├── context/      # AuthContext (Global State)
│   │   ├── pages/        # Page Views (Login, Dashboard, Play, Upload)
│   │   ├── services/     # API Service (Axios)
│   │   └── App.js        # Main Router
│   └── package.json
├── sample_story.xml      # Example file for testing
└── README.md
```