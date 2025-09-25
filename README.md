# NoteNexus - A Collaborative Hub for Academic Resources 📚

**NoteNexus** is a modern, collaborative web platform designed to help college students share and find academic resources like notes, Previous Year Questions (PYQs), lab manuals, and e-books.

---

## 🚀 Project Overflow: The User Journey

The core workflow of NoteNexus is designed to be intuitive and seamless, guiding users from discovery to contribution effortlessly.

### Authentication (`/login`)
- Secure and simple authentication using **Firebase Authentication** and a custom **AuthContext**.  
- Users can sign in with their Google account in a single click.  
- Unauthenticated users are gracefully redirected from protected routes like `/profile`.

### Discovery & Filtering (`/pyq`, `/resource`)
- Once logged in, users can explore the resource library.  
- **Filtering system** is the heart of the application:
  - UI fetches a structured list of colleges, courses, and semesters from the Firebase RTDB.
  - **React hooks** (`useReducer`, `useMemo`) dynamically populate dropdowns.
  - Selecting a college filters courses, selecting a course filters semesters.

### Viewing Documents (`PdfViewer.jsx`)
- Creates a **real-time subscription** to the database path (e.g., `colleges/nit_agartala/.../pyq`) using Firebase's `onValue` listener.  
- Documents uploaded by other users appear **instantly**.  
- Includes:
  - **Skeleton loaders** for polished loading state.  
  - **Empty state** with actionable prompts encouraging contributions.

### Contribution (`/upload`)
- Upload page allows users to contribute.  
- Form uses the same dynamic filtering logic for proper categorization.  
- Large file upload handled via **XMLHttpRequest** to track progress with a minimalist orange progress bar.  
- File uploaded **directly to Cloudinary**, URL saved to Firebase RTDB.

### Personalization (`/profile`)
- Displays user information from **AuthContext**.  
- Bookmarks fetched in real-time from `/users/{uid}/bookmarks`.  
- Users can quickly access saved documents across categories.

---

## ✨ Key Features & Implementations

- **Secure Google Authentication**: Firebase Authentication + global React Context (`AuthContext.js`).  
- **Real-time Data Sync**: Instant updates via Firebase's `onValue` listeners.  
- **Client-Side File Uploads**: Direct-to-Cloudinary with progress bar for smooth UX.  
- **Dynamic & Dependent Filtering**: Efficient logic with `useReducer` + `useMemo`.  
- **Personalized Bookmarking**: Bookmarks stored under each user’s UID in Firebase RTDB.  
- **Modern & Animated UI/UX**: Responsive **dark theme**, built with **Tailwind + Framer Motion** animations.  
- **Robust Empty & Loading States**: Skeleton loaders and actionable prompts.

---

## 💻 Tech Stack

| Category             | Technology |
|----------------------|------------|
| Frontend Framework   | React      |
| Styling & Animation  | Tailwind CSS, Framer Motion |
| Backend & Services   | Firebase RTDB, Firebase Auth, Cloudinary |
| Build Tool & Routing | Vite, React Router |

---

## 🛠️ Setup and Local Installation

Follow these steps to run the project locally:

### Prerequisites
- Node.js (v18+ recommended)  
- An active **Firebase project**  
- A free **Cloudinary account**

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/tusharg2210/NoteNexus.git
   cd NoteNexus
   ```
2. **Install Dependencies**
    ```
    npm install
    ```

3. **Configure Environment Variables**
- Create a .env file in the project root and add:
```
# Firebase Configuration
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_DATABASE_URL="YOUR_DATABASE_URL"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="YOUR_CLOUD_NAME"
VITE_CLOUDINARY_UPLOAD_PRESET="your_unsigned_upload_preset"
VITE_CLOUDINARY_URL="YOUR_CLOUD_URL"
VITE_CLOUDINARY_API_SECRET="YOUR_CLOUD_SECRET"
VITE_CLOUDINARY_API_KEY="YOUR_CLOUD_API_KEY"
```
4. **Firebase Database Setup**

- Create a Realtime Database in Firebase.

- Import firebase_schema.json or create structure manually.

- Set Security Rules:

- Public reads for colleges collection.

- Authenticated writes for user-specific data (e.g., bookmarks).

5. **Cloudinary Setup**

- Go to Settings > Upload.

- Use an Unsigned Upload Preset (e.g., ml_default).

- Under Settings > Security, enable Raw files delivery as Public.

6. **Run Development Server**
    ```
    npm run dev
    ```

App runs at: http://localhost:5173

## 📜 License

This project is licensed under the MIT License – see the LICENSE.md file for details.
