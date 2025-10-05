function open_modal() {
    const overlay = document.querySelectorAll("[data-add-contact-overlay]")[0];
    const modal = document.querySelectorAll("[data-add-contact-modal-content]")[0];
    const clsbtn = document.querySelectorAll("[data-close-modal]")[0];
    const btn = document.querySelectorAll("[data-add-contact]")[0];
    const input_box = document.querySelectorAll("[data-add-contact-modal-input]")[0];
    const null_tag = document.querySelectorAll("[data-null-tag]")[0];
    const multiple_tag = document.querySelectorAll("[data-existing-contact]")[0];
    const root = document.querySelector(":root");
    

    btn.addEventListener("mouseenter", () => {
        root.style.setProperty("--ion-color-primary", getComputedStyle(root).getPropertyValue("--pure-white"));
    });
    btn.addEventListener("mouseleave", () => {
        root.style.setProperty("--ion-color-primary", getComputedStyle(root).getPropertyValue("--ion-color-light"));
    });
    btn.addEventListener("click", () => {
        overlay.style.display = "grid";
        overlay.style.animation = "overlayShow 300ms linear forwards";
        modal.style.animation = "addContactModalShow 300ms linear forwards";
        clsbtn.style.animation = "addContactModalColorShow 300ms linear forwards";
        modal.children[1].style.animation = "addContactModalColorShow 300ms linear forwards";
        modal.children[2].style.animation = "addContactModalInputShow 300ms linear forwards";
        modal.children[3].style.animation = "addContactModalSubmitShow 300ms linear forwards";
        setTimeout(() => {
            for (let i=0; i < modal.children.length; i++) {
                modal.children[i].style.animation = "";
            }
        }, 300);
        null_tag.style.display = "none";
        multiple_tag.style.display = "none";
        input_box.value = "";
        input_box.focus();
    });

    clsbtn.addEventListener("mouseenter", () => {
        clsbtn.style.color = "#20212a";
        clsbtn.onmousedown = () => {
            clsbtn.style.color = "#000";
        }
    });
    clsbtn.addEventListener("mouseleave", () => {
        clsbtn.style.color = "";
    });
    clsbtn.addEventListener("click", () => {
        input_box.blur();
        overlay.style.animation = "overlayHide 200ms linear forwards";
        modal.style.animation = "addContactModalHide 200ms linear forwards";
        clsbtn.style.animation = "addContactModalColorHide 200ms linear forwards";
        modal.children[1].style.animation = "addContactModalColorHide 200ms linear forwards";
        modal.children[2].style.animation = "addContactModalInputHide 200ms linear forwards";
        modal.children[3].style.animation = "addContactModalSubmitHide 200ms linear forwards";
        if (multiple_tag.style.display === "block") {
            multiple_tag.style.animation = "addContactModalFlagHide 200ms linear forwards";
        }
        if (null_tag.style.display === "block") {
            null_tag.style.animation = "addContactModalFlagHide 200ms linear forwards";
        }
        setTimeout(() => {
            overlay.style.display = "none";
            null_tag.style.display = "none";
            multiple_tag.style.display = "none";
            input_box.value = ""
        }, 200);
    });
    
    window.onclick = (event) => {
        if (event.target === overlay) clsbtn.click();
    }
    
    document.addEventListener("keydown", (event) => {
        if (`${event.code}` === "Escape") {
            if (input_box === document.activeElement) input_box.blur();
            else clsbtn.click();
        }
    });
}

function toggle_contact() {
    const contact_btns = document.querySelectorAll("[data-contact]");
    
    contact_btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const contact_content_main = document.querySelectorAll(".contact-content-main")[0];
            if (contact_content_main.style.display != "none") contact_content_main.classList.add("contact-content");
            if (document.querySelectorAll(".focused-contact")[0]) {
                const focused_contact = document.querySelectorAll(".focused-contact")[0];
                const contact = document.getElementById(focused_contact.getAttribute("data-contact-btn"));
                contact.className = contact.className.replace(" active-contact-content", "");
                focused_contact.className = focused_contact.className.replace(" focused-contact", "");
            }
            btn.classList.add("focused-contact");
            document.getElementById(btn.getAttribute("data-contact-btn")).classList.add("active-contact-content");
            document.querySelectorAll(".active-contact-content")[0].children[2].children[1].firstElementChild.focus();
        });
    });
}

