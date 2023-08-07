//background.js
chrome.runtime.onInstalled.addListener(() => {
  
  chrome.storage.sync.get("copyList").then(function(result) {

    for(let i = 0; i < result.copyList.length; i++) {

      const copyList = result.copyList || [];
      updateContextMenu(copyList);
    }
  });
});

// 컨텍스트 메뉴 업데이트 함수
function updateContextMenu(copyList) {
  // 기존에 생성된 컨텍스트 메뉴들을 삭제
  chrome.contextMenus.removeAll();
  
  // 새로운 컨텍스트 메뉴 생성
  chrome.contextMenus.create({
    title: "Copy-Keeper",
    id: "Copy",
    contexts: ["all"],
    visible: false
  });

  // 저장된 클립보드 데이터들을 반복하여 컨텍스트 메뉴 생성
  for (let i = 0; i < copyList.length; i++) {
    chrome.contextMenus.create({
      title: copyList[i].text,
      id: "Copy" + i,
      contexts: ["all"]
    });
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {

  if (info.menuItemId.startsWith("Copy")) {
    // 선택한 메뉴의 id에 따라 처리
    let index = parseInt(info.menuItemId.replace("Copy", ""));
    handleCopy(index, tab);
  }
    
});
  
function handleCopy(index, tab) {
  chrome.storage.sync.get("copyList").then(function(result) {
    let testData = result.copyList;
    
    if (index >= 0 && index < testData.length) {
      var selectedValue = testData[index].text;

      try {
        copyToClipboard(selectedValue, tab.id);
      } catch(error) {
          console.error(error);
      }
    }
  });
}
  
async function copyToClipboard(selectedValue, tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      function: function(selectedValue) {
        const dummyElement = document.createElement('textarea');
        dummyElement.value = selectedValue;
        document.body.appendChild(dummyElement);
        dummyElement.select();
        document.execCommand('copy');
        document.body.removeChild(dummyElement);

      }, args: [selectedValue]
    });

  } catch (error) {
    console.error('스크립트 실행 중 오류가 발생했습니다.', error);
  }
}

// 컨텐츠 스크립트에서 클립보드 데이터를 수신하는 메시지 핸들러 등록
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.type === "copy_event") {
    const { text, id } = message;
    handleEvent(text, "add");
  } else if (message.type === "delete_event") {
    const filteredCopyList = message.filteredCopyList;
    handleEvent(filteredCopyList, "del");
  }
});

// 복사 이벤트 핸들러
async function handleEvent(data, status) {
  try {
    // 기존 저장된 클립보드 데이터 가져오기
    let copyList;

    if (status == "add") {
      const { copyList: addCopyList } = await chrome.storage.sync.get("copyList");
      copyList = addCopyList;
    } else if (status == "del") {
      copyList = data;
    }

    // 컨텍스트 메뉴 업데이트
    updateContextMenu(copyList);
  } catch (e) {
    console.error("Background Error: ", e);
  }
}
  