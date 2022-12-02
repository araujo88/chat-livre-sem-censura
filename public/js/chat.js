// Global
let poolingIsRunning = true;
let isUserIdle = false;
let requestIsPending = false;
let isSendindMessage = false;

// Constants
const POOLING_MS_TIME = 500;
const USERNAME = document.getElementById("username").value;
const CHAT_BOX_ELEMENT = document.getElementById("chat-box");
const MENU_WRAPPER = document.getElementById("menu");
const chatBtn = document.getElementById("chat-link-nav-anchor");
const sendMessageBtn = document.getElementById("send-message-btn");
const scrollBottomBtn = document.getElementById("scroll-link-nav-anchor");
const githubBtn = document.getElementById("github-link-nav-anchor");
const logoutBtn = document.getElementById("logout-link-nav-anchor");
const triggerMenuBtn = document.getElementById("btn-menu");

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    isUserIdle = false;
  } else {
    isUserIdle = true;
  }
});

const isMobile = () => {
  return navigator.userAgentData.mobile;
};

const onAuthenticated = () => {
  poolingIsRunning = false;
  requestIsPending = true;

  alert("A sua sessão foi expirada!");
  location.replace(loginPageUrl);
  return;
};

const attachSendMessageBtnListener = () => {
  sendMessageBtn.addEventListener("keypress", (e) => {
    // Enter message
    if (e.key == "Enter") {
      const value = structuredClone(e.target.value);
      if (isSendindMessage || value == "") return;

      e.target.value = "";

      sendMessageBtn.setAttribute("disabled", "disabled");
      sendMessageBtn.classList.add("input-disabled");
      sendMessageBtn.setAttribute("placeholder", "Enviando mensagem...");
      isSendindMessage = true;

      const payload = new FormData();
      payload.append("action", "append_message");
      payload.append("message", value);

      fetch(apiUrl, { method: "POST", body: payload })
        .then((resp) => resp.json())
        .then((data) => {
          if (data?.action == "unauthorized") {
            onAuthenticated();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          isSendindMessage = false;
          sendMessageBtn.removeAttribute("disabled");
          sendMessageBtn.classList.remove("input-disabled");
          sendMessageBtn.setAttribute("placeholder", "Enter para enviar");
          if (!isMobile()) sendMessageBtn.focus();
        });
    }
  });
};

const attachScrollBottomBtnListener = () => {
  scrollBottomBtn.addEventListener("click", () => {
    scrollToBottom();
  });
};

const attachChatBtnListener = () => {
  chatBtn.addEventListener("click", () => {});
};

const attachGithubBtnListener = () => {
  githubBtn.addEventListener("click", (e) => {
    window
      .open("https://github.com/araujo88/chat-livre-sem-censura", "_blank")
      .focus();
  });
};

const attachLogoutBtnListener = () => {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    poolingIsRunning = false;
    alert("Obrigado por utilizar!");
    const values = new FormData();
    values.append("action", "logout");

    fetch(apiUrl, { method: "POST", body: values })
      .then((resp) => resp.json())
      .then((data) => {
        if (data?.action == "handle_redirect_to_login") {
          location.replace(loginPageUrl);
          return;
        }

        if (data?.action == "unauthorized") {
          onAuthenticated();
        }

        location.replace(loginPageUrl);
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const attachTriggerMenuBtnListener = () => {
  triggerMenuBtn.addEventListener("click", (e) => {
    // Menu Open
    if (MENU_WRAPPER.classList.contains("hide-nav-menu")) {
      MENU_WRAPPER.classList.remove("hide-nav-menu");
      MENU_WRAPPER.classList.add("show-nav-menu");

      // Tab
      chatBtn.tabIndex = 2;
      githubBtn.tabIndex = 3;
      logoutBtn.tabIndex = 4;
    } else {
      // Menu hide
      MENU_WRAPPER.classList.remove("show-nav-menu");
      MENU_WRAPPER.classList.add("hide-nav-menu");

      // Tab
      chatBtn.tabIndex = -1;
      githubBtn.tabIndex = -1;
      logoutBtn.tabIndex = -1;
    }
  });
};

const fetchMessages = (poolingIsRunning = false) => {
  const values = new FormData();
  values.append("action", "retrive_messages");

  requestIsPending = true;
  fetch(apiUrl + "?action=retrive_messages", { method: "GET" })
    .then((resp) => resp.json())
    .then((data) => {
      if (data?.action == "unauthorized") {
        onAuthenticated();
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

        if (canScroll) {
          scrollToBottom();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      requestIsPending = false;
    });
};

const createChatMessageObject = (messageObject) => {
  let timestamp = messageObject.timestamp;
  let sender = messageObject.sender;
  let message = messageObject.message;
  let roomAction = messageObject.room_action;
  let id = messageObject.id;
  let isMessageOwner = USERNAME == sender;
  let classMessageOwner = isMessageOwner
    ? "message-owner"
    : "foreigner-message";

  let wrapperEl = document.createElement("div");
  wrapperEl.classList.add(
    "chat-message",
    "w-100",
    "d-flex",
    "flex-row",
    roomAction,
    classMessageOwner
  );
  wrapperEl.id = "";

  let messageContentWrapperEl = document.createElement("div");
  messageContentWrapperEl.classList.add("message-content-wrapper");

  let tooltipEl = document.createElement("div");
  tooltipEl.classList.add("tooltip-message");

  let timestampEl = document.createElement("span");
  timestampEl.classList.add("timestamp");
  timestampEl.innerText = timestamp;

  let senderEl = document.createElement("span");
  senderEl.classList.add("sender");
  senderEl.innerText = `${isMessageOwner ? "" : sender}`;

  tooltipEl.appendChild(senderEl);
  tooltipEl.appendChild(timestampEl);

  let messageWrapperEl = document.createElement("div");
  messageWrapperEl.classList.add("text-message-wrapper");

  let messageTextEl = document.createElement("span");
  messageTextEl.classList.add("text-message");
  messageTextEl.innerText = message;

  messageWrapperEl.appendChild(messageTextEl);

  let tooltipMessageWrapper = document.createElement("div");
  tooltipMessageWrapper.classList.add("tooltip-message-wrapper");

  tooltipMessageWrapper.appendChild(tooltipEl);

  messageContentWrapperEl.appendChild(tooltipMessageWrapper);
  messageContentWrapperEl.appendChild(messageWrapperEl);

  wrapperEl.appendChild(messageContentWrapperEl);

  // Assign an ID
  wrapperEl.id = id;

  return wrapperEl;
};

const parseJsonStringToMessageObject = (jsonString) => {
  jsonString;
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
};

const appendMessagesToDiv = (messagesArr) => {
  messagesArr.forEach((el) => {
    CHAT_BOX_ELEMENT.appendChild(el);
  });
};

const hasNewMessages = (incomingMessagesArr) => {
  const presentMessagesHTMLCollection =
    document.getElementById("chat-box").children;
  const presentMessagesArr = [].slice.call(presentMessagesHTMLCollection);
  return incomingMessagesArr.filter(
    (inc) => !presentMessagesArr.some((pre) => inc.id == pre.id)
  );
};

const scrollToBottom = () => {
  CHAT_BOX_ELEMENT.scrollTop = CHAT_BOX_ELEMENT.scrollHeight;
};

const canScrollToBottom = () => {
  let differenceInPixels =
    CHAT_BOX_ELEMENT.scrollHeight - CHAT_BOX_ELEMENT.scrollTop;
  let bottomInPixels = CHAT_BOX_ELEMENT.clientHeight;
  let thresholdInPixels = 30;
  return differenceInPixels - bottomInPixels < thresholdInPixels;
};

const runPooling = () => {
  setInterval(() => {
    if (!isUserIdle && poolingIsRunning && !requestIsPending) {
      fetchMessages(true);
    } else {
      // Do nothing
    }
  }, POOLING_MS_TIME);
};

attachSendMessageBtnListener();
attachGithubBtnListener();
attachLogoutBtnListener();
attachScrollBottomBtnListener();
attachTriggerMenuBtnListener();
fetchMessages();
