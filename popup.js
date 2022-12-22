const domain = "https://simplify-note.vercel.app"; //prod
// const domain = "http://localhost:3000" //dev

const cssThemeVariables = {
  '--color-secondary': {
    'light': '#4a4a4a',
    'dark': '#b4b4b4'
  },
  '--color-black-white': {
    'light': '#000',
    'dark': '#fff'
  },
  '--color-white-black': {
    'light': '#fff',
    'dark': '#000'
  },
  '--color-bgr-main': {
    'light': '#f3f6fd',
    'dark': '#1e1e1e'
  },
  '--color-bgr-main-hover': {
    'light': 'hsl(222, 71%, 90%)',
    'dark': 'hsl(0, 0%, 20%)'
  },
  '--color-bgr-secondary': {
    'light': '#ffffff',
    'dark': '#000'
  },
  '--color-icon-background': {
    'light': '#171717',
    'dark': '#ffffff'
  },
  '--color-icon-text': {
    'light': '#ffffff',
    'dark': '#cecccc'
  },
  '--color-box-shadow': {
    'light': 'rgba(60, 64, 67, 0.3)',
    'dark': 'rgba(195, 191, 188, 0.3)'
  },
  '--color-box-shadow2': {
    'light': 'rgba(0, 0, 0, 0.35)',
    'dark': 'rgba(255, 255, 255, 0.35)'
  },
  '--color-glass-effect': {
    'light': 'rgba(255, 255, 255, 0.4)',
    'dark': 'rgba(0, 0, 0, 0.4)'
  }
}

let activeTab = 0;
let activeStyle = 0;
let userStyle = null;
const textStyles = ['heading', 'subheading', 'bullet', 'paragraph'];
const fontColors = [];
const highlightColors = [];

const documentRoot = document.querySelector(':root');
const computedStyle = getComputedStyle(documentRoot);
const pageLoad = document.querySelector('#page-load');
const iconSun = document.querySelector('#icon-sun');
const iconMoon = document.querySelector('#icon-moon');
const wiperElem = document.querySelector('#wiper');
const noAvatar = document.querySelector('#icon-no-avatar');
const userAvatar = document.querySelector('#user-avatar');
const signedOutContainer = document.querySelector('#signed-out');
const signedInContainer = document.querySelector('#signed-in');
const navbarTabs = document.querySelectorAll('.navbar-tab');
const tabContents = document.querySelectorAll('.tab-content');
// const currentlyEditingDocIcon = document.querySelector('.currently-editing-content #icon-document');
const addNoteInput = document.querySelector('#addNoteInput');
const tooltipButtons = document.querySelectorAll('.tooltip-button');
const addNoteForm = document.querySelector('#addNoteForm');
const tooltipSubmitMessage = document.querySelector('#tooltipSubmitMessage');
const loadingMessage = document.querySelector('#tooltipLoadingMessage');
const responseMessage = document.querySelector('#tooltipResponseMessage');
// const logoutButton = document.querySelector('.profile-avatar #logout');
const docIcons = document.querySelectorAll('.tab-content.notes .icon-box');
const stylesListItems = document.querySelectorAll('.styles-sidebar .list .list-item');
const createDocForm = tabContents[1].querySelector('#createDocForm')
const addDocForm = tabContents[1].querySelector('#addDocForm')
const renameDocForm = tabContents[1].querySelector('#renameDocForm')
const deleteDocForm = tabContents[1].querySelector('#deleteDocForm')
const styleForms = tabContents[2].querySelectorAll('.styles-form')
const styleIconContainer = tabContents[2].querySelector('.icon-container')
const styleEditIcon = tabContents[2].querySelector('#iconEdit')
const styleCloseIcon = tabContents[2].querySelector('#iconClose')

window.onload = render;

addNoteForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const style = document.activeElement.dataset.style;
  document.activeElement?.blur();
  if (!textStyles.includes(style)) return;
  for (let i = 0; i < tooltipButtons.length; i++) {
    tooltipButtons[i].classList.add('submit');
  }
  const inputValue = this.elements['addNoteInput'].value;
  tooltipSubmitMessage.classList.add('extend');
  loadingMessage.classList.add('show');
  this.elements['addNoteInput'].value = "";
  try {
    const response = await apiInsertText(style, inputValue);
    loadingMessage.classList.remove('show');
    responseMessage.classList.add('show');
    for (let i = 0; i < tooltipButtons.length; i++) {
      tooltipButtons[i].classList.remove('submit');
      tooltipButtons[i].classList.remove('active');
    }
    setTimeout(() => {
      responseMessage.classList.remove('show');
      tooltipSubmitMessage.classList.remove('extend');
    }, 1500);
  } catch (error) {
    console.log('error' + error);
  }
});

createDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = this.elements['name'].value;
  const parentFolderId = tabContents[1].querySelector('.notes-container .icon-box[data-context="new"]').dataset.folderid
  console.log(name, parentFolderId);
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  await apiCreateDoc(name, parentFolderId);
  const folderTree = await apiFetchFolderTree();
  updateWorkspaceTab(folderTree);
  navbarTabs[0].click();
  pageLoad.style.visibility = 'hidden';
  updateNotesTab(folderTree);
});

addDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const docURL = this.elements['docURL'].value;
  const docID = docURL.match(/[-\w]{25,}(?!.*[-\w]{25,})/)[0];
  const parentFolderId = tabContents[1].querySelector('.notes-container .icon-box[data-context="new"]').dataset.folderid
  console.log(docURL, docID, parentFolderId);
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  await apiAddDoc(docID, parentFolderId);
  const folderTree = await apiFetchFolderTree();
  updateWorkspaceTab(folderTree);
  navbarTabs[0].click();
  pageLoad.style.visibility = 'hidden';
  updateNotesTab(folderTree);
});

renameDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = this.elements['name'].value;
  const selectedDoc = tabContents[1].querySelector('.doc-card.selected');
  const docID = selectedDoc.dataset.docid
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  await apiRenameDoc(name, docID);
  const folderTree = await apiFetchFolderTree();
  updateWorkspaceTab(folderTree);
  navbarTabs[0].click();
  pageLoad.style.visibility = 'hidden';
  updateNotesTab(folderTree);
});


deleteDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const selectedDoc = tabContents[1].querySelector('.doc-card.selected');
  const docID = selectedDoc.dataset.docid
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  await apiDeleteDoc(docID);
  const folderTree = await apiFetchFolderTree();
  updateWorkspaceTab(folderTree);
  navbarTabs[0].click();
  pageLoad.style.visibility = 'hidden';
  updateNotesTab(folderTree);
});

docIcons.forEach((icon) => {
  icon.addEventListener('click', async () => {

    if (icon.dataset.context === 'new') {
      showPopup(icon.dataset.context);
      return;
    }

    const selectedDoc = tabContents[1].querySelector('.doc-card.selected');
    if (!selectedDoc) return;

    if (icon.dataset.context === 'rename' || icon.dataset.context === 'delete') {
      showPopup(icon.dataset.context);
      return;
    }

    if (icon.dataset.context === 'edit') {
      pageLoad.style.visibility = 'visible';
      await apiEditDoc(selectedDoc.dataset.docid);
      const folderTree = await apiFetchFolderTree();
      updateWorkspaceTab(folderTree);
      navbarTabs[0].click();
      pageLoad.style.visibility = 'hidden';
      updateNotesTab(folderTree);
      return;
    }

    if (icon.dataset.context === 'open') {
      docIconClickAndEnter(selectedDoc.dataset.gdocid);
      return;
    }
  })
})

iconSun.addEventListener("click", async function () {
  try {
    await themeClickEvent('light');
  } catch (error) {
    sendNotification('failure', error);
  }
});

iconMoon.addEventListener("click", async function () {
  try {
    await themeClickEvent('dark');
  } catch (error) {
    sendNotification('failure', error);
  }
});

userAvatar.addEventListener("click", function () {
  navbarTabs[3].click();
});

for (let i = 0; i < navbarTabs.length; i++) {
  navbarTabs[i].addEventListener("click", function () {
    navTabsClickAndEnter(i);
  });
  navbarTabs[i].addEventListener("keypress", function (event) {
    if (event.key === 'Enter') navTabsClickAndEnter(i);
  });
};

addNoteInput.addEventListener('input', function () {
  if (this.value.length == 0) {
    this.classList.remove('active');
    for (let i = 0; i < tooltipButtons.length; i++) {
      tooltipButtons[i].classList.remove('active');
    }
    return;
  }
  this.classList.add('active');
  for (let i = 0; i < tooltipButtons.length; i++) {
    tooltipButtons[i].classList.add('active');
  }
});

addNoteInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') event.preventDefault();
});


for (let index = 0; index < stylesListItems.length; index++) {
  stylesListItems[index].addEventListener('click', () => {
    stylesListItems[activeStyle].classList.remove('active');
    styleForms[activeStyle].classList.remove('active');
    console.log(getComputedStyle(styleCloseIcon, null).display);
    if (getComputedStyle(styleCloseIcon, null).display !== 'none') {
      console.log('closeon');
      styleIconContainer.click();
    }
    activeStyle = index;
    stylesListItems[activeStyle].classList.add('active');
    styleForms[activeStyle].classList.add('active');
  });
}

tabContents[0].querySelector('#icon-document').addEventListener('click', function (event) {
  const target = event.currentTarget;
  console.log(target);
  console.log(target.dataset.gdocid);
  docIconClickAndEnter(target.dataset.gdocid);
});
tabContents[0].querySelector('#icon-document').addEventListener('keypress', function (event) {
  const target = event.currentTarget;
  if (event.key === 'Enter') docIconClickAndEnter(target.dataset.gdocid);
});

tabContents[1].querySelectorAll('.dialog-box .buttons .cancel').forEach((button) => {
  button.addEventListener('click', () => {
    const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
    openedDialogBoxes.forEach((box) => {
      box.classList.remove('show');
    });
  });
});


styleIconContainer.addEventListener('click', () => {
  if (getComputedStyle(styleEditIcon, null).display !== 'none') {
    styleEditIcon.style.display = 'none';
    styleCloseIcon.style.display = 'block';
    styleForms[activeStyle].querySelector('fieldset').disabled = false;
  } else {
    const style = textStyles[activeStyle];
    styleForms[activeStyle].querySelector('#fontStyles').value = userStyle[style]["fontFamily"];
    let { red: cR, green: cG, blue: cB } = userStyle[style]["foregroundColor"];
    const color_hex = rgbToHex(cR, cG, cB);
    const selcolorElem = styleForms[activeStyle].querySelector(`input[name="color"][value="${color_hex}"]`);
    if (selcolorElem) selcolorElem.checked = true;
    let { red: hR, green: hG, blue: hB } = userStyle[style]["backgroundColor"];
    const highlighter_hex = rgbToHex(hR, hG, hB);
    const selHighlighterElem = styleForms[activeStyle].querySelector(`input[name="highlighter"][value="${highlighter_hex}"]`);
    if (selHighlighterElem) selHighlighterElem.checked = true;
    styleForms[activeStyle].querySelector('#bold').checked = userStyle[style]["bold"];
    styleForms[activeStyle].querySelector('#italic').checked = userStyle[style]["italic"];
    styleForms[activeStyle].querySelector('#underline').checked = userStyle[style]["underline"];
    if (style === 'bullet') {
      styleForms[activeStyle].querySelector('#bulletStyles').value = userStyle["bulletPreset"]
    };
    styleCloseIcon.style.display = 'none';
    styleEditIcon.style.display = 'block';
    styleForms[activeStyle].querySelector('fieldset').disabled = true;
  }
})

styleForms.forEach(form => {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const buttonId = document.activeElement.id;
    console.log(buttonId);
    pageLoad.style.visibility = 'visible';
    if (buttonId === 'submit') {
      const style = textStyles[activeStyle]
      const payload = {}
      payload["fontFamily"] = styleForms[activeStyle].querySelector('#fontStyles').value;
      styleForms[activeStyle].querySelectorAll('input[name="color"]').forEach(radioBtn => {
        if (radioBtn.checked) payload["foregroundColor"] = hexToRgb(radioBtn.value);
      });
      styleForms[activeStyle].querySelectorAll('input[name="highlighter"]').forEach(radioBtn => {
        if (radioBtn.checked) payload["backgroundColor"] = hexToRgb(radioBtn.value);
      });
      payload["bold"] = styleForms[activeStyle].querySelector('#bold').checked;
      payload["italic"] = styleForms[activeStyle].querySelector('#italic').checked;
      payload["underline"] = styleForms[activeStyle].querySelector('#underline').checked;
      if (style === 'bullet') {
        payload["bulletPreset"] = styleForms[activeStyle].querySelector('#bulletStyles').value;
      }
      console.log(payload);
      await apiUpdateUserStyle(style, payload);
    } else {
      const style = textStyles[activeStyle]
      await apiResetUserStyle(style);
    }
    userStyle = await apiFetchUserStyle();
    updateStylesTab();
    pageLoad.style.visibility = 'hidden';
  });
})



