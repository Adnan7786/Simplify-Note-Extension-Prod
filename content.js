function isPDF(url) {
  return url.split('.').pop() === 'pdf'
}

// if url is pdf, open pdf using pdf viewer present in src folder
if (isPDF(window.location.href)) {
  if (!window.location.href.startsWith('chrome-extension://')) {
    window.location.href =
      chrome.runtime.getURL('src/pdfjs/web/viewer.html') +
      '?file=' +
      window.location.href
  }
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

function getTooltipDisabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipDisabled'], function (result) {
      result.tooltipDisabled ? resolve(result.tooltipDisabled) : resolve(false)
    })
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'toggleTooltip') {
    console.log(request.status)
    alert(request.status)

    sendResponse({
      message: 'successful',
    })
  }
})

// function to handle response
function handleResponse(res) {
  if (res.successful) {
    alert(res.message)
  } else {
    alert(res.message)
  }
}

// Create a container with the three buttons (screenshot, snip, and ocr) at the bottom left of the screen
const screenSnipContainer = document.createElement('div')
screenSnipContainer.id = 'screenSnipContainer'
screenSnipContainer.style.position = 'fixed'
screenSnipContainer.style.zIndex = '10000'
screenSnipContainer.style.bottom = '0px'
screenSnipContainer.style.left = '0px'
screenSnipContainer.style.margin = '10px'
screenSnipContainer.style.padding = '6px'

// add padding to left anf right of
screenSnipContainer.style.paddingLeft = '10px'
screenSnipContainer.style.paddingRight = '10px'
screenSnipContainer.style.display = 'flex'
screenSnipContainer.style.flexDirection = 'row'
screenSnipContainer.style.alignItems = 'center'
screenSnipContainer.style.justifyContent = 'center'
screenSnipContainer.style.width = '120px'
screenSnipContainer.style.height = '40px'
screenSnipContainer.style.backgroundColor = 'black'
screenSnipContainer.style.color = 'white'
screenSnipContainer.style.borderRadius = '30px'
screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(255,255,255,1)'
screenSnipContainer.style.transition = 'all 0.3s ease-in-out'
screenSnipContainer.style.cursor = 'pointer'

// add a small box at right of the screenSnipContainerfor mouse holding with a button
const mouseHoldContainer = document.createElement('div')
// set image in background
mouseHoldContainer.style.backgroundImage =
  'url(' + chrome.runtime.getURL('src/icons/drag.png') + ')'
mouseHoldContainer.style.backgroundSize = 'contain'
// mouseHoldContainer.style.backgroundRepeat = 'no-repeat'
mouseHoldContainer.id = 'mouseHoldContainer'
mouseHoldContainer.style.width = '30px'
mouseHoldContainer.style.height = '30px'
mouseHoldContainer.title = 'Hold to drag'
// mouseHoldContainer.style.backgroundColor = 'white'
// mouseHoldContainer.style.marginRight = '10px'
mouseHoldContainer.style.cursor = 'pointer'

// when button is pressed it will mkae the screenSnipContainer to be draggable and chage the position of the screenSnipContainer with the mouse position
mouseHoldContainer.addEventListener('mousedown', () => {
  // now make the screenSnipContainer to be draggable
  screenSnipContainer.draggable = true
  mouseHoldContainer.style.cursor = 'grabbing'
  console.log('mouse on mouse down')

  // now change the position of the screenSnipContainer with the mouse position
  screenSnipContainer.addEventListener('dragend', (e) => {
    // screenSnipContainer.style.left = e.clientX + 'px'
    screenSnipContainer.style.top = e.clientY + 'px'
    console.log('mouse', e.clientX, e.clientY)
  })
})

// // when button is released it will make the screenSnipContainer to be not draggable and change the cursor to pointer
// mouseHoldContainer.addEventListener('mouseup', (e) => {
//   // set the screenSnipContainer top position with mouse position
//   screenSnipContainer.style.top = e.clientY + 'px'
//   screenSnipContainer.style.left = e.clientX + 'px'
//   console.log('mouse on mouse up')
//   // mouseHoldContainer.draggable = false
//   mouseHoldContainer.style.cursor = 'pointer'
// })

// change the theme same as the theme of the tooltipContainer
// chrome.storage.sync.get(['theme'], function (result) {
//   if (result.theme === 'light') {
//     screenSnipContainer.style.backgroundColor = 'white'
//     screenSnipContainer.style.color = 'black'
//   }
// })

// Create a screenshot button
const screenshotButton = document.createElement('button')
screenshotButton.id = 'screenshotButton'
screenshotButton.style.width = '40px'
screenshotButton.style.height = '40px'
screenshotButton.title = 'Take a screenshot'
// screenshotButton.style.borderRadius = '10px'
screenshotButton.style.backgroundColor = 'transparent'
screenshotButton.style.border = 'none'
screenshotButton.style.outline = 'none'
screenshotButton.style.margin = '5px'
screenshotButton.style.cursor = 'pointer'
screenshotButton.style.transition = 'all 0.3s ease-in-out'
// screenshotButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
screenshotButton.style.backgroundImage =
  'url(' + chrome.runtime.getURL('src/icons/screenshot.png') + ')'
screenshotButton.style.backgroundSize = 'contain'
screenshotButton.style.padding = '5px'
screenshotButton.style.backgroundRepeat = 'no-repeat'
screenshotButton.style.backgroundPosition = 'center'
screenSnipContainer.style.justifyContent = 'space-around'

// add entrance animation on hover of container
// screenSnipContainer.addEventListener('mouseenter', () => {
//   screenSnipContainer.style.width = '200px'
//   screenSnipContainer.style.height = '60px'
//   screenSnipContainer.style.borderRadius = '10px'
//   screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
// })

