import utils from "./utils";

// 복사 이벤트 발생하면 로컬 스토리지에 저장
document.addEventListener('copy', () => {
  navigator.clipboard.readText()
    .then(value => {
      chrome.storage.sync.get(['copyList'], async result => {
        const copyList = result.copyList || [];

        if (copyList.length > 0 && copyList[copyList.length-1].text === value) {
          return;
        }
      
        copyList.push({time: new Date().toLocaleString(), text: value});

        chrome.storage.sync.set({copyList});
      });
    });
});
