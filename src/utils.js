export async function request(type, value) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, value }, function (response) {
      if (chrome.runtime.lastError) {
        reject("Send Message Error");
        return;
      }
      return resolve(response);
    });
  });
}
