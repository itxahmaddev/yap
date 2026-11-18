import { initDownloadDialog, detectPlatform } from "./downloads.js";

const YAP = (window.YAP = window.YAP || {});
YAP.mic = YAP.mic || { active: false, level: 0, bands: new Float32Array(7) };

const root = document.documentElement;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const finePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const animate = Boolean(gsap && ScrollTrigger) && !reduceMotion;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

if (!animate) root.classList.add("load-failed");
if (animate) gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   Theme
   ========================================================= */

function setTheme(name, persist) {
  root.setAttribute("data-theme", name);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute("content", name === "light" ? "#fafafa" : "#000000");
  });
  if (persist) {
    try {
      localStorage.setItem("yap-theme", name);
    } catch {
      /* private mode: theme still applies for this visit */
    }
  }
  YAP.setTheme?.(name);
}

document.querySelectorAll(".theme-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    setTheme(
      root.getAttribute("data-theme") === "light" ? "dark" : "light",
      true,
    );
  });
});

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem("yap-theme");
    } catch {
      /* ignore */
    }
    if (!saved) setTheme(e.matches ? "light" : "dark", false);
  });

/* =========================================================
   Split headings into masked words (before anything is visible)
   ========================================================= */

document.querySelectorAll(".split").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName !== "BR"
      ) {
        walk(child);
      }
    });
  };
  walk(el);
});

/* =========================================================
   Loader: wait for fonts + first 3D frame, then reveal once
   ========================================================= */

const pctEl = document.getElementById("loaderPct");
const barEl = document.getElementById("loaderBar");
let shown = 0;
let target = 0;
let progressRaf = 0;
function paintProgress() {
  shown += (target - shown) * 0.12;
  if (target - shown < 0.4) shown = target;
  pctEl.textContent = String(Math.round(shown));
  barEl.style.transform = `scaleX(${shown / 100})`;
  if (shown < 100) progressRaf = requestAnimationFrame(paintProgress);
}
function bump(to) {
  target = Math.max(target, to);
  cancelAnimationFrame(progressRaf);
  progressRaf = requestAnimationFrame(paintProgress);
}
bump(18);

const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() =>
  bump(55),
);
const sceneReady = new Promise((resolve) => {
  if (YAP.sceneReady) return resolve();
  window.addEventListener("yap:scene-ready", resolve, { once: true });
}).then(() => bump(90));
// Drift forward while waiting so the bar never looks stuck.
const drift = setInterval(() => bump(Math.min(85, target + 4)), 260);

const minShow = wait(reduceMotion ? 0 : 650);
const everything = Promise.all([fontsReady, sceneReady, minShow]);
Promise.race([everything, wait(7000)]).then(async () => {
  clearInterval(drift);
  bump(100);
  await wait(reduceMotion ? 0 : 320);
  reveal();
});

function reveal() {
  root.classList.remove("is-loading");
  root.classList.add("is-ready");
  YAP.startIntro?.();
  if (!animate) return;

  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.25 });
  tl.fromTo(
    ".hero-title .word",
    // y: 0 overrides the CSS start offset so GSAP doesn't stack the two.
    { y: 0, yPercent: 110 },
    { y: 0, yPercent: 0, duration: 1.3, stagger: 0.1 },
  ).to(
    ".hero .reveal",
    { opacity: 1, y: 0, duration: 1, stagger: 0.07 },
    "-=0.95",
  );
  setupScroll();
}

/* =========================================================
   Scroll-driven animation
   ========================================================= */

function setupScroll() {
  gsap.to(".hero-inner", {
    yPercent: -14,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  document.querySelectorAll(".split").forEach((el) => {
    gsap.from(el.querySelectorAll(".w > span"), {
      yPercent: 110,
      duration: 1.05,
      ease: "expo.out",
      stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils
    .toArray("main .reveal:not(.hero .reveal), .kicker, .section-sub")
    .forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        },
      );
    });

  gsap.utils.toArray(".bento .card, .platform").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 48,
      rotateX: -12,
      transformPerspective: 900,
      duration: 1.1,
      ease: "expo.out",
      delay: (i % 3) * 0.06,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: el, start: "top 94%" },
    });
  });

  gsap.from(".stat", {
    opacity: 0,
    y: 24,
    duration: 0.9,
    ease: "expo.out",
    stagger: 0.05,
    clearProps: "transform,opacity",
    scrollTrigger: { trigger: ".stats", start: "top 92%" },
  });
  ["model-list", "faq-list"].forEach((cls) => {
    ScrollTrigger.create({
      trigger: `.${cls}`,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.fromTo(
          `.${cls} > *`,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.9,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
        ),
    });
  });

  gsap.from(".demo, .terminal", {
    opacity: 0,
    y: 70,
    rotateY: -14,
    rotateX: 6,
    transformPerspective: 1200,
    duration: 1.3,
    ease: "expo.out",
    clearProps: "transform,opacity",
    scrollTrigger: { trigger: ".demo", start: "top 88%" },
  });

  gsap.fromTo(
    ".big-num",
    { scale: 0.65, opacity: 0, filter: "blur(16px)" },
    {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: ".statement",
        start: "top 85%",
        end: "top 30%",
        scrub: true,
      },
    },
  );

  gsap.fromTo(
    ".footer-huge",
    { yPercent: 35, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".footer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    },
  );
}

