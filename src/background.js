//background.js
chrome.runtime.onInstalled.addListener(() => {

    var copyList = ['항목1', '항목2', '항목3'];
  
    chrome.storage.sync.set({ copyList: copyList }, function() {
      console.log('테스트 값이 설정되었습니다.');
    });
  
    chrome.contextMenus.create({
      title: "Copy-Keeper",
      id: "Copy",
      contexts: ["all"],
      visible: false
    });
  
    chrome.storage.sync.get("copyList").then(function(result) {
  
      for(let i = 0; i < result.copyList.length; i++) {
        chrome.contextMenus.create({
          title: result.copyList[i],
          id: "Copy" + i,
          contexts: ["all"]
        });
      }
    });
  
  });
  
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
        var selectedValue = testData[index];
  
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
  
          // document.execCommand('copy');
  
          // const coptValue = selectedValue;
          // navigator.clipboard.writeText(coptValue)
          //   .then(() => {
          //     console.log('텍스트가 클립보드에 복사되었습니다!');
          //   })
          //   .catch((error) => {
          //     console.error('클립보드 복사 중 오류가 발생했습니다.', error);
          //   });
  
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
  