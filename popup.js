const domain = "https://simplifynote.app"; //prod
// const domain = "https://simplify-note.vercel.app" //dev

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
let user = null;
let folderTree = null;
let userStyle = null;
let switchToTab = 0;
let blockedTabList = [];
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
const addNoteInput = document.querySelector('#addNoteInput');
const tooltipButtons = document.querySelectorAll('.tooltip-button');
const addNoteForm = document.querySelector('#addNoteForm');
const tooltipSubmitMessage = document.querySelector('#tooltipSubmitMessage');
const loadingMessage = document.querySelector('#tooltipLoadingMessage');
const responseMessage = document.querySelector('#tooltipResponseMessage');
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
    await apiCall(`/api/v1/insert/${style}`,
      'POST',
      { text: inputValue }
    );
    responseMessage.classList.add('success');
  } catch (error) {
    responseMessage.classList.add('failure');
  }
  loadingMessage.classList.remove('show');
  responseMessage.classList.add('show');
  for (let i = 0; i < tooltipButtons.length; i++) {
    tooltipButtons[i].classList.remove('submit');
    tooltipButtons[i].classList.remove('active');
  }
  setTimeout(() => {
    responseMessage.classList.remove('show');
    responseMessage.classList.remove('failure');
    responseMessage.classList.remove('success');
    tooltipSubmitMessage.classList.remove('extend');
  }, 1500);

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
  try {
    await apiCall('/api/v1/dashboard/document',
      'POST',
      { name, parentFolderId });
    switchToTab = 0
    await render();
  } catch (error) {
    pageLoad.style.visibility = 'hidden';
    sendNotification('Failure', error)
  }
});

addDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const docURL = this.elements['docURL'].value;
  const documentId = docURL.match(/[-\w]{25,}(?!.*[-\w]{25,})/)[0];
  const parentFolderId = tabContents[1].querySelector('.notes-container .icon-box[data-context="new"]').dataset.folderid
  console.log(docURL, documentId, parentFolderId);
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  try {
    await apiCall('/api/v1/dashboard/document/add',
      'POST',
      { documentId, parentFolderId });
    switchToTab = 0
    await render();
  } catch (error) {
    pageLoad.style.visibility = 'hidden';
    sendNotification('Failure', error)
  }
});

renameDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = this.elements['name'].value;
  const selectedDoc = tabContents[1].querySelector('.doc-card.selected');
  const documentId = selectedDoc.dataset.docid
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  try {
    await apiCall('/api/v1/dashboard/document/',
      'PATCH',
      { name, documentId });
    switchToTab = 1
    await render();
  } catch (error) {
    pageLoad.style.visibility = 'hidden';
    sendNotification('Failure', error)
  }
});


deleteDocForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const selectedDoc = tabContents[1].querySelector('.doc-card.selected');
  const documentId = selectedDoc.dataset.docid
  pageLoad.style.visibility = 'visible';
  const openedDialogBoxes = tabContents[1].querySelectorAll('.toolbar .dialog-box.show')
  openedDialogBoxes.forEach((box) => {
    box.classList.remove('show');
  });
  try {
    await apiCall('/api/v1/dashboard/document/',
      'DELETE',
      { documentId });
    switchToTab = 1
    await render();
  } catch (error) {
    pageLoad.style.visibility = 'hidden';
    sendNotification('Failure', error)
  }
});

docIcons.forEach((icon) => {
  icon.addEventListener('click', async () => {

    if (icon.dataset.context === 'new') {
      tabContents[1].querySelector('.icon-box[data-context="new"]').classList.remove('bounce');
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
      try {
        await apiCall('/api/v1/dashboard/document/edit',
          'POST',
          { documentId: selectedDoc.dataset.docid });
        switchToTab = 0
        await render();
      } catch (error) {
        pageLoad.style.visibility = 'hidden';
        sendNotification('Failure', error)
      }
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
    try {
      switchToTab = 2
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
        await apiCall(`/api/v1/style/${style}`, 'POST', payload);
      } else {
        const style = textStyles[activeStyle];
        await apiCall(`/api/v1/style/${style}/reset`, 'POST', {});
      }
      await render();
    } catch (error) {
      pageLoad.style.visibility = 'hidden';
      sendNotification('Failure', error)
    }
  });
})

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

document.querySelector('#sign-in-button').addEventListener('click', redirectToSignInPage);

// Functions

