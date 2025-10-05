function send_message(event) {
    const box = event.target;
    const input = box.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#47;").replace(/\n/g, "<br>");
    const time = `${(new Date()).getHours()}:${(new Date()).getMinutes()}`;
    if (input != null  &&  input.trim() != "") {
        const message = document.createElement("span");
        message.innerHTML = `<span class="sent-message">
                                <div class="message-content">${input}</div>
                                <p class="message-time"> ${time} </p>
                            </span>`;
        const elem = document.querySelectorAll(".active-contact-content")[0].children[1];
        elem.insertBefore(message, elem.firstElementChild);
        box.value = "";
        const [calculateHeight, gridHeights, lineHeight, padding] = resizeTextbox(box);
        setTimeout(() => {
            box.parentElement.parentElement.parentElement.style.gridTemplateRows = `${ gridHeights[0] }px
                                                                                    ${ Math.max(gridHeights[1] - lineHeight * (calculateHeight(box) - 1), 455) }px
                                                                                    ${ Math.min(gridHeights[2] + lineHeight * (calculateHeight(box) - 1), 157) }px`;
            box.style.height = `${ Math.min(2 * padding + lineHeight * calculateHeight(box), 138) }px`;
        }, 1);
        socket.emit('message-send', document.querySelector("#username").value, document.querySelectorAll(".active-contact-content")[0].id, [{message: input, image: null, time: time}]);
    }
    box.focus();
}

function recieve_message(sender, data) {
    const message = document.createElement("span");
    message.innerHTML = `<span class="recieved-message">
                            <div class="message-content">${data.message}</div>
                            <p class="message-time"> ${data.time} </p>
                        </span>`;
    const elem = document.getElementById(sender).children[1];
    elem.insertBefore(message, elem.firstElementChild);
}

function resizeTextbox(box) {
    function calculateContentHeight(elem) {
        elem.style.height = "1px";
        const scrollHeight = elem.scrollHeight;
        return scrollHeight;
    }
    function calculateHeight(elem) {
        const style = (window.getComputedStyle) ? window.getComputedStyle(elem) : elem.currentStyle;
        const taLineHeight = parseFloat(style.lineHeight);
        const taHeight = calculateContentHeight(elem);
        const numberOfLines = Math.ceil(taHeight / taLineHeight) - 1;
        return numberOfLines;
    }
    
    const gridHeights = getComputedStyle(document.querySelectorAll(".contacts-section")[0]).gridTemplateRows.split(" ").map(value => value = value.slice(0, -2)).map(value => value = parseFloat(value));
    const lineHeight = parseFloat(getComputedStyle(box).lineHeight.slice(0, -2));
    const padding = parseFloat(getComputedStyle(box).paddingTop.slice(0, -2));
    return [calculateHeight, gridHeights, lineHeight, padding];
}

window.onresize = () => {
    if (document.querySelectorAll(".active-contact-content")[0]) {
        const box = document.querySelectorAll(".active-contact-content")[0].children[2].children[1].firstElementChild;
        resizeTextbox(box);
    }
}

function manage_key_presses(event) {
    if (`${event.key}` == "Enter") {
        if (!event.shiftKey) {
            event.preventDefault();
            send_message(event);
        }
        resizeTextbox(event.target);
    } else if (`${event.key}` == "Escape") document.querySelectorAll(".active-contact-content")[0].lastElementChild.children[1].blur();
    if ( (!event.altKey && event.ctrlKey && (`${event.key}`=="v" || `${event.key}` == "V" || `${event.key}`=="x" || `${event.key}`=="z" || `${event.key}`=="y")) || (!event.altKey && !event.ctrlKey && event.shiftKey && `${event.key}` == "Insert") || (`${event.key}`.length == 1 && !event.ctrlKey && !event.altKey) || (`${event.key}` == "Backspace") ) {
        const box = event.target;
        const [calculateHeight, gridHeights, lineHeight, padding] = resizeTextbox(box);
        setTimeout(() => {
            box.parentElement.parentElement.parentElement.style.gridTemplateRows = `${ gridHeights[0] }px
                                                                                    ${ Math.max(gridHeights[1] - lineHeight * (calculateHeight(box) - 1), 455) }px
                                                                                    ${ Math.min(gridHeights[2] + lineHeight * (calculateHeight(box) - 1), 157) }px`;
            box.style.height = `${ Math.min(2 * padding + lineHeight * calculateHeight(box), 138) }px`;
        }, 1);
    }
}

socket.on("message-recieve", (sender, data) => {
    if (data[0].message !== null && data[0].image === null) recieve_message(sender, data[0]);
});
