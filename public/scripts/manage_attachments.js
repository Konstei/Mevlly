function readURL(file) {
    return new Promise((resolve, reject) => {
        let fr = new FileReader();

        fr.onload = () => resolve(fr.result);

        fr.onerror = () => reject(fr);

        fr.readAsDataURL(file);
    });
}

function toggle_attachements_menu(event) {
    const btn = event.target;
    btn.nextElementSibling.classList.toggle("open-attach-menu");
}

window.onclick = (event) => {
    if (document.querySelectorAll(".active-contact-content")[0] && event.target !== document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.firstElementChild && event.target !== document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.lastElementChild.firstElementChild) {
        document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.lastElementChild.classList.remove("open-attach-menu");
    }
}

function attach_images(event) {
    event.target.nextElementSibling.click();
    event.target.nextElementSibling.addEventListener("change", (event) => {
        document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.firstElementChild.click();

        let files = event.target.files;
        let readers = [];

        if (!files.length) return;

        for (let i=0; i<files.length; i++) readers.push(readURL(files[i]));

        let i=0;
        Promise.all(readers).then((values) => {
            values.forEach((value) => {
                const btn = document.createElement("button");
                btn.classList.add("image-tab");
                btn.style.backgroundImage = `url(${value})`;
                btn.setAttribute("onclick", "toggle_image_attachments(event)");
                document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].append(btn);

                const div = document.createElement("div");
                div.classList.add("image-attachment-preview");
                div.innerHTML =`<div></div>
                                <div class="image-tab-message-bar">
                                    <textarea wrap="hard" placeholder="Scrieți un mesaj" onkeydown="manage_key_presses_image_attachments(event)"></textarea>
                                    <span class="send" title="Trimiteți" onclick="send_image_message(event)"><ion-icon name="send" color="medium" class="send-arrow"></ion-icon></span>
                                </div>`
                const img = document.createElement("img");
                img.classList.add("attachment-image");
                img.src = `${value}`;
                div.firstElementChild.append(img);
                document.querySelectorAll(".active-contact-content")[0].lastElementChild.lastElementChild.append(div);
            });
            document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].firstElementChild.classList.add("focused-image-tab");
            document.querySelectorAll(".active-contact-content")[0].lastElementChild.lastElementChild.firstElementChild.classList.add("visible-image-attachment-preview");
            document.querySelectorAll(".active-contact-content")[0].lastElementChild.classList.add("preview-attachments-overlay");
            document.querySelectorAll(".active-contact-content")[0].lastElementChild.lastElementChild.firstElementChild.lastElementChild.firstElementChild.focus();
            readers = []
        })
        .catch(err => alert(err));
        event.target.value = null;
    }, false);
}

function toggle_image_attachments(event) {
    const elements = document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].children;
    for (let i=0; i<elements.length; i++) {
        if (elements[i].classList.contains("focused-image-tab")) {
            elements[i].classList.remove("focused-image-tab");
            break;
        }
    }
    event.target.classList.add("focused-image-tab");
    let k = 0;
    for (let i=0; i<event.target.parentElement.children.length; i++) {
        if (event.target === event.target.parentElement.children[i]) {
            k = i;
            break;
        }
    }
    const divs = document.querySelectorAll(".active-contact-content")[0].lastElementChild.lastElementChild.children;
    for (let i=0; i<divs.length; i++) {
        if (divs[i].classList.contains("visible-image-attachment-preview")) {
            divs[i].classList.remove("visible-image-attachment-preview");
            break
        }
    }
    divs[k].classList.add("visible-image-attachment-preview");
    divs[k].lastElementChild.firstElementChild.focus();
    
}

function close_attachments_overlay() {
    document.querySelectorAll(".active-contact-content")[0].lastElementChild.classList.remove("preview-attachments-overlay");
    const btns = document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].children;
    const lengths = btns.length;
    const divs = document.querySelectorAll(".active-contact-content")[0].lastElementChild.lastElementChild.children;
    for (let i=0; i<lengths; i++) {
        btns[0].remove();
        divs[0].remove();
    }
    const file_input = document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.lastElementChild.firstElementChild.lastElementChild.cloneNode();
    document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.lastElementChild.firstElementChild.lastElementChild.remove();
    document.querySelectorAll(".active-contact-content")[0].children[2].firstElementChild.lastElementChild.firstElementChild.append(file_input);
}

