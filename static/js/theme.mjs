const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
if(getCookie('theme') === 'dark'){
  root.classList.toggle("dark");
  themeSwitch.checked = true;
}
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie = themeSwitch.checked ? 'theme=dark' : 'theme=light';
});

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}