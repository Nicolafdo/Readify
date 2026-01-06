const quoteEl = document.getElementById("hero-quote");
const phraseEl = document.getElementById("hero-phrase");

async function loadQuotes() {
  try {
    const response = await fetch("/Readify/data/quote.json");
    const quotes = await response.json();

    showDailyQuote(quotes);
  } catch (error) {
    console.error("Failed to load quotes:", error);
    quoteEl.textContent = "Something went wrong.";
    phraseEl.textContent = "";
  }
}

function showDailyQuote(quotes) {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("dailyQuote");

  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.date === today) {
      quoteEl.textContent = `“${parsed.quote}”`;
      phraseEl.textContent = parsed.bookPhrase;
      return;
    }
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];

  localStorage.setItem(
    "dailyQuote",
    JSON.stringify({
      date: today,
      quote: selected.quote,
      bookPhrase: selected.bookPhrase,
    })
  );

  quoteEl.textContent = `“${selected.quote}”`;
  phraseEl.textContent = selected.bookPhrase;
}
loadQuotes();

async function loadAuthorOfTheDay() {
  try {
    const [authorsRes, booksRes] = await Promise.all([
      fetch("/Readify/data/authors.json"),
      fetch("/Readify/data//books.json"),
    ]);
    const authors = await authorsRes.json();
    const books = await booksRes.json();

    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("dailyAuthor");

    let selectedAuthor;

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        selectedAuthor = authors.find((a) => a.id === parsed.authorId);
      }
    }

    if (!selectedAuthor) {
      const randomIndex = Math.floor(Math.random() * authors.length);
      selectedAuthor = authors[randomIndex];

      localStorage.setItem(
        "dailyAuthor",
        JSON.stringify({
          date: today,
          authorId: selectedAuthor.id,
        })
      );
    }

    document.getElementById("author-name").textContent = selectedAuthor.name;
    document.getElementById(
      "author-image"
    ).src = `/Readify/assets/img/authors/${selectedAuthor.image}`;
    document.getElementById("author-image").alt = selectedAuthor.name;
    document.getElementById("author-bio").textContent = selectedAuthor.bio;

    const authorBooksDiv = document.getElementById("author-books");
    authorBooksDiv.innerHTML = "";

    const authorBooks = books.filter((b) => b.authorId === selectedAuthor.id);

    authorBooks.forEach((book) => {
      const bookWrapper = document.createElement("div");
      bookWrapper.classList.add("book-wrapper");

      const img = document.createElement("img");
      img.src = `/Readify/assets/img/book-cover/${book.coverImage}`;
      img.alt = book.title;

      const title = document.createElement("div");
      title.classList.add("book-title");
      title.textContent = book.title;

      bookWrapper.appendChild(img);
      bookWrapper.appendChild(title);
      authorBooksDiv.appendChild(bookWrapper);
    });
  } catch (error) {
    console.error("Failed to load author data:", error);
    document.getElementById("author-of-the-day").textContent =
      "Something went wrong.";
  }
}

loadAuthorOfTheDay();
