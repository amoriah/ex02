// const start = document.getElementById("start-btn");
// start.addEventListener("click", () => {
//   chrome.tabs.query({ active: true }, (tabs) => {
//     const tab = tabs[0];
//     if (tab) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: tab.id, allFrames: true },
//           func: grabImages,
//         },
//         onResult
//       );
//     } else {
//       alert("There are no active tabs");
//     }
//   });
// });

// function grabImages() {
//   return ["array", "array", "array", "array"];
// }

// function onResult(frames) {
//   if (!frames || !frames.length) {
//     alert(`Could not retrieve images from specified page ${frames}`);
//     return;
//   }
//   alert("result!");
// }

// const start = document.getElementById("start-btn");

// start.addEventListener("click", () => {
//   chrome.tabs.create({ url: "./login/login.html" });
// });
