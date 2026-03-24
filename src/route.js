import { documentId } from 'firebase/firestore';
import { onAuthReady } from './authentication.js';


function setup() {

    const addRouteContainer = document.getElementById('container')
    const inputForm = document.getElementById('')

    onAuthReady(async (user) => {
        if (user) {
            addRouteContainer.classList.remove("hidden")
            
            document.getElementById("addbtn").addEventListener('click',)
        } else {
            document.getElementById('welcome').textContent = 'Please login before adding new route'
            addRouteContainer.classList.add("hidden")
        }
    })
}



setup()