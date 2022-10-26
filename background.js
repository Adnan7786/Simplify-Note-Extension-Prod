// chrome.runtime.onMessage.addListener(function (request, sender) {
//   if (request.userSignedIn === true) {
//     userLoggedIn = true;
//     sendResponse({ status: "status_received_by_background_script" });
//   } else {
//     userLoggedIn = false;
//     sendResponse({ status: "status_received_by_background_script" });
//   }
//   return true;
// });

//setting the response of the onMessage Event Listener
function setResponse(flag, mssg) {
  let res = {
    successful: flag,
    message: mssg,
  };
  console.log("response from setResponse function");
  console.log(res);
  return res;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //Creating a new document
  const domain = "https://simpli-notes.herokuapp.com"; //prod
  const CookieDetails = {
    name: "token",
    url: domain,
  };
  //   chrome.cookies.get(CookieDetails, (cookie) => {
  // if (!cookie) {
  //   console.log("no");
  // }
  // console.log("yes");
  //   });
  if (request.message === "insertHeading") {
    fetch(`${domain}/api/v1/insert/heading`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // text: document.querySelector("#heading").value,
        text: request.value,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((res) => {
            sendResponse(setResponse(true, "Successfully inserted Heading"));

            // responseArea.innerHTML = JSON.stringify(res, undefined, 2);
          })
          .catch(
            (error) =>
              sendResponse(
                setResponse(false, "not Successfully inserted Headingt")
              )

            //   (errorArea.innerHTML = JSON.stringify(error, undefined, 2))
          );
      })
      .catch((error) =>
        sendResponse(setResponse(false, "not Successfully inserted Heading"))
      );
  }
});
