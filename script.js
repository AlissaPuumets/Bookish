const url = "https://kool.krister.ee/chat/Bookish";

// Add a book draggable modal
const modal = document.getElementById("myModal");
const header = document.getElementById("modalHeader");
const closeBtn = document.getElementById("closeBtn");
const openModalBtn = document.getElementById("openModalBtn");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
    header.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    header.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
    }
});

document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    fetch("https://kool.krister.ee/chat/Bookish", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (response.ok) {
                alert("Success! 💌");
            }
        })
});