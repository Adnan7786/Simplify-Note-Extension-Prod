const domain = "https://simpli-notes.herokuapp.com"; //prod
// const domain = "http://localhost:3000" //dev
const userLoggedIn = true;

//Verify & Update User signin status from popup.js
// chrome.runtime.onMessage.addListener(function (request, sender) {
//   if (request.userSignedIn === true) {
//     userLoggedIn = true;
//     sendResponse({ status: "status_received_by_content_script" });
//   } else {
//     userLoggedIn = false;
//     sendResponse({ status: "status_received_by_content_script" });
//   }
//   return true;
// });

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

//function to handle response
function handleResponse(res) {
  if (res.successful) {
    alert(res.message);
  } else {
    alert(res.message);
  }
}

//Payload for backend
let payload = {
  textData: "none",
  formatting: "none",
};

// document.addEventListener(
//   "keyup",
//   (event) => {
//     var name = event.key;
//     var code = event.code;
//     // console.log("mouse up");
//     if (name === "Control") {
//       // Do nothing.
//       return;
//     }
//     if (event.ctrlKey) {
//       if (name == "q" || name == "Q") {
//         chrome.runtime.sendMessage(
//           { message: "update_document" },
//           handleResponse
//         );
//       } else {
//         // console.log("Invalid Command");
//       }
//     } else {
//       //   console.log("Invalid Command");
//     }
//   },
//   false
// );

//Creating the tooltip and event Listeners

var tooltipXoffset = 10; //Tooltip X offset in px
var tooltipYoffset = 10; //Tooltip Y offset in px

var div = document.createElement("div");
document.body.appendChild(div);
div.id = "quickRibbon";
div.className = "quickRibbon";
div.style.cssText = `color:white; background-color:white; width:150px; height:30px; z-index:100; position:absolute; display:none;border-radius:7px; box-shadow: 3px 3px 5px 0 lightgrey`;
div.style.display = "none";
div.style.left = window.pageXOffset + "px";
div.style.top = window.pageYOffset + "px";

var heading = this.document.createElement("div");
this.document.getElementById("quickRibbon").appendChild(heading);
// heading.id = "heading";
heading.id = "insertHeading";
heading.className = "heading";
heading.title = "Heading";

heading.style.cssText = `color:black; background-color:white; width:25%; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAvUlEQVQ4jd3SMUoDQRTG8V80YKOtRS6QuGcQBPEQWqaysEzlBTyAkFzECxhQsLENehTB7KbYVwzjwGYXq3zNMN/3+L83j+HgdYdfLAvZKrLbxDvDPT6xgHEEUxyjKoAuIpvF/RlznMb9JQX10QMabKMBOBoAusYE76mZT1ThEXXSKH/uOs46NXPQOZ4GTPkH9IM37Q5ghEuc9AV94CbzXnHVBcqX3RRqSl4naLD+HfSt/WCbQs0msq89/UPTDg4aHsOi2s1MAAAAAElFTkSuQmCC'); background-repeat : no-repeat; background-position:center; align-items:center; justify-content:center; height:30px; z-index:100; left:0%; top:0%; border-radius:5px 0 0 5px`;

var subHeading = this.document.createElement("div");
this.document.getElementById("quickRibbon").appendChild(subHeading);
// subHeading.id = "subHeading";
subHeading.id = "insertSubheading";
subHeading.className = "subHeading";
subHeading.title = "Sub Heading";

subHeading.style.cssText = `color:black; background-color:white; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAABAklEQVQ4jd3SvUpDQRAF4C+oIAqK2KiNECOilT+ksMub2PgCPoFVHsBnEAXrVKnUysJXEH9ARRvFgKXG4s6F5bIXYpuBYXfOOTs7s7OMrU3E2sYMPhKuhTW8Vs6sYjP2g5TYw7AKRjzEbsRL6AdW+lXgoJMQqZVYJ+LriB9xjs+Iz/6TaCv2v2gGfxjYA0xWDnejpbkK/oQjxRveB7YS63uuopyXraW2je/gD3IV3YRgFvuZBBTT7CmmfIHTXEWNwBo1Fa3jOfAeptIbRp3aBl4C62M6FVdbq7NFXGIZP3jDSXADHDPahyw1db5Tvklb8cHukkQtLOA20cxnqv1KNONof5g4V7lJY6qcAAAAAElFTkSuQmCC'); background-repeat : no-repeat; background-position:center; width:25%; height:30px; z-index:100; left:25%; top:0%; border-radius:0px`;

