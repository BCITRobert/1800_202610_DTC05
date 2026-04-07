import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, onSnapshot, getDocs, collection, deleteDoc } from "firebase/firestore";


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

        const name = user.name;
        const email = user.email;
        const avatar = user.avatar;

        document.getElementById("userProfile").innerHTML = `
            <img src="${avatar}" alt="${name}'s avatar" width="100">
            <h2>Name: ${name}</h2>
            <p>Email: ${email}</p>
        `;

    } catch (error) {
        console.log("Error loading user profile:", error);
    }
}


async function displayRoutes() {
    const user = auth.currentUser;
    const userID = getDocIdFromUrl()

    const routeRef = collection(db, "users", userID, "routes")

    const routeSnap = await getDocs(routeRef)
    console.log(routeSnap.size)


    routeSnap.forEach((Snap) => {
        const docID = Snap.id
        const data = Snap.data();
        console.log(data)

        const title = data.title || "(No title)";
        const detail = data.detail || "(No detail)";
        const commuteTime = data.commutePeriod || "(No time specific)"
        const crowdLevel = data.crowdLevel || "(Not specific)"
        // const recomand = data.recomand || "(Not specific)"

        let crowdLevelText = ``;
        commuteTime.forEach((timePeriod)=>{
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
        routeCard.querySelector("#timeStamp").innerHTML = `
        <span class="font-bold">Time Created</span>: ${time}
        `;
        routeCard.querySelector('#deleteRoute').addEventListener("click", async (params) => {
            const docRef = doc(db, "users", userID, "routes", docID);
            await deleteDoc(docRef);
            window.location.reload()
        })
        routeCard.querySelector("#routeDetail").innerHTML = `
        <span class="font-semibold">Detail</span>: ${detail}
        `;
        routeCard.querySelector("#routeCommuteTime").innerHTML = `
        <span class="font-semibold">Commute Time</span>: ${commuteTime}
        `;
        routeCard.querySelector("#routeCrowdLevel").innerHTML = `
        <span class="font-semibold">Crowding Level</span>: ${crowdLevel}
        `;
        // routeCard.querySelector("#routeRecomand").innerHTML = `
        // <span class="font-semibold">Recommended</span>: ${recomand}
        // `;

        document.getElementById('routeGroup').appendChild(routeCard);
    });

}



displayUserProfile()
displayRoutes()
