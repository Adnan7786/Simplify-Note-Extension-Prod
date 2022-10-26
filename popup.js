const domain = "https://simpli-notes.herokuapp.com"; //prod
// const domain = "http://localhost:3000" //dev
const companyWebsite = "https://dummy_website.com/"; //Place official website link here

const responseArea = document.querySelector("#response");
const errorArea = document.querySelector("#error");
const dropDownUserName = document.getElementById("dropdownUserName");
const dropDownUserSpan = document.getElementById("dropdownUserSpan");
let parentId = "";

var isAdderActive = false;
var isAppenderActive = false;

const CookieDetails = {
  name: "token",
  url: domain,
};

document.getElementById("newdocadder").addEventListener("click", function () {
  formToggler();
});

document.getElementById("docappender").addEventListener("click", function () {
  formTogglersec();
});

var forms = document.getElementsByClassName("forminput");

function handleForm(event) {
  event.preventDefault();
}

for (var i = 0; i < forms.length; i++) {
  forms[i].addEventListener("submit", handleForm, false);
}

const docAddToggler = document.querySelector(".menu.adder");
const docAppendToggler = document.querySelector(".menu.appender");
// const logOutButton = document.querySelector("#logOutButton");

function formToggler() {
  // console.log("Form Toggler");
  if (!isAdderActive) {
    docAddToggler.classList.toggle("active");
    isAdderActive = true;
  } else {
    docAddToggler.classList.toggle("active");
    isAdderActive = false;
  }
  if (isAppenderActive) {
    docAppendToggler.classList.toggle("active");
    isAppenderActive = false;
  }
}

function formTogglersec() {
  if (!isAppenderActive) {
    docAppendToggler.classList.toggle("active");
    isAppenderActive = true;
  } else {
    docAppendToggler.classList.toggle("active");
    isAppenderActive = false;
  }
  if (isAdderActive) {
    docAddToggler.classList.toggle("active");
    isAdderActive = false;
  }
}

document
  .querySelector(".avatarPanelInner")
  .addEventListener("click", function () {
    const dropDownMenu = document.querySelector(".drop");
    dropDownMenu.classList.toggle("active");
  });

document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("brandHyperlink");
  link.onclick = function () {
    chrome.tabs.create({ active: true, url: companyWebsite });
  };
});

// var isLogoutShown = false;

// document.querySelector("#avatar").addEventListener("click", function () {
//   if (isLogoutShown) {
//     logOutButton.style.display = "none";
//     isLogoutShown = false;
//   } else {
//     logOutButton.style.display = "block";
//     isLogoutShown = true;
//   }
// });

// document
// .querySelector(".logOutButton")
// .addEventListener("mouseleave", function () {
//   logOutButton.style.display = "none";
//   isLogoutShown = false;
// });

// function displayLogoutButton() {
//   console.log("Logout shown");
//   logOutButton.style.display = "block";
// }

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

var documentNameList = [];
var documentList = [];

const populateDocumentList = (inputArray) => {
  //Loop over
  console.log("Document List");
  Object.keys(inputArray).forEach((keyp) => {
    console.log(`key : ${keyp}, value: ${inputArray[keyp].name}`);
    documentList.push({ key: inputArray[keyp].name, value: keyp });
    documentNameList.push(inputArray[keyp].name);
  });
  // console.log(documentList);
  // console.log(documentNameList);

  // for (const obj of inputArray) {
  //   var docInfo = copy(obj);
  //   documentList.push({});
  //   documentNameList.push();
  // }
};

const getDocumentIndex = (documentName) => {
  for (let i = 0; i < documentName.length; i++) {
    if (documentList[i].key === documentName) {
      return i;
    }
  }
};

autocomplete(document.getElementById("documentID"), documentNameList);

var input = document.querySelector("#createDocumentDiv");
var docName = document.querySelector("#documentName");
var button = document.querySelector("#createDocument");
button.addEventListener("click", function (e) {
  e.preventDefault();
  input.classList.toggle("active");
});
docName.addEventListener("focus", function () {
  input.classList.add("focus");
});
docName.addEventListener("blur", function () {
  docName.value.length != 0
    ? input.classList.add("focus")
    : input.classList.remove("focus");
});

//
//
//