// // add exit animation on hover of container
// screenSnipContainer.addEventListener('mouseleave', () => {
//   screenSnipContainer.style.width = '120px'
//   screenSnipContainer.style.height = '40px'
//   screenSnipContainer.style.paddingLeft = '10px'
//   screenSnipContainer.style.paddingRight = '10px'
//   screenSnipContainer.style.borderRadius = '30px'
//   screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
// })

// Create a snip button
const snipButton = document.createElement('button')
snipButton.id = 'snipButton'
snipButton.style.width = '40px'
snipButton.style.height = '40px'
snipButton.title = 'Snip a part of the screen'
// snipButton.style.borderRadius = '10px'
snipButton.style.backgroundColor = 'transparent'
snipButton.style.border = 'none'
snipButton.style.outline = 'none'
snipButton.style.margin = '5px'
snipButton.style.cursor = 'pointer'
snipButton.style.transition = 'all 0.3s ease-in-out'
// snipButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
snipButton.style.backgroundImage =
  'url(' + chrome.runtime.getURL('src/icons/snip.png') + ')'
snipButton.style.backgroundSize = 'contain'
snipButton.style.padding = '5px'
snipButton.style.backgroundRepeat = 'no-repeat'
snipButton.style.backgroundPosition = 'center'

// show some animation on hover of snip button
snipButton.addEventListener('mouseenter', () => {
  snipButton.style.transform = 'scale(1.2)'
  snipButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

snipButton.addEventListener('mouseleave', () => {
  snipButton.style.transform = 'scale(1.0)'
  snipButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

// show some animation on hover of screenshot button
screenshotButton.addEventListener('mouseenter', () => {
  screenshotButton.style.transform = 'scale(1.2)'
  screenshotButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

screenshotButton.addEventListener('mouseleave', () => {
  screenshotButton.style.transform = 'scale(1.0)'
  screenshotButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

// Create a ocr button
const ocrButton = document.createElement('button')
ocrButton.id = 'ocrButton'
ocrButton.style.width = '40px'
ocrButton.style.height = '40px'
ocrButton.title = 'crop to read text from image'
// ocrButton.style.borderRadius = '10px'
ocrButton.style.backgroundColor = 'transparent'
ocrButton.style.border = 'none'
ocrButton.style.outline = 'none'
ocrButton.style.margin = '5px'
ocrButton.style.cursor = 'pointer'
ocrButton.style.transition = 'all 0.3s ease-in-out'
// ocrButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
ocrButton.style.backgroundImage =
  'url(' + chrome.runtime.getURL('src/icons/ocr.png') + ')'
ocrButton.style.backgroundSize = 'contain'
ocrButton.style.padding = '5px'
ocrButton.style.backgroundRepeat = 'no-repeat'
ocrButton.style.backgroundPosition = 'center'

// show some animation on hover of snip button
ocrButton.addEventListener('mouseenter', () => {
  ocrButton.style.transform = 'scale(1.2)'
  ocrButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

ocrButton.addEventListener('mouseleave', () => {
  ocrButton.style.transform = 'scale(1.0)'
  ocrButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

document.body.appendChild(screenSnipContainer)
screenSnipContainer.appendChild(screenshotButton)
screenSnipContainer.appendChild(snipButton)
screenSnipContainer.appendChild(ocrButton)
screenSnipContainer.appendChild(mouseHoldContainer)

// Add event listeners to the buttons
screenshotButton.addEventListener('click', () => {
  document.body.removeChild(screenSnipContainer)
  removeExistingSnip()
  setTimeout(() => {
    chrome.runtime.sendMessage(
      { message: 'screenshot' },
      function (response) {}
    )
  }, 300)
  setTimeout(() => {
    screenSnipContainer.style.width = '120px'
    screenSnipContainer.style.height = '40px'
    screenSnipContainer.style.paddingLeft = '10px'
    screenSnipContainer.style.paddingRight = '10px'
    screenSnipContainer.style.borderRadius = '30px'
    screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
    document.body.appendChild(screenSnipContainer)
  }, 1000)
})

snipButton.addEventListener('click', (e) => {
  // Removing the screenshot container so that it doesn't interfere with the snip
  document.body.removeChild(screenSnipContainer)
  removeExistingSnip()

  captureSnip()
})

ocrButton.addEventListener('click', () => {
  // Removing the screenshot container so that it doesn't interfere with the snip
  document.body.removeChild(screenSnipContainer)
  removeExistingSnip()

  captureSnipOcr()
})

// funciton to remove all existing visible screenshot/ ocr/ snip images
function removeExistingSnip() {
  // remove all elements having class 'image-container'
  const imageContainers = document.getElementsByClassName('image-container')
  while (imageContainers.length > 0) {
    imageContainers[0].parentNode.removeChild(imageContainers[0])
  }
}

// Function to capture the snip
function captureSnip() {
  const snipContainer = document.createElement('div')
  snipContainer.id = 'snipContainer'
  snipContainer.style.position = 'absolute'
  snipContainer.style.zIndex = '10000'
  snipContainer.style.top = '0px'
  snipContainer.style.left = '0px'
  snipContainer.style.width = '0px'
  snipContainer.style.height = '0px'
  document.body.appendChild(snipContainer)

  // create a element to over the screen
  const overScreenSnip = document.createElement('div')
  overScreenSnip.id = 'overScreenSnip'
  overScreenSnip.style.position = 'fixed'
  overScreenSnip.style.zIndex = '10000'
  overScreenSnip.style.top = '0px'
  overScreenSnip.style.left = '0px'
  overScreenSnip.style.width = '100vw'
  overScreenSnip.style.height = '100vh'
  overScreenSnip.style.cursor = 'crosshair'
  document.body.appendChild(overScreenSnip)

  let startX
  let startY
  let isDown = false

  overScreenSnip.addEventListener('mousedown', (e) => {
    e.preventDefault()
    startX = e.pageX
    startY = e.pageY
    isDown = true
    snipContainer.style.top = startY + 'px'
    snipContainer.style.left = startX + 'px'
    snipContainer.style.width = '0px'
    snipContainer.style.height = '0px'
    // dashed moving border
    snipContainer.style.border = '1px dashed #000'
    // detect background color and change the boxShadow color accordingly
    snipContainer.style.boxShadow = '0px 0px 10px 0px rgba(255,255,255,0.5)'
    // snipContainer.style.backgroundColor = 'rgba(0,0,0,0.7)'
  })

  overScreenSnip.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const width = e.pageX - startX
    const height = e.pageY - startY
    snipContainer.style.top = Math.min(e.pageY, startY) + 'px'
    snipContainer.style.left = Math.min(e.pageX, startX) + 'px'
    snipContainer.style.width = Math.abs(width) + 'px'
    snipContainer.style.height = Math.abs(height) + 'px'
  })

  overScreenSnip.addEventListener('mouseup', (e) => {
    e.preventDefault()
    isDown = false
    const width = e.pageX - startX
    const height = e.pageY - startY
    snipContainer.style.width = Math.abs(width) + 'px'
    snipContainer.style.height = Math.abs(height) + 'px'

    // send the snip to the background script
    chrome.runtime.sendMessage(
      {
        message: 'snip',
        dim: {
          top: parseInt(snipContainer.style.top) - window.scrollY,
          left: parseInt(snipContainer.style.left) - window.scrollX,
          width: snipContainer.style.width,
          height: snipContainer.style.height,
        },
      },
      function (response) {
        // Removing the elements and the event listeners
        document.body.removeChild(snipContainer)
        document.body.removeChild(overScreenSnip)
      }
    )
  })
}

// Function to capture the ocr
function captureSnipOcr() {
  const ocrContainer = document.createElement('div')
  ocrContainer.id = 'ocrContainer'
  ocrContainer.style.position = 'absolute'
  ocrContainer.style.zIndex = '10000'
  ocrContainer.style.top = '0px'
  ocrContainer.style.left = '0px'
  ocrContainer.style.width = '0px'
  ocrContainer.style.height = '0px'
  document.body.appendChild(ocrContainer)

  // create a element to over the screen
  const overScreenOcr = document.createElement('div')
  overScreenOcr.id = 'overScreenOcr'
  overScreenOcr.style.position = 'fixed'
  overScreenOcr.style.zIndex = '10000'
  overScreenOcr.style.top = '0px'
  overScreenOcr.style.left = '0px'
  overScreenOcr.style.width = '100vw'
  overScreenOcr.style.height = '100vh'
  overScreenOcr.style.cursor = 'crosshair'
  document.body.appendChild(overScreenOcr)

  let startX
  let startY
  let isDown = false

  overScreenOcr.addEventListener('mousedown', (e) => {
    e.preventDefault()
    startX = e.pageX
    startY = e.pageY
    isDown = true
    ocrContainer.style.top = startY + 'px'
    ocrContainer.style.left = startX + 'px'
    ocrContainer.style.width = '0px'
    ocrContainer.style.height = '0px'
    // dashed moving border
    ocrContainer.style.border = '1px dashed #000'
    ocrContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
    // ocrContainer.style.backgroundColor = 'rgba(0,0,0,0.7)'
  })

  overScreenOcr.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    // console.log(e.pageX, e.pageY)
    // console.log(startX, startY)
    const width = e.pageX - startX
    const height = e.pageY - startY
    ocrContainer.style.top = Math.min(e.pageY, startY) + 'px'
    ocrContainer.style.left = Math.min(e.pageX, startX) + 'px'
    ocrContainer.style.width = Math.abs(width) + 'px'
    ocrContainer.style.height = Math.abs(height) + 'px'
  })

  overScreenOcr.addEventListener('mouseup', (e) => {
    e.preventDefault()
    isDown = false
    console.log(`startX: ${startX}, startY: ${startY}`)
    console.log(`endX: ${e.pageX}, endY: ${e.pageY}`)
    document.body.style.cursor = 'default'
    ocrContainer.style.backgroundColor = 'rgba(0,0,0,0)'
    const width = e.pageX - startX
    const height = e.pageY - startY
    ocrContainer.style.width = Math.abs(width) + 'px'
    ocrContainer.style.height = Math.abs(height) + 'px'

    // send the snip to the background script
    chrome.runtime.sendMessage(
      {
        message: 'ocr',
        dim: {
          top: parseInt(ocrContainer.style.top) - window.scrollY,
          left: parseInt(ocrContainer.style.left) - window.scrollX,
          width: ocrContainer.style.width,
          height: ocrContainer.style.height,
        },
      },
      function (response) {
        // Removing the elements and the event listeners
        document.body.removeChild(overScreenOcr)
        document.body.removeChild(ocrContainer)
      }
    )
  })
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === 'screenshot') {
    const screenshotContainer = document.createElement('div')
    screenshotContainer.className = 'image-container'
    screenshotContainer.style.position = 'fixed'
    screenshotContainer.style.bottom = '10px'
    screenshotContainer.style.zIndex = '10000'
    screenshotContainer.style.padding = '20px 10px'
    screenshotContainer.style.right = '10px'
    document.body.appendChild(screenshotContainer)

    var mimeType = request.dataUrl.split(',')[0].split(':')[1].split(';')[0]
    var binaryString = atob(request.dataUrl.split(',')[1])
    var arrayBuffer = new ArrayBuffer(binaryString.length)
    var view = new Uint8Array(arrayBuffer)
    for (var i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i)
    }
    // add image in png formate to clipboard
    navigator.clipboard.write([
      new ClipboardItem({
        'image/png': new Blob([arrayBuffer], { type: mimeType }),
      }),
    ])

    // display the snip in bottom right corner for 3 seconds
    const screenshotPic = document.createElement('img')
    screenshotPic.src = request.dataUrl
    screenshotPic.style.maxHeight = '120px'
    screenshotPic.style.maxWidth = '150px'
    screenshotPic.style.minHeight = '85px'
    screenshotPic.style.minWidth = '85px'
    // screenshotPic.style.width = parseInt(request.dim.width) * dpr
    // screenshotPic.style.height = parseInt(request.dim.height) * dpr
    screenshotPic.style.borderRadius = '5px'
    screenshotPic.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
    screenshotPic.style.zIndex = '10000'
    screenshotContainer.appendChild(screenshotPic)

    // Close button
    const closeBtn = document.createElement('button')
    closeBtn.innerText = 'X'
    closeBtn.style.position = 'absolute'
    closeBtn.style.top = '0px'
    closeBtn.style.right = '0px'
    closeBtn.style.backgroundColor = 'transparent'
    closeBtn.style.border = 'none'
    closeBtn.style.color = 'black'
    closeBtn.style.cursor = 'pointer'
    closeBtn.style.textShadow = '0px 0px 10px rgba(255,255,255,255.75)'
    closeBtn.style.zIndex = '10000'
    screenshotContainer.appendChild(closeBtn)
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(screenshotContainer)
    })
  }

  if (request.message === 'snip') {
    console.log(request.dim, 'request.dataUrl')
    const dpr = devicePixelRatio
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = request.dataUrl
    img.width = parseInt(request.dim.width) * dpr
    img.height = parseInt(request.dim.height) * dpr
    img.onload = () => {
      canvas.width = parseInt(request.dim.width) * dpr
      canvas.height = parseInt(request.dim.height) * dpr
      ctx.drawImage(
        img,
        parseInt(request.dim.left) * dpr,
        parseInt(request.dim.top) * dpr,
        parseInt(request.dim.width) * dpr,
        parseInt(request.dim.height) * dpr,
        0,
        0,
        parseInt(request.dim.width) * dpr,
        parseInt(request.dim.height) * dpr
      )
      const dataUrl = canvas.toDataURL()
      console.log(dataUrl)
      screenSnipContainer.style.width = '120px'
      screenSnipContainer.style.height = '40px'
      screenSnipContainer.style.paddingLeft = '10px'
      screenSnipContainer.style.paddingRight = '10px'
      screenSnipContainer.style.borderRadius = '30px'
      screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
      document.body.appendChild(screenSnipContainer)

      var mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0]
      var binaryString = atob(dataUrl.split(',')[1])
      var arrayBuffer = new ArrayBuffer(binaryString.length)
      var view = new Uint8Array(arrayBuffer)
      for (var i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i)
      }
      // add image in png formate to clipboard
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': new Blob([arrayBuffer], { type: mimeType }),
        }),
      ])

      const snipImageContainer = document.createElement('div')
      snipImageContainer.className = 'image-container'
      snipImageContainer.style.position = 'fixed'
      snipImageContainer.style.bottom = '10px'
      snipImageContainer.style.right = '10px'
      snipImageContainer.style.zIndex = '10000'
      snipImageContainer.style.padding = '20px 10px'
      document.body.appendChild(snipImageContainer)

      // display the snip in bottom right corner for 3 seconds
      const snip = document.createElement('img')
      snip.src = dataUrl
      snip.style.maxHeight = '120px'
      snip.style.maxWidth = '150px'
      snip.style.minHeight = '85px'
      snip.style.minWidth = '85px'
      snip.style.width = parseInt(request.dim.width) * dpr
      snip.style.height = parseInt(request.dim.height) * dpr
      snip.style.borderRadius = '5px'
      snip.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
      snip.style.zIndex = '10000'
      snipImageContainer.appendChild(snip)
      // document.body.appendChild(snip)
      // setTimeout(() => {
      //   document.body.removeChild(snip)
      // }, 3000)

      // Close button
      const closeBtn = document.createElement('button')
      closeBtn.innerText = 'X'
      closeBtn.style.position = 'absolute'
      closeBtn.style.top = '0px'
      closeBtn.style.right = '0px'
      closeBtn.style.zIndex = '10000'
      closeBtn.style.backgroundColor = 'transparent'
      closeBtn.style.border = 'none'
      closeBtn.style.color = 'black'
      closeBtn.style.cursor = 'pointer'
      closeBtn.style.textShadow = '0px 0px 10px rgba(255,255,255,255.75)'

      snipImageContainer.appendChild(closeBtn)
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(snipImageContainer)
      })

      // ask background to save the image
      chrome.runtime.sendMessage({
        message: 'saveImage',
        dataUrl: dataUrl,
        width: parseInt(request.dim.width) * dpr,
        height: parseInt(request.dim.height) * dpr,
      })
    }
  }
  if (request.message === 'ocr') {
    const dpr = devicePixelRatio
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = request.dataUrl
    img.width = parseInt(request.dim.width) * dpr
    img.height = parseInt(request.dim.height) * dpr
    img.onload = () => {
      canvas.width = parseInt(request.dim.width) * dpr
      canvas.height = parseInt(request.dim.height) * dpr
      ctx.drawImage(
        img,
        parseInt(request.dim.left) * dpr,
        parseInt(request.dim.top) * dpr,
        parseInt(request.dim.width) * dpr,
        parseInt(request.dim.height) * dpr,
        0,
        0,
        parseInt(request.dim.width) * dpr,
        parseInt(request.dim.height) * dpr
      )
      const dataUrl = canvas.toDataURL()
      screenSnipContainer.style.width = '120px'
      screenSnipContainer.style.height = '40px'
      screenSnipContainer.style.paddingLeft = '10px'
      screenSnipContainer.style.paddingRight = '10px'
      screenSnipContainer.style.borderRadius = '30px'
      screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
      document.body.appendChild(screenSnipContainer)

      // const ocrTextImageContainer = document.createElement('div')
      // ocrTextImageContainer.className = 'image-container'
      // ocrTextImageContainer.style.position = 'fixed'
      // ocrTextImageContainer.style.bottom = '10px'
      // ocrTextImageContainer.style.right = '10px'
      // ocrTextImageContainer.style.zIndex = '10000'
      // ocrTextImageContainer.style.padding = '20px 10px'
      // document.body.appendChild(ocrTextImageContainer)

      // make a container with header body and footer for ocr text
      const ocrTextContainer = document.createElement('div')
      ocrTextContainer.className = 'ocr-text-container'
      ocrTextContainer.style.position = 'fixed'
      ocrTextContainer.style.bottom = '10px'
      ocrTextContainer.style.right = '10px'
      ocrTextContainer.style.zIndex = '10000'
      ocrTextContainer.innerHTML =
        `
        <style>
          .ocr-text-container {
            width: 600px;
            height: 400px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
            display: flex;
            flex-direction: column;
          }
          .ocr-text-header {
            width: 100%;
            height: 30px;
            background-color: #f1f1f1;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .ocr-text-header-text-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .ocr-text-header-text {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            padding-left: 10px;
          }
          .ocr-text-header-close {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            padding-right: 10px;
            background-color: transparent;
            border: none;
            cursor: pointer;
          }
          .ocr-text-body {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .ocr-text-body-textarea {
            width: 90%;
            height: 90%;
            border: none;
            outline: none;
            resize: none;
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }
          .ocr-text-footer {
            width: 100%;
            height: 30px;
            background-color: #f1f1f1;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            &:not(:last-child) {
              margin-right: 10px; 
            }
          }
          .ocr-text-footer-save {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            background-color: transparent;
            border: none;
            cursor: pointer;                       
          }
          .ocr-text-footer-save:hover {
            color: #fff;
            background-color: #333;
          }
        
      
        </style>

        <div class="ocr-text-header">
          <div class="ocr-text-header-text-container">
            <div class="ocr-text-header-text">
              <img src=` +
        chrome.runtime.getURL('src/icons/tooltip-logo.png') +
        `
                alt="logo" width="20px" height="20px" />
             <span>OCR Text</span>
            </div>
            <button class="ocr-text-header-close">X</button>
          </div>
        </div>
        <div class="ocr-text-body">
          <textarea class="ocr-text-body-textarea" placeholder='Recognizing text...'
           ></textarea>
        </div>
        <div class="ocr-text-footer">
          <button class="ocr-text-footer-save" id="ocr-text-footer-heading">Heading</button>
          <button class="ocr-text-footer-save" id="ocr-text-footer-paragraph">Paragraph</button>
          <button class="ocr-text-footer-save" id="ocr-text-footer-list">List</button>
          <button class="ocr-text-footer-save" id="ocr-text-footer-quote">Quote</button>          
        </div>        
      `

      document.body.appendChild(ocrTextContainer)

      // get textarea class  to change its inner html
      const ocrTextBodyTextarea = document.querySelector(
        '.ocr-text-body-textarea'
      )

      // get close button to close the ocr text container
      const ocrTextHeaderClose = document.querySelector(
        '.ocr-text-header-close'
      )

      // get heading list paragraph quote buttons
      const ocrTextFooterHeading = document.querySelector(
        '#ocr-text-footer-heading'
      )
      const ocrTextFooterParagraph = document.querySelector(
        '#ocr-text-footer-paragraph'
      )
      const ocrTextFooterList = document.querySelector('#ocr-text-footer-list')
      const ocrTextFooterQuote = document.querySelector(
        '#ocr-text-footer-quote'
      )

      // onpress ocrTextFooterHeading send text to background.js
      ocrTextFooterHeading.addEventListener('click', () => {
        // send message to background.js
        chrome.runtime.sendMessage(
          {
            message: 'insert_text',
            style: 'heading',
            text: ocrTextBodyTextarea.value,
          },
          handleResponse
        )

        // remove ocr text container
        document.body.removeChild(ocrTextContainer)
      })

      // onpress ocrTextFooterParagraph send text to background.js
      ocrTextFooterParagraph.addEventListener('click', () => {
        // send message to background.js
        chrome.runtime.sendMessage(
          {
            message: 'insert_text',
            style: 'paragraph',
            text: ocrTextBodyTextarea.value,
          },
          handleResponse
        )
        // remove ocr text container
        document.body.removeChild(ocrTextContainer)
      })

      // onpress ocrTextFooterList send text to background.js
      ocrTextFooterList.addEventListener('click', () => {
        // send message to background.js
        chrome.runtime.sendMessage(
          {
            message: 'insert_text',
            style: 'list',
            text: ocrTextBodyTextarea.value,
          },
          handleResponse
        )
        // remove ocr text container
        document.body.removeChild(ocrTextContainer)
      })

      // const snip = document.createElement('img')
      // snip.src = dataUrl
      // snip.style.maxHeight = '120px'
      // snip.style.maxWidth = '150px'
      // snip.style.width = parseInt(request.dim.width) * dpr
      // snip.style.height = parseInt(request.dim.height) * dpr
      // snip.style.borderRadius = '5px'
      // snip.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
      // snip.style.zIndex = '10000'
      // // make it contain
      // snip.style.objectFit = 'cover'
      // ocrTextImageContainer.appendChild(snip)

      // const textContainer = document.createElement('textarea')
      // textContainer.style.height = '120px'
      // textContainer.style.width = '150px'
      // // textContainer.style.minHeight = '120px'
      // // textContainer.style.maxWidth = '150px'
      // // textContainer.style.maxHeight = '240px'
      // // textContainer.style.maxWidth = '300px'
      // textContainer.style.display = 'block'
      // textContainer.style.borderRadius = '5px'
      // textContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
      // textContainer.style.zIndex = '10000'
      // textContainer.style.backgroundColor = 'white'
      // textContainer.style.padding = '10px'
      // textContainer.style.fontSize = '12px'
      // textContainer.style.fontFamily = 'monospace'
      // textContainer.style.color = 'black'
      // textContainer.innerText = 'Recognizing text...'
      // textContainer.style.overflow = 'auto'
      // ocrTextImageContainer.appendChild(textContainer)

      // Close button
      // const closeBtn = document.createElement('button')
      // closeBtn.innerText = 'X'
      // closeBtn.style.position = 'absolute'
      // closeBtn.style.top = '0px'
      // closeBtn.style.right = '0px'
      // closeBtn.style.zIndex = '10000'
      // closeBtn.style.backgroundColor = 'transparent'
      // closeBtn.style.border = 'none'
      // closeBtn.style.color = 'black'
      // closeBtn.style.cursor = 'pointer'
      // closeBtn.style.textShadow = '0px 0px 10px rgba(255,255,255,255.75)'

      ocrTextHeaderClose.addEventListener('click', () => {
        document.body.removeChild(ocrTextContainer)
      })

      // OCR using tesseract
      Tesseract.recognize(dataUrl, 'eng', {}).then(({ data: { text } }) => {
        // Show the text in the page
        ocrTextBodyTextarea.innerText = text
      })
      // setTimeout(() => {
      //   document.body.removeChild(snip)
      // }, 3000)

      // send the snip to the background script
      // chrome.runtime.sendMessage({
      //   message: 'doOCR',
      //   dim: {
      //     top: snipContainer.style.top,
      //     left: snipContainer.style.left,
      //     width: snipContainer.style.width,
      //     height: snipContainer.style.height,
      //   },
      //   dataUrl: dataUrl,
      // })
    }
  }
})

