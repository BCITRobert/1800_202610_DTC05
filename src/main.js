import { onAuthReady, logoutUser } from './authentication.js';
import { db } from "./firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import protobuf from "protobufjs";

function setup() {
    $(document).on("click", "#logoutBtn", logoutUser);
    // watch auth state and update page accordingly
    onAuthReady(async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid)
            const userData = { name: user.displayName, email: user.email, avatar: user.photoURL }
            console.log(userRef, userData)
            await setDoc(userRef, userData)
            document.getElementById('welcomeMessage').textContent = `Hello, ${user.displayName || user.email}!`;
            loadGTFS()
        } else {
            document.getElementById('welcomeMessage').textContent = 'Not logged in';
        }
    });
}



async function loadGTFS() {
    const url = "https://gtfsapi.translink.ca/v3/gtfsrealtime?apikey=n2hPJBIaQCxB7mOOn8oT";
    const root = await protobuf.load("gtfs-realtime.proto");
    const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const message = FeedMessage.decode(new Uint8Array(buffer));
    const object = FeedMessage.toObject(message, {
        longs: String,
        enums: String,
        defaults: true
    });

    // console.log(object);
}

loadGTFS();

setup()