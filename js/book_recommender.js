let allBooks = [];
const suggestedContainer = document.getElementById("suggested-books");
const pickBtn = document.getElementById("pick-btn");

function loadBooks() {
  fetch("../DATA/books.json")
    .then((res) => res.json())
    .then((data) => {
      allBooks = data;
      populateGenreOptions();
    })
    .catch((err) => {
      console.log("Failed to load books");
    });
}

function populateGenreOptions() {
  const genreSelect = document.getElementById("genre-select");
  const genres = [];
  allBooks.forEach((b) => {
    if (!genres.includes(b.genre)) {
      genres.push(b.genre);
    }
  });
  genres.sort();

  genres.forEach((g) => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    genreSelect.appendChild(option);
  });
}

function pickBooks() {
  const genre = document.getElementById("genre-select").value;
  const length = document.getElementById("length-select").value;

  let filtered = allBooks.filter((b) => {
    let matchesGenre = genre ? b.genre === genre : true;
    let matchesLength = true;
    const pages = b.pages || 300;
    if (length === "short") matchesLength = pages < 200;
    if (length === "medium") matchesLength = pages >= 200 && pages <= 400;
    if (length === "long") matchesLength = pages > 400;
    return matchesGenre && matchesLength;
  });

  filtered.sort(() => Math.random() - 0.5);

  const picked = filtered.slice(0, 5);

  renderBooks(picked);

  pickBtn.textContent = "Pick Again";
}

function renderBooks(books) {
  suggestedContainer.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML =
      '<img src="../ASSETS/img/book cover/' +
      book.coverImage +
      '" alt="' +
      book.title +
      '" />' +
      '<div class="book-title">' +
      book.title +
      "</div>" +
      '<div class="book-author">' +
      book.authorName +
      "</div>" +
      '<div class="save-bar"><div class="filled"></div></div>';

    card.addEventListener("click", () => {
      const filledBar = card.querySelector(".filled");
      let readingList = JSON.parse(localStorage.getItem("readingList") || "[]");

      const index = readingList.findIndex((b) => b.id === book.id);
      if (index === -1) {
        readingList.push(book);
        filledBar.style.width = "100%";
      } else {
        readingList.splice(index, 1);
        filledBar.style.width = "0%";
      }

      localStorage.setItem("readingList", JSON.stringify(readingList));
    });

    suggestedContainer.appendChild(card);
  });
}

pickBtn.addEventListener("click", pickBooks);

loadBooks();
