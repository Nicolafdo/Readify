const calculateBtn = document.getElementById("calculate-btn");
const saveBtn = document.getElementById("save-btn");

let allBooks = [];

fetch("../DATA/books.json")
  .then((res) => res.json())
  .then((data) => {
    allBooks = data;
  })
  .catch((err) => console.error("Failed to load books.json", err));

let calculatedPercent = 0;

calculateBtn.addEventListener("click", () => {
  const totalPages = parseInt(document.getElementById("total-pages").value);
  const pagesRead = parseInt(document.getElementById("pages-read").value);
  const dailySpeed = parseInt(document.getElementById("daily-speed").value);

  if (!totalPages || !pagesRead || !dailySpeed) {
    return alert("Fill all fields!");
  }

  calculatedPercent = Math.min((pagesRead / totalPages) * 100, 100);

  const daysLeft = Math.ceil((totalPages - pagesRead) / dailySpeed);
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysLeft);

  document.querySelector(".progress-fill").style.width =
    calculatedPercent + "%";

  const percentageEl = document.getElementById("percentage");
  let start = 0;
  const duration = 1500;
  const increment = calculatedPercent / (duration / 20);

  const counter = setInterval(() => {
    start += increment;
    if (start >= calculatedPercent) {
      start = calculatedPercent;
      clearInterval(counter);
    }
    percentageEl.textContent = Math.round(start) + "%";
  }, 20);

  document.getElementById("estimated-finish").textContent =
    "Estimated Finish: " + finishDate.toDateString();
});

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("book-title").value;
  const totalPages = parseInt(document.getElementById("total-pages").value);
  const pagesRead = parseInt(document.getElementById("pages-read").value);

  if (!title || !totalPages || !pagesRead) {
    return alert("Fill all fields & calculate first!");
  }

  if (!allBooks.length) {
    return alert("Books data not loaded yet. Try again.");
  }

  const normalizedTitle = title.trim().toLowerCase();

  const matchedBook = allBooks.find(
    (book) => book.title.trim().toLowerCase() === normalizedTitle
  );

  const coverImage = matchedBook ? matchedBook.coverImage : "default.jpg";

  const progressList =
    JSON.parse(localStorage.getItem("readingProgress")) || [];

  const bookData = {
    id: matchedBook ? matchedBook.id : normalizedTitle.replace(/\s+/g, "_"),
    title,
    coverImage,
    percent: Math.round(calculatedPercent),
    status: calculatedPercent >= 100 ? "completed" : "reading",
    lastUpdated: new Date().toISOString(),
  };

  const existingIndex = progressList.findIndex((b) => b.id === bookData.id);

  if (existingIndex > -1) {
    progressList[existingIndex] = bookData;
  } else {
    progressList.push(bookData);
  }

  localStorage.setItem("readingProgress", JSON.stringify(progressList));
  alert("Progress saved to Reading Flow!");
});
