const protocol = 'https://'
const domain = 'simplifynote.app'

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason == 'install') {
    chrome.tabs.create({
      url: `${protocol}${domain}/onboarding`,
    })
  } else if (details.reason == 'update') {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach((tab) => {
          chrome.tabs.reload(tab.id)
        })
      })
    })
    chrome.tabs.create({
      url: `${protocol}${domain}/onboarding`,
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
    apiCall(`/api/v1/insert/${request.style}`, 'POST', { text: request.text })
      .then((res) => {
        sendResponse({
          status: 'success',
          message: `${toTitleCase(request.style)} inserted successfully`,
        })
      })
      .catch((errMsg) => {
        sendResponse({ status: 'failure', message: errMsg })
      })
  } else if (request.message === 'insert_image') {
    const imageData = request.imageData
    apiCall(`/api/v1/insert/image`, 'POST', {
      image: imageData.url,
      height: imageData.height,
      width: imageData.width,
    })
      .then((res) => {
        sendResponse({
          status: 'success',
          message: 'Image inserted successfully',
        })
      })
      .catch((errMsg) => {
        sendResponse({ status: 'failure', message: errMsg })
      })
  } else if (request.message === 'screenshot') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, async (dataUrl) => {
      apiCall(`/api/v1/insert/image`, 'POST', {
        image: dataUrl,
        height: request.height,
        width: request.width,
      })
        .then((res) => {
          sendResponse({
            status: 'success',
            message: 'Image inserted successfully',
          })
        })
        .catch((errMsg) => {
          sendResponse({ status: 'failure', message: errMsg })
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
    apiCall(`/api/v1/insert/image`, 'POST', {
      image: request.dataUrl,
      height: request.height,
      width: request.width,
    })
      .then((res) => {
        sendResponse({
          status: 'success',
          message: 'Image inserted successfully',
        })
      })
      .catch((errMsg) => {
        sendResponse({ status: 'failure', message: errMsg })
      })
  } else if (request.message === 'ocr') {
    chrome.tabs.captureVisibleTab(
      sender.tab.windowId,
      { format: 'png' },
      async (href) => {
        // (dataUrl) => {
        // chrome.tabs.sendMessage(sender.tab.id, {
        //   message: 'ocr',
        //   dataUrl: dataUrl,
        //   dim: request.dim,
        // })
        try {
          console.log('akjkbkajsb===============>', request.dim)
          const target = {
            tabId: sender.tab.id,
          }
          await chrome.scripting.executeScript({
            target,
            files: ['/inject/elements.js'],
            world: 'MAIN',
          })
          await chrome.scripting.executeScript({
            target,
            files: ['/engine/helper.js'],
          })
          await chrome.scripting.executeScript({
            target,
            files: ['/inject/response.js'],
          })
          // start
          chrome.storage.local.get(
            {
              'post-method': 'POST',
              'post-href': '',
              'post-body': '',
              lang: 'eng',
              'frequently-used': ['eng', 'fra', 'deu', 'rus', 'ara'],
              accuracy: '4.0.0',
            },
            (prefs) =>
              chrome.scripting.executeScript({
                target,
                func: (prefs, href, box) => {
                  const em = document.querySelector('ocr-result:last-of-type')

                  em.command('configure', prefs)
                  em.command('prepare')

                  em.href = href
                  em.box = box

                  em.run()
                },
                args: [
                  prefs,
                  href,
                  {
                    width: request.dim.width * request.dim.devicePixelRatio,
                    height: request.dim.height * request.dim.devicePixelRatio,
                    top: request.dim.top * request.dim.devicePixelRatio,
                    left: request.dim.left * request.dim.devicePixelRatio,
                  },
                ],
              })
          )
        } catch (e) {
          console.error('Error================', e)
        }
      }
    )
  }
  return true
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
    fetch(`${protocol}${domain}/api/v1/insert/${style}`, {
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
    fetch(`${protocol}${domain}/api/v1/insert/image`, {
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
  const endpoint = `${protocol}${domain}${pathSuffix}`
  const reqObj = {}
  if (method !== 'GET') {
    reqObj.method = method
    reqObj.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    reqObj.body = JSON.stringify(payload)
  }
  return new Promise((resolve, reject) => {
    fetch(endpoint, reqObj)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Something went wrong. Please try again later.`)
        }
        return res.json()
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
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
    chrome.action.setIcon({ path: 'images/logo.png' })
  } catch (error) {
    console.log(error)
  }
}

function turnBadgeOff() {
  try {
    chrome.action.setIcon({ path: 'images/logo-offline.png' })
  } catch (error) {
    console.log(error)
  }
}

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const cookie = changeInfo.cookie
  if (cookie.domain === 'simplifynote.app' && cookie.name === 'token') {
    console.log('changed cookie2', changeInfo)
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
