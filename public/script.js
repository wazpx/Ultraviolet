const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const newTabBtn = document.getElementById("newTabBtn");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const tilesContainer = document.getElementById("tiles");
const home = document.getElementById("home");
const homeBtn = document.getElementById("homeBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let tabId = 0;
const tabs = [];

function createTab(url = "/") {
  home.style.display = "none";

  const id = tabId++;
  const title = url.includes("google") ? "Google" : url;

  const tabButton = document.createElement("button");
  tabButton.innerText = title.length > 15 ? title.slice(0, 15) + "…" : title;
  tabButton.classList.add("tab-button");
  tabButton.onclick = () => setActiveTab(id);

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "×";
  closeBtn.classList.add("tab-close");
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeTab(id);
  };

  tabButton.appendChild(closeBtn);
  tabBar.insertBefore(tabButton, newTabBtn);

  const iframe = document.createElement("iframe");
  iframe.src = url === "/" ? "index.html" : `/uv/service/${encodeURIComponent(url)}`;
  iframe.dataset.tabId = id;
  iframe.style.display = "none";
  tabContent.appendChild(iframe);

  tabs.push({ id, button: tabButton, iframe });
  setActiveTab(id);
}

function setActiveTab(id) {
  tabs.forEach((tab) => {
    const isActive = tab.id === id;
    tab.button.classList.toggle("active", isActive);
    tab.iframe.style.display = isActive ? "block" : "none";
  });
}

function closeTab(id) {
  const index = tabs.findIndex((t) => t.id === id);
  if (index === -1) return;

  const [removed] = tabs.splice(index, 1);
  removed.button.remove();
  removed.iframe.remove();

  if (tabs.length) {
    setActiveTab(tabs[Math.max(index - 1, 0)].id);
  } else {
    home.style.display = "block";
  }
}

newTabBtn.onclick = () => createTab("/");

homeBtn.onclick = () => {
  tabContent.innerHTML = "";
  tabBar.innerHTML = "";
  home.style.display = "block";
};

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

searchBtn.onclick = search;
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") search();
});

function search() {
  const query = searchInput.value.trim();
  if (!query) return;
  let url = query;
  if (!query.startsWith("http")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(query);
  }
  createTab(url);
  searchInput.value = "";
}

const tiles = [
  { name: "Google", url: "https://google.com", icon: "https://www.google.com/favicon.ico" },
  { name: "YouTube", url: "https://youtube.com", icon: "https://www.youtube.com/s/desktop/8f8e62b5/img/favicon_144.png" },
  { name: "Spotify", url: "https://spotify.com", icon: "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png" },
  { name: "Discord", url: "https://discord.com", icon: "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico" },
  { name: "ChatGPT", url: "https://chat.openai.com", icon: "https://chat.openai.com/apple-touch-icon.png" },
  { name: "GeForce Now", url: "https://play.geforcenow.com", icon: "https://www.nvidia.com/etc/designs/nvidiaGFN/clientlib-all/images/favicon.ico" },
  { name: "GitHub", url: "https://github.com", icon: "https://github.githubassets.com/favicons/favicon-dark.svg" },
  { name: "Twitch", url: "https://twitch.tv", icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" },
  { name: "ESPN", url: "https://espn.com", icon: "https://a.espncdn.com/favicon.ico" },
  { name: "TikTok", url: "https://tiktok.com", icon: "https://sf16-website-login.neutral.ttwstatic.com/obj/ttfe/ies/superpage/favicon.ico" },
];

function renderTiles() {
  tilesContainer.innerHTML = "";
  tiles.forEach((tile) => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `
      <img src="${tile.icon}" alt="${tile.name}" />
      <p>${tile.name}</p>
    `;
    div.onclick = () => createTab(tile.url);
    tilesContainer.appendChild(div);
  });
}

renderTiles();
