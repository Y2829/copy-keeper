const debounce = (fn) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), 500);
  };
};

// 복사 이벤트 발생하면 로컬 스토리지에 저장
document.addEventListener(
  "copy",
  debounce(async () => {
    try {
      const clipedText = await navigator.clipboard.readText();
      const { copyList } = await chrome.storage.sync.get("copyList");
      const newCopyList = copyList || [];
      const now = new Date();
      const stringNow = String(now);
      const id = String(now.getTime());
      await chrome.storage.sync.set({
        copyList: [{ id, date: stringNow, text: clipedText }, ...newCopyList],
      });

      // 백그라운드 스크립트로 클립보드 데이터 전송
      chrome.runtime.sendMessage({ type: "copy_event", text: clipedText });
    } catch (e) {
      console.error("Content Error: ", e);
    }
  })
);
