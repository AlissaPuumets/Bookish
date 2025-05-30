const url = "https://kool.krister.ee/chat/Bookish";
const bookCardTemplate = document.querySelector("[data-book-template]");
const bookCardContainer = document.querySelector("[data-book-cards-container]");
const searchInput = document.querySelector("[data-search]");

// modal stuff
const modal = document.getElementById("aknake");
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
        modal.style.left = (e.clientX - offsetX) + "px";
        modal.style.top = (e.clientY - offsetY) + "px";
    }
});

const form = document.getElementById("myForm");
const fileInput = document.getElementById("file");
const previewImage = form.querySelector("img");

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            previewImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    formData.append("imageUrl", previewImage.src); // sending base64 as string

    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (response.ok) {
                alert("Success! 💌");

                const card = bookCardTemplate.content.cloneNode(true).children[0];
                const header = card.querySelector("[data-header]");
                const body = card.querySelector("[data-body]");
                const genre = card.querySelector("[data-genre]");
                const image = card.querySelector("[data-image] img");

                const title = jsonData.title || "Untitled";
                const author = jsonData.author || "Unknown Author";
                const genreText = jsonData.genre || "No Genre";
                const imageSrc = jsonData.imageUrl || "images/download.png";

                header.textContent = title;
                body.textContent = author;
                genre.textContent = genreText;
                image.src = imageSrc;

                bookCardContainer.append(card);

                books.push({
                    title,
                    author,
                    genre: genreText,
                    element: card
                });

                form.reset();
                previewImage.src = "images/download.png";
                modal.style.display = "none";
            }
        });
});

let books = [];

// search
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    books.forEach(book => {
        const titleMatch = book.title.toLowerCase().includes(value);
        const genreMatch = (book.genre || "").toLowerCase().includes(value);
        const isVisible = titleMatch || genreMatch;

        book.element.classList.toggle("hide", !isVisible);
    });
});

// load books
fetch(url)
    .then(res => res.json())
    .then(data => {
        books = data.map(book => {
            const card = bookCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            const genre = card.querySelector("[data-genre]");
            const image = card.querySelector("[data-image] img");

            const title = book.title || "Untitled";
            const author = book.author || "Unknown Author";
            const genreText = book.genre || "No Genre";
            const imageSrc = book.imageUrl || "images/download.png";

            header.textContent = title;
            body.textContent = author;
            genre.textContent = genreText;
            image.src = imageSrc;

            bookCardContainer.append(card);

            return {
                title,
                author,
                genre: genreText,
                element: card
            };
        });
    });