// for (let i = 0; i < tooltipButtons.length; i++) {
//   tooltipButtons[i].addEventListener('submit', function(){

//   })
// };

document.querySelector('#icon-linkedin').addEventListener('click', function () {
  window.open('https://www.linkedin.com/company/simplify-notes/', '_blank');
});
document.querySelector('#icon-youtube').addEventListener('click', function () {
  window.open('https://www.youtube.com/channel/UCfvWlKog8_FfmU4KU3Bssgw', '_blank');
});
document.querySelector('#icon-mail').addEventListener('click', function () {
  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=developer.simplifynote@gmail.com&su=Simplify Note Chrome Extension Feedback', '_blank');
});
document.querySelector('#icon-instagram').addEventListener('click', function () {
  window.open('https://www.instagram.com/simplifynote/', '_blank');
});
document.querySelector('#icon-telegram').addEventListener('click', function () {
  window.open('https://t.me/simplify_notes', '_blank');
});

document.querySelector('input[name=toggle-switch-input]').addEventListener('click', async function () {
  try {
    if (this.checked === true) {
      console.log('checked');
      return await storeTooltipUnchecked(false);
    }
    else if (this.checked === false) {
      console.log('unchecked');
      return await storeTooltipUnchecked(true);
    }
  } catch (error) {
    return sendNotification('failure', error);
  }
});

noAvatar.addEventListener('click', redirectToSignInPage);

// logoutButton.addEventListener('click', async () => {
//   try {
//     return await logoutAndRefreshPopup();
//   } catch (error) {
//     return sendNotification('failure', error);
//   }
// });

document.querySelector('#sign-in-button').addEventListener('click', redirectToSignInPage);

// Functions

async function render() {
  try {
    await setTheme();

    const tooltipUnchecked = await getTooltipUnchecked();
    if (tooltipUnchecked) uncheckTooltipSwitch(true);

    const userIsSignedIn = await isSignedIn();

    if (!userIsSignedIn) {
      pageLoad.style.visibility = 'hidden';
      return;
    }

    const user = await apiFetchUser();
    const folderTree = await apiFetchFolderTree();
    userStyle = await apiFetchUserStyle();


    await signInAndRefreshPopup(user, folderTree);
    pageLoad.style.visibility = 'hidden';

  } catch (error) {
    sendNotification('failure', error);
  }
}

function storeCurrentTheme(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ 'currentTheme': value }, function () {
      resolve();
    });
  })
}

function getCurrentTheme() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['currentTheme'], function (result) {
      (result.currentTheme) ? resolve(result.currentTheme) : resolve(null);
    });
  })
}

function storeTooltipUnchecked(value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ 'tooltipUnchecked': value }, function () {
      resolve();
    });
  })
}

function getTooltipUnchecked() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipUnchecked'], function (result) {
      (result.tooltipUnchecked) ? resolve(result.tooltipUnchecked) : resolve(false);
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

function getTooltipDisabled() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tooltipDisabled'], function (result) {
      (result.tooltipDisabled) ? resolve(result.tooltipDisabled) : resolve(false);
    });
  });
}

function sendNotification(status, error) {
  console.log(status, error);
}

function getCSSVariableValue(variable) {
  return computedStyle.getPropertyValue(variable);
}

function setCSSVariableValue(variable, value) {
  documentRoot.style.setProperty(variable, value);
}

function toggleWiperLeftRight() {
  wiperElem.classList.toggle("left");
  wiperElem.classList.toggle("right");
}

function toggleDisplay(hideElem, showElem, displayType) {
  hideElem.style.display = "none";
  showElem.style.display = displayType;
}

async function toggleTheme(theme) {
  await storeCurrentTheme(theme);
  for (const variable in cssThemeVariables) {
    setCSSVariableValue(variable, cssThemeVariables[variable][theme]);
  }
}

