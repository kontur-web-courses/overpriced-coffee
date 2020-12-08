const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked && root.classList.toggle("dark");

// themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
    root.classList.toggle("dark");
    document.cookie = `dark_theme=${themeSwitch.checked}`;
});