/* =========================================================
   Nav: scrolled state, dim layer, current section, mobile sheet
   ========================================================= */

const nav = document.getElementById("nav");
let scrollRaf = 0;
function onScroll() {
  scrollRaf = 0;
  const y = window.scrollY;
  nav.classList.toggle("is-scrolled", y > 20);
  const hero = Math.min(1, y / window.innerHeight);
  root.style.setProperty(
    "--dim",
    String(Math.min(0.82, Math.max(0, (hero - 0.2) * 1.4))),
  );
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(onScroll);
  },
  { passive: true },
);
onScroll();

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle(
          "is-current",
          a.getAttribute("href") === `#${entry.target.id}`,
        ),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
["how", "features", "models", "faq"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

const menuBtn = document.getElementById("menuBtn");
const sheet = document.getElementById("sheet");
function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    nav.classList.add("is-scrolled");
  } else {
    sheet.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!sheet.classList.contains("is-open")) sheet.hidden = true;
    }, 600);
    onScroll();
  }
}
menuBtn.addEventListener("click", () =>
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true"),
);
sheet
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuBtn.focus();
  }
});
window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

/* =========================================================
   Stats count-up
   ========================================================= */

const statObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (reduceMotion || end === 0) {
        el.textContent = `${end}${suffix}`;
        return;
      }
      const t0 = performance.now();
      const dur = 1400;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 4);
        el.textContent = `${Math.round(end * eased)}${suffix}`;
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = `0${suffix}`;
      requestAnimationFrame(step);
    });
  },
  { threshold: 0.6 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((el) => statObserver.observe(el));

/* =========================================================
   Tilt + magnetic buttons (mouse only)
   ========================================================= */

if (finePointer && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach((el) => {
    const max =
      el.classList.contains("demo") || el.classList.contains("terminal")
        ? 5
        : 8;
    const glow = el.querySelector(".card-glow");
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        if (glow) {
          glow.style.setProperty("--gx", `${px * 100}%`);
          glow.style.setProperty("--gy", `${py * 100}%`);
        }
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  document.querySelectorAll(".btn, .mic-btn").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${(e.clientX - r.left - r.width / 2) * 0.18}px`,
      );
      el.style.setProperty(
        "--my",
        `${(e.clientY - r.top - r.height / 2) * 0.25}px`,
      );
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  });
}

/* =========================================================
   How-it-works demo
   ========================================================= */

const PHRASES = [
  "Hey team, the build is green. Shipping the release tonight after one last check.",
  "Remind me to call Sara about the venue on Thursday morning.",
  "Refactor the audio manager so the recorder restarts when the device changes.",
];
const STEP_MS = [1300, 2600, 1300, 2600];

const steps = [...document.querySelectorAll(".step")];
const demoText = document.getElementById("demoText");
const pill = document.getElementById("pill");
const pillLabel = document.getElementById("pillLabel");
const pillBars = [...pill.querySelectorAll(".pill-bars i")];
pillBars.forEach((b, i) => b.style.setProperty("--i", String(i)));
const keyCtrl = document.getElementById("keyCtrl");
const keySpace = document.getElementById("keySpace");

function setStep(i) {
  steps.forEach((s, n) => {
    s.classList.toggle("is-active", n === i);
    s.style.setProperty("--step-ms", `${STEP_MS[i]}ms`);
  });
}

let barsRaf = 0;
function animatePillBars(on) {
  cancelAnimationFrame(barsRaf);
  if (!on) {
    pillBars.forEach((b) => (b.style.height = "5px"));
    return;
  }
  const loop = (now) => {
    const t = now / 1000;
    pillBars.forEach((b, i) => {
      const v =
        Math.abs(Math.sin(t * 7 + i * 0.9)) *
        (0.5 + 0.5 * Math.sin(t * 2.3 + i * 0.4));
      b.style.height = `${4 + v * 14}px`;
    });
    barsRaf = requestAnimationFrame(loop);
  };
  barsRaf = requestAnimationFrame(loop);
}

let demoVisible = false;
let demoRunning = false;
async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  let p = 0;
  while (demoVisible) {
    const phrase = PHRASES[p++ % PHRASES.length];
    demoText.textContent = "";

    setStep(0);
    keyCtrl.classList.add("is-down");
    await wait(180);
    keySpace.classList.add("is-down");
    await wait(STEP_MS[0] - 180);

    setStep(1);
    pill.dataset.state = "recording";
    pillLabel.textContent = "Recording";
    animatePillBars(true);
    await wait(STEP_MS[1]);

    setStep(2);
    keyCtrl.classList.remove("is-down");
    keySpace.classList.remove("is-down");
    animatePillBars(false);
    pill.dataset.state = "transcribing";
    pillLabel.textContent = "Transcribing";
    await wait(STEP_MS[2]);

    setStep(3);
    pill.dataset.state = "idle";
    const words = phrase.split(" ");
    const per = Math.max(18, Math.floor(900 / words.length));
    for (let i = 0; i < words.length && demoVisible; i++) {
      demoText.textContent += (i ? " " : "") + words[i];
      await wait(per);
    }
    await wait(STEP_MS[3] - 900);
  }
  animatePillBars(false);
  demoRunning = false;
}

if (reduceMotion) {
  setStep(3);
  demoText.textContent = PHRASES[0];
} else {
  new IntersectionObserver(
    ([entry]) => {
      demoVisible = entry.isIntersecting;
      if (demoVisible) runDemo();
    },
    { threshold: 0.3 },
  ).observe(document.getElementById("demo"));
}

/* =========================================================
   Terminal typing
   ========================================================= */

const TERM = [
  {
    cmd: "yap --toggle-transcription",
    out: "# start or stop recording on the running instance",
  },
  {
    cmd: "yap --toggle-post-process",
    out: "# same, with post-processing on the result",
  },
  {
    cmd: "yap --start-hidden --no-tray",
    out: "# launch quietly for autostart",
  },
  { cmd: "yap --cancel", out: "# cancel whatever is in progress" },
];
const termCode = document.querySelector("#term code");
let termStarted = false;
const esc = (s) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

async function typeTerminal() {
  if (termStarted) return;
  termStarted = true;
  let html = "";
  const prefix = '<span class="p">~ $</span> ';
  for (const line of TERM) {
    if (!reduceMotion) {
      for (let i = 0; i <= line.cmd.length; i++) {
        termCode.innerHTML = `${html}${prefix}<span class="c">${esc(line.cmd.slice(0, i))}</span><span class="caret"></span>`;
        await wait(26 + Math.random() * 28);
      }
      await wait(260);
    }
    html += `${prefix}<span class="c">${esc(line.cmd)}</span>\n<span class="k">${esc(line.out)}</span>\n\n`;
    termCode.innerHTML = html;
    if (!reduceMotion) await wait(380);
  }
  termCode.innerHTML = `${html}${prefix}<span class="caret"></span>`;
}
new IntersectionObserver(([entry]) => entry.isIntersecting && typeTerminal(), {
  threshold: 0.35,
}).observe(document.getElementById("term"));

/* =========================================================
   FAQ: animate open/close
   ========================================================= */

document.querySelectorAll(".qa").forEach((qa) => {
  const summary = qa.querySelector("summary");
  const body = qa.querySelector(".qa-body");
  summary.addEventListener("click", (e) => {
    if (reduceMotion) return;
    e.preventDefault();
    if (qa.open) {
      const anim = body.animate(
        [
          { height: `${body.offsetHeight}px`, opacity: 1 },
          { height: "0px", opacity: 0 },
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
      anim.onfinish = () => (qa.open = false);
    } else {
      qa.open = true;
      body.animate(
        [
          { height: "0px", opacity: 0 },
          { height: `${body.offsetHeight}px`, opacity: 1 },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
    }
  });
});

/* =========================================================
   Download picker
   ========================================================= */

const OS_LABEL = { mac: "macOS", windows: "Windows", linux: "Linux" };
// Shared and updated in place, so nothing waits on CPU detection.
const platform = { os: null, arm: false, archKnown: false };
const openDownloads = initDownloadDialog({ platform });
detectPlatform().then((p) => {
  Object.assign(platform, p);
  if (!p.os) return;
  document
    .querySelector(`.platform[data-os="${p.os}"]`)
    ?.classList.add("is-recommended");
  document
    .querySelectorAll(".os-name")
    .forEach((el) => (el.textContent = OS_LABEL[p.os]));
});
document.querySelectorAll("[data-download]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    // Platform cards pass their own OS; every other button uses the visitor's.
    openDownloads(el.dataset.download || null);
    const sheet = document.getElementById("sheet");
    if (sheet?.classList.contains("is-open")) setMenu(false);
  });
});

/* =========================================================
   Live repo details (best effort, never blocks the page)
   ========================================================= */

const fmt = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
fetch("https://api.github.com/repos/itxahmaddev/yap", {
  headers: { Accept: "application/vnd.github+json" },
})
  .then((r) => (r.ok ? r.json() : null))
  .then((repo) => {
    // Only worth showing once there are a few stars.
    if (
      !repo ||
      typeof repo.stargazers_count !== "number" ||
      repo.stargazers_count < 10
    )
      return;
    const el = document.getElementById("ghStars");
    el.textContent = `★ ${fmt(repo.stargazers_count)}`;
    el.hidden = false;
  })
  .catch(() => {});
document.getElementById("year").textContent = String(new Date().getFullYear());

/* =========================================================
   Mic-driven 3D bars (audio stays in the tab)
   ========================================================= */

const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const micNote = document.getElementById("micNote");
const MIC_IDLE_LABEL = micLabel.textContent;
const MIC_IDLE_NOTE = micNote.textContent;
let audioCtx = null;
let stream = null;
let micRaf = 0;

async function startMic() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    micNote.textContent =
      "Mic access was blocked, so the bars keep talking on their own.";
    return;
  }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.7;
  src.connect(analyser);
  const freq = new Uint8Array(analyser.frequencyBinCount);
  const time = new Uint8Array(analyser.fftSize);
  // Voice sits roughly in 80 Hz–4 kHz: four log-spaced bands, mirrored so the
  // tallest middle bar carries the strongest band.
  const nyquist = audioCtx.sampleRate / 2;
  const edges = Array.from(
    { length: 5 },
    (_, i) => 80 * Math.pow(4000 / 80, i / 4),
  );
  const binOf = (hz) =>
    Math.min(freq.length - 1, Math.round((hz / nyquist) * freq.length));
  const order = [3, 2, 1, 0, 1, 2, 3];

  YAP.mic.active = true;
  micBtn.setAttribute("aria-pressed", "true");
  micLabel.textContent = "Listening, tap to stop";
  micNote.textContent =
    "Talk and watch the logo move. Nothing is recorded or sent.";
  if (window.scrollY > window.innerHeight * 0.5)
    window.scrollTo({ top: 0, behavior: "smooth" });

  const loop = () => {
    analyser.getByteFrequencyData(freq);
    analyser.getByteTimeDomainData(time);
    let sum = 0;
    for (let i = 0; i < time.length; i++) {
      const v = (time[i] - 128) / 128;
      sum += v * v;
    }
    YAP.mic.level = Math.min(1, Math.sqrt(sum / time.length) * 4);
    const bands = [];
    for (let b = 0; b < 4; b++) {
      let s = 0;
      const a = binOf(edges[b]);
      const z = Math.max(a + 1, binOf(edges[b + 1]));
      for (let i = a; i < z; i++) s += freq[i];
      bands.push(s / (z - a) / 255);
    }
    for (let i = 0; i < 7; i++)
      YAP.mic.bands[i] = Math.min(1, bands[order[i]] * 1.5);
    micRaf = requestAnimationFrame(loop);
  };
  loop();
}

function stopMic() {
  cancelAnimationFrame(micRaf);
  stream?.getTracks().forEach((t) => t.stop());
  audioCtx?.close();
  stream = null;
  audioCtx = null;
  YAP.mic.active = false;
  YAP.mic.level = 0;
  micBtn.setAttribute("aria-pressed", "false");
  micLabel.textContent = MIC_IDLE_LABEL;
  micNote.textContent = MIC_IDLE_NOTE;
}

if (!navigator.mediaDevices?.getUserMedia) {
  micBtn.closest(".mic-try").hidden = true;
} else {
  micBtn.addEventListener("click", () =>
    YAP.mic.active ? stopMic() : startMic(),
  );
}
