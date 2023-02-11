API_URL = ""

async function hearthAttack(type, conj, essere) {
    console.log(type)
    if (conj[0] == 1 || type == "cosciente") {
        cosciente = true
    } else {
        cosciente = false
    }
    insertMessage("Dove "+essere+"?", mode="from", async function() {
        button = document.getElementById("question")
        input = button.value
        button.value = ""
        insertMessage(input, "to")
        await predict("posizione", input, mode=1).then(result => {
            i_split = input.split(" ")
            position = ""
            for (let i = 0; i < result[0].length; i++) {
                position += i_split[result[0][i]]+" "
            }
            return position  
        }).then(result => position = result)
        if (cosciente == true) {
            insertMessage("La ambulanza sta arrivando nella tua posizione, se ci sono problemi rincontatta nella chat", mode="from", func = function() {})
            finish()
        } else {
            nonCosciente()
        }
    })
}

function nonCosciente(){
    insertMessage("mettigli una mano sul collo, sulla vena, controlla se c'è il battito", mode="from")
    insertMessage("C'è battito?", mode="from", func = async function() {
        button = document.getElementById("question")
        input = button.value
        button.value = ""
        insertMessage(input, "to")
        await predict("si_no", input).then(result => battito = result[0])
        if (battito == "no") {
            insertMessage("c'è qualcuno con te?", mode="from", func = async function() {
                button = document.getElementById("question")
                input = button.value
                button.value = ""
                insertMessage(input, "to")
                await predict("si_no", input).then(result => {
                    if (result[0] == "si") {
                        insertMessage("Ok, mandalo a prendere un defribilatore perfavore", mode="from")
                    }
                })
                insertMessage("Adesso iniziaremo il massaggio cardiaco", from="from")
                insertMessage("Per prima cosa dobbiamo liberare le vie aeree, tira in dietro la testa in modo di allungare il collo", mode="from")
                insertMessage("Hai fatto?", mode="from", func = async function(){
                    button = document.getElementById("question")
                    input = button.value
                    button.value = ""
                    insertMessage(input, "to")
                    await predict("si_no", input).then(result => fatto = result[0])
                    console.log(fatto)
                    if (fatto == "si") {
                        console.log("in")
                        insertMessage("Metti le due mani al centro del petto e spingi molto forte, fallo per 30 volte.", mode="from")
                            insertMessage(
                                "Avvertimi quando hai finito", 
                                mode="from", 
                                func = async function(){
                                    button = document.getElementById("question")
                                    input = button.value
                                    button.value = ""
                                    await predict("read_sentence", input).then(result => finito = result[0])
                                    if (finito == "finire") {
                                        insertMessage("Adesso avvicina la tua bocca alla sua e soffia dentro per due volte", mode="from")
                                        insertMessage("Come hai fatto prima controlla se c'è il brattito", mode="from")
                                        insertMessage("Senti il battio?", mode="from", func = async function(){
                                            button = document.getElementById("question")
                                            input = button.value
                                            button.value = ""
                                            insertMessage(input, "to")
                                            await predict("si_no", input).then(result => battito = result[0])
                                            if (battito == "no") {
                                                insertMessage("Continua finchè non riprende a battere", mode="from")
                                            } 
                                        })
                                    }
                                }
                            )
                         
                        //insertMessage("Complimenti, gli hai salvato la vita! Non ti resta che aspettare l'ambulanza")
                    }
                })
            })
        }

    })
}


async function predict(question, input, mode=0){ // 0: normal, 1: get
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    if (mode == 0) {
        await fetch(API_URL+"/prepareBag?i="+input+"&q="+question, requestOptions)
            .then(response => response.json())
            .then(result =>  bag=result)
            .catch(error => console.log('error', error));
    } else {
        await fetch(API_URL+"/prepareBagGet?i="+input+"&q="+question, requestOptions)
            .then(response => response.json())
            .then(result => bag=result)
            .catch(error => console.log('error', error));
    }
    await tf.loadLayersModel('models/'+question+"/model.json").then((loadedModel) =>  {
        const shape = [1, bag.length]
        const dtype = "float32"
        b = tf.tensor(bag, shape, dtype);
        const prediction = loadedModel.predict(b);
        pred = prediction.dataSync()
        max = pred[0]
        intent = 0
        for (let i = 1; i < pred.length; i++){
            x = pred[i]
            if (x > max) {
                max = x
                intent = i
            }
        }
        return intent
    }).then(result => intent_num = result)
    await fetch(API_URL+"/getClass?q="+question+"&i="+intent_num.toString(), requestOptions)
            .then(response => response.json())
            .then(result => intent = result)
            .catch(error => console.log('error', error));
    sessionStorage.setItem(localStorage.getItem("lastQuestion"), intent)
    keys = Object.keys(sessionStorage)
    infos = {}
    for (let i = 0; i < keys.length; i++) {
        infos[keys[i]] = sessionStorage.getItem(keys[i])
    }
    window.writeNewSession(localStorage.getItem("uid"), infos, New=false)
    return await [intent, intent_num]
}


