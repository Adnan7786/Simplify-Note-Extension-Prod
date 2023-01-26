const domain = 'https://simplifynote.app' //prod

chrome.runtime.onInstalled.addListener(async (details) => {
  const tooltipUnchecked = await getTooltipUnchecked()
  const tooltipDisabled = await getTooltipDisabled()
  if (tooltipUnchecked || tooltipDisabled) {
    turnBadgeOff()
  } else {
    turnBadgeOn()
  }
})

chrome.runtime.onStartup.addListener(async () => {
  const tooltipUnchecked = await getTooltipUnchecked()
  const tooltipDisabled = await getTooltipDisabled()
  if (tooltipUnchecked || tooltipDisabled) {
    turnBadgeOff()
  } else {
    turnBadgeOn()
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'insert_text') {
    apiCall(`/api/v1/insert/${request.style}`,
      'POST',
      { text: request.text }
    ).then((res) => {
      console.log(res);
      sendResponse({
        status: 'success',
        message: `${toTitleCase(request.style)} inserted successfully`
      })
    }).catch((errMsg) => {
      sendResponse({ status: 'failure', message: errMsg });
    })
  }
  else if (request.message === 'insert_image') {
    const imageData = request.imageData
    apiCall(`/api/v1/insert/image`,
      'POST',
      {
        image: imageData.url,
        height: imageData.height,
        width: imageData.width,
      }
    ).then((res) => {
      console.log(res);
      sendResponse({
        status: 'success',
        message: 'Image inserted successfully'
      })
    }).catch((errMsg) => {
      sendResponse({ status: 'failure', message: errMsg });
    })
  }
  else if (request.message === 'screenshot') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (dataUrl) => {
      console.log('dataUrl = ', dataUrl)
      apiCall(`/api/v1/insert/image`,
        'POST',
        {
          image: dataUrl,
          height: request.height,
          width: request.width,
        }
      ).then((res) => {
        console.log(res);
        sendResponse({
          status: 'success',
          message: 'Image inserted successfully'
        })
      }).catch((errMsg) => {
        sendResponse({ status: 'failure', message: errMsg });
      })
      chrome.tabs.sendMessage(sender.tab.id, {
        message: 'screenshot',
        dataUrl: dataUrl,
      })
    })
  } else if (request.message === 'snip') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        message: 'snip',
        dataUrl: dataUrl,
        dim: request.dim,
      })
    })
  } else if (request.message === 'saveImage') {
    apiCall(`/api/v1/insert/image`,
      'POST',
      {
        image: request.dataUrl,
        height: request.height,
        width: request.width,
      }
    ).then((res) => {
      console.log(res);
      sendResponse({
        status: 'success',
        message: 'Image inserted successfully'
      })
    }).catch((errMsg) => {
      sendResponse({ status: 'failure', message: errMsg });
    })
  } else if (request.message === 'ocr') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        message: 'ocr',
        dataUrl: dataUrl,
        dim: request.dim,
      })
    })
  } else if (request.message === 'doOCR') {
    // doOCR using tesseract
    console.log('doOCR')

    const { TesseractWorker } = Tesseract
    const worker = new TesseractWorker()
    worker
      .recognize(request.dataUrl, 'eng', { logger: (m) => console.log(m) })
      .progress((progress) => {
        console.log('progress', progress)
      })
      .then((result) => {
        console.log('result', result)
      })
      .finally(() => worker.terminate())
  }
  return true;
})

chrome.storage.onChanged.addListener(async function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'tooltipUnchecked') {
      const tooltipDisabled = await getTooltipDisabled()
      if (!newValue && !tooltipDisabled) {
        turnBadgeOn()
      } else {
        turnBadgeOff()
      }
    } else if (key === 'tooltipDisabled') {
      const tooltipUnchecked = await getTooltipUnchecked()
      if (!newValue && !tooltipUnchecked) {
        turnBadgeOn()
      } else {
        turnBadgeOff()
      }
    }
  }
})

function apiInsertText(style, text) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/insert/${style}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    })
      .then((res) => {
        if (res.ok) {
          resolve(`${toTitleCase(style)} successfully inserted to the document`)
        }
        reject(res.statusText)
      })
      .catch((error) => {
        reject(error.message)
      })
  })
}

function apiInsertImage(url, height, width) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/insert/image`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: url,
        height,
        width,
      }),
    })
      .then((res) => {
        if (res.ok) {
          resolve('Image successfully inserted to the document')
        }
        reject(res.statusText)
      })
      .catch((error) => {
        reject(error.message)
      })
  })
}

function apiCall(pathSuffix, method, payload) {
  const endpoint = `${domain}${pathSuffix}`;
  const reqObj = {};
  if (method !== 'GET') {
    reqObj.method = method;
    reqObj.headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    reqObj.body = JSON.stringify(payload);
  }
  return new Promise((resolve, reject) => {
    fetch(endpoint, reqObj)
      .then(async (res) => {
        if (!res.ok) {
          console.log(await res.json());
          throw new Error(`Something went wrong. Please try again later.`)
        };
        return res.json();
      })
      .then((data) => { resolve(data) })
      .catch((error) => { reject(error) });
  });
}

function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
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
      result.tooltipUnchecked
        ? resolve(result.tooltipUnchecked)
        : resolve(false)
    })
  })
}

function storeTooltipUnchecked(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ tooltipUnchecked: value }, function () {
      resolve()
    })
  })
}

function getTooltipDisabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipDisabled'], function (result) {
      result.tooltipDisabled ? resolve(result.tooltipDisabled) : resolve(false)
    })
  })
}

function storeTooltipDisabled(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ tooltipDisabled: value }, function () {
      resolve()
    })
  })
}

function turnBadgeOn() {
  try {
    chrome.action.setBadgeBackgroundColor(
      {
        color: [14, 208, 149, 1],
      },
      () => {
        chrome.action.setBadgeText({
          text: ' ',
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
}

function turnBadgeOff() {
  chrome.action.setBadgeBackgroundColor(
    {
      color: [249, 159, 159, 1],
    },
    () => {
      chrome.action.setBadgeText({
        text: ' ',
      })
    }
  )
}