async function render() {
  try {
    setTheme();
    const tooltipUnchecked = await getTooltipUnchecked();
    if (tooltipUnchecked) uncheckTooltipSwitch(true);
    const userIsSignedIn = await isSignedIn();
    if (!userIsSignedIn) {
      pageLoad.style.visibility = 'hidden';
      return;
    }
    try {
      blockedTabList = []
      user = await apiCall('/api/v1/users/showMe', 'GET', {});
      folderTree = await apiCall('/api/v1/dashboard/folder-tree', 'GET', {});
      userStyle = await apiCall('/api/v1/style', 'GET', {});
      console.log(user);
      console.log(folderTree);
      console.log(userStyle);
      if (!user.googleRefreshToken || user.googleRefreshToken === '') {
        blockedTabList.push(0);
        blockedTabList.push(1);
        switchToTab = 3;
        tabContents[3].querySelector('#googleDriveAccess').classList.add('bounce');
      }
      else if (!user.currentDocID || user.currentDocID === '') {
        blockedTabList.push(0);
        switchToTab = 1;
        tabContents[1].querySelector('.icon-box[data-context="new"]').classList.add('bounce');
      }
      if (switchToTab !== 3) tabContents[3].querySelector('#googleDriveAccess').classList.remove('bounce');
      if (switchToTab !== 1) tabContents[1].querySelector('.icon-box[data-context="new"]').classList.remove('bounce');
      console.log('switchToTab', switchToTab)
      if (switchToTab !== -1) navbarTabs[switchToTab].click();
      updateAvatar(true);
      updateProfileTab();
      updateContentBox(true);
      await updateTooltipSwitch();
      updateWorkspaceTab();
      updateNotesTab();
      updateStylesTab();
    } catch (errMsg) {
      sendNotification('Failure', errMsg)
    }
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
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}

async function logoutAndRefreshPopup() {
  pageLoad.style.visibility = 'visible';
  try {
    await apiCall('/api/v1/auth/logout', 'GET', {});
  } catch (errMsg) {
    pageLoad.style.visibility = 'hidden';
    sendNotification('Failure', errMsg);
  }
  updateAvatar();
  updateContentBox();
  disableTooltipSwitch(true);
  await storeTooltipDisabled(true);
  pageLoad.style.visibility = 'hidden';
}

function updateAvatar(userIsSignedIn = false) {
  if (userIsSignedIn) {
    userAvatar.src = user?.image;
    toggleDisplay(noAvatar, userAvatar, "inline");
    return;
  }
  return toggleDisplay(userAvatar, noAvatar, "inline");
}

function updateContentBox(userIsSignedIn = false) {
  if (userIsSignedIn) {
    toggleDisplay(signedOutContainer, signedInContainer, "flex");
    return;
  }
  return toggleDisplay(signedInContainer, signedOutContainer, "flex");
}

async function updateTooltipSwitch() {
  if (!user?.currentDocID || user?.currentDocID === "") {
    disableTooltipSwitch(true);
    await storeTooltipDisabled(true);
  }
  else {
    await storeTooltipDisabled(false);
  }
}

function updateWorkspaceTab() {
  if (!folderTree) return;
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
  const dateCreated = getFormattedDate(currDocObj?.createdAt);
  const dateModified = getFormattedDate(currDocObj?.updatedAt);
  docIcon.dataset.docid = currDocId ? currDocId : '';
  docIcon.dataset.gdocid = currDocObj ? currDocObj.docID : '';
  docName.innerHTML = currDocObj ? currDocObj.name : '';
  docCreated.innerHTML = dateCreated ? dateCreated : '';
  docModified.innerHTML = dateModified ? dateModified : '';
}

function updateNotesTab() {
  if (!folderTree) return;
  const notesTab = tabContents[1];
  const rootFolderId = folderTree.rootId;
  const docsContainer = notesTab.querySelector('.notes-container .docs-container');
  docsContainer.innerHTML = ""; //clear doc container before updating
  // const docEditIcons = [...notesTab.querySelectorAll('.icon-box')].splice(1);
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
    if (folderTree.documents[docId].currentlyEditing) {
      docClone.classList.add('active');
      docsContainer.prepend(docClone);
    } else {
      docsContainer.append(docClone);
    }
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
  if (!userStyle) return;
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


function updateProfileTab() {
  console.log('uswttevh', user.subscription);
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
  if (index in blockedTabList) return;
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