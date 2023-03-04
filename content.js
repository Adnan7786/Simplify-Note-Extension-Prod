const extensionId = chrome.runtime.id;

function isPDF(url) {
  return url.split('.').pop() === 'pdf'
}

function openPDFinSN(url) {
  if (url.startsWith(`chrome-extension://${extensionId}`)) {
    return;
  }
  chrome.runtime.sendMessage({ message: 'checkFileUrlAccess' })
    .then((isAllowedFileAccess) => {
      if (url.startsWith('file://') && !isAllowedFileAccess) {
        const confirmed = window.confirm('To start using Simplify Notes in local PDF\'s, please allow access to file URLs in extension settings and then refresh pdf tab to continue');
        if (confirmed) chrome.runtime.sendMessage({ message: 'openAccessPage' });
      } else {
        window.location.href =
          chrome.runtime.getURL('src/pdfjs/web/viewer.html') +
          '?file=' +
          url
      }
    })
}

// if url is pdf, open pdf using pdf viewer present in src folder
if (isPDF(window.location.href)) openPDFinSN(window.location.href)

function getTooltipUnchecked() {
  try {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['tooltipUnchecked'])
        .then((result) => {
          result.tooltipUnchecked
            ? resolve(result.tooltipUnchecked)
            : resolve(false)
        })
    })
  } catch (error) {
  }
}

function getTooltipDisabled() {
  try {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['tooltipDisabled'])
        .then((result) => {
          result.tooltipDisabled ? resolve(result.tooltipDisabled) : resolve(false)
        })
    })
  } catch (error) {
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.message === 'toggleTooltip') {
    alert(request.status);
    sendResponse({
      message: 'successful',
    })
  }
})

// function to handle response
function handleResponse(res) {
  sendNotification(res.status, res.message);
}

// Create a container with the three buttons (screenshot, snip, and ocr) at the bottom left of the screen

const containAllSnips = document.createElement('div')
containAllSnips.id = 'containAllSnips'
containAllSnips.style.display = 'flex'
containAllSnips.style.flexDirection = 'column'
containAllSnips.style.alignItems = 'center'
containAllSnips.style.justifyContent = 'center'

const screenSnipContainer = document.createElement('div')
screenSnipContainer.id = 'screenSnipContainer'

// on hover make a box slide in from right with three buttons
screenSnipContainer.innerHTML = `
<style>
#screenSnipContainer {
  box-sizing: border-box;
  position: fixed;
  z-index: 10002;
  bottom: 0px;
  left: 0px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: white;
  color: white;
  border-radius: 30px;
  box-shadow: var(--color-logo-shadow1) 0px -10px 25px 0px inset, var(--color-logo-shadow2) 0px -15px 30px 0px inset, var(--color-logo-shadow3) 0px -40px 40px 0px inset;
  cursor: pointer;
  border-radius: 50%;
  background-image: url(${chrome.runtime.getURL('src/icons/tooltip-logo.png')});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  outline: none;
  margin: 5px;
  cursor: pointer;
  background-size: 32px 32px !important;
}    
</style>
`

const sliderContainer = document.createElement('div')
sliderContainer.id = 'sliderContainer'
sliderContainer.innerHTML = `
<style>
#sliderContainer {
  box-sizing: border-box;
  position: fixed;
  z-index: 10000;
  bottom: 0px;
  left: 20px;
  margin: 10px;
  padding: 6px;
  padding-left: 20px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 0px;
  height: 35px;
  background-color: black;
  color: white;
  border-radius: 0px 30px 30px 0px;
  box-shadow: 0px 0px 10px 0px rgba(255,255,255,1);
  transition: width 0.3s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  visibility: hidden;
}
</style>
`

