// const createDocumentDiv = document.getElementById("createDocumentDiv");
// const documentName = document.getElementById("documentName");
// const createDocument = document.getElementById("createDocument");
// const inputBox = document.getElementById("inputBox");
// let isSubmitClicked = false;

// createDocumentDiv.addEventListener("click", function () {
//   this.classList.toggle("active");
// });

// createDocument.addEventListener("click", function () {
//   //   this.classList.toggle("active");
//   console.log("Clicked");
//   if (isSubmitClicked) {
//     createDocument.style.backgroundImage = "url('add.png')";
//     //Collapse input bar
//     inputBox.style.display = "none";
//     inputBox.style.width = "0px";
//     createDocument.classList.toggle("active");
//     createDocumentDiv.classList.toggle("active");
//     isSubmitClicked = false;
//   } else {
//     createDocument.style.backgroundImage = "url('next.png')";
//     //Expand input bar
//     inputBox.style.display = "block";
//     inputBox.style.width = "200px";
//     createDocument.classList.toggle("active");
//     createDocumentDiv.classList.toggle("active");
//     isSubmitClicked = true;
//   }
// });

// var input = document.querySelector(".search-form");
// var search = document.querySelector("input");
// var button = document.querySelector("button");
// button.addEventListener("click", function (e) {
//   e.preventDefault();
//   input.classList.toggle("active");
// });
// search.addEventListener("focus", function () {
//   input.classList.add("focus");
// });

// search.addEventListener("blur", function () {
//   search.value.length != 0
//     ? input.classList.add("focus")
//     : input.classList.remove("focus");
// });

document
  .querySelector("#createDocument")
  .addEventListener("click", async function () {
    console.log(document.querySelector("#documentName").value);
  });

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
