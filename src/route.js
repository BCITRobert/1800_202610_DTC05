import { onAuthReady } from './authentication.js';
import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

function setup() {
    const addRouteContainer = document.getElementById('container')
    const inputForm = document.getElementById('inputForm')
    const addBtn = document.getElementById('addBtn')
    const routeBtn = document.querySelectorAll('.routeBtn')
    routeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        })
    })


    onAuthReady(async (user) => {
        if (user) {
            document.getElementById('welcome').textContent = 'Create your new Route comment!'
            addRouteContainer.classList.remove("hidden")
            addRouteContainer.classList.add("flex")
            addBtn.addEventListener('click', () => {
                addBtn.classList.add("hidden")
                inputForm.classList.remove("hidden")
                newRoute()
            })

        }
    })
}

async function newRoute() {

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
    console.log(btnValues);

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

            // ✅ Store review as subcollection under this hike
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
                window.location.href = `profile.html?userID=${user.uid}`;
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

document.addEventListener('DOMContentLoaded', () => {
    setup()
    const submitBtn = document.getElementById("submitBtn")
    submitBtn.addEventListener("click", () => {
        writeRoute()
    })
});
