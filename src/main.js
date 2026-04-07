import { onAuthReady, logoutUser } from './authentication.js';
import { db } from "./firebaseConfig.js";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
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
            iterateUsers(user)
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


async function iterateUsers() {

    const usersRef = collection(db, "users")

    const usersSnap = await getDocs(usersRef)


    for (const user of usersSnap.docs) {
        const userID = user.id
        const username = user.data().name
        const routesRef = collection(db, "users", userID, "routes")
        const routesSnap = await getDocs(routesRef)
        routesSnap.forEach((routeSnap) => {
            const docID = routeSnap.id
            const data = routeSnap.data()
            const title = data.title || "(No title)";
            const detail = data.detail || "(No detail)";
            const commuteTime = data.commutePeriod || "(No time specific)"
            const crowdLevel = data.crowdLevel || "(Not specific)"
            const recomand = data.recomand || "(Not specific)"

            let crowdLevelText = ``;
            commuteTime.forEach((timePeriod) => {
                crowdLevelText += ` ${timePeriod}, `;
            })

            // Format the time
            let time = "";
            if (data.timestamp?.toDate) {
                time = data.timestamp.toDate().toLocaleString();
            }

            // Clone the template and fill in the fields
            const routeCard = document.getElementById("routeTemp").content.cloneNode(true);

            routeCard.querySelector("#routeTitle").innerHTML = `
        <span class="font-bold">Route Title</span>: ${title}
        `;
            routeCard.querySelector("#creater").innerHTML = `
        <span class="font-bold">Creater</span>: ${username}
        `;
            routeCard.querySelector("#timeStamp").innerHTML = `
        <span class="font-bold">Time Created</span>: ${time}
        `;

            routeCard.querySelector('#recommand').addEventListener("click", toggleRecoomand(userID, docID))
            routeCard.querySelector("#routeDetail").innerHTML = `
        <span class="font-semibold">Detail</span>: ${detail}
        `;
            routeCard.querySelector("#routeCommuteTime").innerHTML = `
        <span class="font-semibold">Commute Time</span>: ${commuteTime}
        `;
            routeCard.querySelector("#routeCrowdLevel").innerHTML = `
        <span class="font-semibold">Crowding Level</span>: ${crowdLevel}
        `;
            routeCard.querySelector("#routeRecomand").innerHTML = `
        <span class="font-semibold">Recommended</span>: ${recomand}
        `;

            document.getElementById('routeGroup').appendChild(routeCard);
        })

    }

}



async function toggleRecoomand(userId, docID) {
    console.log("recommand")
    const routeRef = doc(db, "users", userId, "routes", docID);
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data() || {};
    const recomand = routeData.recomand || [];
    const recomandCount = routeData.recomandCount || 0;
    const isRecomand = recomand.includes(docID);

    const iconId = "save-" + docID;           // construct icon's unique ID given the hike ID
    const icon = document.getElementById("recommand"); // get a pointer to icon DOM

    try {
        if (isRecomand) {
            await updateDoc(routeRef, {
                recomand: false,
                recomandCount: recomandCount - 1
            })
            // db, "users", userId, "routes", docID
            icon.innerText = "bookmark_border"
        } else {
            await updateDoc(routeRef, {
                recomand: true,
                recomandCount: recomandCount + 1
            });
            icon.innerText = "bookmark";
        }
    } catch (err) {
        console.log(err)
    }
}


setup()