const shadowRootContainer = document.createElement('div')
shadowRootContainer.id = 'shadowRootContainer'
shadowRootContainer.style.position = 'absolute'
shadowRootContainer.style.zIndex = '-1'
shadowRootContainer.style.top = '0px'
shadowRootContainer.style.left = '0px'

document.body.appendChild(shadowRootContainer)

var host = document.getElementById('shadowRootContainer')
var root = host.attachShadow({ mode: 'open' })
const tooltipContainer = document.createElement('div')
tooltipContainer.id = 'tooltipContainer'
tooltipContainer.className = 'tooltipContainer'
tooltipContainer.innerHTML = `<style>


* {
  font-family: "Poppins", sans-serif;
  outline: none;
  border: none;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:host {
  --color-primary: #0ed095;
  --color-background: #f3f6fd;
  --color-text: #7c7c7c;
  --color-shadow: rgba(0, 0, 0, 0.2);
  --color-logo-shadow1: rgba(0, 0, 0, 0.17);
  --color-logo-shadow2: rgba(0, 0, 0, 0.15);
  --color-logo-shadow3: rgba(0, 0, 0, 0.1);
  --tooltip-buttons-width: 155px;
  --tooltip-logo-width: 40px;
  --gap-width: 12px;
  --padding-right-buffer: 6px;
}

.textTooltip {
  display: inline-flex;
  align-items: center;
  position: relative;
  height: var(--tooltip-logo-width);
  visibility: hidden;
  border-radius: calc(var(--tooltip-logo-width) / 2);
  transition: width cubic-bezier(0, 0.89, 1, 1) 350ms;
}

.appLogo {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  overflow: hidden;
  width: var(--tooltip-logo-width);
  height: 100%;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  box-shadow: var(--color-logo-shadow1) 0px -10px 25px 0px inset,
      var(--color-logo-shadow2) 0px -15px 30px 0px inset,
      var(--color-logo-shadow3) 0px -40px 40px 0px inset;
  background-color: white;
}

.appLogo .iconLogo {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.tooltipButton {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: calc(var(--tooltip-logo-width) / 2);
  gap: var(--gap-width);
  height: 80%;
  width: 0px;
  overflow: hidden;
  border-radius: calc(var(--tooltip-logo-width) / 2);
  box-shadow: var(--color-shadow) 0px 2px 40px;
  background-color: var(--color-background);
  transition: width cubic-bezier(0, 0.89, 1, 1) 350ms;
}

.tooltipButton.expand {
  width: var(--tooltip-buttons-width);
  padding-left: calc(var(--tooltip-logo-width) / 2);
  padding-right: var(--padding-right-buffer);
}

.tooltipButton span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.tooltipButton .button {
  width: 20px;
  height: 30px;
  cursor: pointer;
  fill: var(--color-text);
  transition: transform ease-in-out 100ms;
}

.button:hover {
  fill: var(--color-primary);
  transform: scale(1.1);
}

.imageTooltip {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: var(--tooltip-logo-width);
  height: var(--tooltip-logo-width);
  visibility: hidden;
  border-radius: 50%;
}

.imageTooltip .iconLogo {
  width: 70%;
  height: 70%;
  border-radius: 50%;
}

.imageTooltip span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  z-index: 10002;
  border-radius: 50%;
  cursor: pointer;
  background-color: var(--color-primary);
  transition: opacity 350ms ease-in-out 50ms;
}

.imageTooltip .iconPlus {
  width: 27.5px;
  height: 27.5px;
  fill: var(--color-background);
}

.imageTooltip:hover .iconLogo {
  visibility: hidden;
}

.imageTooltip:hover .appLogo{
  opacity: 0.7;
}

.imageTooltip:hover span {
  visibility: visible;
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  :host {
      --color-background: #1e1e1e;
      --color-text: #eaeaea;
      --color-shadow: rgba(255, 255, 255, 0.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  body {
      scroll-behavior: auto;
  }

  * {
      -webkit-animation: none !important;
      animation: none !important;
      transition: none !important;
  }
}

</style>
<div id="textTooltip" class="textTooltip">
  <div class="appLogo"><img id="iconLogo" class="iconLogo" src="" alt="Logo" title="Simplify Notes"></div>
  <div id="tooltipButton" class="tooltipButton">
      <span title="Heading">
          <svg id="iconHeading" class="button" viewBox="0 0 16 16">
              <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.25V8.728h4.62V13h1.25zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
          </svg>
      </span>
      <span title="Subheading">
          <svg id="iconSubheading" class="button" viewBox="0 0 16 16">
              <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.25V8.728h4.62V13h1.25zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
          </svg>
      </span>
      <span title="Bullet">
          <svg id="iconBullet" class="button" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
      </span>
      <span title="Paragraph">
          <svg id="iconParagraph" class="button" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" />
          </svg>
      </span>
  </div>
</div>
<div id="imageTooltip" class="imageTooltip">
  <div class="appLogo"><img id="iconLogo" class="iconLogo" src="https://source.unsplash.com/random" alt="Logo" title="Simplify Notes"></div>
  <span title="Add Image">
      <svg id="iconPlus" class="iconPlus" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
      </svg>
  </span>
</div>`

