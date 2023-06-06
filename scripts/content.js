// 복사 이벤트 발생하면 로컬 스토리지에 저장
document.addEventListener('copy', () => {
  navigator.clipboard.readText()
    .then(value => {
      const copyList = getCopyList();

      if (copyList[copyList.length-1] && copyList[copyList.length-1].text === value) {
        return;
      }
      copyList.push({time: new Date().toLocaleString(), text: value});

      setCopyList(copyList);
    });
});

// 로컬 스토리지에서 리스트 조회
function getCopyList () {
  const jsonStr = window.localStorage.getItem('copyList');

  return jsonStr ? JSON.parse(jsonStr) : [];
}

// 로컬 스토리지에 리스트 저장
function setCopyList (copyList) {
  const jsonStr = JSON.stringify(copyList);

  window.localStorage.setItem('copyList', jsonStr);
}

// 로컬 스토리지에서 리스트 조회 (페이징)
function getCopyListByPaging (page, size) {
  const copyList = getCopyList();

  const startIndex = (page - 1) * size;
  const endIndex = page * size < copyList.length ? page * size : copyList.length;

  return copyList.slice(startIndex, endIndex);
}

// 선택한 아이템 복사
function copyItemToClipboard (item) {
  navigator.clipboard.writeText(item.text);
}

// 선택한 아이템 삭제
function deleteItem (index) {
  const copyList = getCopyList();
  copyList.slice(index, 1);
  
  setCopyList(copyList);
}

// 모든 아이템 삭제
function clearItem () {
  setCopyList([]);
}

// 아이템 검색 (키워드)
function searchItemByKeyword (keyword) {
  const copyList = getCopyList();

  const filteredList = copyList.filter(item => item.text.includes(keyword));

  return filteredList;
}

// 아이템 검색 (날짜)
function searchItemByDate (date) {
  const copyList = getCopyList();

  const filteredList = copyList.filter(item => new Date(item.time).toLocaleDateString() === date);

  return filteredList;
}