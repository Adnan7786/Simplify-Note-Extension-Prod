function getTooltipUnchecked() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipUnchecked'], function (result) {
      (result.tooltipUnchecked) ? resolve(result.tooltipUnchecked) : resolve(false);
    });
  });
}

function getTooltipDisabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipDisabled'], function (result) {
      (result.tooltipDisabled) ? resolve(result.tooltipDisabled) : resolve(false);
    });
  });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "toggleTooltip") {
      console.log(request.status);
      alert(request.status)

      sendResponse({
        message: 'successful'
      })
    }
  }
);

// function to handle response
function handleResponse(res) {
  if (res.successful) {
    alert(res.message);
  } else {
    alert(res.message);
  }
}

const tooltipXoffset = 10;
const tooltipYoffset = 10;
let payloadText = null;


const shadowRootContainer = document.createElement('div');
shadowRootContainer.id = 'shadowRootContainer';
shadowRootContainer.style.position = 'absolute';
shadowRootContainer.style.left = window.pageXOffset + "px";
shadowRootContainer.style.top = window.pageYOffset + "px";
shadowRootContainer.style.zIndex = '500';
shadowRootContainer.style.visibility = "hidden";

document.body.appendChild(shadowRootContainer);

var host = document.getElementById('shadowRootContainer');
var root = host.attachShadow({ mode: 'open' });
const textTooltipContainer = document.createElement('div');
textTooltipContainer.id = 'textTooltipContainer';
textTooltipContainer.className = 'textTooltipContainer';
textTooltipContainer.innerHTML = `<style>

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
  --color-background: #fff;
  --color-logo-background: #d3d3d3;
  --color-text: #a9a9a9;
  --color-shadow: rgba(0, 0, 0, 0.2);
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
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
      rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
  background-color: var(--color-logo-background);
}

.appLogo .iconLogo {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background-color: var(--color-background);
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
  fill: darkgrey;
  transition: transform ease-in-out 100ms;
}

.button:hover {
  fill: var(--color-primary);
  transform: scale(1.1);
}

@media (prefers-color-scheme: dark) {
  :host {
      --color-background: #000;
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
              <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
          </svg>
      </span>
      <span title="Subheading">
          <svg id="iconSubheading" class="button" viewBox="0 0 16 16">
              <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
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
</div>`;
root.appendChild(textTooltipContainer);

const shadowElem = document.querySelector('#shadowRootContainer').shadowRoot;
shadowElem.querySelector('#iconLogo').src = chrome.runtime.getURL("images/tooltip-logo.png");

shadowElem.querySelector('#iconHeading').addEventListener("click", function () {
  if (!payloadText) {
    return;
  }
  chrome.runtime.sendMessage(
    { message: "insert_text", style: "heading", text: payloadText },
    handleResponse
  );
});

shadowElem.querySelector('#iconSubheading').addEventListener("click", function () {
  if (!payloadText) {
    return;
  }
  chrome.runtime.sendMessage(
    { message: "insert_text", style: "subheading", text: payloadText },
    handleResponse
  );
});

shadowElem.querySelector('#iconBullet').addEventListener("click", function () {
  if (!payloadText) {
    return;
  }
  chrome.runtime.sendMessage(
    { message: "insert_text", style: "bullet", text: payloadText },
    handleResponse
  );
});

shadowElem.querySelector('#iconParagraph').addEventListener("click", function () {
  if (!payloadText) {
    return;
  }
  chrome.runtime.sendMessage(
    { message: "insert_text", style: "paragraph", text: payloadText },
    handleResponse
  );
});
// this.document
//   .querySelector(".subHeading")
//   .addEventListener("click", function (event) {
//     payload.formatting = "subheading";
//     console.log(payload);
//     chrome.runtime.sendMessage(
//       { message: "insert_text", key: "sub_heading", value: payload.textData },
//       handleResponse
//     );
//     div.style.display = "none";
//   });