root.appendChild(tooltipContainer)

const cssThemeVariables = {
  '--color-background': {
    light: '#f3f6fd',
    dark: '#1e1e1e',
  },
  '--color-text': {
    light: '#7c7c7c',
    dark: '#eaeaea',
  },
  '--color-shadow': {
    light: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(255, 255, 255, 0.2)',
  },
}

const tooltipXoffset = 10
const tooltipYoffset = 10
let payloadText = null
const payloadImage = {
  url: null,
  width: 0,
  height: 0,
}

const shadowElem = document.querySelector('#shadowRootContainer').shadowRoot
const textTooltip = shadowElem.querySelector('#textTooltip')
const imageTooltip = shadowElem.querySelector('#imageTooltip')
const iconLogos = shadowElem.querySelectorAll('.iconLogo')
const iconHeading = shadowElem.querySelector('#iconHeading')
const iconSubheading = shadowElem.querySelector('#iconSubheading')
const iconBullet = shadowElem.querySelector('#iconBullet')
const iconParagraph = shadowElem.querySelector('#iconParagraph')
const iconPlus = shadowElem.querySelector('#iconPlus')
const textTooltipWidth = 40 / 2 + 155
const textTooltipHeight = 40

window.onloadstart = render()

for (const logo of iconLogos) {
  logo.src = chrome.runtime.getURL('images/tooltip-logo.png')
  logo.addEventListener('click', function () {
    window.getSelection().empty() //clear selection - for chrome
    window.open('https://www.simplifynote.com', '_blank')
    shadowElem.querySelector('#tooltipButton').classList.remove('expand')
    setTimeout(() => {
      imageTooltip.style.visibility = 'hidden'
      textTooltip.style.visibility = 'hidden'
      shadowRootContainer.style.zIndex = '-1'
    }, 350)
  })
}

