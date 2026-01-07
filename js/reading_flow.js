const readingContainer = document.getElementById("reading-books");
const completedContainer = document.getElementById("completed-books");
const template = document.getElementById("flow-card-template");
const audio = document.getElementById("lofi-audio");
const vinyl = document.getElementById("vinyl");
const musicToggleBtn = document.getElementById("musicToggleBtn");

let musicOn = localStorage.getItem("musicOn") === "true";

if (musicOn) {
  vinyl.classList.add("playing");
  audio.play().catch(() => {});
}

musicToggleBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  localStorage.setItem("musicOn", musicOn);

  if (musicOn) {
    vinyl.classList.add("playing");
    audio.play().catch(() => {});
  } else {
    vinyl.classList.remove("playing");
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
  ).style.backgroundImage = `url('../assets/img/book-cover/${book.coverImage}')`;

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
