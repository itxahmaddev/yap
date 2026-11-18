// Download picker: lists every installer in the latest GitHub release with its
// file name, format and size, and links straight to the file.

const REPO = "itxahmaddev/yap";
const API = `https://api.github.com/repos/${REPO}/releases/latest`;
const CACHE_KEY = "yap-release-v1";
const CACHE_MS = 10 * 60 * 1000;

// Used when the GitHub API is unreachable or rate-limited. Refreshed on deploy.
const FALLBACK = {
  tag: "v0.5.3",
  published: null,
  files: [
    ["Yap_0.5.3_x64-setup.exe", 16885023],
    ["Yap_0.5.3_x64_en-US.msi", 32403456],
    ["Yap_0.5.3_arm64-setup.exe", 10465056],
    ["Yap_0.5.3_arm64_en-US.msi", 15069184],
    ["Yap_0.5.3_aarch64.dmg", 14231991],
    ["Yap_0.5.3_x64.dmg", 14532526],
    ["Yap_0.5.3_amd64.deb", 33947566],
    ["Yap_0.5.3_arm64.deb", 29518658],
    ["Yap-0.5.3-1.x86_64.rpm", 90349693],
    ["Yap-0.5.3-1.aarch64.rpm", 76737461],
    ["Yap_0.5.3_amd64.AppImage", 123619832],
    ["Yap_0.5.3_aarch64.AppImage", 115681800],
  ].map(([name, size]) => ({
    name,
    size,
    url: `https://github.com/${REPO}/releases/download/v0.5.3/${name}`,
  })),
};

const OS_LABEL = { windows: "Windows", mac: "macOS", linux: "Linux" };

/** Turn a release asset into a displayable item, or null if it isn't an installer. */
function classify(asset) {
  const n = asset.name;
  if (/\.sig$/i.test(n) || n === "latest.json" || /\.app\.tar\.gz$/i.test(n))
    return null;
  const arm = /arm64|aarch64/i.test(n);
  const ext = (n.match(/\.(exe|msi|dmg|deb|rpm|appimage)$/i) ||
    [])[1]?.toLowerCase();
  if (!ext) return null;

  const base = {
    name: n,
    size: asset.size,
    url: asset.url,
    ext: ext === "appimage" ? "AppImage" : ext,
  };
  switch (ext) {
    case "exe":
      return {
        ...base,
        os: "windows",
        arch: arm ? "ARM64" : "x64",
        kind: "Setup installer",
        rank: 0,
      };
    case "msi":
      return {
        ...base,
        os: "windows",
        arch: arm ? "ARM64" : "x64",
        kind: "MSI package",
        rank: 1,
      };
    case "dmg":
      return {
        ...base,
        os: "mac",
        arch: arm ? "Apple silicon" : "Intel",
        kind: arm ? "Disk image, M1 and newer" : "Disk image, older Macs",
        rank: 0,
      };
    case "deb":
      return {
        ...base,
        os: "linux",
        arch: arm ? "ARM64" : "x86_64",
        kind: "Debian / Ubuntu",
        rank: 0,
      };
    case "rpm":
      return {
        ...base,
        os: "linux",
        arch: arm ? "ARM64" : "x86_64",
        kind: "Fedora / RHEL",
        rank: 1,
      };
    default:
      return {
        ...base,
        os: "linux",
        arch: arm ? "ARM64" : "x86_64",
        kind: "Portable, runs anywhere",
        rank: 2,
      };
  }
}

function archOrder(item) {
  // The common chip first: x64 on Windows and Linux, Apple silicon on Mac.
  const arm = /arm|apple/i.test(item.arch);
  return item.os === "mac" ? (arm ? 0 : 1) : arm ? 1 : 0;
}