iconHeading.addEventListener('click', function () {
  if (!payloadText) {
    return
  }
  chrome.runtime.sendMessage(
    { message: 'insert_text', style: 'heading', text: payloadText },
    handleResponse
  )
})

iconSubheading.addEventListener('click', function () {
  if (!payloadText) {
    return
  }
  chrome.runtime.sendMessage(
    { message: 'insert_text', style: 'subheading', text: payloadText },
    handleResponse
  )
})

iconBullet.addEventListener('click', function () {
  if (!payloadText) {
    return
  }
  chrome.runtime.sendMessage(
    { message: 'insert_text', style: 'bullet', text: payloadText },
    handleResponse
  )
})

iconParagraph.addEventListener('click', function () {
  if (!payloadText) {
    return
  }
  chrome.runtime.sendMessage(
    { message: 'insert_text', style: 'paragraph', text: payloadText },
    handleResponse
  )
})

iconPlus.addEventListener('click', function () {
  console.log('clicked')
  if (
    !payloadImage ||
    !payloadImage.url ||
    payloadImage.height <= 0 ||
    payloadImage.width <= 0
  ) {
    console.log('jaaa')
    return
  }
  console.log('sending')
  chrome.runtime.sendMessage(
    { message: 'insert_image', imageData: payloadImage },
    handleResponse
  )
})

