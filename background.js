const domain = "https://simpli-notes.herokuapp.com"; //prod

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  if (request.message === "insert_text") {
    const response = await apiInsertText(request.style, request.text);
    // sendResponse('Heheh');
  }
});


function apiInsertText(style, text) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/insert/${style}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}