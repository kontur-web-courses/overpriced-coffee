const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  const themeIsDark = root.classList.contains("dark");
  document.cookie = `dark=${themeIsDark}`;
});
