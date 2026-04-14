
import { onAuthReady, logoutUser } from './authentication.js';
import { db, auth } from "./firebaseConfig.js";
import { doc, setDoc, collection, getDocs, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import protobuf from "protobufjs";

function timeBadge(period) {
    const bg = "#62B5B4";
    const text = "#000000";
    return `<span style="background-color:${bg}; color:${text}; display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 500; margin-right: 4px;">${period}</span>`;
}

function setup() {
    $(document).on("click", "#logoutBtn", logoutUser);
    // watch auth state and update page accordingly
    
    onAuthReady(async (user) => {
        if (user) {

            const currentUserUid = user.uid
            const userRef = doc(db, "users", user.uid)
            const userData = { name: user.displayName, email: user.email }
            console.log(userRef, userData)
            await setDoc(userRef, userData, {merge: true})
            document.getElementById('welcomeMessage').textContent = `Hello, ${user.displayName || user.email}!`;
            // loadGTFS()
            iterateUsers(currentUserUid)
            
        } else {
            document.getElementById('welcomeMessage').textContent = 'Not logged in';
        }
    });
}



let renderVersion = 0;

async function iterateUsers(currentUserUid, searchVal = "") {
    const currentVersion = ++renderVersion;

    const routeGroup = document.getElementById('routeGroup')
    routeGroup.innerHTML = ""

    const usersSnap = await getDocs(collection(db, "users"))

    for (const user of usersSnap.docs) {
        if (currentVersion !== renderVersion) return; // cancel outdated render

        const routesRef = collection(db, "users", user.id, "routes")
        await displayRoutes(currentUserUid, user.id, user.data().name, routesRef, searchVal)
    }
}


async function displayRoutes(currentUserUid, userID, username, routesRef, searchVal) {
    
    const routesSnap = await getDocs(routesRef)
        routesSnap.forEach((routeSnap) => {
            const docID = routeSnap.id
            const data = routeSnap.data()
            const title = data.title || "(No title)";
            const detail = data.detail || "(No detail)";
            const commuteTime = data.commutePeriod || [];
            const crowdLevel = data.crowdLevel || "(Not specific)"
            // const recomand = data.recomand || "(Not specific)"
            const timeBadges = commuteTime.length ? commuteTime.map(t => timeBadge(t)).join(""): "(No time specific)";

            let crowdLevelText = ``;
            commuteTime.forEach((timePeriod) => {
                crowdLevelText += ` ${timePeriod}, `;
            })

            // Format the time
            let time = "";
            if (data.timestamp?.toDate) {
                time = data.timestamp.toDate().toLocaleString();
            }

        // Clone the template and fill in the fields
        const routeCard = document.getElementById("routeTemp").content.cloneNode(true);

        routeCard.querySelector("#routeTitle").innerHTML = `
        <span class="font-bold">Route Title</span>: ${title}
        `;
            routeCard.querySelector("#creater").innerHTML = `
        <span class="font-bold">Creator</span>: ${username}
        `;
        routeCard.querySelector("#timeStamp").innerHTML = `
        <span class="font-bold">Time Created</span>: ${time}
        `;

        routeCard.querySelector("#routeDetail").innerHTML = `
        <span class="font-semibold">Detail</span>: ${detail}
        `;
            routeCard.querySelector("#routeCommuteTime").innerHTML = `
        <span class="font-semibold">Commute Time</span>: ${timeBadges}
        `;
        routeCard.querySelector("#routeCrowdLevel").innerHTML = `
        <span class="font-semibold">Crowding Level</span>: ${crowdLevel}
        `;
        //     routeCard.querySelector("#routeRecomand").innerHTML = `
        // <span class="font-semibold">Recommended</span>: ${recomand}
        // `;
        const recomandBtn = routeCard.querySelector('#recommand')
        const disrecomandBtn = routeCard.querySelector('#disrecommand')
        const recomandCounter = routeCard.querySelector('#recommandCount')
        const disrecomandCounter = routeCard.querySelector('#disrecommandCount')
        toggleRecommand(currentUserUid, userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, false)
        toggleDisrecommand(currentUserUid, userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, false)
        recomandBtn.addEventListener("click", () => toggleRecommand(currentUserUid, userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, true))
        disrecomandBtn.addEventListener("click", () => toggleDisrecommand(currentUserUid, userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, true))
        const searchHTML = document.getElementById('searchInput')
            searchHTML.addEventListener("input", () => {
                iterateUsers(auth.currentUser.uid, searchHTML.value)
            })
        if (title.includes(searchVal) || searchVal == "") {
            document.getElementById('routeGroup').appendChild(routeCard);
        }
        
        
    })
}
async function displayBtn(currentUserUid, isHtmlTypeRecommand, btnHTML, countHTML, routeRef) {
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const recommander = routeData.recommander
    const disrecommander = routeData.disrecommander
    const isRecomand = recommander.includes(currentUserUid)
    const isDisrecomand = disrecommander.includes(currentUserUid)

    if (isHtmlTypeRecommand) {
        if (isRecomand) {
            console.log("recommand toggled")
            btnHTML.src = "./images/recommand-toggled.svg"
        } else {
            console.log("recommand untoggled")
            btnHTML.src = "./images/recommand-untoggle.svg"
        } 
        countHTML.innerHTML = recommander.length
    }
    else {
        if (isDisrecomand) {
            btnHTML.src = "./images/disrecommand-toggled.svg"
        } else {
            btnHTML.src = "./images/disrecommand-untoggle.svg"
        }
        countHTML.innerHTML = disrecommander.length
    }
    
}


async function toggleRecommand(currentUserUid, userId, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, isClick) {
    const routeRef = doc(db, "users", userId, "routes", docID);
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const recommander = routeData.recommander
    const disrecommander = routeData.disrecommander
    const isRecomand = recommander.includes(currentUserUid)
    const isDisrecomand = disrecommander.includes(currentUserUid)
    if (isClick) {
        try {
            if (isRecomand) {
                console.log("cancel recommand")
                // cancel recommand
                await updateDoc(routeRef, {
                    recommander: arrayRemove(currentUserUid)
                })
            } else {
                console.log("recommanded")
                await updateDoc(routeRef, {
                    recommander: arrayUnion(currentUserUid)
                });
                if (isDisrecomand) {
                    console.log("cancel disrecommand")
                    await updateDoc(routeRef, {
                        disrecommander: arrayRemove(currentUserUid)
                    });
                    displayBtn(currentUserUid, false, disrecomandBtn, disrecomandCounter, routeRef)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    displayBtn(currentUserUid, true, recomandBtn, recomandCounter, routeRef)

}



async function toggleDisrecommand(currentUserUid, userId, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, isClick) {
    const routeRef = doc(db, "users", userId, "routes", docID);
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const recommander = routeData.recommander
    const disrecommander = routeData.disrecommander
    const isDisrecomand = disrecommander.includes(currentUserUid)
    const isRecomand = recommander.includes(currentUserUid)
    if (isClick) {
        try {
            // cancel disrecommand
            if (isDisrecomand) {
                console.log("cancel disrecommand")
                await updateDoc(routeRef, {
                    disrecommander: arrayRemove(currentUserUid)
                })
            } else {
                console.log("disrecommanded")
                await updateDoc(routeRef, {
                    disrecommander: arrayUnion(currentUserUid)
                });
                if (isRecomand) {
                    console.log("cancel recommand")
                    await updateDoc(routeRef, {
                        recommander: arrayRemove(currentUserUid)
                    });
                    displayBtn(currentUserUid, true, recomandBtn, recomandCounter, routeRef)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    displayBtn(currentUserUid, false, disrecomandBtn, disrecomandCounter, routeRef)

}

setup()

