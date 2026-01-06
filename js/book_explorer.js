let allBooks = [];
let currentPage = 1;
const booksPerPage = 25;

function loadBooks() {
  fetch("../data/books.json")
    .then((res) => res.json())
    .then((data) => {
      allBooks = data;
      populateGenreFilter();
      displayBooks();
    });
}

function populateGenreFilter() {
  const genreFilter = document.getElementById("genre-filter");
  const genres = [];
  allBooks.forEach((book) => {
    if (!genres.includes(book.genre)) {
      genres.push(book.genre);
    }
  });

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

function displayBooks() {
  const container = document.getElementById("books-container");
  container.innerHTML = "";

  const filteredBooks = applyFilters();
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToShow = filteredBooks.slice(start, end);

  booksToShow.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML =
      '<img src="../assets/img/book-cover/' +
      book.coverImage +
      '" alt="' +
      book.title +
      '" />' +
      '<div class="book-title">' +
      book.title +
      "</div>" +
      '<div class="book-author">' +
      book.authorName +
      "</div>";

    card.addEventListener("click", () => {
      window.location.href = `book_details.html?id=${book.id}`;
    });

    container.appendChild(card);
  });

  setupPagination(filteredBooks.length);
}

function applyFilters() {
  const searchInput = document
    .getElementById("book-search")
    .value.toLowerCase();
  const genreFilter = document.getElementById("genre-filter").value;
  const lengthFilter = document.getElementById("length-filter").value;

  return allBooks.filter((book) => {
    let matchesSearch = book.title.toLowerCase().includes(searchInput);
    let matchesGenre = genreFilter ? book.genre === genreFilter : true;

    let matchesLength = true;
    if (lengthFilter) {
      const pages = book.pages || 300;
      if (lengthFilter === "short") matchesLength = pages < 200;
      if (lengthFilter === "medium")
        matchesLength = pages >= 200 && pages <= 400;
      if (lengthFilter === "long") matchesLength = pages > 400;
    }

    return matchesSearch && matchesGenre && matchesLength;
  });
}

function setupPagination(totalBooks) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;

    btn.addEventListener("click", () => {
      currentPage = i;
      displayBooks();
    });

    pagination.appendChild(btn);
  }
}

document.getElementById("apply-filters").addEventListener("click", () => {
  currentPage = 1;
  displayBooks();
});

document.getElementById("book-search").addEventListener("input", () => {
  currentPage = 1;
  displayBooks();
});

loadBooks();
