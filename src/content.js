// 복사 이벤트 발생하면 로컬 스토리지에 저장
document.addEventListener("copy", async () => {
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
  } catch (e) {
    console.error("Content Error: ", e);
  }
});
