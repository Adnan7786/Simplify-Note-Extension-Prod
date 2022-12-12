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
  }
}

let activeTab = 0;
let activeStyle = 0;
const textStyles = ['heading', 'subheading', 'bullet', 'paragraph'];

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
const docEditIcons = document.querySelectorAll('.tab-content.notes .icon-box');
const stylesListItems = document.querySelectorAll('.styles-sidebar .list .list-item');


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

docEditIcons.forEach((icon) => {
  icon.addEventListener('click', () => {
    console.log('aha');
    if (icon.dataset.context === 'create' || icon.dataset.context === 'add' || icon.dataset.docid) {
      console.log('huhhhhh');
      showPopup(icon.dataset.context, icon.dataset.docid);
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
    stylesListItems[index].classList.add('active');
    activeStyle = index;
  });

}


// for (let i = 0; i < tooltipButtons.length; i++) {
//   tooltipButtons[i].addEventListener('submit', function(){

//   })
// };

document.querySelector('#icon-facebook').addEventListener('click', function () {
  window.open('https://www.facebook.com', '_blank');
});
document.querySelector('#icon-youtube').addEventListener('click', function () {
  window.open('https://www.youtube.com', '_blank');
});
document.querySelector('#icon-mail').addEventListener('click', function () {
  window.open('https://www.outlook.com', '_blank');
});
document.querySelector('#icon-instagram').addEventListener('click', function () {
  window.open('https://www.instagram.com/simplifynote/', '_blank');
});
document.querySelector('#icon-twitter').addEventListener('click', function () {
  window.open('https://www.twitter.com', '_blank');
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

function apiCreateFolder(name, parentFolderId) {
  return new Promise((resolve, reject) => {
    fetch(`${domain}/api/v1/dashboard/folder`, {
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
        console.log(res);
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
  // updateStylesTab();
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
  for (const doc of folderTree.folders[rootId].documents) {
    if (folderTree.documents[doc].currentlyEditing) {
      currDocObj = folderTree.documents[doc];
      break;
    }
  }
  if (!currDocObj) {
    sendNotification('Failure', 'Something went wrong while fetching current document details. Please try again.')
  }
  const dateCreated = getFormattedDate(currDocObj.createdAt);
  const dateModified = getFormattedDate(currDocObj.updatedAt);
  workspaceTab.querySelector('.doc-details .doc-name .value').innerHTML = currDocObj.name;
  workspaceTab.querySelector('.doc-details .doc-created .value').innerHTML = dateCreated;
  workspaceTab.querySelector('.doc-details .doc-modified .value').innerHTML = dateModified;
  workspaceTab.querySelector('#icon-document').addEventListener('click', function () {
    docIconClickAndEnter(currDocObj.docID);
  });
  workspaceTab.querySelector('#icon-document').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') docIconClickAndEnter(currDocObj.docID);
  });
}

function updateNotesTab(folderTree) {
  const notesTab = tabContents[1];
  const rootId = folderTree.rootId;
  const docsContainer = notesTab.querySelector('.notes-container .docs-container');
  const docEditIcons = [...notesTab.querySelectorAll('.icon-box')].splice(2);
  const docElem = document.createElement('div');
  docElem.className = 'doc-card';
  docElem.innerHTML = `
  <svg id="icon-document" class="icon-document" viewBox="0 0 16 16" tabindex=0>
    <path
      d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM7 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V9.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V9s1.54-1.274 1.639-1.208zM5 11h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
  </svg>
  <div class="doc-name"></div>`;
  folderTree.folders[rootId].documents.sort((doc1, doc2) => {
    return new Date(folderTree.documents[doc2].updatedAt) - new Date(folderTree.documents[doc1].updatedAt)
  })
  for (const doc of folderTree.folders[rootId].documents) {
    const docClone = docElem.cloneNode(true);
    if (folderTree.documents[doc].currentlyEditing) docClone.classList.add('active');
    docClone.querySelector('.doc-name').innerText = folderTree.documents[doc].name;
    docClone.addEventListener('click', (event) => {
      event.stopPropagation();
      const selectedDoc = notesTab.querySelector('.doc-card.selected');
      if (selectedDoc) selectedDoc.classList.remove('selected');
      docClone.classList.add('selected');
      docEditIcons.forEach((icon) => {
        icon.dataset.docid = folderTree.documents[doc].docID;
      });
    })
    docsContainer.appendChild(docClone);
  }
  docsContainer.addEventListener('click', () => {
    const selectedDoc = docsContainer.querySelector('.doc-card.selected')
    if (selectedDoc) selectedDoc.classList.remove('selected')
  })
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

function showPopup(context, docID) {
  var popup = document.querySelector('.popup');
  popup.style.visibility = 'visible';
  var popupBox = popup.querySelector(`.${context}`);
  popupBox.classList.add('show');
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
  const [weekday, month, day, year] = (new Date(datetimeStr).toDateString()).split(' ');
  return day + ' ' + month + ', ' + year
}