// this.document
//   .querySelector(".bullets")
//   .addEventListener("click", function (event) {
//     payload.formatting = "bullets";
//     console.log(payload);
//     chrome.runtime.sendMessage(
//       { message: "insert_text", key: "bullets", value: payload.textData },
//       handleResponse
//     );
//     div.style.display = "none";
//   });

// this.document
//   .querySelector(".paragraph")
//   .addEventListener("click", function (event) {
//     payload.formatting = "paragraph";
//     console.log(payload);
//     chrome.runtime.sendMessage(
//       { message: "insert_text", key: "paragraph", value: payload.textData },
//       handleResponse
//     );
//     div.style.display = "none";
//   });

//Calling the backend API here...



// document
//   .querySelector("#insertHeading")
//   .addEventListener("click", async function () {
//     chrome.runtime.sendMessage(
//       { message: "insertHeading", key: "heading", value: payload.textData },
//       handleResponse
//     );
//   });

// document
//   .querySelector("#insertSubheading")
//   .addEventListener("click", async function () {
//     chrome.runtime.sendMessage(
//       { message: "insertSubheading", key: "subheading", value: payload.textData },
//       handleResponse
//     );
//   });

// document
//   .querySelector("#insertParagraph")
//   .addEventListener("click", async function () {
//     chrome.runtime.sendMessage(
//       { message: "insertParagraph", key: "paragraph", value: payload.textData },
//       handleResponse
//     );
//   });

// document
//   .querySelector("#insertBullet")
//   .addEventListener("click", async function () {
//     chrome.runtime.sendMessage(
//       { message: "insertBullet", key: "bullet", value: payload.textData },
//       handleResponse
//     );
//   });

// var imageData = {
//   url: null,
//   width: 0,
//   height: 0,
// };


// document
//   .querySelector("#insertImage")
//   .addEventListener("click", async function () {
//     imageTooltip.style.display = "none";
//     chrome.runtime.sendMessage(
//       { message: "insertImage", key: "image", value: imageData },
//       handleResponse
//     );
//   });

// document
//   .getElementById("insertHeading")
//   .addEventListener("mouseover", function (event) {
//     event.target.style.backgroundColor = "#4de1ff";
//   });
// document
//   .getElementById("insertHeading")
//   .addEventListener("mouseout", function (event) {
//     event.target.style.backgroundColor = "white";
//   });

// document
//   .getElementById("insertSubheading")
//   .addEventListener("mouseover", function (event) {
//     event.target.style.backgroundColor = "#4de1ff";
//   });
// document
//   .getElementById("insertSubheading")
//   .addEventListener("mouseout", function (event) {
//     event.target.style.backgroundColor = "white";
//   });

// document
//   .getElementById("insertBullet")
//   .addEventListener("mouseover", function (event) {
//     event.target.style.backgroundColor = "#4de1ff";
//   });
// document
//   .getElementById("insertBullet")
//   .addEventListener("mouseout", function (event) {
//     event.target.style.backgroundColor = "white";
//   });

// document
//   .getElementById("insertParagraph")
//   .addEventListener("mouseover", function (event) {
//     event.target.style.backgroundColor = "#4de1ff";
//   });
// document
//   .getElementById("insertParagraph")
//   .addEventListener("mouseout", function (event) {
//     event.target.style.backgroundColor = "white";
//   });

function sendNotification(status, error) {
  console.log(status + error);
}

//Trigger for tooltip
window.addEventListener("mouseup", async function (event) {
  try {
    const tooltipUnchecked = await getTooltipUnchecked();
    const tooltipDisabled = await getTooltipDisabled();

    if (tooltipUnchecked || tooltipDisabled) {
      return;
    }

    const mouseX = event.pageX;
    const mouseY = event.pageY;
    const selectedText = getSelectionText().text;

    if (selectedText.length > 0) {
      payloadText = selectedText;
      shadowRootContainer.style.left = mouseX + tooltipXoffset + "px";
      shadowRootContainer.style.top = mouseY + tooltipYoffset + "px";
      shadowRootContainer.style.visibility = "visible";
      shadowElem.querySelector('#tooltipButton').classList.add('expand');
    } else {
      shadowRootContainer.style.visibility = "hidden";
      shadowElem.querySelector('#tooltipButton').classList.remove('expand');
    }
  } catch (error) {
    sendNotification('failure', error);
  }

});