window.addEventListener("keydown", (event) => {
    if (`${event.key}` == "Escape" && document.querySelectorAll(".active-contact-content")[0] && document.querySelectorAll(".active-contact-content")[0].lastElementChild.classList.contains("preview-attachments-overlay")) {
        document.querySelectorAll(".active-contact-content")[0].lastElementChild.firstElementChild.click();
    }
});

function manage_key_presses_image_attachments(event) {
    const box = event.target;
    if (`${event.key}` == "Enter") {
        if (!event.shiftKey) {
            event.preventDefault();
            attach_images(event);
        } else {
            const [calculateHeight, _, lineHeight, padding] = resizeTextbox(box);
            setTimeout(() => {
                box.style.height = `${ Math.min(2 * padding + lineHeight * calculateHeight(box), 1000) }px`
                console.log(calculateHeight(box));
            });
        }
    } else if (`${event.key}` == "Escape") document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].blur();
    if ( (!event.altKey && event.ctrlKey && (`${event.key}`=="v" || `${event.key}` == "V" || `${event.key}`=="x" || `${event.key}`=="z" || `${event.key}`=="y")) || (!event.altKey && !event.ctrlKey && event.shiftKey && `${event.key}` == "Insert") || (`${event.key}`.length == 1 && !event.ctrlKey && !event.altKey) || (`${event.key}` == "Backspace") ) {
        const [calculateHeight, _, lineHeight, padding] = resizeTextbox(box);
        setTimeout(() => box.style.height = `${ Math.min(2 * padding + lineHeight * calculateHeight(box), 1000) }px`);
    }
}

function send_image_message(event) {
    const divs = event.target.parentElement.parentElement.parentElement.children;
    let message_list = [];
    for (let i=0; i<divs.length; i++) {
        let message_object = {};
        const message = document.createElement("span");
        const message_content = document.createElement("span");
        message_content.classList.add("sent-message");
        const input = divs[i].lastElementChild.firstElementChild.value;
        const source = divs[i].firstElementChild.firstElementChild.src;
        const time = `${(new Date()).getHours()}:${(new Date()).getMinutes()}`;
        if (input != null  &&  input.trim() != "") {
            message_content.innerHTML =`<div class="image-message-content">
                                            <div><img src="${source}"></div>
                                            <p> ${input} </p>
                                        </div>
                                        <p class="image-time"> ${time} </p>`;
            message_object = {
                message: input,
                image: source,
                time: time
            };
        } else {
            message_content.innerHTML =`<div class="image-content">
                                            <div><img src="${source}"></div>
                                        </div>
                                        <p class="image-time"> ${time} </p>`;
            message_object = {
                message: null,
                image: source,
                time: time
            };
        }
        message.append(message_content);
        const elem = document.querySelectorAll(".active-contact-content")[0].children[1];
        elem.insertBefore(message, elem.firstElementChild);
        message_list.push(message_object);
    }
    event.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.click();
    socket.emit("message-send", document.querySelector("#username").value, document.querySelectorAll(".active-contact-content")[0].id, message_list);
    // socket.emit("message-send", document.querySelector("#username").value, undefined, message_list);
}

function recieve_image_message(sender, data) {
    const message = document.createElement("span");
    const message_content = document.createElement("span");
    message_content.classList.add("recieved-message");
    if (data.message !== null) {
        console.log(data);
        message_content.innerHTML =`<div class="image-message-content">
                                        <div><img src="${data.image}"></div>
                                        <p> ${data.message} </p>
                                    </div>
                                    <p class="image-time"> ${data.time} </p>`
    } else {
        message_content.innerHTML =`<div class="image-content">
                                        <div><img src="${data.image}"></div>
                                    </div>
                                    <p class="image-time"> ${data.time} </p>`
    }
    message.append(message_content);
    const elem = document.getElementById(sender).children[1];
    elem.insertBefore(message, elem.firstElementChild);
}

socket.on("message-recieve", (sender, data) => {
    if (data[0].image !== null) for (const attachment of data) recieve_image_message(sender, attachment);
});