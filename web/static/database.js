window.newInviteLink = newInviteLink
window.writeNewSession = writeNewSession

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyD71_AmFU2k0N9BfIxm1H4dOZrs0rAx-V0",
    authDomain: "first-aid-ai.firebaseapp.com",
    projectId: "first-aid-ai",
    storageBucket: "first-aid-ai.appspot.com",
    messagingSenderId: "666576725906",
    appId: "1:666576725906:web:c3b361c2d9f832c248434b",
    measurementId: "G-XT5F9C8GX3",
    databaseURL: "https://first-aid-ai-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);


const db = getDatabase(app);

const id_ = ref(db, 'last id');
onValue(id_, (snapshot) => {
    var id = snapshot.val() 
    localStorage.setItem("last id", id)
});

set(ref(db, 'last id'), parseInt(localStorage.getItem("last id"))+1);



function writeNewSession(user, infos, New = true) {
    var id = parseInt(localStorage.getItem("last id"))+1
    set(ref(db, 'infos session/'+id), {
        user: user,
        protocollo: localStorage.getItem("protocollo"),
        infos: infos,
    });   
}


function newInviteLink(user) {
    const d = new Date().toString().split(" ")
     set(ref(db, 'links/'+user), {
        month: d[1],
        year: d[3],
        day: parseInt(d[2])+5,
    }); 
}

function validInviteLink(id, func = function() {location.href = "/sing-up.php?id="+id}) {
    const d = new Date().toString().split(" ")
    const link = ref(db, 'links');
    onValue(link, (snapshot) => {
        var value = snapshot.val()[id]
        if (value == undefined) {
            window.location.href = "/sing-up.php"
        }
        if (value['month'] == d[1] && value['year'] == d[3]) {
            if (value['day'] > d[2]) {
                func()
            } else {
                window.location.href = "/sing-up.php"
            }
        } else {
            window.location.href = "/sing-up.php"
        }

    });
}

window.newInviteLink = newInviteLink
window.writeNewSession = writeNewSession
window.validInviteLink = validInviteLink
