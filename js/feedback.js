const form = document.getElementById("feedback-form");
const messageBox = document.getElementById("form-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    messageBox.textContent = "All fields are required.";
    messageBox.style.color = "red";
    return;
  }

  const feedback = {
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];

  feedbackList.push(feedback);
  localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

  messageBox.textContent = "Thank you for your feedback!";
  messageBox.style.color = "green";

  form.reset();
});

document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
  });
});