function uncheckTooltipSwitch(value) {
  const checked = !value;
  console.log(checked);
  document.querySelector('input[name=toggle-switch-input]').checked = checked;

}

// Enable/Disable tooltip-switch
function disableTooltipSwitch(disable) {
  document.querySelector('input[name=toggle-switch-input]').disabled = disable;
}

async function themeClickEvent(theme) {
  await toggleTheme(theme);
  wiperElem.style.width = "30px";
  setTimeout(function () {
    toggleWiperLeftRight();
    wiperElem.style.width = "0px";
    (theme === 'dark') ? toggleDisplay(iconMoon, iconSun, "inline") : toggleDisplay(iconSun, iconMoon, "inline");
    setTimeout(function () {
      toggleWiperLeftRight();
    }, 400);
  }, 400);
}

function redirectToSignInPage() {
  window.open(domain + '/auth/login.html', '_blank');
}

async function setTheme() {
  const theme = await getCurrentTheme();
  console.log(!theme);
  console.log('theme ' + theme);
  if (!theme || (theme !== 'light' && theme !== 'dark')) {
    console.log('aha');
    return;
  }
  await toggleTheme(theme);
  (theme === 'dark') ? toggleDisplay(iconMoon, iconSun, "inline") : toggleDisplay(iconSun, iconMoon, "inline");
  return;
}

function isSignedIn() {
  return new Promise((resolve, reject) => {
    const CookieDetails = {
      name: "token",
      url: domain,
    };
    chrome.cookies.get(CookieDetails, (cookie) => {
      (cookie) ? resolve(true) : resolve(false);
    });
  });
}


function apiFetchUser() {
  return new Promise((resolve, reject) => {
    const user = {};
    fetch(`${domain}/api/v1/users/showMe`, {})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res.user);
          })
          .catch((error) => {
            reject('From apiFetchUser ' + error);
          });
      })
      .catch((error) => {
        reject('From apiFetchUser ' + error);
      });
  });
}