// when button is pressed it will mkae the screenSnipContainer to be draggable and chage the position of the screenSnipContainer with the mouse position
screenSnipContainer.addEventListener('pointerdown', () => {
  // now make the screenSnipContainer to be draggable
  screenSnipContainer.draggable = true
  screenSnipContainer.style.cursor = 'grabbing'

  // now change the position of the screenSnipContainer with the mouse position
  screenSnipContainer.addEventListener('dragstart', (e) => {
    sliderContainer.style.visibility = 'hidden'
    sliderContainer.style.width = '0px'
    sliderContainer.style.transition = 'all 0.3s ease-in-out'
    snipButton.style.display = 'none'
    ocrButton.style.display = 'none'
    screenshotButton.style.display = 'none'
    screenSnipContainer.style.cursor = 'grabbing'
  })

  screenSnipContainer.addEventListener('dragend', (e) => {
    screenSnipContainer.style.cursor = 'grab'

    // the position of the screenSnipContainer should not go out of the screen
    screenSnipContainer.style.top = e.clientY + 'px'
    sliderContainer.style.top = e.clientY + 'px'
    if (e.clientY < 0) {
      screenSnipContainer.style.top = '10px'
      sliderContainer.style.top = '10px'
    }
    if (e.clientY > window.innerHeight - 80) {
      screenSnipContainer.style.top = window.innerHeight - 80 + 'px'
      sliderContainer.style.top = window.innerHeight - 80 + 'px'
    }
  })
})

screenSnipContainer.addEventListener('pointerup', () => {
  screenSnipContainer.draggable = false
  // sliderContainer.style.display = 'flex'

  screenSnipContainer.style.cursor = 'grab'
})

// Create a screenshot button
const screenshotButton = document.createElement('button')
screenshotButton.id = 'screenshotButton'
screenshotButton.innerHTML = `
<style>
#screenshotButton {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  background-image: url(${chrome.runtime.getURL('src/icons/screenshot.png')});
  background-size: 24px 24px !important;
  padding: 5px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
`

// Create a snip button
const snipButton = document.createElement('button')
snipButton.id = 'snipButton'
snipButton.innerHTML = `
<style>
#snipButton {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  background-image: url(${chrome.runtime.getURL('src/icons/snip.png')});
  background-size: 24px 24px !important;
  padding: 5px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
`
// Create a ocr button
const ocrButton = document.createElement('button')
ocrButton.id = 'ocrButton'
ocrButton.innerHTML = `
<style>
#ocrButton {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  background-image: url(${chrome.runtime.getURL('src/icons/ocr.png')});
  background-size: 24px 24px !important;
  padding: 5px;
  background-repeat: no-repeat;
  background-position: center;}
</style>
`