var bullets = this.document.createElement("div");
this.document.getElementById("quickRibbon").appendChild(bullets);
// bullets.id = "bullets";
bullets.id = "insertBullet";
bullets.className = "bullets";
bullets.title = "Bullets";
bullets.style.cssText = `color:black; background-color:white; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAA6UlEQVQ4jc3TMUoDQRjF8d+GrcW0EYygwcID2IVcw0KvoHZ2Ilh7g9gKnkLxGKJGGw9gmTVaZEbHcYO7YJE/LG/mffDmG+Zblo0i6Aou0E9qzzjGW5vAI3zUfIdNA8qgq0FfcIU9rKMb/H30FmRc46nMzEecYDcERU6xWRMyw2saNAs6Mr+SzN9a0M0XnaC3qLJahZu/AiJFsu5jkOzvzV+uEZ1kXWS1fN+IEaZ+Pv0Uw7YdDX2PQqQMB7QKijrBWtDUf1A/sO84iKem9HDm9/CdY7umkQp3qfFvv8gYO9hIahNcNg1aPj4BHlk1be/56IMAAAAASUVORK5CYII='); background-repeat : no-repeat;background-position:center; width:25%; height:30px; z-index:100; left:50%; top:0%; border-radius:0px`;

var paragraph = this.document.createElement("div");
this.document.getElementById("quickRibbon").appendChild(paragraph);
// paragraph.id = "paragraph";
paragraph.id = "insertParagraph";
paragraph.className = "paragraph";
paragraph.title = "Paragraph";
paragraph.style.cssText = `color:black; background-color:white; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAApElEQVQ4jd3TPQ4BQRjG8Z+PVqnUOANOoFA5gNoRdCKRKFxCJ9G7hULhCgr1NtSrWCsylmU1G//qmXdmnnnmnQxlo5JRa2CCHupv9h4xTgfVYLKJA6Y3ndJHO0O/ZI0zOkE9xjxD3wkTDbHBPu/EPKOsnhUyWmHk+Wq5hK+ywAA7SdOjookidDHD6ZdEcMEyqMXfJirMHxvVPlzXwlbyUR91ibkCwfUXxZWCApIAAAAASUVORK5CYII='); background-repeat : no-repeat; width:25%; background-position:center; height:30px; z-index:100; left:75%; top:0%; border-radius:0 5px 5px 0`;

