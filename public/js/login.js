const attachFormElementListener = () => {
    // Login form
    let loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = new FormData(e.target);
        values.append("action", "login");

        fetch(apiUrl, { method: "POST", body: values })
            .then(resp => resp.json())
            .then(data => {
                if (data?.action == 'handle_sucesssfull_login') {
                    location.assign(chatPageUrl)
                    return;
                }

                console.log("Hmm, something went wrong!");
            })
            .catch(err => {
                console.log(err);
            })
    });
}

attachFormElementListener();