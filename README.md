# SafeRide


## Overview
SafeRide is an app that helps user to track transit routes and select their route they are most comfortable taking without delays.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user favorites and login details.

---


## Features

- Browse a list of user created routes
- Recommend user's routes
- Edit profile picture
- Search a specific name of the user created route

---


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---


## Usage

To run the application locally:

1.  **Clone** the repository.
2.  **Install dependencies** by running `npm install` in the project root directory.  This pulls in Vite and the Firebase SDK.
3.  Create a `.env` file in the project root containing the Firebase configuration values provided by your instructor.  Example contents are available in the `env.` file:

    ```text
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your-app-id
    VITE_FIREBASE_APP_ID=1:XXX:web:YYYYYY
    ```

    Vite only exposes variables prefixed with `VITE_`, and the dev server
    must be restarted after editing the `.env` file.
4.  **Start the development server** by running the command: `npm run dev`.
5.  Open your browser and visit the local address shown in your terminal (usually `http://localhost:5173` or similar).

Once the application is running from the dev server:

1.  Create an account or log in using the form on `login.html`.
2.  The app will communicate with the provided Firebase project; user
    information lives in Authentication and favorites are saved in
    Firestore under `/users/{uid}/favorites`.
3.  Browse the list of hiking trails displayed on the main page.
4.  Click the heart icon (or similar) to mark a trail as a favorite.
5.  View your favorite hikes in the favorites section.

---



## Contributors
- **Robert Si** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute. Contributed mostly on database working with Firebase and Firestore
- **Edward Kim** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute. Contributed on frontend and user experience (UX)


---


### Future Work

- Use more time on implementing an API outside of school to get hands-on coding skills using live API keys
- Add filtering and sorting options (e.g., by crowdedness, time, etc.).
- Create a dark mode for better usability in low-light conditions.