//Creating tooltip for image
var imageTooltip = document.createElement("div");
document.body.appendChild(imageTooltip);
imageTooltip.id = "insertImage";
imageTooltip.className = "insertImageRibbon";
imageTooltip.title = "Add Image";
imageTooltip.style.cssText = `color:white; background-color:white; background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADrElEQVRoge3aX28VRRgG8B80YnuKcChRY403BrSFRD8AUdBEvZFQ7xFCVDTGK02UC+WDoPg5NGIKBgVBiWlR/AdqTJBgNFEq1KTkeDGznbVpe87ZM2dbDU+yeU9nZ555n87OOzPvLrewurAmI9cIdmIHtuF+3IXheP8vXMVFXMBJfITfM/pQGUPYj2O4iVaX1018gH2Rq3YM4xCulJy6Lgh6E3swjk24LV6bYtkE3sKHuFFqfwWvo1GXiAn8VHLgFA5gQwWuDbHt6RLfj8I/om9o4N1Sh6fxWEb+x/Fpif+oPozOvZiKHVzDQazN3UnkfCn20cIXGM1FvlUY7pYg5sFcxMtgDNOxzx+iDz1hNBK1cBwbeyXsAuuFiNbCz7ivKlFDepwmMZjDuy4xhBPSY1YpRBcTe0q9I7EQTZyPvrzdbeMJaWLXMSfaYRwzgk+7O200LK0TBzM4UYTTXvFy5Lmkw0fskLTQ5QixuYQM4Gzkeq1d5UFcjpV3ZeicfELgicj1izajsl8ajVzIKYS0+u9drtKxWOlAxo5zC3k+8r2/VIURYVt9XbUN4FLILWQjZjEnhGb8ezLvin9/gj8zdpwbfwiP/gAeLQrLQnZEe7xGp6piMtpHioKykPFop2pzpzqmox0rCspCtkT7bW3uVMc30c7vistCNkd7tTZ3qqPwcWSxm38L0WVdB0TdJhm6vdrh9lhvtijoxylvRVAWMhPt+g7areni6qXNUrgj2vlloizkt2jv7oBopVH4OJ/cKwv5Ltqez8c14IFo5yNsWciFaB+uzZ3qeCjar4uCspCPo91ZmzvVUeTTTi52c0TYiN2wujeNTYtsGhfiv7CNfyHyvbdcpX1SOjQXcgs5o4ODVfmomyuvm1PIUzo86sIbsfJZqyv5sFY65r7aSYOGlOt9MYMDuYS8Enku6iLjuEdK0I21qVsHtguv7lp4utvGR2PDaSufMv0y+nKkCkFDSBwXmfiVeMc3JLwwbeFcLz6UXyuckg5fdaApZeIv4Z5eCbdKYs5LZ/t+Yhu+kkRsWb565xiVHrMZIaHcj0PZgBCdiol9ToaRWIghvCOF08+EXGwuPInPS/xH9Hle7haGu+jwDJ5TLbI1hRRose0o1omuQ2xVDAmp/WI7UyQCJnEYzwixf7OQzFgXf2+P9w4LkXC21P6ysGKvyBcQg3hWSCjPlZzq9JoTdrF79fiOMudHNU3po5pxIdLcKSUKruFXfC99VHNCyOXewv8O/wD7dCgM9I88HwAAAABJRU5ErkJggg==');background-repeat : no-repeat; background-position:center; cursor:pointer; width:50px; height:50px; z-index:100; position:absolute; border-radius:25px;`;
imageTooltip.style.display = "none";

// this.document
//   .querySelector(".heading")
//   .addEventListener("click", function (event) {
//     payload.formatting = "heading";
//     console.log(payload);
//     div.style.display = "none";
//     chrome.runtime.sendMessage(
//       { message: "insert_text", key: "heading", value: payload.textData },
//       handleResponse
//     );
//   });

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

var responseArea = document.createElement("div");
document.body.appendChild(responseArea);
responseArea.id = "response";
// responseArea.className = "quickRibbon";
// responseArea.style.cssText = `color:white; background-color:white; width:150px; height:30px; z-index:100; position:absolute; display:none;border-radius:7px; responseArea-shadow: 3px 3px 5px 0 lightgrey`;
// responseArea.style.display = "none";
responseArea.style.left = 0 + "px";
responseArea.style.top = 0 + "px";
responseArea.style.position = "absolute";

var errorArea = document.createElement("div");
document.body.appendChild(errorArea);
errorArea.id = "error";
errorArea.style.left = 0 + "px";
errorArea.style.top = 0 + "px";
errorArea.style.position = "absolute";

document
  .querySelector("#insertHeading")
  .addEventListener("click", async function () {
    chrome.runtime.sendMessage(
      { message: "insertHeading", key: "heading", value: payload.textData },
      handleResponse
    );
  });

document
  .querySelector("#insertSubheading")
  .addEventListener("click", async function () {
    chrome.runtime.sendMessage(
      { message: "insertSubheading", key: "subheading", value: payload.textData },
      handleResponse
    );
  });

document
  .querySelector("#insertParagraph")
  .addEventListener("click", async function () {
    chrome.runtime.sendMessage(
      { message: "insertParagraph", key: "paragraph", value: payload.textData },
      handleResponse
    );
  });

document
  .querySelector("#insertBullet")
  .addEventListener("click", async function () {
    chrome.runtime.sendMessage(
      { message: "insertBullet", key: "bullet", value: payload.textData },
      handleResponse
    );
  });

