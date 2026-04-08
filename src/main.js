import { onAuthReady, logoutUser } from './authentication.js';
import { db } from "./firebaseConfig.js";
import { doc, setDoc, collection, getDocs, getDoc, updateDoc } from "firebase/firestore";
import protobuf from "protobufjs";

function setup() {
    $(document).on("click", "#logoutBtn", logoutUser);
    // watch auth state and update page accordingly
    onAuthReady(async (currentUser) => {
        if (user) {
            const userRef = doc(db, "users", user.uid)
            const userData = { name: currentUser.displayName, email: currentUser.email, avatar: currentUser.photoURL }
            console.log(userRef, userData)
            await setDoc(userRef, userData)
            document.getElementById('welcomeMessage').textContent = `Hello, ${currentUser.displayName || currentUser.email}!`;
            loadGTFS()
            iterateUsers(currentUser)
        } else {
            document.getElementById('welcomeMessage').textContent = 'Not logged in';
        }
    });
}



async function loadGTFS() {
    const url = "https://gtfsapi.translink.ca/v3/gtfsrealtime?apikey=n2hPJBIaQCxB7mOOn8oT";
    const root = await protobuf.load("gtfs-realtime.proto");
    const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const message = FeedMessage.decode(new Uint8Array(buffer));
    const object = FeedMessage.toObject(message, {
        longs: String,
        enums: String,
        defaults: true
    });

    // console.log(object);
}


async function iterateUsers(currentUser) {
console.log(currentUser)
    const usersRef = collection(db, "users")
    const usersSnap = await getDocs(usersRef)
    usersSnap.forEach((user) => {
        const userID = user.id
        const username = user.data().name
        const routesRef = collection(db, "users", userID, "routes")
        displayRoutes(userID, username, routesRef)
    })
}


async function displayRoutes(userID, username, routesRef) {
    const routesSnap = await getDocs(routesRef)
    routesSnap.forEach((routeSnap) => {
        const docID = routeSnap.id
        const data = routeSnap.data()
        const title = data.title || "(No title)";
        const detail = data.detail || "(No detail)";
        const commuteTime = data.commutePeriod || "(No time specific)"
        const crowdLevel = data.crowdLevel || "(Not specific)"
        // const recomand = data.recomand || "(Not specific)"

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
        <span class="font-bold">Creater</span>: ${username}
        `;
        routeCard.querySelector("#timeStamp").innerHTML = `
        <span class="font-bold">Time Created</span>: ${time}
        `;

        routeCard.querySelector("#routeDetail").innerHTML = `
        <span class="font-semibold">Detail</span>: ${detail}
        `;
        routeCard.querySelector("#routeCommuteTime").innerHTML = `
        <span class="font-semibold">Commute Time</span>: ${commuteTime}
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
        toggleRecoomand(userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, false)
        toggleDisrecoomand(userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, false)
        recomandBtn.addEventListener("click", () => toggleRecoomand(userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, true))
        disrecomandBtn.addEventListener("click", () => toggleDisrecoomand(userID, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, true))


        document.getElementById('routeGroup').appendChild(routeCard);
    })
}
async function displayBtn(isHtmlTypeRecommand, btnHTML, countHTML, routeRef) {
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const isRecomand = routeData.recomand;
    const recomandCount = routeData.recomandCount;
    const isDisrecomand = routeData.disrecomand;
    const disrecomandCount = routeData.disrecomandCount;
    if (isHtmlTypeRecommand) {
        if (isRecomand) {
            btnHTML.src = "./images/recommand-toggled.svg"
        } else {
            btnHTML.src = "./images/recommand-untoggle.svg"
        } 
        countHTML.innerHTML = recomandCount
    }
    else {
        if (isDisrecomand) {
            btnHTML.src = "./images/disrecommand-toggled.svg"
        } else {
            btnHTML.src = "./images/disrecommand-untoggle.svg"
        }
        countHTML.innerHTML = disrecomandCount
    }
    
}


async function toggleRecoomand(isCurrentUser, userId, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, isClick) {
    const routeRef = doc(db, "users", userId, "routes", docID);
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const isRecomand = routeData.recomand;
    const recomandCount = routeData.recomandCount;
    const isDisrecomand = routeData.disrecomand;
    const disrecomandCount = routeData.disrecomandCount;
    console.log("recommand in firebase before this click:", isRecomand)
    if (isClick) {
        try {
            if (isRecomand) {
                console.log("cancel recommand")
                // cancel recommand
                await updateDoc(routeRef, {
                    recomand: false,
                    recomandCount: recomandCount - 1
                })
            } else {
                console.log("recommand")
                await updateDoc(routeRef, {
                    recomand: true,
                    recomandCount: recomandCount + 1
                });
                if (isDisrecomand) {
                    console.log("cancel disrecommand")
                    await updateDoc(routeRef, {
                        disrecomand: false,
                        disrecomandCount: disrecomandCount - 1
                    });
                    displayBtn(false, disrecomandBtn, disrecomandCounter, routeRef)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    displayBtn(true, recomandBtn, recomandCounter, routeRef)

}



async function toggleDisrecoomand(isCurrentUser, userId, docID, recomandBtn, disrecomandBtn, recomandCounter, disrecomandCounter, isClick) {
    const routeRef = doc(db, "users", userId, "routes", docID);
    const routeSnap = await getDoc(routeRef);
    const routeData = routeSnap.data();
    const isDisrecomand = routeData.disrecomand;
    const disrecomandCount = routeData.disrecomandCount;
    const isRecomand = routeData.recomand;
    const recomandCount = routeData.recomandCount;
    console.log("disrecommand in firebase before this click:", isRecomand)
    if (isClick) {
        try {
            // cancel disrecommand
            if (isDisrecomand) {
                console.log("cancel disrecommand")
                await updateDoc(routeRef, {
                    disrecomand: false,
                    disrecomandCount: disrecomandCount - 1
                })
            } else {
                console.log("disrecommand")
                await updateDoc(routeRef, {
                    disrecomand: true,
                    disrecomandCount: disrecomandCount + 1
                });
                if (isRecomand) {
                    console.log("cancel recommand")
                    await updateDoc(routeRef, {
                        recomand: false,
                        recomandCount: recomandCount - 1
                    });
                    displayBtn(true, recomandBtn, recomandCounter, routeRef)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    displayBtn(false, disrecomandBtn, disrecomandCounter, routeRef)

}

setup()

