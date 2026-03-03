import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="w-full flex justify-between bg-gray-400 p-5">
                <img src="./images/menu.svg" alt="Menu" class="w-8 h-8">
                <div id="authControls">
                    <button id="goToLogin" class="text-white p-2 bg-black rounded-lg">Login/Sign up</button>
                </div>
            </nav>
        `;
        this.updateAuth();
    }

    updateAuth() {
        const authControls = this.querySelector('#authControls');
        if (!authControls) return;
        onAuthStateChanged(auth, user => {
            if (user) {
                authControls.innerHTML = `<button id="signOutBtn" class="text-white p-2 bg-black rounded-lg">Logout</button>`;
                const btn = authControls.querySelector('#signOutBtn');
                btn?.addEventListener('click', logoutUser);
            } else {
                authControls.innerHTML = `<button id="goToLogin" class="text-white p-2 bg-black rounded-lg">Login/Sign up</button>`;
                const btn = authControls.querySelector('#goToLogin');
                btn?.addEventListener('click', () => { window.location.href = 'login.html'; });
            }
        });
    }


    // // Copied & slitly modified code using bootstrap
    // connectedCallback() {
    //     this.innerHTML = `
    //         <nav class="navbar navbar-expand-lg navbar-light bg-dark">
    //             <div class="container-fluid">
    //                 <a class="navbar-brand" href="/">
    //                     <img src="/images/logo.png" height="36">
    //                     SafyHike
    //                 </a>
    //                 <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
    //                     aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    //                     <span class="navbar-toggler-icon"></span>
    //                 </button>
    //                 <div class="collapse navbar-collapse" id="navbarSupportedContent">
    //                     <ul class="navbar-nav me-auto">
    //                         <li class="nav-item">
    //                             <a class="nav-link" href="/">Home</a>
    //                         </li>
    //                     </ul>
    //                     <div class="d-flex align-items-center gap-2 ms-lg-2" id="rightControls">
    //                         <form class="d-flex align-items-center gap-2 my-2 my-lg-0" id="navSearch" role="search">
    //                             <input class="form-control d-none d-sm-block w-auto" type="search" placeholder="Search" aria-label="Search">
    //                             <button class="btn btn-outline-light d-none d-sm-inline-block" type="submit">Search</button>
    //                         </form>
    //                         <div id="authControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
    //                             <!-- populated by JS -->
    //                         </div>
    //                     </div>

    //                 </div>
    //             </div>
    //         </nav>
    //     `;
    // }
}
customElements.define("nav-bar", Navbar)