var imageData = {
  url: null,
  width: 0,
  height: 0,
};


document
  .querySelector("#insertImage")
  .addEventListener("click", async function () {
    imageTooltip.style.display = "none";
    chrome.runtime.sendMessage(
      { message: "insertImage", key: "image", value: imageData },
      handleResponse
    );
  });

document
  .getElementById("insertHeading")
  .addEventListener("mouseover", function (event) {
    event.target.style.backgroundColor = "#4de1ff";
  });
document
  .getElementById("insertHeading")
  .addEventListener("mouseout", function (event) {
    event.target.style.backgroundColor = "white";
  });

document
  .getElementById("insertSubheading")
  .addEventListener("mouseover", function (event) {
    event.target.style.backgroundColor = "#4de1ff";
  });
document
  .getElementById("insertSubheading")
  .addEventListener("mouseout", function (event) {
    event.target.style.backgroundColor = "white";
  });

document
  .getElementById("insertBullet")
  .addEventListener("mouseover", function (event) {
    event.target.style.backgroundColor = "#4de1ff";
  });
document
  .getElementById("insertBullet")
  .addEventListener("mouseout", function (event) {
    event.target.style.backgroundColor = "white";
  });

document
  .getElementById("insertParagraph")
  .addEventListener("mouseover", function (event) {
    event.target.style.backgroundColor = "#4de1ff";
  });
document
  .getElementById("insertParagraph")
  .addEventListener("mouseout", function (event) {
    event.target.style.backgroundColor = "white";
  });

//Trigger for tooltip
window.addEventListener("mouseup", function (event) {
  //  let [tab] = getCurrentTab();
  let mouseX = event.pageX;
  let mouseY = event.pageY;
  let selectedData = getSelectionText();
  let selectedText = selectedData.text;
  let boundingRect = selectedData.boundingRect;

  if (selectedText.length > 0) {
    //display tooltip, get formatting
    //send formatting with selected text

    //Logging the selected text
    // console.log(window);
    // console.log(selectedText);
    // console.log(boundingRect);
    // console.log(mouseX);
    // console.log(mouseY);

    payload.textData = selectedText;

    div.style.left = mouseX + tooltipXoffset + "px";
    div.style.top = mouseY + tooltipYoffset + "px";
    if (userLoggedIn) div.style.display = "flex";
  } else {
    // console.log("Nothing selected.");
    div.style.display = "none";
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
let imageCollection = document.getElementsByTagName("img");
// console.log(imageCollection);
for (elem in imageCollection) {
  try {
    imageCollection[elem].addEventListener("mouseenter", function (event) {
      //add code to show button over image
      // imageCollection[elem].appendChild(imageTooltip);
      isMouseIn = true;
      imageData.url = this.src;
      imageData.width = this.width;
      imageData.height = this.height;
      let imgRect = this.getBoundingClientRect();
      // imageXstart = imgRect.left;
      // imageXend = imgRect.right;
      // imageYstart = imgRect.top;
      // imageYend = imgRect.bottom;
      let mouseX =
        window.scrollX + imgRect.left + (imgRect.right - imgRect.left) / 2 - 25;
      let mouseY =
        window.scrollY + imgRect.top + (imgRect.bottom - imgRect.top) / 2 - 15;
      imageTooltip.style.left = mouseX + "px";
      imageTooltip.style.top = mouseY + "px";
      if (imageTooltip.style.display != "block") {
        imageTooltip.style.display = "block";
      }
      this.addEventListener("mouseleave", function (event) {
        if (
          event.pageX < this.getBoundingClientRect().left ||
          event.pageX > this.getBoundingClientRect().right ||
          event.pageY < this.getBoundingClientRect().top ||
          event.pageY > this.getBoundingClientRect().bottom
        ) {
          imageTooltip.style.display = "none";
          isMouseIn = false;
          imageXstart = imageXend = imageYstart = imageYend = 0;
          //   console.log("mouseout");
        }
      });
    });
  } catch {
    //do nothing
  }
}

//Deprecated Function
// async function getCurrentTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
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