async function reRender() {
  chrome.cookies.get(CookieDetails, (cookie) => {
    console.log("reRender Called");

    if (!cookie) {
      document.querySelector("#logIn").style.display = "block";
      document.querySelector("#loggedInComponent").style.display = "none";
      document.querySelector(".avatarPanel").style.display = "none";
    } else {
      console.log("Cookie found");

      document.querySelector("#logIn").style.display = "none";
      document.querySelector(".avatarPanel").style.display = "block";
      //Send response to content.js
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //   chrome.tabs.sendMessage(
      //     tabs[0].id,
      //     { userSignedIn: true },
      //     function (response) {
      //       console.log(response.status); //Maybe log??
      //     }
      //   );
      // });
      responseArea.innerHTML = "";
      errorArea.innerHTML = "";

      fetch(`${domain}/api/v1/dashboard/folder-tree`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          res
            .json()
            .then((res) => {
              console.log(res);
              parentId = res.root;
              console.log("res.root");
              console.log(parentId);
              populateDocumentList(res.folderStructure.document);
              console.log(res.folderStructure.document);
            })
            .catch(
              (error) =>
                (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
            );
        })
        .catch(
          (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
        );

      fetch(`${domain}/api/v1/users/showMe`, {})
        .then((res) => {
          res
            .json()
            .then((res) => {
              const avatar = document.querySelector("#avatar");
              const greetUser = document.querySelector("#greetUser");
              const loggedInComponent =
                document.querySelector("#loggedInComponent");
              const clippedUserName =
                res.user.name.substring(0, 8).trim() + "... ";
              avatar.src = res.user.image;
              dropDownUserName.innerHTML = `${res.user.name}`;
              // dropDownUserSpan.innerHTML = `${res.user.currentPlan}`;  //User payment Plan {basic, premium, elite etc...}
              // greetUser.innerHTML = `Hi ${res.user.name}`;
              greetUser.innerHTML = `Hi ${clippedUserName}`;
              loggedInComponent.style.display = "block";
            })
            .catch(
              (error) =>
                (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
            );
        })
        .catch(
          (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
        );
    }
  });
}

document.getElementById("logInLink").href = `${domain}/auth/login.html`;
window.onload = reRender;

document
  .querySelector("#logOutButton")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    fetch(`${domain}/api/v1/auth/logout`, {})
      .then((res) => {
        res
          .json()
          .then(async (res) => {
            //Send response to content.js
            // chrome.tabs.query(
            //   { active: true, currentWindow: true },
            //   function (tabs) {
            //     chrome.tabs.sendMessage(
            //       tabs[0].id,
            //       { userSignedIn: false },
            //       function (response) {
            //         console.log(response.status); //Maybe log??
            //       }
            //     );
            //   }
            // );
            await reRender();
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });

document
  .querySelector("#createDocument")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    console.log(document.querySelector("#documentName").value);
    if (document.querySelector("#documentName").value.length > 0) {
      fetch(`${domain}/api/v1/dashboard/document`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: document.querySelector("#documentName").value,
          // parentFolderId: "",
          // parentFolderId: "25482de4-78b4-4f70-9b68-61a5922c1a8b",
          // parentFolderId: "10977cdf-6daa-4881-9811-88d4b3acb36e",
          parentFolderId: parentId,
        }),
      })
        .then((res) => {
          res
            .json()
            .then((res) => {
              responseArea.innerHTML = JSON.stringify(res, undefined, 2);
            })
            .catch(
              (error) =>
                (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
            );
        })
        .catch(
          (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
        );
    }
  });

document
  .querySelector("#updateDocumentId")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    let documentName = document.querySelector("#documentID").value;
    fetch(`${domain}/api/v1/users/update-document-id`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // documentID: document.querySelector("#documentID").value,
        documentId:
          documentList[
            getDocumentIndex(document.querySelector("#documentID").value)
          ].value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
            console.log("fraz");
            docId = res.docID;
          })
          .catch((error) => {
            errorArea.innerHTML = JSON.stringify(error, undefined, 2);
            console.log(error);
          });
      })
      .catch((error) => {
        errorArea.innerHTML = JSON.stringify(error, undefined, 2);
        console.log(error);
      });
  });

document.querySelector("#showMe").addEventListener("click", async function () {
  responseArea.innerHTML = "";
  errorArea.innerHTML = "";
  fetch(`${domain}/api/v1/users/showMe`, {})
    .then((res) => {
      res
        .json()
        .then((res) => {
          responseArea.innerHTML = JSON.stringify(res, undefined, 2);
        })
        .catch(
          (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
        );
    })
    .catch(
      (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
    );
});

document
  .querySelector("#insertHeading")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    fetch(`${domain}/api/v1/insert/heading`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document.querySelector("#heading").value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });

document
  .querySelector("#insertSubheading")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    fetch(`${domain}/api/v1/insert/subheading`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document.querySelector("#subheading").value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });

document
  .querySelector("#insertParagraph")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    fetch(`${domain}/api/v1/insert/paragraph`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document.querySelector("#paragraph").value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });

document
  .querySelector("#insertBullet")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    fetch(`${domain}/api/v1/insert/bullet`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document.querySelector("#bullet").value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });

document
  .querySelector("#insertImage")
  .addEventListener("click", async function () {
    responseArea.innerHTML = "";
    errorArea.innerHTML = "";
    console.log(
      document.querySelector("#height").value,
      document.querySelector("#width").value
    );
    fetch(`${domain}/api/v1/insert/image`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: document.querySelector("#image").value,
        height: document.querySelector("#height").value,
        width: document.querySelector("#width").value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch(
        (error) => (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
      );
  });
