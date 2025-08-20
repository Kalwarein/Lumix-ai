function toggleEntry(button) {
  const section = button.parentElement;
  const content = button.nextElementSibling;

  section.classList.toggle("open");
  if (section.classList.contains("open")) {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}