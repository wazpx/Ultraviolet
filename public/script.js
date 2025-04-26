const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const newTabBtn = document.getElementById("newTabBtn");
const searchInput = document.getElementById("search");
const tilesContainer = document.getElementById("tiles");
const addTileButton = document.getElementById("addTile");

let tabId = 0;
const tabs = [];

function createTab(url = "/") {
  const id = tabId++;
  const title = url === "/" ? "Home" : url;

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
  }
}

newTabBtn.onclick = () => createTab("/");

// Load shortcut tiles from localStorage
let tiles = JSON.parse(localStorage.getItem("tiles")) || [];

function renderTiles() {
  tilesContainer.innerHTML = "";
  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `
      <img src="${tile.icon}" alt="logo" />
      <p>${tile.name}</p>
    `;
    div.onclick = () => createTab(tile.url);
    tilesContainer.appendChild(div);
  });
}

addTileButton.onclick = () => {
  const name = prompt("Name?");
  const url = prompt("URL?");
  const icon = prompt("Icon URL?");
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
createTab("/"); // Load initial "home" tab