function toggle_more_options_menu(event) {
    if (event.target.nextElementSibling.classList.contains("more-options-menu")) {
        event.target.blur();
        event.target.nextElementSibling.classList.remove("more-options-menu")
    } else {
        event.target.nextElementSibling.classList.add("more-options-menu")
        event.target.focus();
    }
}

function delete_contact() {
    document.querySelectorAll(".focused-contact")[0].remove();
    document.querySelectorAll(".active-contact-content")[0].remove();
    document.querySelector("#contact_content_main").classList.remove("contact-content");
}

function add_contact() {
    const submit = document.querySelectorAll("[data-add-contact-modal-submit]")[0];
    const input = document.querySelectorAll("[data-add-contact-modal-input]")[0];
    const multiple_tag = document.querySelectorAll("[data-existing-contact]")[0];
    const null_tag = document.querySelectorAll("[data-null-tag]")[0];
    
    submit.addEventListener("click", () => {
        const text = input.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#47;");
        null_tag.style.display = "none";
        multiple_tag.style.display = "none";
        if (text != null && text != "") {
            if (document.getElementById(text)) setTimeout(() => { multiple_tag.style.display = "block"; }, 10);
            else {
                const contact_btn = document.createElement("button");
                contact_btn.classList.add("contact");
                contact_btn.dataset.contactBtn = `${text}`;
                contact_btn.dataset.contact = "";
                contact_btn.innerHTML =`<div class="contact-profile-picture"></div>
                                        <p> ${text} </p>`;
                document.querySelectorAll("[data-contact-list]")[0].append(contact_btn);
                const contact_content = document.createElement("div");
                contact_content.id = `${text}`;
                contact_content.classList.add("contact-content");
                contact_content.innerHTML =`<div class="contact-name">
                                                <div class="contact-profile-picture"></div>
                                                <p> ${text} </p>
                                                <button onclick="toggle_more_options_menu(event)" onblur="toggle_more_options_menu(event)"><ion-icon name="ellipsis-vertical"></ion-icon></button>
                                                <div class="hidden-more-options-menu">
                                                    <button onclick="delete_contact()"> Ștergeți contactul </button>
                                                </div>
                                            </div>
                                            <div class="message-area"></div>
                                            <div class="message-bar">
                                                <div>
                                                    <span class="attach" title="Atașați" onclick="toggle_attachements_menu(event)"><ion-icon name="attach-outline" color="medium" class="paperclip"></ion-icon></span>
                                                    <div class="attach-menu">
                                                        <div>
                                                            <div class="attach-images" onclick="attach_images(event)"><ion-icon name="image-outline" color="secondary"></ion-icon></div>
                                                            <input type="file" style="display:none;" accept="images/*" multiple>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div><textarea class="send-message-box" wrap="hard" id="send_message_box" placeholder="Scrieți un mesaj" onkeydown="manage_key_presses(event)"></textarea></div>
                                                <div><span class="send" title="Trimiteți" onclick="send_message(event)"><ion-icon name="send" color="medium" class="send-arrow"></ion-icon></span></div>
                                            </div>
                                            <div class="attachments-overlay">
                                                <span class="close-attachments-overlay" onclick="close_attachments_overlay()"> &times; </span>
                                                <div class="image-tabs"></div>
                                                <div class="image-tab-content">
                                                </div>
                                            </div>`
                document.querySelectorAll("[data-contacts-area]")[0].append(contact_content);
                document.querySelectorAll("[data-close-modal]")[0].click();
                toggle_contact();
            }
        } else {
            setTimeout(() => {
                null_tag.style.display = "block";
            }, 10);
        }
    });

    input.addEventListener("keydown", (event) => {
        if (`${event.code}` === "Enter") submit.click();
    });
}



open_modal();
toggle_contact();
add_contact();