// show some animation on hover of snip button
snipButton.addEventListener('pointerenter', () => {
  snipButton.style.transform = 'scale(1.2)'
  snipButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

snipButton.addEventListener('pointerleave', () => {
  snipButton.style.transform = 'scale(1.0)'
  snipButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

// show some animation on hover of screenshot button
screenshotButton.addEventListener('pointerenter', () => {
  screenshotButton.style.transform = 'scale(1.2)'
  screenshotButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

screenshotButton.addEventListener('pointerleave', () => {
  screenshotButton.style.transform = 'scale(1.0)'
  screenshotButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

// show some animation on hover of snip button
ocrButton.addEventListener('pointerenter', () => {
  ocrButton.style.transform = 'scale(1.2)'
  ocrButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

ocrButton.addEventListener('pointerleave', () => {
  ocrButton.style.transform = 'scale(1.0)'
  ocrButton.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
})

containAllSnips.appendChild(screenSnipContainer)
containAllSnips.appendChild(sliderContainer)

sliderContainer.appendChild(screenshotButton)
sliderContainer.appendChild(snipButton)

website_link = window.location.href
if (!website_link.includes('.pdf')) {
  sliderContainer.appendChild(ocrButton)
}

containAllSnips.addEventListener('pointerenter', () => {
  sliderContainer.style.visibility = 'visible'
  sliderContainer.style.display = 'flex'
  sliderContainer.style.width = '130px'
  snipButton.style.display = 'block'
  ocrButton.style.display = 'block'
  screenshotButton.style.display = 'block'
  sliderContainer.style.transition = 'width 0.5s ease-in-out'
})

containAllSnips.addEventListener('pointerleave', () => {
  sliderContainer.style.visibility = 'hidden'
  sliderContainer.style.width = '0px'
  sliderContainer.style.transition = 'width 0.3s ease-in-out'
  snipButton.style.display = 'none'
  ocrButton.style.display = 'none'
  screenshotButton.style.display = 'none'
})

// Add event listeners to the buttons
screenshotButton.addEventListener('click', () => {
  containAllSnips.style.display = 'none'
  screenSnipContainer.style.display = 'none'
  setTimeout(() => {
    chrome.runtime.sendMessage(
      {
        message: 'screenshot',
        height: window.innerHeight,
        width: window.innerWidth,
      },
      handleResponse
    )
  }, 300)
  setTimeout(() => {
    containAllSnips.style.display = 'block'
    screenSnipContainer.style.display = 'block'
  }, 1000)
})

snipButton.addEventListener('click', (e) => {
  sliderContainer.style.visibility = 'hidden'
  containAllSnips.style.visibility = 'hidden'
  screenSnipContainer.style.visibility = 'hidden'
  captureSnip()
})

ocrButton.addEventListener('click', () => {
  sliderContainer.style.visibility = 'hidden'
  containAllSnips.style.visibility = 'hidden'
  screenSnipContainer.style.visibility = 'hidden'
  captureSnipOcr()
})

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

  overScreenSnip.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    startX = e.pageX
    startY = e.pageY
    isDown = true
    snipContainer.style.top = startY + 'px'
    snipContainer.style.left = startX + 'px'
    snipContainer.style.width = '0px'
    snipContainer.style.height = '0px'
    snipContainer.style.border = '1px dashed #000'
    snipContainer.style.boxShadow = '0px 0px 10px 0px rgba(255,255,255,0.5)'
  })

  overScreenSnip.addEventListener('pointermove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const width = e.pageX - startX
    const height = e.pageY - startY
    snipContainer.style.top = Math.min(e.pageY, startY) + 'px'
    snipContainer.style.left = Math.min(e.pageX, startX) + 'px'
    snipContainer.style.width = Math.abs(width) + 'px'
    snipContainer.style.height = Math.abs(height) + 'px'

    if (Math.abs(width) < 10 || Math.abs(height) < 10) {
      snipContainer.style.backgroundColor = 'rgba(255,0,0,0.15)'
    } else {
      snipContainer.style.backgroundColor = 'rgb(178,241,212,0.15)'
    }
  })

  overScreenSnip.addEventListener('pointerup', (e) => {
    e.preventDefault()
    isDown = false
    document.body.style.cursor = 'default'
    const width = e.pageX - startX
    const height = e.pageY - startY
    snipContainer.style.width = Math.abs(width) + 'px'
    snipContainer.style.height = Math.abs(height) + 'px'
    snipContainer.style.visibility = 'hidden'

    // if the snip is too small, remove it
    if (Math.abs(width) < 10 || Math.abs(height) < 10) {
      document.body.removeChild(snipContainer)
      document.body.removeChild(overScreenSnip)
      containAllSnips.style.visibility = 'visible'
      screenSnipContainer.style.visibility = 'visible'
    } else {
      document.body.removeChild(snipContainer)
      document.body.removeChild(overScreenSnip)
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
        }
      )
    }
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

  overScreenOcr.addEventListener('pointerdown', (e) => {
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
    ocrContainer.style.boxShadow = '0px 0px 10px 0px rgba(255,255,255,0.5)'
    // ocrContainer.style.backgroundColor = 'rgba(0,0,0,0.7)'
  })

  overScreenOcr.addEventListener('pointermove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const width = e.pageX - startX
    const height = e.pageY - startY
    ocrContainer.style.top = Math.min(e.pageY, startY) + 'px'
    ocrContainer.style.left = Math.min(e.pageX, startX) + 'px'
    ocrContainer.style.width = Math.abs(width) + 'px'
    ocrContainer.style.height = Math.abs(height) + 'px'

    // if the snip is too small, remove it
    if (Math.abs(width) < 10 || Math.abs(height) < 10) {
      ocrContainer.style.backgroundColor = 'rgba(255,0,0,0.15)'
    } else {
      ocrContainer.style.backgroundColor = 'rgb(178,241,212,0.15)'
    }
  })

  overScreenOcr.addEventListener('pointerup', (e) => {
    e.preventDefault()
    isDown = false
    document.body.style.cursor = 'default'
    ocrContainer.style.backgroundColor = 'rgba(0,0,0,0)'
    const width = e.pageX - startX
    const height = e.pageY - startY
    ocrContainer.style.width = Math.abs(width) + 'px'
    ocrContainer.style.height = Math.abs(height) + 'px'
    ocrContainer.style.visibility = 'hidden'
    // if the snip is too small, remove it
    if (Math.abs(width) < 10 || Math.abs(height) < 10) {
      document.body.removeChild(overScreenOcr)
      document.body.removeChild(ocrContainer)
      containAllSnips.style.visibility = 'visible'
      screenSnipContainer.style.visibility = 'visible'
    } else {
      document.body.removeChild(overScreenOcr)
      document.body.removeChild(ocrContainer)
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
          // document.body.removeChild(overScreenOcr)
          // document.body.removeChild(ocrContainer)
        }
      )
    }
  })
}

// make a container with header body and footer for ocr text
const ocrTextContainer = document.createElement('div')
ocrTextContainer.className = 'ocr-text-container'
ocrTextContainer.style.position = 'fixed'
ocrTextContainer.style.bottom = '10px'
ocrTextContainer.style.right = '10px'
ocrTextContainer.style.zIndex = '10000'
ocrTextContainer.style.visibility = 'hidden'
ocrTextContainer.innerHTML = `<style>

    :host{
      --color-primary: #0ed095;
      --color-bgr-main: #f3f6fd;
      --color-bgr-secondary: #fff;
      --color-font: rgb(69 69 69);
    }
    .ocr-text-container {
      width: 600px;
      height: 400px;
      background-color: var(--color-bgr-secondary);
      border-radius: 5px;
      box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 75%);
      display: flex;
      flex-direction: column;
      gap: 13px;
    }
    .ocr-text-header {
      width: 100%;
      height: 50px;
      background-color: var(--color-bgr-main);
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
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-primary);
      padding-left: 10px;
    }
    .ocr-text-header-close {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-font);
      padding-right: 10px;
      margin-right: 10px;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .ocr-text-header-close:hover {
      color: #f00;
    }
    .ocr-text-body {
      width: 100%;
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-bgr-secondary);
    }
    .ocr-text-body-textarea {
      width: 93%;
      height: 100%;
      border: none;
      outline: none;
      resize: none;
      font-size: 14px;
      font-weight: 400;
      color: var(--color-font);
      padding: 15px;
      box-sizing: border-box;
      border-radius: 10px;
      background-color: var(--color-bgr-main);
    }
    .ocr-text-footer {
      width: 100%;
      height: 50px;
      background-color: var(--color-bgr-secondary);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      display: flex;
      align-items: flex-start;
      justify-content: space-evenly;
      gap: 12px;
    }
    .ocr-text-footer-save {
      width: 115px;
      height: 30px;
      font-size: 12px;
      color: var(--color-font);
      background-color: var(--color-bgr-main);
      border: none;
      cursor: pointer;
      border-radius: 3px;
      transition: color 350ms ease-in-out;
    }
    .ocr-text-footer-save:hover {
      color: var(--color-primary);  
    }
  

  </style>

  <div class="ocr-text-header">
    <div class="ocr-text-header-text-container">
      <div class="ocr-text-header-text">
        <img src=` +
  chrome.runtime.getURL('src/icons/tooltip-logo.png') +
  `
          alt="logo" width="50px" height="50px" />
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
    <button class="ocr-text-footer-save" id="ocr-text-footer-quote">Subheading</button>          
    <button class="ocr-text-footer-save" id="ocr-text-footer-list">Bullet</button>
    <button class="ocr-text-footer-save" id="ocr-text-footer-paragraph">Paragraph</button>
   
  </div>        
`
document.body.appendChild(ocrTextContainer);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === 'screenshot') {
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
  }

  if (request.message === 'snip') {
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
      containAllSnips.style.visibility = 'visible'
      screenSnipContainer.style.visibility = 'visible'

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

      // ask background to save the image
      chrome.runtime.sendMessage(
        {
          message: 'insert_image',
          imageData: {
            url: dataUrl,
            width: parseInt(request.dim.width) * dpr,
            height: parseInt(request.dim.height) * dpr,
          }
        },
        handleResponse
      )
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

      containAllSnips.style.visibility = 'visible'
      screenSnipContainer.style.visibility = 'visible'

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
        ocrTextContainer.style.visibility = 'hidden';
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
        ocrTextContainer.style.visibility = 'hidden';
      })

      // onpress ocrTextFooterList send text to background.js
      ocrTextFooterList.addEventListener('click', () => {
        // send message to background.js
        chrome.runtime.sendMessage(
          {
            message: 'insert_text',
            style: 'bullet',
            text: ocrTextBodyTextarea.value,
          },
          handleResponse
        )
        ocrTextContainer.style.visibility = 'hidden'
      })

      // onpress ocrTextFooterQuote send text to background.js
      ocrTextFooterQuote.addEventListener('click', () => {
        // send message to background.js
        chrome.runtime.sendMessage(
          {
            message: 'insert_text',
            style: 'subheading',
            text: ocrTextBodyTextarea.value,
          },
          handleResponse
        )
        ocrTextContainer.style.visibility = 'hidden'
      })

      ocrTextHeaderClose.addEventListener('click', () => {
        ocrTextContainer.style.visibility = 'hidden';
      })
      ocrTextBodyTextarea.innerHTML = '';
      ocrTextBodyTextarea.placeholder = 'Recognizing text...';
      ocrTextContainer.style.visibility = 'visible';
      // OCR using tesseract
      try {
        let isOcrDone = false
        setTimeout(() => {
          if (!isOcrDone) {
            ocrTextBodyTextarea.placeholder = 'Taking longer than expected...'
          }
        }, 5000)

        Tesseract.recognize(dataUrl, 'eng', {})
          .then(({ data: { text } }) => {
            isOcrDone = true
            ocrTextBodyTextarea.innerHTML = text
          })
          .catch((error) => {
            ocrTextBodyTextarea.innerHTML = 'Error in recognizing text'
            ocrTextBodyTextarea.style.color = 'red'
          })
      } catch (error) {
        ocrTextBodyTextarea.innerHTML = 'Error in recognizing text'
        ocrTextBodyTextarea.style.color = 'red'
      }
    }
  }
})

