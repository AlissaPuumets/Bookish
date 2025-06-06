const url = "https://kool.krister.ee/chat/Bookish";
const bookCardTemplate = document.querySelector("[data-book-template]");
const bookCardContainer = document.querySelector("[data-book-cards-container]");
const searchInput = document.querySelector("[data-search]");

// väike aknake
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

// form raamatutele
document.getElementById("myForm").addEventListener("submit", function (event) {

    const formData = new FormData(this);

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
                this.reset();
            }
        })
});

let books = [];


//searchi osa
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    books.forEach(book => {
        const titleMatch = book.title.toLowerCase().includes(value);
        const genreMatch = (book.genre || "").toLowerCase().includes(value);
        const isVisible = titleMatch || genreMatch;

        console.log(`Checking "${book.title}" - Visible: ${isVisible}`);

        book.element.classList.toggle("hide", !isVisible);
    });
});

// jookseb raamatutele järgi
fetch (url)
    .then(res => res.json())
    .then(data => {
        books = data.map(book => {
            const card = bookCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            const genre = card.querySelector("[data-genre]");

            const title = book.title || "Untitled";
            const author = book.author || "Unknown Author";
            const genreText = book.genre || "No Genre";

            header.textContent = title;
            body.textContent = author;
            genre.textContent = genreText;

            bookCardContainer.append(card);

            return {
                title,
                author,
                genre: genreText,
                element: card
            };
        });
    });