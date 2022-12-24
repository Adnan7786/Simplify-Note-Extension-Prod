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
screenSnipContainer.style.zIndex = '1000'
screenSnipContainer.style.bottom = '0px'
screenSnipContainer.style.left = '0px'
screenSnipContainer.style.margin = '10px'
screenSnipContainer.style.padding = '6px'
screenSnipContainer.style.display = 'flex'
screenSnipContainer.style.flexDirection = 'column'
screenSnipContainer.style.alignItems = 'center'
screenSnipContainer.style.justifyContent = 'center'
screenSnipContainer.style.width = '40px'
screenSnipContainer.style.height = '120px'
screenSnipContainer.style.backgroundColor = 'white'
screenSnipContainer.style.borderRadius = '10px'
screenSnipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
screenSnipContainer.style.transition = 'all 0.3s ease-in-out'
screenSnipContainer.style.cursor = 'pointer'

// Create a screenshot button
const screenshotButton = document.createElement('button')
screenshotButton.id = 'screenshotButton'
screenshotButton.style.width = '40px'
screenshotButton.style.height = '40px'
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

// Create a snip button
const snipButton = document.createElement('button')
snipButton.id = 'snipButton'
snipButton.style.width = '40px'
snipButton.style.height = '40px'
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

// Create a ocr button
const ocrButton = document.createElement('button')
ocrButton.id = 'ocrButton'
ocrButton.style.width = '40px'
ocrButton.style.height = '40px'
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

document.body.appendChild(screenSnipContainer)
screenSnipContainer.appendChild(screenshotButton)
screenSnipContainer.appendChild(snipButton)
screenSnipContainer.appendChild(ocrButton)

// Add event listeners to the buttons
screenshotButton.addEventListener('click', () => {
  document.body.removeChild(screenSnipContainer)
  setTimeout(() => {
    chrome.runtime.sendMessage(
      { message: 'screenshot' },
      function (response) {}
    )
  }, 300)
  setTimeout(() => {
    document.body.appendChild(screenSnipContainer)
  }, 1500)
})

snipButton.addEventListener('click', (e) => {
  document.body.removeChild(screenSnipContainer)
  captureSnip()
})

ocrButton.addEventListener('click', () => {
  document.body.removeChild(screenSnipContainer)
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
  overScreenSnip.style.position = 'absolute'
  overScreenSnip.style.zIndex = '9999'
  overScreenSnip.style.top = '0px'
  overScreenSnip.style.left = '0px'
  overScreenSnip.style.width = '100%'
  overScreenSnip.style.height = '100%'
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
    snipContainer.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.2)'
    // snipContainer.style.backgroundColor = 'rgba(0,0,0,0.7)'
  })

  overScreenSnip.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    // console.log(e.pageX, e.pageY)
    // console.log(startX, startY)
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
    console.log(`startX: ${startX}, startY: ${startY}`)
    console.log(`endX: ${e.pageX}, endY: ${e.pageY}`)
    document.body.style.cursor = 'default'
    snipContainer.style.backgroundColor = 'rgba(0,0,0,0)'
    const width = e.pageX - startX
    const height = e.pageY - startY
    snipContainer.style.width = Math.abs(width) + 'px'
    snipContainer.style.height = Math.abs(height) + 'px'

    // send the snip to the background script
    chrome.runtime.sendMessage(
      {
        message: 'snip',
        dim: {
          top: snipContainer.style.top,
          left: snipContainer.style.left,
          width: snipContainer.style.width,
          height: snipContainer.style.height,
        },
      },
      function (response) {
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
    overScreenOcr.style.position = 'absolute'
    overScreenOcr.style.zIndex = '9999'
    overScreenOcr.style.top = '0px'
    overScreenOcr.style.left = '0px'
    overScreenOcr.style.width = '100%'
    overScreenOcr.style.height = '100%'
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
          top: ocrContainer.style.top,
          left: ocrContainer.style.left,
          width: ocrContainer.style.width,
          height: ocrContainer.style.height,
        },
      },
      function (response) {
        document.body.removeChild(overScreenOcr)
      }
    )
  })
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
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
      console.log(dataUrl)
      document.body.appendChild(screenSnipContainer)
      document.body.removeChild(snipContainer)

      // display the snip in bottom right corner for 3 seconds
      const snip = document.createElement('img')
      snip.src = dataUrl
      snip.style.position = 'fixed'
      snip.style.bottom = '10px'
      snip.style.right = '10px'
      snip.style.maxHeight = '120px'
      snip.style.maxWidth = '150px'
      snip.style.width = parseInt(request.dim.width) * dpr
      snip.style.height = parseInt(request.dim.height) * dpr
      snip.style.borderRadius = '5px'
      snip.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
      snip.style.zIndex = '10000'
      document.body.appendChild(snip)
      setTimeout(() => {
        document.body.removeChild(snip)
      }, 3000)
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
      document.body.appendChild(screenSnipContainer)

      document.body.removeChild(ocrContainer)

      // console.log('contentjs' + dataUrl)
      // display the snip in bottom right corner for 3 seconds
      const snip = document.createElement('img')
      snip.src = dataUrl
      snip.style.position = 'fixed'
      snip.style.bottom = '10px'
      snip.style.right = '10px'
      snip.style.maxHeight = '120px'
      snip.style.maxWidth = '150px'
      snip.style.width = parseInt(request.dim.width) * dpr
      snip.style.height = parseInt(request.dim.height) * dpr
      snip.style.borderRadius = '5px'
      snip.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)'
      snip.style.zIndex = '10000'
      document.body.appendChild(snip)
      // OCR using tesseract
      Tesseract.recognize(dataUrl, 'eng', {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        console.log(text)
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
  z-index: 2;
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
      shadowRootContainer.style.zIndex = '500'
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
          shadowRootContainer.style.zIndex = '500'
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
    if (
      (key === 'tooltipUnchecked' || key === 'tooltipDisabled') &&
      newValue === true
    ) {
      imageTooltip.style.visibility = 'hidden' //hide imageTooltip

      //hide textTooltip
      shadowElem.querySelector('#tooltipButton').classList.remove('expand')
      setTimeout(() => {
        textTooltip.style.visibility = 'hidden'
        shadowRootContainer.style.zIndex = '-1'
      }, 350)
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
