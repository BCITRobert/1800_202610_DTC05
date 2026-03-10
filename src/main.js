import { onAuthReady, logoutUser } from './authentication.js';
import { db } from "./firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

function setup() {
    $(document).on("click", "#goToLogin", navToLogin);
    $(document).on("click", "#logoutBtn", logoutUser);

    // watch auth state and update page accordingly
    onAuthReady(async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid)
            const userData = {name: user.displayName, email: user.email, avatar: user.photoURL}
            await setDoc(userRef, userData)
            document.getElementById('welcomeMessage').textContent = `Hello, ${user.displayName || user.email}!`;
        } else {
            document.getElementById('welcomeMessage').textContent = 'Not logged in';
        }
    });
}

setup()