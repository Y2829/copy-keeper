import "../style.css";

import { getCopyList, deleteCopyItem } from "./utils";

const store = (initialState = {}) => {
  let state = initialState;

  const setState = (newState) => {
    state = { ...state, ...newState };
  };

  const getState = () => {
    return state;
  };

  return {
    setState,
    getState,
  };
};

const { setState, getState } = store({
  isActive: true,
  date: -1,
  searchText: "",
  checkedCopy: undefined,
  copyList: [],
});

const selectDate = document.querySelector(".Main__control-select");
const searchForm = document.querySelector(".Main__control-search");
const searchInput = document.querySelector(".Search__text");
const tableBody = document.querySelector("tbody");

searchInput.addEventListener("keyup", (e) => {
  setState({ searchText: e.target.value });
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { searchText, date } = getState();
  const copyList = await getCopyList(searchText, calcNAgoDay(date));
  setState(copyList);

  renderTable(copyList);
});

selectDate.addEventListener("change", async (e) => {
  const { value } = e.target;
  const { searchText } = getState();
  const keyword = searchText || undefined;

  if (value === "-1") {
    const copyList = await getCopyList(keyword, undefined);
    setState({ copyList, date: -1 });
    renderTable(copyList);
    return;
  }

  const copyList = await getCopyList(keyword, calcNAgoDay(Number(value)));
  setState({ copyList, date: Number(value) });
  renderTable(copyList);
});

tableBody.addEventListener("click", (e) => {
  const { value } = e.target;
  if (value === undefined) return;
  searchInput.value = value;
  setState({ checkedCopy: value });
});

const handleClickDelete = async (id) => {
  const { copyList } = getState();
  const filteredCopyList = await deleteCopyItem(copyList, id);
  setState({ copyList: filteredCopyList });
  renderTable(filteredCopyList);
};

const calcNAgoDay = (num) => {
  if (num < 0) return undefined;

  const now = new Date();
  const nAgoDay = new Date();
  nAgoDay.setDate(now.getDate() - num);

  return nAgoDay;
};

const renderTable = (copyList) => {
  if (!copyList) return;
  tableBody.innerHTML = ``;

  copyList.forEach((item) => {
    const { id, date, text } = item;
    const { checkedCopy } = getState();
    const checked = checkedCopy && checkedCopy === id;
    const parsedDate = new Date(date).toLocaleString();
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td style="width: 40%;">${parsedDate}</td>
      <td style="width: 50%; min-width: 240px;">${text}</td>
      <td style="width: 10%;" class="delete-icon" >
      <button class="Delete__button">
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ff5050}</style><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      </button>
      </td>

    `;
    const deleteButton = tableRow.querySelector(".Delete__button");
    deleteButton.addEventListener("click", async () => {
      await handleClickDelete(id);
    });
    tableBody.appendChild(tableRow);
  });
};

window.addEventListener("load", async () => {
  const copyList = await getCopyList();
  setState({ copyList });
  renderTable(copyList);
});