//Trigger for tooltip
window.addEventListener('mouseup', async function (event) {
  try {
    const tooltipUnchecked = await getTooltipUnchecked()
    const tooltipDisabled = await getTooltipDisabled()

    // return if tooltip is disabled or turned off
    if (tooltipUnchecked || tooltipDisabled) {
      return
    }

    imageTooltip.style.visibility = 'hidden' //hide imageTooltip

    const mouseX = event.pageX
    const mouseY = event.pageY
    const selectedText = getSelectionText().text

    if (selectedText.length > 0) {
      payloadText = selectedText
      shadowRootContainer.style.zIndex = '10001'
      const posX = mouseX + tooltipXoffset
      const posY = mouseY + tooltipYoffset
      const pageWidth = getWidth()
      const pageHeight = getHeight()

      if (posX + textTooltipWidth + tooltipXoffset > pageWidth) {
        textTooltip.style.left =
          pageWidth - tooltipXoffset - textTooltipWidth + 'px' // if tooltip goes outside pageview
      } else {
        textTooltip.style.left = mouseX + tooltipXoffset + 'px'
      }

      if (posY + textTooltipHeight + tooltipYoffset > pageHeight) {
        textTooltip.style.top =
          pageHeight - tooltipYoffset - textTooltipHeight + 'px' // if tooltip goes outside pageview
      } else {
        textTooltip.style.top = mouseY + tooltipYoffset + 'px'
      }

      textTooltip.style.visibility = 'visible'
      shadowElem.querySelector('#tooltipButton').classList.add('expand')
    } else {
      shadowElem.querySelector('#tooltipButton').classList.remove('expand')
      setTimeout(() => {
        textTooltip.style.visibility = 'hidden'
        shadowRootContainer.style.zIndex = '-1'
      }, 350)
    }
  } catch (error) {
    sendNotification('failure', error)
  }
})

