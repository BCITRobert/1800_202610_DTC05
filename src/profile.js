import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc, onSnapshot, getDocs, collection, deleteDoc } from "firebase/firestore";


function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("userID");
}

// coloured time badge
function timeBadge(period) {
    const bg = "#62B5B4";
    const text = "#000000";
    return `<span style="background-color:${bg}; color:${text}; display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 500; margin-right: 4px;">${period}</span>`;
}

// fetches and displayers user profile info
async function displayUserProfile() {
    const id = getDocIdFromUrl();

    try {
        // gets user document from firestore
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();
        console.log(user)

        const name = user.name;
        const email = user.email;
        const avatar = user.avatar;

        const currentUser = auth.currentUser;
        const ownProfile = currentUser && currentUser.uid === id;

        // shows avatar image if it exists, otherwise it will show the name initial
        const avatarHTML = avatar
            ? `<img src="${avatar}" alt="${name}'s avatar" class="w-24 h-24 rounded-full object-cover">` : `<div class="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold">
                  ${name[0].toUpperCase()}
               </div>`;
        
        // renders profile section
        document.getElementById("userProfile").innerHTML = `
            <div class="relative cursor-pointer group" id="avatarWrapper">
                ${avatarHTML}
                ${ownProfile ? `
                <div class="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white text-xs font-semibold">Edit</span>
                </div>
                <input type="file" id="avatarInput" accept="image/*" class="hidden">`: ''}
            </div>
            ${ownProfile && avatar ? `<button id="removeAvatar" class="text-sm text-red-500 mt-1">Remove Photo</button>`: ""}
            <h2><span class="font-semibold">Name:</span> ${name}</h2>
            <p><span class="font-semibold">Email:</span> ${email}</p>
            ${ownProfile ? `<p id="uploadStatus" class="text-sm text-green-500 mt-1"></p>`: ""}`;

        if (ownProfile) {
            document.getElementById("avatarWrapper").addEventListener("click", () => {
                document.getElementById("avatarInput").click();
            });
            // uploads if file is selected
            document.getElementById("avatarInput").addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) 
                    return;

                const status = document.getElementById("uploadStatus");
                status.textContent = "Uploading Image...";
                    
                // reads file as base64 and saves it to Firestore
                const reader = new FileReader(); // FileReader reads the files from the user's computer
                reader.onload = async (e) => { // must give a lifecycle event (onload) because FileReader is asynchronous
                    const profile = e.target.result;
                    try {
                        await updateDoc(userRef, {avatar: profile});
                        document.querySelector("#avatarWrapper").firstElementChild.outerHTML =
                            `<img src="${base64}" class=w-24 h-24 rounded-full object-cover">`;
                        status.textContent = "Profile picture updated!";
                        setTimeout(() => status.textContent = "", 3000); // "Profile picture updated!" message shows up for 3 seconds
                    } catch (err) {
                        console.error("Upload failed:", err);
                        status.textContent = "Upload failed. Please try again.";
                    }
                };
                reader.readAsDataURL(file);
        });

        // remove button
        if (avatar) {
            document.getElementById("removeAvatar").addEventListener("click", async () => {
                await updateDoc(userRef, {avatar: null}); // sets to null in database if there is no profile picture
                document.querySelector("#avatarWrapper").firstElementChild.outerHTML = 
                `<div class="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold"> 
                    ${name[0].toUpperCase()} 
                </div>`; // sets the profile picture to the first name initial if there is no profile picture
                document.getElementById("removeAvatar").remove();
            });
        }

        };
        
        // catches error if loading user profile is unsuccessful
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
        const commuteTime = data.commutePeriod || [];
        const crowdLevel = data.crowdLevel || "(Not specific)"
        // const recomand = data.recomand || "(Not specific)"

        // generates coloured badge for time periods
        const timeBadges = commuteTime.length ? commuteTime.map(t => timeBadge(t)).join(""): "(No time specific)";

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
        
        // timeBadge returns the colored time periods to the cards
        routeCard.querySelector("#routeCommuteTime").innerHTML = `
        <span class="font-semibold">Commute Time Periods</span>: ${timeBadges} 
        `;
        routeCard.querySelector("#routeCrowdLevel").innerHTML = `
        <span class="font-semibold">Crowd Level</span>: ${crowdLevel}
        `;
        // routeCard.querySelector("#routeRecomand").innerHTML = `
        // <span class="font-semibold">Recommended</span>: ${recomand}
        // `;

        document.getElementById('routeGroup').appendChild(routeCard);
    });

}



displayUserProfile()
displayRoutes()
