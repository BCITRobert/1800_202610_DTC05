import { db } from "./firebaseConfig.js";
import { doc, getDoc, onSnapshot, getDocs } from "firebase/firestore";


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
        console.log(user)

        



    } catch (error) {
        console.log("Error loading user profile:", error);
    }
}





displayUserProfile()

