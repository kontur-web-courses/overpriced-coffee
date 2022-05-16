const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");

themeSwitch.checked && root.classList.toggle("dark");
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie = `theme=${themeSwitch.checked}`;
});
