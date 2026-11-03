/* =====================================
   VDOORA — SHARED JAVASCRIPT
   Browser prototype; no backend yet.
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname.split("/").pop();

    // Safely save demo data in this browser.
    function saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("VDOORA could not save browser data.", error);
        }
    }

    function getData(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function showNotice(message) {
        alert(message);
    }


    // 1. HIGHLIGHT THE CURRENT SIDEBAR PAGE
    document.querySelectorAll(".sidebar-link").forEach(function (link) {
        const destination = link.getAttribute("href");

        if (destination === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    // 2. SEARCH CHATS, COMMUNITIES, MOMENTS AND STATUS
    document.querySelectorAll(".dashboard-search").forEach(function (input) {

        input.addEventListener("input", function () {
            const query = input.value.toLowerCase().trim();

            const items = document.querySelectorAll(
                ".conversation-item, .community-card, .moment-post, .status-card"
            );

            items.forEach(function (item) {
                const matches = item.textContent.toLowerCase().includes(query);
                item.hidden = !matches;
            });
        });

    });


    // 3. SIGN-UP, LOGIN AND PASSWORD FORMS
    // These forms cannot create real accounts without a backend.
    document.querySelectorAll("form").forEach(function (form) {

        form.addEventListener("submit", function (event) {

            if (currentPage === "signup.html") {
                event.preventDefault();

                const passwordInputs = form.querySelectorAll(
                    'input[type="password"]'
                );

                if (
                    passwordInputs.length >= 2 &&
                    passwordInputs[0].value !== passwordInputs[1].value
                ) {
                    showNotice("Your passwords do not match. Please try again.");
                    return;
                }

                showNotice(
                    "Your form looks ready! Real account creation will require " +
                    "a secure backend. No account has been created yet."
                );
                return;
            }

            if (currentPage === "login.html") {
                event.preventDefault();

                showNotice(
                    "Login is not connected to a real account system yet. " +
                    "A backend is needed to verify your account securely."
                );
                return;
            }

            if (currentPage === "forgot-password.html") {
                event.preventDefault();

                showNotice(
                    "Password recovery needs a backend and email service. " +
                    "No reset email has been sent."
                );
                return;
            }

            if (currentPage === "reset-password.html") {
                event.preventDefault();

                const passwordInputs = form.querySelectorAll(
                    'input[type="password"]'
                );

                if (
                    passwordInputs.length >= 2 &&
                    passwordInputs[0].value !== passwordInputs[1].value
                ) {
                    showNotice("Your new passwords do not match.");
                    return;
                }

                showNotice(
                    "The passwords match, but no password has been changed. " +
                    "Secure password reset needs a backend."
                );
            }

        });

    });


    // 4. CHAT PAGE — SEND DEMO MESSAGES
    const conversation = document.querySelector(".conversation-panel");

    if (conversation) {

        const composer = conversation.querySelector(
            'textarea, input[type="text"]'
        );

        const messageArea = conversation.querySelector(
            ".message-list, .chat-messages, .conversation-messages, .messages-container"
        ) || conversation;

        if (composer) {
            composer.disabled = false;
            composer.placeholder = "Write a message...";

            const oldButton = conversation.querySelector(
                'button[type="submit"], .send-button, .message-send'
            );

            if (oldButton) {
                oldButton.disabled = false;
            }

            function sendMessage() {
                const text = composer.value.trim();

                if (!text) {
                    showNotice("Please type a message first.");
                    return;
                }

                const bubble = document.createElement("div");
                bubble.className = "message-bubble sent";
                bubble.textContent = text;

                messageArea.appendChild(bubble);
                composer.value = "";

                messageArea.scrollTop = messageArea.scrollHeight;
            }

            if (oldButton) {
                oldButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    sendMessage();
                });
            }

            composer.addEventListener("keydown", function (event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            });
        }
    }


    // 5. MOMENTS — LIKE, COMMENT AND SHARE
    document.querySelectorAll(".moment-post-footer span").forEach(
        function (control) {

            control.setAttribute("role", "button");
            control.setAttribute("tabindex", "0");
            control.style.cursor = "pointer";

            function activateMomentControl() {
                const action = control.textContent.toLowerCase().trim();
                const post = control.closest(".moment-post");

                if (action.startsWith("like")) {
                    const liked = control.dataset.liked === "true";

                    control.dataset.liked = String(!liked);
                    control.textContent = liked ? "♡ Like" : "♥ Liked";

                } else if (action.startsWith("comment")) {
                    const comment = prompt("Write your demo comment:");

                    if (comment && comment.trim() && post) {
                        let commentArea = post.querySelector(".demo-comments");

                        if (!commentArea) {
                            commentArea = document.createElement("p");
                            commentArea.className = "demo-comments";
                            commentArea.style.padding = "12px";
                            commentArea.style.color = "var(--muted)";
                            post.appendChild(commentArea);
                        }

                        const line = document.createElement("p");
                        line.textContent = "You: " + comment.trim();
                        commentArea.appendChild(line);
                    }

                } else if (action.startsWith("share")) {
                    const shareText =
                        "Check out this VDOORA Moment: " + window.location.href;

                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(shareText)
                            .then(function () {
                                showNotice("Demo share text copied!");
                            })
                            .catch(function () {
                                showNotice(shareText);
                            });
                    } else {
                        showNotice(shareText);
                    }
                }
            }

            control.addEventListener("click", activateMomentControl);

            control.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    activateMomentControl();
                }
            });
        }
    );


    // 6. COMMUNITIES — ADD DEMO JOIN BUTTONS
    document.querySelectorAll(".community-card").forEach(function (card) {

        if (card.querySelector(".join-community-button")) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "join-community-button";
        button.textContent = "Join community";

        button.style.marginTop = "14px";
        button.style.padding = "10px 14px";
        button.style.color = "white";
        button.style.background = "var(--primary)";
        button.style.border = "1px solid var(--primary-light)";
        button.style.borderRadius = "9px";
        button.style.cursor = "pointer";

        const communityName =
            card.querySelector("h3")?.textContent.trim() || "Community";

        const joinedCommunities = getData("vdooraJoinedCommunities", []);

        if (joinedCommunities.includes(communityName)) {
            button.textContent = "Joined ✓";
        }

        button.addEventListener("click", function () {
            let joined = getData("vdooraJoinedCommunities", []);

            if (joined.includes(communityName)) {
                joined = joined.filter(function (name) {
                    return name !== communityName;
                });
                button.textContent = "Join community";
            } else {
                joined.push(communityName);
                button.textContent = "Joined ✓";
            }

            saveData("vdooraJoinedCommunities", joined);
        });

        card.appendChild(button);
    });


    // 7. PROFILE — EDIT DEMO DETAILS
    const profileIdentity = document.querySelector(".profile-identity");

    if (profileIdentity) {

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit profile";
        editButton.style.marginTop = "15px";
        editButton.style.padding = "10px 14px";
        editButton.style.color = "white";
        editButton.style.background = "var(--primary)";
        editButton.style.border = "1px solid var(--primary-light)";
        editButton.style.borderRadius = "9px";
        editButton.style.cursor = "pointer";

        profileIdentity.appendChild(editButton);

        const savedProfile = getData("vdooraDemoProfile", {});

        function displayProfile(profile) {
            const name = profileIdentity.querySelector("h2");
            const username = profileIdentity.querySelector(".profile-username");
            const bio = profileIdentity.querySelector(".profile-bio");
            const avatar = document.querySelector(".profile-avatar-large");

            if (name && profile.name) name.textContent = profile.name;
            if (username && profile.username) {
                username.textContent = "@" + profile.username.replace(/^@/, "");
            }
            if (bio && profile.bio) bio.textContent = profile.bio;
            if (avatar && profile.name) {
                avatar.textContent = profile.name.charAt(0).toUpperCase();
            }
        }

        displayProfile(savedProfile);

        editButton.addEventListener("click", function () {
            const existingName =
                profileIdentity.querySelector("h2")?.textContent || "";

            const existingUsername =
                profileIdentity.querySelector(".profile-username")?.textContent || "";

            const existingBio =
                profileIdentity.querySelector(".profile-bio")?.textContent || "";

            const name = prompt("Enter your display name:", existingName);
            if (name === null || !name.trim()) return;

            const username = prompt(
                "Enter your username without @:",
                existingUsername.replace(/^@/, "")
            );
            if (username === null || !username.trim()) return;

            const bio = prompt("Write your bio:", existingBio);
            if (bio === null) return;

            const profile = {
                name: name.trim(),
                username: username.trim().replace(/^@/, ""),
                bio: bio.trim()
            };

            saveData("vdooraDemoProfile", profile);
            displayProfile(profile);
            showNotice("Your demo profile is saved in this browser.");
        });
    }


    // 8. PRIVACY & SAFETY — DEMO PREFERENCES
    document.querySelectorAll(".setting-card").forEach(function (card) {

        const content = card.querySelector(".setting-content");
        if (!content || content.querySelector(".demo-setting-control")) return;

        const title = content.querySelector("h3")?.textContent.trim();
        if (!title) return;

        const label = document.createElement("label");
        label.className = "demo-setting-control";
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "8px";
        label.style.marginTop = "12px";
        label.style.color = "var(--muted)";
        label.style.fontSize = "13px";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(
            getData("vdooraSetting_" + title, false)
        );

        const text = document.createElement("span");
        text.textContent = "Demo preference";

        checkbox.addEventListener("change", function () {
            saveData("vdooraSetting_" + title, checkbox.checked);
        });

        label.appendChild(checkbox);
        label.appendChild(text);
        content.appendChild(label);
    });


    // 9. WELCOME PAGE — SIMPLE BUTTON FEEDBACK
    document.querySelectorAll(".coming-soon").forEach(function (item) {
        item.setAttribute("title", "Some VDOORA features are still in development.");
    });


    // 10. DEVELOPER CHECK
    console.log("VDOORA JavaScript loaded on:", currentPage || "home page");
});