import { onAuthReady } from './authentication.js';
import { db, auth } from "./firebaseConfig.js";
import { doc, getDocs, collection, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

function crowdBadge(level) {
    const map = {
        empty:    { bg: "bg-gray-100",   text: "text-gray-500" },
        light:    { bg: "bg-green-100",  text: "text-green-700" },
        moderate: { bg: "bg-yellow-100", text: "text-yellow-700" },
        crowded:  { bg: "bg-orange-100", text: "text-orange-700" },
        packed:   { bg: "bg-red-100",    text: "text-red-700" },
    };
    const style = map[level?.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-500" };
    return `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}">${level}</span>`;
}

function setup() {
    const addRouteContainer = document.getElementById('container')
    const inputForm = document.getElementById('inputForm')
    const addBtn = document.getElementById('addBtn')
    const routeBtn = document.querySelectorAll('.routeBtn')
    const submitBtn = document.getElementById("submitBtn")
    const routeDisplayContainer = document.getElementById('routeGroup')
    

    routeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        })
    })
    
    submitBtn.addEventListener("click", () => {
        writeRoute()
    })

    onAuthReady(async (user) => {
        if (user) {
            document.getElementById('welcome').textContent = `Create your new Route comment!\nExisting routes:`
            document.getElementById('welcome').style.whiteSpace = 'pre'
            displayRoutes(routeDisplayContainer)
            addRouteContainer.classList.remove("hidden")
            addRouteContainer.classList.add("flex")
            routeDisplayContainer.classList.remove("hidden")
            routeDisplayContainer.classList.add("flex")

            addBtn.addEventListener('click', () => {
                addBtn.classList.add("hidden")
                routeDisplayContainer.classList.add("hidden")
                inputForm.classList.remove("hidden")
            })

        }
    })
}


async function writeRoute() {
    console.log("Inside write review");

    // 🧾 Collect form data
    const routeTitle = document.getElementById("title").value;
    const routeCrowdLevel = document.getElementById("crowdLevel").value;
    const routeDetail = document.getElementById("detail").value;
    // const routeRecomand = document.querySelector('input[name="recommand"]:checked')?.value;

    const activeButtons = document.querySelectorAll('.routeBtn.active')
    const btnValues = Array.from(activeButtons).map(btn => btn.value);

    // Log collected data for verification
    // console.log(routeTitle, routeDetail, routeCrowdLevel, btnValues, routeRecomand);

    // simple validation
    if (!routeTitle) {
        alert("A route name must be given.");
        return;
    }

    // get a pointer to the user who is logged in
    const user = auth.currentUser;

    if (user) {
        try {
            const userID = user.uid;

            // Path: hikes/{hikeDocID}/reviews/{autoReviewID}
            await addDoc(collection(db, "users", userID, "routes"), {
                title: routeTitle,
                crowdLevel: routeCrowdLevel,
                commutePeriod: btnValues,
                detail: routeDetail,
                // recomand: routeRecomand,
                timestamp: serverTimestamp()
            });

            console.log("Review successfully written!");


            // Show thank-you modal
            // Get modal and close buttons
            const thankYouModal = document.getElementById("thankYouModal");
            const closeBtns = [
                document.getElementById("closeModalBtn"),
                document.getElementById("closeModalBtn2")
            ];

            // Function to show modal
            function showThankYouModal() {
                thankYouModal.classList.remove("hidden");
                thankYouModal.classList.add("flex");
            }

            // Function to hide modal and redirect once
            function hideThankYouModal() {
                thankYouModal.classList.add("hidden");
                thankYouModal.classList.remove("flex");
                // Redirect after modal is closed
                window.location.href = `route.html`;
            }

            // Show modal
            showThankYouModal();

            // Close modal when user clicks any close button
            closeBtns.forEach(btn => {
                btn.addEventListener("click", hideThankYouModal, { once: true });
            });

            // Optional: close modal on click outside
            thankYouModal.addEventListener("click", (e) => {
                if (e.target === thankYouModal) {
                    hideThankYouModal();
                }
            }, { once: true });

            // Optional: close modal on ESC key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    hideThankYouModal();
                }
            }, { once: true });

        } catch (error) {
            console.error("Error adding review:", error);
        }
    } else {
        console.log("No user is signed in");
        //window.location.href = "review.html";
    }
}


async function displayRoutes(routeDisplayContainer) {
    const user = auth.currentUser;
    const userID = user.uid

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

        routeDisplayContainer.appendChild(routeCard);
    });

}

document.addEventListener('DOMContentLoaded', () => {
    setup()
});