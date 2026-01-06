const readingContainer = document.getElementById("reading-books");
const completedContainer = document.getElementById("completed-books");
const template = document.getElementById("flow-card-template");
const musicToggle = document.getElementById("music-toggle");
const audio = document.getElementById("lofi-audio");

musicToggle.checked = localStorage.getItem("musicOn") === "true";

musicToggle.addEventListener("change", () => {
  localStorage.setItem("musicOn", musicToggle.checked);
  if (musicToggle.checked) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

const progressList = JSON.parse(localStorage.getItem("readingProgress")) || [];

progressList.forEach((book) => {
  const cardFragment = template.content.cloneNode(true);
  const card = cardFragment.querySelector(".flow-card");

  card.querySelector(".book-title").textContent = book.title;

  card.querySelector(
    ".cover-bg"
  ).style.backgroundImage = `url('../ASSETS/img/book cover/${book.coverImage}')`;

  const fg = card.querySelector(".fg");
  const percentText = card.querySelector(".percent-text");

  const circumference = 251;
  const percent = book.percent || 0;
  const offset = circumference - (percent / 100) * circumference;

  setTimeout(() => {
    fg.style.strokeDashoffset = offset;
    percentText.textContent = percent + "%";
  }, 50);

  if (book.status === "completed") {
    completedContainer.appendChild(card);
  } else {
    readingContainer.appendChild(card);
  }
});
