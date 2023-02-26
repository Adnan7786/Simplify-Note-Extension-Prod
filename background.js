const protocol = 'https://'
const domain = 'simplifynote.app'

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason == 'install') {
    let onbLink = `${protocol}${domain}/onboarding`;
    chrome.tabs.query({
      url: 'https://chrome.google.com/webstore/detail/simplifynote-your-note-ta/mjhigpcgpfiaadanipnacbalgaaleclc?*'
    }).then((result) => {
      const qKey = 'ref_code';
      let qValue = null;
      const url = result[0]?.url;
      if (!url || url === '') return;
      const queryParams = (url.split('?')[1]).split('&');
      for (query of queryParams) {
        const [key, value] = query.split('=');
        if (key === qKey) {
          qValue = value;
          break;
        }
      }
      if (qValue) onbLink += `?${qKey}=${qValue}`;
    }).catch((error) => console.log(error))
    chrome.tabs.create({
      url: onbLink
    });
  }
  if (details.reason == 'install' || details.reason == 'update') {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach((tab) => {
          chrome.tabs.reload(tab.id);
        })
      })
    })
  }
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
      sendResponse({
        status: 'success',
        message: `${toTitleCase(request.style)} inserted successfully`
      })
    }).catch((error) => {
      sendResponse({ status: 'failure', message: error.message });
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
      sendResponse({
        status: 'success',
        message: 'Image inserted successfully'
      })
    }).catch((error) => {
      sendResponse({ status: 'failure', message: error.message });
    })
  }
  else if (request.message === 'screenshot') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (dataUrl) => {
      apiCall(`/api/v1/insert/image`,
        'POST',
        {
          image: dataUrl,
          height: request.height,
          width: request.width,
        }
      ).then((res) => {
        sendResponse({
          status: 'success',
          message: 'Image inserted successfully'
        })
      }).catch((error) => {
        sendResponse({ status: 'failure', message: error.message });
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
      sendResponse({
        status: 'success',
        message: 'Image inserted successfully'
      })
    }).catch((error) => {
      sendResponse({ status: 'failure', message: error.message });
    })
  } else if (request.message === 'ocr') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        message: 'ocr',
        dataUrl: dataUrl,
        dim: request.dim,
      })
    })
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

function apiCall(pathSuffix, method, payload) {
  const endpoint = `${protocol}${domain}${pathSuffix}`;
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
          throw new Error(`Request Failed. Please try again.`)
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
    chrome.action.setIcon({ path: "images/logo.png" })
  } catch (error) {
    console.log(error);
  }
}

function turnBadgeOff() {
  try {
    chrome.action.setIcon({ path: "images/logo-offline.png" });
  } catch (error) {
    console.log(error);
  }
}

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const cookie = changeInfo.cookie;
  if (cookie.domain === 'simplifynote.app' && cookie.name === 'token') {
    if (changeInfo.removed) {
      turnBadgeOff()
    } else {
      const tooltipUnchecked = await getTooltipUnchecked()
      if (tooltipUnchecked) {
        turnBadgeOff()
      } else {
        turnBadgeOn()
      }
    }
  }
})
