import { db } from "./firebaseConfig.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";


function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("userID");
}

async function displayUserProfile() {
    const id = getDocIdFromUrl();

    try {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        const user = userSnap.data();
        const name = user.name;
        const email = user.email;
        const avatar = user.avatar;

        console.log(user)
        document.getElementById("userProfile").innerHTML = `
            <img src="${avatar}" alt="${name}'s avatar" width="100">
            <h2>Name: ${name}</h2>
            <p>Email: ${email}</p>
        `;

    } catch (error) {
        console.error("Error loading user profile:", error);
        document.getElementById("hikeName").textContent = "Error loading hike.";
    }
}

displayUserProfile()
