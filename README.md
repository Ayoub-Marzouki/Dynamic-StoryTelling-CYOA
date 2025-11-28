# Dynamic StoryTelling - Choose Your Own Adventure (CYOA)

A lightweight, interactive platform that transforms structured **XML stories** into an immediate, clean "Choose Your Own Adventure" experience in the browser. Authors simply upload their story logic in XML after registering & logging in, and the platform handles the transformation, storage, and interactive playback.

---

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Technology Stack](#technology-stack)
3.  [Features](#features)
4.  [Prerequisites](#prerequisites)
5.  [Installation & Setup (Docker)](#installation--setup-docker)
6.  [How to Run & Test (Step-by-Step)](#how-to-run--test-step-by-step)
7.  [XML Formats](#xml-formats)

---

## Project Overview

This project bridges the gap between structured data (XML) and interactive web experiences. It uses a heterogeneous data architecture where **Users**, **Genres**, and **Stories** are all imported via XML files, processed by XSLT, and stored in MongoDB.

---

## Technology Stack

*   **Frontend:** React (v19), React Router DOM, Fetch API, CSS Modules.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ODM).
*   **Authentication:** JWT (JSON Web Tokens), Bcryptjs.
*   **Data Processing:** `xslt-processor`, `xml2js`.
*   **Containerization:** Docker, Docker Compose.

---

## Features

*   **Role-Based Access:** 
    *   **Admin:** Can import Users and Genres via XML.
    *   **Author:** Can upload Stories via XML.
    *   **Player:** Can browse genres and play stories.
*   **Genre-Based Navigation:** Stories are organized by categories (Sci-Fi, Noir, Fantasy).
*   **XML Transformation:** All core data enters the system as XML and is transformed server-side into JSON.
*   **Interactive Player:** A polished React component for playing the stories.

---

## Prerequisites

*   **Docker Desktop** (Installed and running).

---

## Installation & Setup (Docker)

You do not need to install Node.js or MongoDB manually. Docker handles everything.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Dynamic-StoryTelling-CYOA
    ```

2.  **Start the Application:**
    ```bash
    docker-compose up --build
    ```
    *Wait for the logs to show `Server running on port 5000` and `webpack compiled successfully`.*

---

## How to Run & Test (Step-by-Step)

Follow this exact sequence to populate the system and test all features.

### 1. Access the Platform
*   Open your browser to [http://localhost:3000](http://localhost:3000).
*   You will see the Dashboard, likely empty or showing "No genres found".

### 2. Admin Setup
The system automatically creates a default Admin account on startup.
*   Go to **Login**.
*   **Email:** `admin@cyoa.com`
*   **Password:** `admin123`
*   You will now see the **Admin Command Center** at the top of the Dashboard.

### 3. Populate Data (The XML Imports)
*   **Import Genres:**
    1.  In the Admin Panel, look for "Import Genres".
    2.  Select the file: `sample_genres/site_genres.xml`.
    3.  Click "Import".
    4.  *Result:* You should see the Genre Cards (Sci-Fi, Noir, Fantasy) appear instantly.
*   **Import Users:**
    1.  Look for "Import Users".
    2.  Select the file: `sample_users/users.xml`.
    3.  Click "Import".
    4.  *Result:* 3 new users (user1, user2, admin) are added to the database.
*   **Logout** (Click the Logout button).

### 4. Author Workflow (Uploading Stories)
*   **Login as an Author from imported users or create a new account:**
    *   **Email:** `user1@example.com` (This user was in the XML you just imported).
    *   **Password:** `password123`
*   **Upload Stories:**
    1.  Click "Upload Story" in the navigation.
    2.  Upload `sample_stories/detective_noir.xml`.
    3.  Repeat for `fantasy_quest.xml` and `scifi_escape.xml`.
*   **Verify:** Go back to the Dashboard. The "Story Count" on the Genre cards should have increased.

### 5. Player Experience
*   **Browse:** Click on the **"Science Fiction"** card.
*   **View:** You will see "Escape from Station X-9".
*   **Play:** Click "Play Now".
*   Enjoy the game!

---

## XML Formats

### Users XML (`users.xsd`)
```xml
<users>
  <user role="user"> <!-- role can be 'user' or 'admin' -->
    <username>john_doe</username>
    <email>john@example.com</email>
    <password>password123</password>
  </user>
</users>
```

### Genres XML (`genres.xsd`)
```xml
<library>
  <genre id="scifi">
    <label>Science Fiction</label>
    <description>Space, aliens...</description>
    <icon>🚀</icon>
  </genre>
</library>
```

### Stories XML (`story.xsd`)
```xml
<story>
  <title>My Story</title>
  <genre>scifi</genre> <!-- Must match a genre ID -->
  <nodes>
    <node id="start">
      <text>You are in a spaceship...</text>
      <choices>
         <choice target="room2">Go Left</choice>
      </choices>
    </node>
  </nodes>
</story>
```
