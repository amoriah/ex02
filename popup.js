const start = document.getElementById("start-btn");

start.addEventListener("click", () => {
  chrome.tabs.create({ url: "./index.html" });
});
