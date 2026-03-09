import { onAuthReady, logoutUser } from './authentication.js';

function navToLogin() {
    window.location.href = "login.html";
}


function setup() {
    $(document).on("click", "#goToLogin", navToLogin);
    $(document).on("click", "#logoutBtn", logoutUser);

    // watch auth state and update page accordingly
    onAuthReady(user => {
        if (user) {
            // show welcome message and favorites
            document.getElementById('welcomeMessage').textContent = `Hello, ${user.displayName || user.email}!`;
            showFavorites(user);
        } else {
            document.getElementById('welcomeMessage').textContent = 'Not logged in';
        }
    });
}

$(document).ready(setup);