export function formatSize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 100 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`;
}

function normalize(tag, published, assets) {
  const items = assets
    .map(classify)
    .filter(Boolean)
    .sort((a, b) => archOrder(a) - archOrder(b) || a.rank - b.rank);
  return { tag, published, items };
}

async function fetchRelease() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;
  } catch {
    /* storage unavailable */
  }
  const res = await fetch(API, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const rel = await res.json();
  const assets = (rel.assets || []).map((a) => ({
    name: a.name,
    size: a.size,
    url: a.browser_download_url,
  }));
  const data = normalize(rel.tag_name, rel.published_at, assets);
  if (!data.items.length) throw new Error("no installers in release");
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore */
  }
  return data;
}

let releasePromise = null;
/** Resolves with { tag, published, items }. Never rejects; falls back to a snapshot. */
export function loadRelease() {
  releasePromise ??= fetchRelease().catch(() =>
    normalize(FALLBACK.tag, FALLBACK.published, FALLBACK.files),
  );
  return releasePromise;
}

/** Best guess at the visitor's OS and CPU, used to highlight one file. */
export async function detectPlatform() {
  const ua =
    `${navigator.userAgentData?.platform || ""} ${navigator.platform || ""} ${navigator.userAgent}`.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(ua))
    return { os: null, arm: false, archKnown: false };
  const os = /mac/.test(ua)
    ? "mac"
    : /win/.test(ua)
      ? "windows"
      : /linux|x11|cros/.test(ua)
        ? "linux"
        : null;
  let arm = /arm|aarch64/.test(navigator.platform || "");
  let archKnown = false;
  try {
    const hi = await navigator.userAgentData?.getHighEntropyValues?.([
      "architecture",
    ]);
    if (hi?.architecture) {
      arm = hi.architecture === "arm";
      archKnown = true;
    }
  } catch {
    /* not supported */
  }
  return { os, arm, archKnown };
}

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

const DL_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14"/></svg>';

/** Wire up the dialog. Returns open(os). */
export function initDownloadDialog({ platform }) {
  const dialog = document.getElementById("dlDialog");
  const tabs = [...dialog.querySelectorAll(".dl-tab")];
  const list = document.getElementById("dlList");
  const meta = document.getElementById("dlMeta");
  const note = document.getElementById("dlNote");
  let data = null;
  let current = "windows";
  let lastFocus = null;

  const NOTES = {
    windows:
      "Not sure? Pick the x64 setup. Use ARM64 only on Windows on ARM devices.",
    mac: "Apple silicon is any Mac from late 2020 onward (M1 or newer). Older Macs are Intel.",
    linux:
      "On Debian or Ubuntu run: sudo apt install ./Yap_*.deb so dependencies come along.",
  };

  function render() {
    tabs.forEach((t) => {
      const on = t.dataset.os === current;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    list.replaceChildren();
    note.textContent = NOTES[current];
    if (!data) {
      for (let i = 0; i < 3; i++) list.append(el("li", "dl-row dl-skel"));
      return;
    }
    meta.textContent = `Version ${data.tag}`;
    const items = data.items.filter((i) => i.os === current);
    // Highlight one file for the visitor's own system.
    const pick = {
      windows: (i) => i.ext === "exe" && /ARM/.test(i.arch) === platform.arm,
      mac: (i) => platform.archKnown && /Apple/.test(i.arch) === platform.arm,
      linux: (i) => i.ext === "AppImage" && /ARM/.test(i.arch) === platform.arm,
    }[current];
    const best = platform.os === current ? items.find(pick) : null;
    items.forEach((item) => {
      const row = el("li", "dl-row");
      const badge = el("span", "dl-ext", `.${item.ext}`);
      const info = el("div", "dl-info");
      info.append(el("span", "dl-name", item.name));
      info.append(el("span", "dl-sub", `${item.arch} · ${item.kind}`));
      const size = el("span", "dl-size", formatSize(item.size));
      const a = el("a", "btn btn-solid btn-sm dl-get");
      a.href = item.url;
      a.setAttribute("download", item.name);
      a.rel = "noopener";
      a.setAttribute(
        "aria-label",
        `Download ${item.name}, ${formatSize(item.size)}`,
      );
      a.innerHTML = `${DL_ICON}<span>Download</span>`;
      row.append(badge, info, size, a);
      if (item === best) {
        row.classList.add("is-best");
        info.append(el("span", "dl-rec", "Recommended for your device"));
      }
      list.append(row);
    });
    if (!items.length)
      list.append(
        el("li", "dl-empty", "No files for this system in the latest release."),
      );
  }

  function open(os) {
    current = os && OS_LABEL[os] ? os : platform.os || "windows";
    lastFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    render();
    loadRelease().then((d) => {
      data = d;
      if (dialog.open) render();
    });
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => {
      current = t.dataset.os;
      render();
    });
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next =
        tabs[
          (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length
        ];
      next.focus();
      next.click();
    });
  });

  const close = () => dialog.close();
  dialog.querySelector(".dl-close").addEventListener("click", close);
  // Click on the backdrop (the dialog element itself, outside the panel) closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("dl-open");
    lastFocus?.focus?.();
  });
  new MutationObserver(() =>
    document.documentElement.classList.toggle("dl-open", dialog.open),
  ).observe(dialog, {
    attributes: true,
    attributeFilter: ["open"],
  });

  // Warm the cache so the list is instant when the dialog opens.
  loadRelease().then((d) => {
    data = d;
    const v = document.getElementById("version");
    if (v && /^v?\d/.test(d.tag))
      v.textContent = d.tag.startsWith("v") ? d.tag : `v${d.tag}`;
  });

  return open;
}
