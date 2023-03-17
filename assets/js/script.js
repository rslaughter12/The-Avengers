const nav = document.querySelector("");
const info_box = document.querySelector(".info_box");
const input = document.querySelector('input[type="search"]');

input.addEventListener("search", () => {
  console.log(`The term searched for was ${input.value}`);
});
