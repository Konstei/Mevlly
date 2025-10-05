localStorage.debug = "*";

const socket = io.connect("localhost:3000", {});

socket.on("connect", () => {
    console.log(socket.id);
    socket.emit("change-username", document.querySelector("#username").value)
});