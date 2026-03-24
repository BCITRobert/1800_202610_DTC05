import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class BottomBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="bg-gray-400 px-4 py-3 w-full bottom-0 fixed">
                <div class="flex items-center justify-center flex-wrap gap-2 w-full">
                    <form id="authControls" class="flex items-center gap-2 justify-evenly w-full">
                        <img class="w-20 px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition h-16" src="./images/home-icon.svg" id="mainIcon">
                        <img class="w-20 px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition h-16" src="./images/create_route.svg" id="route">
                        <img class="w-20 px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition h-16" src="./images/profile.svg" id="profile">
                    </form>
                </div>
            </nav>
        `;
        this.updateAuth();

    }

    updateAuth() {
        const profileBtn = this.querySelector("#profile")
        const mainBtn = this.querySelector("#mainIcon")
        const routeBtn = this.querySelector("#route")
        // if (!authControls) return;

        onAuthStateChanged(auth, user => {
            if (user) {
                mainBtn?.addEventListener('click', () => { window.location.href = 'main.html' })
                profileBtn?.addEventListener('click', () => { window.location.href = `profile.html?userID=${user.uid}`; })
            } else {
                mainBtn?.addEventListener('click', () => { window.location.href = 'index.html' })
                profileBtn?.addEventListener('click', () => { window.location.href = 'login.html'; });
            }
            routeBtn?.addEventListener('click', () => { window.location.href = `route.html`; })
        });
    }

}
customElements.define("bottom-bar", BottomBar)