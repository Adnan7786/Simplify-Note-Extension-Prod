// try {
//   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete') {
//       chrome.scripting.executeScript({
//         files: ['contentScript.js'],
//         target: { tabId: tabId }
//       })
//     }
//   })
// } catch (error) {
//   console.log(error);
// }






// // chrome.runtime.onMessage.addListener(function (request, sender) {
// //   if (request.userSignedIn === true) {
// //     userLoggedIn = true;
// //     sendResponse({ status: "status_received_by_background_script" });
// //   } else {
// //     userLoggedIn = false;
// //     sendResponse({ status: "status_received_by_background_script" });
// //   }
// //   return true;
// // });

// //setting the response of the onMessage Event Listener
// function setResponse(flag, mssg) {
//   let res = {
//     successful: flag,
//     message: mssg,
//   };
//   console.log("response from setResponse function");
//   console.log(res);
//   return res;
// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   //Creating a new document
//   const domain = "https://simpli-notes.herokuapp.com"; //prod
//   const CookieDetails = {
//     name: "token",
//     url: domain,
//   };
//   //   chrome.cookies.get(CookieDetails, (cookie) => {
//   // if (!cookie) {
//   //   console.log("no");
//   // }
//   // console.log("yes");
//   //   });

//   if (request.message === "toggleTooltip") {
//     console.log(request.status)
//     sendResponse({
//       message: 'successful'
//     })
//   }
//   if (request.message === "insertHeading") {
//     fetch(`${domain}/api/v1/insert/heading`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // text: document.querySelector("#heading").value,
//         text: request.value,
//       }),
//     })
//       .then((res) => {
//         res
//           .json()
//           .then((res) => {
//             sendResponse(setResponse(true, "Successfully inserted Heading"));
//           })
//           .catch(
//             (error) =>
//               sendResponse(
//                 setResponse(false, "not Successfully inserted Heading")
//               )
//           );
//       })
//       .catch((error) =>
//         sendResponse(setResponse(false, "not Successfully inserted Heading"))
//       );
//   }
//   else if (request.message === "insertSubheading") {
//     fetch(`${domain}/api/v1/insert/subheading`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // text: document.querySelector("#heading").value,
//         text: request.value,
//       }),
//     })
//       .then((res) => {
//         res
//           .json()
//           .then((res) => {
//             sendResponse(setResponse(true, "Successfully inserted subheading"));
//           })
//           .catch(
//             (error) =>
//               sendResponse(
//                 setResponse(false, "not Successfully inserted subheading")
//               )
//           );
//       })
//       .catch((error) =>
//         sendResponse(setResponse(false, "not Successfully inserted subheading"))
//       );
//   }
//   else if (request.message === "insertParagraph") {
//     fetch(`${domain}/api/v1/insert/paragraph`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // text: document.querySelector("#heading").value,
//         text: request.value,
//       }),
//     })
//       .then((res) => {
//         res
//           .json()
//           .then((res) => {
//             sendResponse(setResponse(true, "Successfully inserted paragraph"));
//           })
//           .catch(
//             (error) =>
//               sendResponse(
//                 setResponse(false, "not Successfully inserted paragraph")
//               )
//           );
//       })
//       .catch((error) =>
//         sendResponse(setResponse(false, "not Successfully inserted paragraph"))
//       );
//   }
//   else if (request.message === "insertBullet") {
//     fetch(`${domain}/api/v1/insert/bullet`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // text: document.querySelector("#heading").value,
//         text: request.value,
//       }),
//     })
//       .then((res) => {
//         res
//           .json()
//           .then((res) => {
//             sendResponse(setResponse(true, "Successfully inserted bullet"));
//           })
//           .catch(
//             (error) =>
//               sendResponse(
//                 setResponse(false, "not Successfully inserted bullet")
//               )
//           );
//       })
//       .catch((error) =>
//         sendResponse(setResponse(false, "not Successfully inserted bullet"))
//       );
//   }
//   else if (request.message === "insertImage") {
//     fetch(`${domain}/api/v1/insert/image`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // text: document.querySelector("#heading").value,
//         image: request.value.url,
//         height: request.value.height,
//         width: request.value.width
//       }),
//     })
//       .then((res) => {
//         res
//           .json()
//           .then((res) => {
//             sendResponse(setResponse(true, "Successfully inserted Image"));
//           })
//           .catch(
//             (error) =>
//               sendResponse(
//                 setResponse(false, "not Successfully inserted Image")
//               )
//           );
//       })
//       .catch((error) =>
//         sendResponse(setResponse(false, "not Successfully inserted Image"))
//       );
//   }
// });