function apiLogoutUser() {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/auth/logout`, {})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject('From logout user ' + error);
      });
  });
}

function apiFetchFolderTree() {
  return new Promise((resolve, reject) => {
    const user = {};
    fetch(`${domain}/api/v1/dashboard/folder-tree`, {})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject('From apiFetchFolderTree ' + error);
          });
      })
      .catch((error) => {
        reject('From apiFetchFolderTree ' + error);
      });
  });
}

function apiFetchUserStyle() {
  return new Promise((resolve, reject) => {
    const user = {};
    fetch(`${domain}/api/v1/style`, {})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject('From apiFetchStyle ' + error);
          });
      })
      .catch((error) => {
        reject('From apiFetchStyle ' + error);
      });
  });
}

function apiUpdateUserStyle(style, payload) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/style/${style}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiResetUserStyle(style) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/style/${style}/reset`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiCreateDoc(name, parentFolderId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/document`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        parentFolderId
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiAddDoc(documentId, parentFolderId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/document/add`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        parentFolderId
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiEditDoc(documentId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/document/edit`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiRenameDoc(name, documentId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/document`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        documentId
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function apiDeleteDoc(documentId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/document`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId
      }),
    }).then((res) => {
      res.json().then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

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

function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}

async function signInAndRefreshPopup(user, folderTree) {
  console.log(user);
  console.log(folderTree);
  if (!user.currentDocID || user.currentDocID === '') {
    pageLoad.style.visibility = 'hidden';
  }
  updateAvatar(true, user.image);
  updateProfileTab(user);
  updateContentBox(true, user);
  await updateTooltipSwitch(user.currentDocID);
  updateWorkspaceTab(folderTree);
  updateNotesTab(folderTree);
  updateStylesTab();
  return;
}

async function logoutAndRefreshPopup() {
  pageLoad.style.visibility = 'visible';
  await apiLogoutUser();
  updateAvatar();
  updateContentBox();
  disableTooltipSwitch(true);
  await storeTooltipDisabled(true);
  pageLoad.style.visibility = 'hidden';
}

function updateAvatar(userIsSignedIn = false, imageSrc = null) {
  if (userIsSignedIn) {
    userAvatar.src = imageSrc;
    toggleDisplay(noAvatar, userAvatar, "inline");
    return;
  }
  return toggleDisplay(userAvatar, noAvatar, "inline");
}

function updateContentBox(userIsSignedIn = false, user = null) {
  if (userIsSignedIn) {
    toggleDisplay(signedOutContainer, signedInContainer, "flex");
    return;
  }
  return toggleDisplay(signedInContainer, signedOutContainer, "flex");
}

async function updateTooltipSwitch(currentDocID) {
  if (!currentDocID || currentDocID === "") {
    disableTooltipSwitch(true);
    await storeTooltipDisabled(true);
  }
  else {
    await storeTooltipDisabled(false);
  }
}

function updateWorkspaceTab(folderTree) {
  const workspaceTab = tabContents[0];
  const rootId = folderTree.rootId;
  console.log('root ' + rootId);
  let currDocObj = null;
  let currDocId = null;
  for (const docId of folderTree.folders[rootId].documents) {
    if (folderTree.documents[docId].currentlyEditing) {
      currDocId = docId;
      currDocObj = folderTree.documents[docId];
      break;
    }
  }
  const docIcon = workspaceTab.querySelector('#icon-document');
  const docName = workspaceTab.querySelector('.doc-details .doc-name .value');
  const docCreated = workspaceTab.querySelector('.doc-details .doc-created .value');
  const docModified = workspaceTab.querySelector('.doc-details .doc-modified .value');

  // if (!currDocObj) {
  //   sendNotification('Failure', 'Something went wrong while fetching current document details. Please try again.');
  //   return;
  // }
  console.log('cuu', currDocObj);
  const dateCreated = getFormattedDate(currDocObj?.createdAt);
  const dateModified = getFormattedDate(currDocObj?.updatedAt);
  docIcon.dataset.docid = currDocId ? currDocId : '';
  docIcon.dataset.gdocid = currDocObj ? currDocObj.docID : '';
  docName.innerHTML = currDocObj ? currDocObj.name : '';
  docCreated.innerHTML = dateCreated ? dateCreated : '';
  docModified.innerHTML = dateModified ? dateModified : '';
}

function updateNotesTab(folderTree) {
  const notesTab = tabContents[1];
  const rootFolderId = folderTree.rootId;
  const docsContainer = notesTab.querySelector('.notes-container .docs-container');
  docsContainer.innerHTML = ""; //clear doc container before updating
  const docEditIcons = [...notesTab.querySelectorAll('.icon-box')].splice(1);
  const docNewIcon = notesTab.querySelector('.icon-box[data-context="new"]');
  docNewIcon.dataset.folderid = rootFolderId;
  const docElem = document.createElement('div');
  docElem.className = 'doc-card';
  docElem.innerHTML = `
  <svg id="icon-document" class="icon-document" viewBox="0 0 16 16" tabindex=0>
    <path
      d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM7 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V9.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V9s1.54-1.274 1.639-1.208zM5 11h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
  </svg>
  <div class="doc-name"></div>`;
  folderTree.folders[rootFolderId].documents.sort((doc1, doc2) => {
    return new Date(folderTree.documents[doc2].updatedAt) - new Date(folderTree.documents[doc1].updatedAt)
  })
  for (const docId of folderTree.folders[rootFolderId].documents) {
    const docClone = docElem.cloneNode(true);
    docClone.dataset.folderid = rootFolderId;
    docClone.dataset.docid = docId;
    docClone.dataset.gdocid = folderTree.documents[docId].docID;
    if (folderTree.documents[docId].currentlyEditing) docClone.classList.add('active');
    docClone.querySelector('.doc-name').innerText = folderTree.documents[docId].name;
    docClone.addEventListener('click', (event) => {
      event.stopPropagation();
      const selectedDoc = notesTab.querySelector('.doc-card.selected');
      if (selectedDoc) selectedDoc.classList.remove('selected');
      docClone.classList.add('selected');
      const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
      openedDialogBoxes.forEach((box) => {
        box.classList.remove('show');
      });
    })
    docsContainer.appendChild(docClone);
  }
  docsContainer.addEventListener('click', () => {
    const selectedDoc = docsContainer.querySelector('.doc-card.selected');
    if (selectedDoc) selectedDoc.classList.remove('selected');
    const openedDialogBoxes = notesTab.querySelectorAll('.toolbar .dialog-box.show')
    openedDialogBoxes.forEach((box) => {
      box.classList.remove('show');
    });
  })
}

function updateStylesTab() {
  const activeStyleButton = stylesListItems[activeStyle];
  activeStyleButton.click();
  for (const index in textStyles) {
    if (Object.hasOwnProperty.call(textStyles, index)) {
      const style = textStyles[index];
      styleForms[index].querySelector('#fontStyles').value = userStyle[style]["fontFamily"];
      let { red: cR, green: cG, blue: cB } = userStyle[style]["foregroundColor"];
      const color_hex = rgbToHex(cR, cG, cB);
      const selcolorElem = styleForms[index].querySelector(`input[name="color"][value="${color_hex}"]`);
      if (selcolorElem) selcolorElem.checked = true;
      let { red: hR, green: hG, blue: hB } = userStyle[style]["backgroundColor"];
      const highlighter_hex = rgbToHex(hR, hG, hB);
      const selHighlighterElem = styleForms[index].querySelector(`input[name="highlighter"][value="${highlighter_hex}"]`);
      if (selHighlighterElem) selHighlighterElem.checked = true;
      styleForms[index].querySelector('#bold').checked = userStyle[style]["bold"];
      styleForms[index].querySelector('#italic').checked = userStyle[style]["italic"];
      styleForms[index].querySelector('#underline').checked = userStyle[style]["underline"];
      if (style === 'bullet') {
        styleForms[index].querySelector('#bulletStyles').value = userStyle["bulletPreset"]
      };
    }
  }
}


function updateProfileTab(user) {
  const profileTab = tabContents[3];
  const dateStr = getFormattedDate(user.subscription.expiry_date);
  profileTab.querySelector('#avatar').src = user.image;
  profileTab.querySelector('.user-details #name').innerHTML = user.name;
  profileTab.querySelector('.user-details #email').innerHTML = user.email;
  profileTab.querySelector('.user-details #subscription').innerHTML = toTitleCase(user.subscription.plan);
  profileTab.querySelector('.user-details #subscriptionEnds').innerHTML = dateStr;

  profileTab.querySelector('.account-settings #googleDriveAccess').addEventListener('click', () => {
    window.open(`${domain}/api/v1/google-auth/`, '_blank');
  })

  // profileTab.querySelector('.account-settings #allWebpageAccess').addEventListener('click', () => {
  //   console.log('adnan');
  //   chrome.permissions.request({
  //     permissions: ['tabs'],
  //     origins: ['https://www.google.com/']
  //   }, (granted) => {
  //     // The callback argument will be true if the user granted the permissions.
  //     if (granted) {
  //       console.log('Granted');
  //     } else {
  //       console.log('Not Granted');
  //     }
  //   })
  // })

  profileTab.querySelector('.account-settings #signOut').addEventListener('click', async () => {
    try {
      return await logoutAndRefreshPopup();
    } catch (error) {
      return sendNotification('failure', error);
    }
  })
}

function showPopup(context) {
  var visibleDialog = tabContents[1].querySelector(`.toolbar .dialog-box.show`);
  visibleDialog?.classList.remove('show');
  var dialogBox = tabContents[1].querySelector(`.toolbar .${context}.dialog-box`);
  dialogBox.classList.add('show');
}

function navTabsClickAndEnter(index) {
  navbarTabs[activeTab].classList.remove('active');
  navbarTabs[activeTab].tabIndex = 0;
  tabContents[activeTab].classList.remove('active');
  navbarTabs[index].classList.add('active');
  navbarTabs[index].tabIndex = -1;
  tabContents[index].classList.add('active');
  activeTab = index;
}

function docIconClickAndEnter(documentId) {
  window.open('https://docs.google.com/document/d/' + documentId, '_blank', 'location=yes,height=720,width=1000,scrollbars=yes,status=yes');
}

function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}

function getFormattedDate(datetimeStr) {
  if (!datetimeStr) return;
  const [weekday, month, day, year] = (new Date(datetimeStr).toDateString()).split(' ');
  return day + ' ' + month + ', ' + year
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  r = r * 255;
  g = g * 255;
  b = b * 255;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    red: parseInt(result[1], 16) / 255,
    green: parseInt(result[2], 16) / 255,
    blue: parseInt(result[3], 16) / 255
  } : null;
}