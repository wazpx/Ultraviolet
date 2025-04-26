const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const newTabBtn = document.getElementById("newTabBtn");
const homeBtn = document.getElementById("homeBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const searchInput = document.getElementById("searchInput");
const tilesContainer = document.getElementById("tiles");

let tabId = 0;
const tabs = [];

function createTab(url = "home") {
  const id = tabId++;
  const title = url === "home" ? "Home" : url;

  const iframe = document.createElement("iframe");
  iframe.src = (url === "home") ? "home.html" : `/uv/service/${encodeURIComponent(url)}`;
  iframe.dataset.tabId = id;
  tabContent.appendChild(iframe);

  tabs.push({ id, iframe });
  setActiveTab(id);
}

function setActiveTab(id) {
  tabs.forEach(tab => {
    tab.iframe.style.display = (tab.id === id) ? "block" : "none";
  });
}

newTabBtn.onclick = () => createTab("home");
homeBtn.onclick = () => createTab("home");

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    const url = query.startsWith("http") ? query : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    createTab(url);
    searchInput.value = "";
  }
});

const defaultTiles = [
  { name: "Google", url: "https://www.google.com", icon: "assets/google.png" },
  { name: "YouTube", url: "https://www.youtube.com", icon: "assets/youtube.png" },
  { name: "Discord", url: "https://discord.com", icon: "assets/discord.png" },
  { name: "Spotify", url: "https://spotify.com", icon: "assets/spotify.png" },
  { name: "GitHub", url: "https://github.com", icon: "assets/github.png" },
  { name: "Twitch", url: "https://twitch.tv", icon: "assets/twitch.png" },
  { name: "ChatGPT", url: "https://chat.openai.com", icon: "assets/chatgpt.png" }
];

function renderTiles() {
  tilesContainer.innerHTML = "";
  defaultTiles.forEach(tile => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `
      <img src="${tile.icon}" alt="${tile.name}">
      <p>${tile.name}</p>
    `;
    div.onclick = () => createTab(tile.url);
    tilesContainer.appendChild(div);
  });
}

renderTiles();
createTab("home");
