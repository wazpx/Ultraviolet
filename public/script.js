const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const newTabBtn = document.getElementById("newTabBtn");
const searchInput = document.getElementById("searchInput");
const tilesContainer = document.getElementById("tiles");
const addTileButton = document.getElementById("addTile");

let tabId = 0;
const tabs = [];

function createTab(url = "home") {
  const id = tabId++;
  const title = (url === "home") ? "Home" : url;

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
  if (url === "home") {
    iframe.src = "home.html"; // load your home screen (separate from proxy)
  } else {
    iframe.src = "/uv/service/" + encodeURIComponent(url);
  }
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
  }
}

newTabBtn.onclick = () => createTab("home");

let tiles = JSON.parse(localStorage.getItem("tiles")) || [
  {
    name: "Google",
    url: "https://www.google.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
  },
  {
    name: "Discord",
    url: "https://discord.com",
    icon: "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg"
  },
  {
    name: "Spotify",
    url: "https://www.spotify.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
  }
];

function renderTiles() {
  tilesContainer.innerHTML = "";
  tiles.forEach((tile, index) => {
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

addTileButton.onclick = () => {
  const name = prompt("Site name?");
  const url = prompt("Site URL?");
  const icon = prompt("Site icon URL?");
  if (!name || !url || !icon) return;

  tiles.push({ name, url, icon });
  localStorage.setItem("tiles", JSON.stringify(tiles));
  renderTiles();
};

searchInput.onkeypress = (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;

    let url = query;
    if (!query.startsWith("http")) {
      url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    }
    createTab(url);
    searchInput.value = "";
  }
};

renderTiles();
createTab("home");
