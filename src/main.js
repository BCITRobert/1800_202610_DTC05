import {onAuthReady} from "./authentication.js"



function showName() {
      const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

      onAuthReady((user) => {
          if (!user) {
              // If no user is signed in → redirect back to login page.
              location.href = "index.html";
              return;
          }

          // If a user is logged in:
          // Use their display name if available, otherwise show their email.
          const name = user.displayName || user.email;

          // Update the welcome message with their name/email.
          if (nameElement) {
              nameElement.textContent = `${name}!`;
          }
      });
}

showName();