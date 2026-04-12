import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc, onSnapshot, getDocs, collection, deleteDoc } from "firebase/firestore";


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

        const currentUser = auth.currentUser;
        const ownProfile = currentUser && currentUser.uid === id;

        const avatarHTML = avatar
            ? `<img src="${avatar}" alt="${name}'s avatar" class="w-24 h-24 rounded-full object-cover">`
            : `<div class="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold">
                  ${name[0].toUpperCase()}
               </div>`;
        
        document.getElementById("userProfile").innerHTML = `
            <div class="relative cursor-pointer group" id="avatarWrapper">
                ${avatarHTML}
                ${ownProfile ? `
                <div class="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white text-xs font-semibold">Edit</span>
                </div>
                <input type="file" id="avatarInput" accept="image/*" class="hidden">
                ` : ''}
            </div>
            <h2><span class="font-semibold">Name:</span> ${name}</h2>
            <p><span class="font-semibold">Email:</span> ${email}</p>
            ${ownProfile ? `<p id="uploadStatus" class="text-sm text-gray-500 mt-1"></p>` : ''}
        `;

        if (ownProfile) {
            document.getElementById("avatarWrapper").addEventListener("click", () => {
                document.getElementById("avatarInput").click();
            })
        };

        document.getElementById("avatarInput").addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const status = document.getElementById("uploadStatus");

                if (file.size > 500 * 1024) {
                    status.textContent = "Image too large. Please pick one under 500KB.";
                    return;
                }

                status.textContent = "Uploading Image...";
            
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const base64 = e.target.result;
                    try {
                        await updateDoc(userRef, {avatar: base64});
                        document.querySelector("#avatarWrapper img").firstElementChild.outerHTML =
                        `<img src="${base64}" class=w-24 h-24 rounded-full object-cover">`;
                        status.textContent = "Profile picture updated!";
                        setTimeout(() => status.textContent = "", 3000);
                    } catch (err) {
                        console.error("Upload failed:", err);
                        status.textContent = "Upload failed. Please try again.";
                    }
                };
                reader.readAsDataURL(file);
        });

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
