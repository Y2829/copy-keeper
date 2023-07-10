// 로컬 스토리지에서 리스트 조회
function getCopyList() {
  return chrome.storage.sync.get(['copyList']);
}

// 로컬 스토리지에 리스트 저장
function setCopyList(copyList) {
  chrome.storage.sync.set({copyList});
}

// 로컬 스토리지에서 리스트 조회 (페이징)
function getCopyListByPaging(page, size) {
  return getCopyList().then(result => {
    const copyList = result.copyList;
    const startIndex = (page - 1) * size;
    const endIndex = page * size < copyList.length ? page * size : copyList.length;

    return copyList.slice(startIndex, endIndex);
  });
}

// 선택한 아이템 복사
function copyItemToClipboard(item) {
  navigator.clipboard.writeText(item.text);
}

// 선택한 아이템 삭제
function deleteItem(index) {
  getCopyList().then(result => {
    const copyList = result.copyList;
    copyList.splice(index, 1);
    setCopyList(copyList);
  });
}

// 모든 아이템 삭제
function clearItem() {
  setCopyList([]);
}

// 아이템 검색 (키워드)
function searchItemByKeyword(keyword) {
  return getCopyList().then(result => {
    const copyList = result.copyList;
    return copyList.filter(item => item.text.includes(keyword));
  });
}

// 아이템 검색 (날짜)
function searchItemByDate(date) {
  return getCopyList().then(result => {
    const copyList = result.copyList;
    return copyList.filter(item => item.time === date);
  });
}

export default {
  getCopyList,
  getCopyListByPaging,
  copyItemToClipboard,
  deleteItem,
  clearItem,
  searchItemByKeyword,
  searchItemByDate
}