let currentLength = 0
//Display Tootip for image
// let insideImage = {};
setInterval(() => {
  const imageCollection = document.getElementsByTagName('img')
  if (imageCollection.length === currentLength) {
    return
  }
  // console.log('laaa');
  // console.log(imageCollection);
  for (let index = currentLength; index < imageCollection.length; index++) {
    // insideImage[index] = false;
    // console.log(index);
    try {
      imageCollection[index].addEventListener(
        'mouseenter',
        async function (event) {
          // if (insideImage[index]) return; // return if already inside image - to avoid flickering issue
          console.log('enter')
          // insideImage[index] = true;
          const tooltipUnchecked = await getTooltipUnchecked()
          const tooltipDisabled = await getTooltipDisabled()

          // return if tooltip is disabled or turned off
          if (tooltipUnchecked || tooltipDisabled) {
            return
          }

          const imgRect = this.getBoundingClientRect()

          // return if image smaller that 80*80
          if (imgRect.height < 80 || imgRect.width < 80) {
            return
          }

          // hide textTooltip
          window.getSelection().empty() //clear selection - for chrome
          shadowElem.querySelector('#tooltipButton').classList.remove('expand')
          setTimeout(() => {
            textTooltip.style.visibility = 'hidden'
          }, 350)

          payloadImage.url = this.src
          payloadImage.width = this.width
          payloadImage.height = this.height
          const mouseX =
            window.scrollX +
            imgRect.left +
            (imgRect.right - imgRect.left) / 2 -
            25
          const mouseY =
            window.scrollY +
            imgRect.top +
            (imgRect.bottom - imgRect.top) / 2 -
            15
          imageTooltip.style.left = mouseX + 'px'
          imageTooltip.style.top = mouseY + 'px'
          shadowRootContainer.style.zIndex = '10001'
          imageTooltip.style.visibility = 'visible'
        }
      )

      imageCollection[index].addEventListener('mouseleave', function (event) {
        let imgRect = this.getBoundingClientRect()
        // console.log(imgRect);
        // console.log(event.clientX);
        // console.log(event.clientY);
        if (
          imgRect.left <= event.clientX &&
          event.clientX <= imgRect.right &&
          imgRect.top <= event.clientY &&
          event.clientY <= imgRect.bottom
        ) {
          return
        }
        console.log('leave')
        // insideImage[index] = false;
        imageTooltip.style.visibility = 'hidden'
        shadowRootContainer.style.zIndex = '-1'
      })
    } catch (error) {
      sendNotification('failure', error)
    }
  }

  currentLength = imageCollection.length
}, 1000)