async function protocolli(input, input_age, input_gender) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    await predict("age", input_age).then(result => age = result[1]) 
    await predict("gender", input_gender).then(result => gender = result[1]) 
    await fetch(API_URL+"/prepareBag?i="+input+"&q=protocolli", requestOptions)
        .then(response => response.json())
        .then(result => protocolli_bag = result)
        .catch(error => console.log('error', error));
    await tf.loadLayersModel("models/protocolli/model.json").then((loadedModel) => {
        bag = [age, gender, parseInt(conj[0])]
        bag = bag.concat(protocolli_bag)
        const shape = [1, bag.length]
        const dtype = "float32"
        b = tf.tensor(bag, shape, dtype);
        const prediction = loadedModel.predict(b);
        pred = prediction.dataSync()
        max = pred[0]
        intent = 0
        for (let i = 1; i < pred.length; i++){
            x = pred[i]
            if (x > max) {
                max = x
                intent = i
            }
        }
        return intent
    }).then(result => intent = result)
    await fetch(API_URL+"/getClass?q=protocolli&i="+intent_num.toString(), requestOptions)
            .then(response => response.json())
            .then(result => intent = result)
            .catch(error => console.log('error', error));
    protocolli_func = {"hearth attack": hearthAttack}
    localStorage.setItem("protocollo", intent[0])
    sessionStorage.setItem("protocollo - "+input, intent[0])
    return await {"func": protocolli_func[intent[0]], "intent": intent}
}



function insertMessage(question, mode, func = null) {
    is_login()
    div = document.createElement("div")
    div.classList.add('message');
    div.classList.add(mode);
    div.innerHTML = "<p>"+question+"</p>"
    element = document.getElementById("messages")
    element.appendChild(div)
    
    if (func != null) {
        if (mode == "from") {
            localStorage.setItem("lastQuestion", question)
        }
        button = document.getElementById("done")
        button.onclick = function() {
            is_login(); 
            button = document.getElementById("question")
            input = button.value
            sessionStorage.setItem(localStorage.getItem("lastQuestion"), input)
            func(); 
        }
    }
    element = document.getElementById("chat")
    element.scrollTo(0, element.scrollHeight);
    
}

function finish(){
    div = document.createElement("div")
    div.innerHTML = "<p class='finish message'>Conversazione terminata <br> puoi ancora avvertirlo in caso di problemi</p><button class='message finish-button' onclick='location.href="+'"/redirect.html"'+"'>Inizia un'altra conversazione!</button>"
    element = document.getElementById("messages")
    element.appendChild(div)
    element = document.getElementById("chat")
    element.scrollTo(0, element.scrollHeight);
    keys = Object.keys(sessionStorage)
    infos = {}
    for (let i = 0; i < keys.length; i++) {
        infos[keys[i]] = sessionStorage.getItem(keys[i])
    }
    window.writeNewSession(localStorage.getItem("uid"), infos)
}

function main() {
    keys = Object.keys(sessionStorage)
    for (let i = 0; i < keys.length; i++) {
        sessionStorage.removeItem(keys[i])
    }
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    insertMessage("Come ti posso aiutare?", "from", func = async function(){
        button = document.getElementById("question")
        input = button.value
        button.value = ""
        insertMessage(input, "to")
        await fetch(API_URL+"/pattern/conj?i="+input, requestOptions)
            .then(response => response.json())
            .then(result => conj = result)
            .catch(error => console.log('error', error));
        conj_spik = (conj[0] == 1) ? 2  : conj[0];
        await fetch(API_URL+"/pattern/coniugate?v=avere&p="+conj_spik.toString()+"&n="+conj[1])
            .then(response => response.json())
            .then(result => avere = result)
            .catch(error => console.error(error))
        await fetch(API_URL+"/pattern/coniugate?v=essere&p="+conj_spik.toString()+"&n="+conj[1])
            .then(response => response.json())
            .then(result => essere = result)
            .catch(error => console.error(error))
        insertMessage("Quanti hanni "+avere+"?", "from", function() {
            button = document.getElementById("question")
            age = button.value
            button.value = ""
            insertMessage(age, "to")
            insertMessage(essere+" un maschio o una femmina?", "from", async function() {
                button = document.getElementById("question")
                gender = button.value
                button.value = ""
                insertMessage(gender, "to")
                await protocolli(input, age, gender, conj)
                    .then(result => result['func'](result['intent'][1], conj, essere))
                    .catch(error => console.error(error))
            })
        })
    })
}


window.onload = function () {main()}
