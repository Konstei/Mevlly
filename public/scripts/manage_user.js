function change_username(event) {
    event.preventDefault();
    socket.emit("change-username", event.target.firstElementChild.value);
}