const shadowRootContainer = document.createElement('div')
shadowRootContainer.id = 'shadowRootContainer'
shadowRootContainer.style.position = 'absolute'
shadowRootContainer.style.zIndex = '10001'
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

const notificationContainer = document.createElement('div')
notificationContainer.id = 'notificationContainer'
notificationContainer.className = 'notificationContainer'
notificationContainer.style.visibility = 'hidden'
notificationContainer.innerHTML = `<style>

.notification {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 240px;
  position: fixed;
  bottom: 8px;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 400;
  text-size-adjust: none;
  padding-left: var(--beforeWidth);
  background-color: var(--color-background);
  box-shadow: var(--color-shadow) 0px 2px 40px;
  transition: left 350ms ease-in-out;
}

.notification::before {
  content: '';
  position: absolute;
  left: -7px;
  height: 100%;
  width: 7px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.notification[data-status="failure"]::before {
  background-color: red;
}

.notification[data-status="success"]::before {
  background-color: #0ed095;
}
</style>
<div id="notification" class="notification">`

root.appendChild(notificationContainer);
root.appendChild(containAllSnips)

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
const notificationDiv = shadowElem.querySelector('#notification')

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
  if (
    !payloadImage ||
    !payloadImage.url ||
    payloadImage.height <= 0 ||
    payloadImage.width <= 0
  ) {
    return
  }
  chrome.runtime.sendMessage(
    { message: 'insert_image', imageData: payloadImage },
    handleResponse
  )
})


