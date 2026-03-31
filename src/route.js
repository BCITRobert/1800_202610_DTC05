import { onAuthReady } from './authentication.js';
import { db, auth } from "./firebaseConfig.js";
import { doc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
            document.getElementById('welcome').textContent = 'Create your new Route comment!'
            displayRoutes(routeDisplayContainer)
            addRouteContainer.classList.remove("hidden")
            addRouteContainer.classList.add("flex")
            routeDisplayContainer.classList.remove("hidden")
            routeDisplayContainer.classList.add("flex")
            addBtn.addEventListener('click', () => {
                addBtn.classList.add("hidden")
                routeDisplayContainer.classList.add("hidden")
                inputForm.classList.remove("hidden")
                newRoute()
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
    const routeAddition = document.getElementById("addition").value;
    const routeRecomand = document.querySelector('input[name="recommand"]:checked')?.value;

    const activeButtons = document.querySelectorAll('.routeBtn.active')
    const btnValues = Array.from(activeButtons).map(btn => btn.value);

    // Log collected data for verification
    console.log(routeTitle, routeDetail, routeCrowdLevel, btnValues, routeAddition, routeRecomand);

    // simple validation
    if (!routeTitle) {
        alert("Please complete all required fields.");
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
                recomand: routeRecomand,
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
        const data = Snap.data();
        console.log(data)

        const title = data.title || "(No title)";
        const detail = data.detail || "(No detail)";

        // Format the time
        let time = "";
        if (data.timestamp?.toDate) {
            time = data.timestamp.toDate().toLocaleString();
        }

        // Clone the template and fill in the fields
        const routeCard = document.getElementById("routeTemp").content.cloneNode(true);

        routeCard.querySelector("#title").innerHTML = `
        title
        `;
        routeCard.querySelector("#detail").innerHTML = ``;

        // reviewCard.querySelector(".level").textContent = `Level: ${level}`;
        // reviewCard.querySelector(".season").textContent = `Season: ${season}`;
        // reviewCard.querySelector(".scrambled").textContent = `Scrambled: ${scrambled}`;
        // reviewCard.querySelector(".flooded").textContent = `Flooded: ${flooded}`;
        // reviewCard.querySelector(".description").textContent = `Description: ${description}`;

        // Star rating
        // let starRating = "";
        // const safeRating = Math.max(0, Math.min(5, rating));
        // for (let i = 0; i < safeRating; i++) {
        //     starRating += '<span class="material-icons">star</span>';
        // }
        // for (let i = safeRating; i < 5; i++) {
        //     starRating += '<span class="material-icons">star_outline</span>';
        // }
        // reviewCard.querySelector(".star-rating").innerHTML = starRating;

        routeDisplayContainer.appendChild(routeCard);
    });

}

document.addEventListener('DOMContentLoaded', () => {
    setup()
});
