import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="bg-gray-400 px-4 py-3">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <a class="flex items-center gap-2 font-semibold text-black text-lg">
                        <img src="./images/Hamburger_icon.png" class="h-9">SafeRide</a>
                    <form id="authControls" class="flex items-center gap-2">
                        <input class="px-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400" type="search" placeholder="Search" aria-label="Search">
                        <button class="px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition" type="submit">Search</button>
                        <button class="px-4 py-1.5 border-2 border-gray-500 text-gray-600 font-bold rounded hover:bg-gray-500 hover:text-white transition" type="button" id="goToLogin">Login/Signup</button>
                    </form>
                </div>
            </nav>
        `;
        this.updateAuth();

    }

    updateAuth() {
        const authControls = this.querySelector('#authControls')
        if (!authControls) return;
        onAuthStateChanged(auth, user => {
            const btn = authControls.querySelector('#goToLogin');
            if (user) {
                document.getElementById("goToLogin").textContent = "Logout"
                btn?.addEventListener('click', logoutUser);
            } else {
                btn?.addEventListener('click', () => { window.location.href = 'login.html'; });
            }
        });
    }

}
customElements.define("nav-bar", Navbar)