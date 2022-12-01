const domain = "https://simpli-notes.herokuapp.com"; //prod

chrome.runtime.onInstalled.addListener(async (details) => {
  const tooltipUnchecked = await getTooltipUnchecked();
  const tooltipDisabled = await getTooltipDisabled();
  if (tooltipUnchecked || tooltipDisabled) {
    turnBadgeOff();
  } else {
    turnBadgeOn();
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const tooltipUnchecked = await getTooltipUnchecked();
  const tooltipDisabled = await getTooltipDisabled();
  if (tooltipUnchecked || tooltipDisabled) {
    turnBadgeOff();
  } else {
    turnBadgeOn();
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === "insert_text") {
    try {
      const message = await apiInsertText(request.style, request.text);
      sendNotification('Successful', message);
    } catch (errorMessage) {
      sendNotification('Failed', errorMessage);
    }
  }
  else if (request.message === "insert_image") {
    try {
      const imageData = request.imageData;
      const message = await apiInsertImage(imageData.url, imageData.height, imageData.width);
      sendNotification('Successful', message);
    } catch (errorMessage) {
      sendNotification('Failed', errorMessage);
    }
  }
});

chrome.storage.onChanged.addListener(async function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'tooltipUnchecked') {
      const tooltipDisabled = await getTooltipDisabled();
      if (!newValue && !tooltipDisabled) {
        turnBadgeOn();
      } else {
        turnBadgeOff();
      }

    } else if (key === 'tooltipDisabled') {
      const tooltipUnchecked = await getTooltipUnchecked();
      if (!newValue && !tooltipUnchecked) {
        turnBadgeOn();
      } else {
        turnBadgeOff();
      }
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
      if (res.ok) {
        resolve(`${toTitleCase(style)} successfully inserted to the document`);
      }
      reject(res.statusText);
    }).catch((error) => {
      reject(error.message);
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
      if (res.ok) {
        resolve('Image successfully inserted to the document');
      }
      reject(res.statusText);
    }).catch((error) => {
      reject(error.message);
    });
  });
}

function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}

function sendNotification(status, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/logo.png',
    title: `Request ${status}`,
    message: message,
  })
}

function getTooltipUnchecked() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipUnchecked'], function (result) {
      (result.tooltipUnchecked) ? resolve(result.tooltipUnchecked) : resolve(false);
    });
  });
}

function storeTooltipUnchecked(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ 'tooltipUnchecked': value }, function () {
      resolve();
    });
  })
}

function getTooltipDisabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipDisabled'], function (result) {
      (result.tooltipDisabled) ? resolve(result.tooltipDisabled) : resolve(false);
    });
  });
}

function storeTooltipDisabled(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ 'tooltipDisabled': value }, function () {
      resolve();
    });
  })
}

function turnBadgeOn() {
  try {
    chrome.action.setBadgeBackgroundColor({
      color: [14, 208, 149, 1]
    }, () => {
      chrome.action.setBadgeText({
        text: " "
      })
    })
  } catch (error) {
    console.log(error);
  }
}

function turnBadgeOff() {
  chrome.action.setBadgeBackgroundColor({
    color: [249, 159, 159, 1]
  }, () => {
    chrome.action.setBadgeText({
      text: " "
    })
  })
}