const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

fetch("../data/books.json")
  .then((res) => res.json())
  .then((books) => {
    const book = books.find((book) => book.id == bookId);
    if (!book) return;

    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent =
      "by " + book.authorName;
    document.getElementById("book-synopsis").textContent = book.synopsis;
    document.getElementById("book-genre").textContent = book.genre;
    document.getElementById("book-cover").src =
      "../assets/img/book-cover/" + book.coverImage;

    document.getElementById("book-prequel").textContent = book.series.prequel
      ? "Prequel: " + book.series.prequel
      : "No prequel";

    document.getElementById("book-sequel").textContent = book.series.sequel
      ? "Sequel: " + book.series.sequel
      : "No sequel";

    let ratingText = "No rating";
    if (book.ratings.length > 0) {
      let total = 0;
      for (let i = 0; i < book.ratings.length; i++) {
        total += book.ratings[i].rating;
      }
      ratingText = "⭐ " + (total / book.ratings.length).toFixed(1);
    }
    document.getElementById("book-rating").textContent = ratingText;

    const reviewsContainer = document.getElementById("reviews-container");

    book.ratings.forEach((r) => {
      const div = document.createElement("div");
      div.className = "review";
      div.innerHTML =
        "<strong>" +
        r.reviewer +
        "</strong> ⭐ " +
        r.rating +
        "<p>" +
        r.comment +
        "</p>";

      reviewsContainer.appendChild(div);
    });
  });
