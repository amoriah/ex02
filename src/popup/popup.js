const start = document.getElementById("start-btn");

start.addEventListener("click", () => {
  chrome.tabs.create({ url: "./src/index.html" });
});