function getSelectionText() {
  var text = ''
  let selectedRange
  let boundingRect
  let currentSelection = window.getSelection()
  if (currentSelection && currentSelection.rangeCount > 0) {
    text = currentSelection.toString()
    let selectedRange = currentSelection.getRangeAt(0)
    let boundingRect = selectedRange.getBoundingClientRect()
  }
  return { text, boundingRect }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );
    if (key === 'tooltipUnchecked' || key === 'tooltipDisabled') {
      if (newValue === true) {
        imageTooltip.style.visibility = 'hidden' //hide imageTooltip
        screenSnipContainer.style.display = 'none'

        //hide textTooltip
        shadowElem.querySelector('#tooltipButton').classList.remove('expand')
        setTimeout(() => {
          textTooltip.style.visibility = 'hidden'
          shadowRootContainer.style.zIndex = '-1'
        }, 350)
      } else {
        screenSnipContainer.style.display = 'flex'
      }
    } else if (key === 'currentTheme') {
      setTheme(newValue)
    }
  }
})

async function render() {
  try {
    const theme = await getCurrentTheme()
    console.log(theme)
    setTheme(theme)
  } catch (error) {
    console.log(error)
  }
}

function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return
  for (const variable in cssThemeVariables) {
    tooltipContainer.style.setProperty(
      variable,
      cssThemeVariables[variable][theme]
    )
  }
  screenSnipContainer.style.backgroundColor =
    theme === 'light' ? '#fff' : '#000'
  screenSnipContainer.style.color = theme === 'light' ? '#000' : '#fff'
  screenshotButton.style.backgroundImage =
    theme === 'light'
      ? 'url(' + chrome.runtime.getURL('src/icons/screenshot1.png') + ')'
      : 'url(' + chrome.runtime.getURL('src/icons/screenshot.png') + ')'
  snipButton.style.backgroundImage =
    theme === 'light'
      ? 'url(' + chrome.runtime.getURL('src/icons/snip1.png') + ')'
      : 'url(' + chrome.runtime.getURL('src/icons/snip.png') + ')'
  ocrButton.style.backgroundImage =
    theme === 'light'
      ? 'url(' + chrome.runtime.getURL('src/icons/ocr1.png') + ')'
      : 'url(' + chrome.runtime.getURL('src/icons/ocr.png') + ')'
}

function getCurrentTheme() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['currentTheme'], function (result) {
      result.currentTheme ? resolve(result.currentTheme) : resolve(null)
    })
  })
}

function sendNotification(status, error) {
  console.log(status + error)
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  )
}

console.log('Width:  ' + getWidth())
console.log('Height: ' + getHeight())

// setInterval(() => {
//   const imageCollection = document.getElementsByTagName("img");
//   console.log(imageCollection.length);
// }, 1000)
