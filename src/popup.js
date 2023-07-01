import "../style.css";

let isActive = true;
let isAllCheck = false;
let duration = "all";
let searchText = "";

const buttonGroup = document.querySelector("#button-group");
const onBtn = document.querySelector("#on-btn");
const offBtn = document.querySelector("#off-btn");

const selectDuration = document.querySelector("#select-duration");

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

const checkboxList = document.querySelectorAll("#tr-check");

const allCheck = document.querySelector("#all-check");
buttonGroup.addEventListener("click", () => {
  setIsActive(!isActive);
});

selectDuration.addEventListener("change", (e) => {
  duration = e.target.value;
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchText = searchInput.value;
});

allCheck.addEventListener("click", (e) => {
  setIsAllCheck(!isAllCheck);
});

searchBtn.addEventListener("click", () => {
  searchText = searchInput.value;
  request("search", searchText).then((res) => {
    console.log(res);
  });
});

const setIsActive = (newValue) => {
  if (isActive) {
    onBtn.classList.remove("button-active");
    offBtn.classList.add("button-active");
  } else {
    onBtn.classList.add("button-active");
    offBtn.classList.remove("button-active");
  }
  isActive = newValue;
};

const setIsAllCheck = (newValue) => {
  if (isAllCheck) {
    checkboxList.forEach((item) => (item.checked = false));
  } else {
    checkboxList.forEach((item) => (item.checked = true));
  }
  isAllCheck = newValue;
};