// this.document
//   .querySelector("#insertImage")
//   .addEventListener("click", function (event) {
//     var currentElement = event.target;
//     var imageSource = currentElement.src;
//     imageTooltip.style.display = "none";
//     chrome.runtime.sendMessage(
//       { message: "insert_image", src: imageSource },
//       handleResponse
//     );
//   });

//Display Tootip for image
// let imageCollection = document.getElementsByTagName("img");
// console.log(imageCollection);
// for (elem in imageCollection) {
//   try {
//     imageCollection[elem].addEventListener("mouseover", function (event) {
//       //add code to show button over image
//       let imgRect = this.getBoundingClientRect();
//       let mouseX =
//         window.scrollX + imgRect.left + (imgRect.right - imgRect.left) / 2 - 25;
//       let mouseY =
//         window.scrollY + imgRect.top + (imgRect.bottom - imgRect.top) / 2 - 15;
//       imageTooltip.style.left = mouseX + "px";
//       imageTooltip.style.top = mouseY + "px";
//       imageTooltip.style.display = "block";
//     });
//   } catch {
//     //do nothing
//   }

//   try {
//     this.addEventListener("mouseout", function (event) {
//       imageTooltip.style.display = "none";
//     });
//   } catch {
//     //do nothing
//   }
// }

//Display Tootip for image
// let imageCollection = document.getElementsByTagName("img");
// // console.log(imageCollection);
// for (elem in imageCollection) {
//   try {
//     imageCollection[elem].addEventListener("mouseenter", async function (event) {
//       const tooltipUnchecked = await getTooltipUnchecked();
//       const tooltipDisabled = await getTooltipDisabled();

//       if (tooltipUnchecked || tooltipDisabled) {
//         return;
//       }
//       //add code to show button over image
//       // imageCollection[elem].appendChild(imageTooltip);
//       isMouseIn = true;
//       imageData.url = this.src;
//       imageData.width = this.width;
//       imageData.height = this.height;
//       let imgRect = this.getBoundingClientRect();
//       // imageXstart = imgRect.left;
//       // imageXend = imgRect.right;
//       // imageYstart = imgRect.top;
//       // imageYend = imgRect.bottom;
//       let mouseX =
//         window.scrollX + imgRect.left + (imgRect.right - imgRect.left) / 2 - 25;
//       let mouseY =
//         window.scrollY + imgRect.top + (imgRect.bottom - imgRect.top) / 2 - 15;
//       imageTooltip.style.left = mouseX + "px";
//       imageTooltip.style.top = mouseY + "px";
//       if (imageTooltip.style.display != "block") {
//         imageTooltip.style.display = "block";
//       }
//       this.addEventListener("mouseleave", function (event) {
//         if (
//           event.pageX < this.getBoundingClientRect().left ||
//           event.pageX > this.getBoundingClientRect().right ||
//           event.pageY < this.getBoundingClientRect().top ||
//           event.pageY > this.getBoundingClientRect().bottom
//         ) {
//           imageTooltip.style.display = "none";
//           isMouseIn = false;
//           imageXstart = imageXend = imageYstart = imageYend = 0;
//           //   console.log("mouseout");
//         }
//       });
//     });
//   } catch {
//     //do nothing
//   }
// }



function getSelectionText() {
  var text = "";
  let selectedRange;
  let boundingRect;
  let currentSelection = window.getSelection();
  if (currentSelection && currentSelection.rangeCount > 0) {
    text = currentSelection.toString();
    let selectedRange = currentSelection.getRangeAt(0);
    let boundingRect = selectedRange.getBoundingClientRect();
  }
  return { text, boundingRect };
}


chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );
    if ((key === 'tooltipUnchecked' || key === 'tooltipDisabled') && newValue === true) {
      div.style.display = "none";
      imageTooltip.style.display = "none";
    }
  }
});
