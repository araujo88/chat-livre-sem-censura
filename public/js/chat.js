let poolingIsRunning = true;
let isUserIdle = false;
let requestIsPending = false;
const POOLING_MS_TIME = 500;
const USERNAME = document.getElementById("username").value;
const CHAT_BOX_ELEMENT = document.getElementById("chat-box");

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

            if (value == "") return;

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

const attachScrollBottomBtnLister = () => {
    const btn = document.getElementById("scroll-link-nav-anchor");
    btn.addEventListener('click', () => {
        scrollToBottom();
    });
}

const attachLogoutBtnListener = () => {
    const btn = document.getElementById("logout-link-nav-anchor");
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        poolingIsRunning = false;
        alert("Obrigado por utilizar!");
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

    requestIsPending = true;
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
            let canScroll = canScrollToBottom();

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

            if (canScroll){
                scrollToBottom()
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => {
        requestIsPending = false;
    })
}

const createChatMessageObject = (messageObject) => {
    let timestamp = messageObject.timestamp;
    let sender = messageObject.sender;
    let message = messageObject.message;
    let roomAction = messageObject.room_action;
    let isMessageOwner = USERNAME == sender;
    let classMessageOwner =  isMessageOwner ? "message-owner": "foreigner-message";

    let wrapperEl = document.createElement("div");
    wrapperEl.classList.add("chat-message", "w-100", "d-flex", "flex-row", "p-2", roomAction, classMessageOwner);
    wrapperEl.id = ""

    let timestampEl = document.createElement("span");
    timestampEl.classList.add("timestamp");
    timestampEl.innerText = timestamp;

    let senderEl = document.createElement("span");
    senderEl.classList.add("sender");
    senderEl.innerText = `${isMessageOwner ? "Eu" : sender}`;

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
            messagesArr.push(createChatMessageObject(obj));
        }
    });

    return messagesArr;
}

const appendMessagesToDiv = (messagesArr) => {
    messagesArr.forEach(el => {
        CHAT_BOX_ELEMENT.appendChild(el);
    })
}

const hasNewMessages = (incomingMessagesArr) => {
    const presentMessagesHTMLCollection = document.getElementById("chat-box").children;
    const presentMessagesArr = [].slice.call(presentMessagesHTMLCollection);
    return incomingMessagesArr.filter(inc => !presentMessagesArr.some(pre => inc.id == pre.id));
}

const scrollToBottom = () => {
    CHAT_BOX_ELEMENT.scrollTop = CHAT_BOX_ELEMENT.scrollHeight;
}

const canScrollToBottom = () => {
    let differenceInPixels = CHAT_BOX_ELEMENT.scrollHeight - CHAT_BOX_ELEMENT.scrollTop;
    let bottomInPixels = CHAT_BOX_ELEMENT.clientHeight;
    let thresholdInPixels = 30;
    return ((differenceInPixels - bottomInPixels) < thresholdInPixels);
}

const runPooling = () => {
    setInterval(() => {
        if (!isUserIdle && poolingIsRunning && !requestIsPending) {
            fetchMessages(true);
        } else {
            // Do nothing
        }
    }, POOLING_MS_TIME)
}

attachSendMessageBtnListener();
attachLogoutBtnListener();
attachScrollBottomBtnLister();
fetchMessages();