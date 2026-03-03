# Elmo Hikes


## Overview
Elmo Hikes is a client-side JavaScript web application that helps users discover and explore hiking trails. The app displays a curated list of hike trails, each with details such as name, location, difficulty, and an image. Users can browse the list and mark their favorite trails for easy access later.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user favorites.

---


## Features

- Browse a list of curated hiking trails with images and details
- Mark and unmark trails as favorites
- View a personalized list of favorite hikes
- Responsive design for desktop and mobile

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


## Project Structure

```
elmo-hikes/
├── src/
│   ├── main.js
├── styles/
│   └── style.css
├── public/
├── images/
├── index.html
├── package.json
├── README.md
```

---


## Contributors
- **Khash** - BCIT CST Student with a passion for programming. I also love to watch soccer and listen to Rap and Hip Hop music.
- **Robert Si** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Edward Kim** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Teammate Name** - BCIT CST Student, Frontend enthusiast with a knack for creative design. Fun fact: Has a collection of over 50 houseplants.

---


## Acknowledgments

- Trail data and images are for demonstration purposes only.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/).

---


## Limitations and Future Work
### Limitations

- Limited trail details (e.g., no live trail conditions).
- Accessibility features can be further improved.

### Future Work

- Implement map view and trailhead directions.
- Add filtering and sorting options (e.g., by difficulty, distance).
- Create a dark mode for better usability in low-light conditions.

---


## License

This project is licensed under the MIT License. See the LICENSE file for details.
