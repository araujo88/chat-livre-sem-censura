let poolingIsRunning = false;
let isUserIdle = false;

document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        isUserIdle = false;
    } else {
        isUserIdle = true;
    }
});

const attachSendMessageBtnListener = () => {
    const btn = document.getElementById("send-message-btn");
    btn.addEventListener("keypress", (e) => {
        // Enter message
        if (e.key == "Enter") {
            const value = structuredClone(e.target.value);
            e.target.value = "";

            const payload = new FormData();
            payload.append("action", "append_message");
            payload.append("message", value);

            fetch(apiUrl, { method: "POST", body: payload })
                .then(resp => resp.json())
                .then(data => {
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {

                })
        }
    });
}

const attachLogoutBtnListener = () => {
    const btn = document.getElementById("logout-link-nav-anchor");
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const values = new FormData();
        values.append("action", "logout");

        fetch(apiUrl, { method: "POST", body: values })
            .then(resp => resp.json())
            .then(data => {
                if (data?.action == "handle_redirect_to_login") {
                    location.replace(loginPageUrl);
                    return;
                }

                if (data?.action == "unauthorized") {
                    alert("A sua sessão foi expirada!")
                    location.replace(loginPageUrl);
                    return;
                }

                location.replace(loginPageUrl);
                return;
            })
            .catch(err => {
                console.log(err);
            });
    })
}

const fetchMessages = (poolingIsRunning = false) => {
    const values = new FormData();
    values.append("action", "retrive_messages");

    fetch(apiUrl + "?action=retrive_messages", { method: "GET" })
    .then(resp => resp.json())
    .then(data => {
        if (data?.action == "unauthorized") {
            alert("A sua sessão foi expirada!");
            location.replace(loginPageUrl)            
        }

        if (data?.payload?.length > 0) {
            const jsonString = data.payload;
            let messagesArr = parseJsonStringToMessageObject(jsonString);

            if (!poolingIsRunning) {
                appendMessagesToDiv(messagesArr);
                runPooling();
            }

            if (poolingIsRunning) {
                let newMessages = hasNewMessages(messagesArr);
                if (newMessages.length > 0) {
                    appendMessagesToDiv(newMessages);
                }
            }
        }
    })
    .catch(err => {
        console.log(err);
    });
}

const createChatMessageObject = (messageObject) => {
    let timestamp = messageObject.timestamp;
    let sender = messageObject.sender;
    let message = messageObject.message;
    let roomAction = messageObject.room_action;

    let wrapperEl = document.createElement("div");
    wrapperEl.classList.add("chat-message", "w-100", "d-flex", "flex-row", "p-2", roomAction);
    wrapperEl.id = ""

    let timestampEl = document.createElement("span");
    timestampEl.classList.add("timestamp", "me-2");
    timestampEl.innerText = timestamp;

    let senderEl = document.createElement("span");
    senderEl.classList.add("sender", "me-2");
    senderEl.innerText = sender + ":";

    let messageEl = document.createElement("span");
    messageEl.classList.add("message");
    messageEl.innerText = message;

    wrapperEl.appendChild(timestampEl);
    wrapperEl.appendChild(senderEl);
    wrapperEl.appendChild(messageEl);

    // Creating a composite key
    wrapperEl.id = createCompositeKey(timestamp, sender, message);

    return wrapperEl;
}

const createCompositeKey = (timestamp, sender, message) => {
    return btoa(`${timestamp.split(' ').join('_')}/${sender}/${message}`);
}

const parseJsonStringToMessageObject = (jsonString) => {
    (jsonString);
    const messageTextObjList = jsonString.split("\n");
    const messagesArr = [];
    messageTextObjList?.forEach((text, k) => {
        // Regex to validate this?
        if (text?.length > 0) {
            let obj = JSON.parse(text);
            obj.id = k;
            messagesArr.push(createChatMessageObject(obj));
        }
    });

    return messagesArr;
}

const appendMessagesToDiv = (messagesArr) => {
    const chatBox = document.getElementById("chat-box");
    messagesArr.forEach(el => {
        chatBox.appendChild(el);
    })
}

const hasNewMessages = (incomingMessagesArr) => {
    const presentMessagesHTMLCollection = document.getElementById("chat-box").children;
    const presentMessagesArr = [].slice.call(presentMessagesHTMLCollection);
    return incomingMessagesArr.filter(inc => !presentMessagesArr.some(pre => inc.id == pre.id));
}

const runPooling = () => {
    setInterval(() => {
        if (!isUserIdle) {
            fetchMessages(true);
        } else {
            // Do nothing
        }
    }, 2000)
}

attachSendMessageBtnListener();
attachLogoutBtnListener();
fetchMessages();