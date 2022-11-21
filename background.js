const domain = "https://simpli-notes.herokuapp.com"; //prod

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  if (request.message === "insert_text") {
    try {
      await apiInsertText(request.style, request.text);
    } catch (error) {
      console.log(error);
    }
  }
  else if (request.message === "insert_image") {
    try {
      const imageData = request.imageData;
      console.log(imageData.url)
      console.log(imageData.height);
      console.log(imageData.width);
      await apiInsertImage(imageData.url, imageData.height, imageData.width);
    } catch (error) {
      console.log(error);
    }
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
      resolve(res);
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiInsertImage(url, height, width) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/insert/image`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: url,
        height,
        width
      }),
    }).then((res) => {
      resolve(res);
    }).catch((error) => {
      reject(error);
    });
  });
}