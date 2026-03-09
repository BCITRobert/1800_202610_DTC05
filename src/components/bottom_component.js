import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class BottomBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="bg-gray-400 px-4 py-3 fixed w-full bottom-0">
                <div class="flex items-center justify-evenly flex-wrap gap-4">
                    <form id="authControls" class="flex items-center gap-2">
                        <img class="w-20 px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition" src="./images/profile.svg" id="profile">
                    </form>
                </div>
            </nav>
        `;
        this.updateAuth();

    }

    updateAuth() {
        const profileBtn = this.querySelector("#profile")
        if (!authControls) return;
        onAuthStateChanged(auth, user => {
            if (user) {
                profileBtn?.addEventListener('click', () => { window.location.href = `profile.html?userID=${user.uid}`; })
            } else {
                profileBtn?.addEventListener('click', () => { window.location.href = 'login.html'; });
            }
        });
    }

}
customElements.define("bottom-bar", BottomBar)