// document.addEventListener("selectionchange", function (e) {
//   //do something, e.g. document.getSelection()        
//   console.log("selectionchange")
//   console.log(getSelectionText().text);
// });


//Trigger for tooltip
window.addEventListener('pointerup', async function (event) {
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
      }, 350)
    }
  } catch (error) {
    sendNotification('failure', error.message)
  }
})

let currentLength = 0
//Display Tootip for image
setInterval(() => {
  const imageCollection = document.getElementsByTagName('img')
  if (imageCollection.length === currentLength) {
    return
  }
  for (let index = currentLength; index < imageCollection.length; index++) {
    try {
      imageCollection[index].addEventListener(
        'pointerenter',
        async function (event) {
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
          imageTooltip.style.visibility = 'visible'
        }
      )

      imageCollection[index].addEventListener('pointerleave', function (event) {
        let imgRect = this.getBoundingClientRect()
        if (
          imgRect.left <= event.clientX &&
          event.clientX <= imgRect.right &&
          imgRect.top <= event.clientY &&
          event.clientY <= imgRect.bottom
        ) {
          return
        }
        // insideImage[index] = false;
        imageTooltip.style.visibility = 'hidden'
      })
    } catch (error) {
      sendNotification('failure', error.message)
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
    if (key === 'tooltipUnchecked' || key === 'tooltipDisabled') {
      if (newValue === true) {
        imageTooltip.style.visibility = 'hidden' //hide imageTooltip
        screenSnipContainer.style.display = 'none'

        //hide textTooltip
        shadowElem.querySelector('#tooltipButton').classList.remove('expand')
        setTimeout(() => {
          textTooltip.style.visibility = 'hidden'
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
    setTheme(theme)
  } catch (error) {
  }
}

function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  for (const variable in cssThemeVariables) {
    tooltipContainer.style.setProperty(
      variable,
      cssThemeVariables[variable][theme]
    )
    notificationContainer.style.setProperty(
      variable,
      cssThemeVariables[variable][theme]
    )
  }

  const clrPrimary = '#0ed095';
  const clrBgrMain = (theme === 'light') ? '#f3f6fd' : '#1e1e1e';
  const clrBgrSec = (theme === 'light') ? '#fff' : '#000';
  const clrFont = (theme === 'light') ? 'rgb(69 69 69)' : 'rgb(165 165 165)';

  ocrTextContainer.style.setProperty('--color-primary', clrPrimary);
  ocrTextContainer.style.setProperty('--color-bgr-main', clrBgrMain);
  ocrTextContainer.style.setProperty('--color-bgr-secondary', clrBgrSec);
  ocrTextContainer.style.setProperty('--color-font', clrFont);
}

function getCurrentTheme() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['currentTheme'], function (result) {
      result.currentTheme ? resolve(result.currentTheme) : resolve(null)
    })
  })
}

let errorCount = 0
function sendNotification(status, message) {
  if (status === 'failure' && message === 'Extension context invalidated.') {
    if (errorCount % 2 === 0) {
      errorCount += 1;
      return;
    }
    errorCount += 1;
    message = 'Please reload tab to continue'
  }
  notificationDiv.dataset.status = status;
  notificationDiv.innerText = message;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  notificationDiv.style.left = vw + 7 + 'px';
  notificationDiv.style.top = vh - 30 - 20 + 'px';
  setTimeout(() => {
    notificationContainer.style.visibility = 'visible';
    notificationDiv.style.left = vw - 240 + 'px';
  }, 360)
  setTimeout(() => {
    notificationDiv.style.left = vw + 7 + 'px';
    setTimeout(() => {
      notificationContainer.style.visibility = 'hidden';
    }, 360)
  }, 4000)
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