const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const newTabBtn = document.getElementById("tabsBtn");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const homeBtn = document.getElementById("homeBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const home = document.getElementById("home");

let tabId = 0;
const tabs = [];

// Create a new tab
function createTab(url = "/") {
  home.style.display = "none"; // Hide homepage
  tabBar.style.display = "flex"; // Show tab bar when tab opened

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
  tabBar.appendChild(tabButton);

  const iframe = document.createElement("iframe");
  iframe.src = url === "/" ? "index.html" : `/uv/service/${encodeURIComponent(url)}`;
  iframe.dataset.tabId = id;
  iframe.style.display = "none";
  iframe.style.width = "100%";
  iframe.style.height = "calc(100vh - 5rem)";
  iframe.style.border = "none";
  tabContent.appendChild(iframe);

  tabs.push({ id, button: tabButton, iframe });
  setActiveTab(id);
}

// Set active tab
function setActiveTab(id) {
  tabs.forEach(tab => {
    const isActive = tab.id === id;
    tab.button.classList.toggle("active", isActive);
    tab.iframe.style.display = isActive ? "block" : "none";
  });
}

// Close a tab
function closeTab(id) {
  const index = tabs.findIndex(t => t.id === id);
  if (index === -1) return;

  const [removed] = tabs.splice(index, 1);
  removed.button.remove();
  removed.iframe.remove();

  if (tabs.length) {
    setActiveTab(tabs[Math.max(index - 1, 0)].id);
  } else {
    home.style.display = "flex"; // Show homepage if no tabs left
    tabBar.style.display = "none";
  }
}

// Add new tab on clicking tabsBtn
newTabBtn.onclick = () => {
  const url = prompt("Enter URL:");
  if (url) {
    createTab(url);
  }
};

// Handle homepage shortcuts
let tiles = JSON.parse(localStorage.getItem("tiles")) || [];

function renderTiles() {
  home.innerHTML = "";
  tiles.forEach((tile) => {
    const div = document.createElement("div");
    div.className = "shortcutBig";
    div.innerHTML = `<img src="${tile.icon}" alt="${tile.name}">`;
    div.onclick = () => createTab(tile.url);
    home.appendChild(div);
  });
}

// Add new homepage shortcut
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "k") { // Ctrl + K to add tile
    e.preventDefault();
    const name = prompt("Site Name?");
    const url = prompt("Site URL?");
    const icon = prompt("Icon URL?");
    if (!name || !url || !icon) return;
    tiles.push({ name, url, icon });
    localStorage.setItem("tiles", JSON.stringify(tiles));
    renderTiles();
  }
});

// Search when pressing Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchGoogle();
  }
});

// Search when clicking search icon
searchBtn.onclick = () => {
  searchGoogle();
};

// Google search function
function searchGoogle() {
  const query = searchInput.value.trim();
  if (!query) return;
  let url = query;
  if (!query.startsWith("http")) {
    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  createTab(url);
  searchInput.value = "";
}

// Go home
homeBtn.onclick = () => {
  home.style.display = "flex";
  tabBar.style.display = "none";
  tabContent.innerHTML = "";
  tabs.length = 0;
};

// Fullscreen mode
fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// Initial setup
renderTiles();
home.style.display = "flex";
tabBar.style.display = "none";
