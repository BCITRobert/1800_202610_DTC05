import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="w-full flex justify-between bg-gray-400 p-5">
                <img src="./images/menu.svg" alt="Menu" class="w-8 h-8" id="profile">
                <div id="authControls">
                    <button id="goToLogin" class="text-white p-2 bg-black rounded-lg">Login/Sign up</button>
                </div>
            </nav>
        `;
        this.updateAuth();
        
    }

    updateAuth() {
        const authControls = this.querySelector('#authControls')
        const profileBtn = this.querySelector("#profile")
        if (!authControls) return;
        onAuthStateChanged(auth, user => {
            if (user) {
                authControls.innerHTML = `<button id="signOutBtn" class="text-white p-2 bg-black rounded-lg">Logout</button>`;
                const btn = authControls.querySelector('#signOutBtn');
                btn?.addEventListener('click', logoutUser);
                profileBtn?.addEventListener('click', () => { window.location.href = 'profile.html'; })
            } else {
                authControls.innerHTML = `<button id="goToLogin" class="text-white p-2 bg-black rounded-lg">Login/Sign up</button>`;
                const btn = authControls.querySelector('#goToLogin');
                btn?.addEventListener('click', () => { window.location.href = 'login.html'; });
            }
        });
    }
    
}
customElements.define("nav-bar", Navbar)