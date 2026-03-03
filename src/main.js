import { onAuthReady, logoutUser } from './authentication.js';
import { getFavorites } from './firestore.js';

function navToLogin() {
    window.location.href = "login.html";
}

// display a list of favorites once user is authenticated
async function showFavorites(user) {
    const listEl = document.getElementById('favoritesList');
    if (!listEl) return;
    try {
        const favs = await getFavorites(user.uid);
        if (favs.length === 0) {
            listEl.innerHTML = '<li>No favorites yet.</li>';
        } else {
            listEl.innerHTML = favs.map(f => `<li>${f.name || f.id}</li>`).join('');
        }
    } catch (err) {
        console.error('failed to load favorites', err);
    }
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