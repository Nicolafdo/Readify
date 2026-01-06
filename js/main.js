const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const overlay = document.getElementById("overlay");
const emailInput = document.getElementById("newsletter-email");
const subscribeBtn = document.getElementById("subscribe-btn");
const message = document.getElementById("newsletter-message");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("show");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navLinks.classList.remove("show");
  overlay.classList.remove("show");
});

subscribeBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();

  if (!email || !email.includes("@")) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  try {
    const storedEmails =
      JSON.parse(localStorage.getItem("newsletterEmails")) || [];

    if (storedEmails.includes(email)) {
      showMessage("You are already subscribed.", "error");
      return;
    }

    storedEmails.push(email);
    localStorage.setItem("newsletterEmails", JSON.stringify(storedEmails));

    showMessage("Successfully subscribed!", "success");
    emailInput.value = "";
  } catch (err) {
    showMessage("An error occurred. Please try again.", "error");
  }
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `newsletter-message ${type}`;
}
