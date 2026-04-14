/**
 * Shared gallery logic for index and project pages.
 */
const ASSET_FILES = [
  "DSCF0007.jpg",
  "DSCF0013.jpg",
  "DSCF0018.jpg",
  "DSCF0029.jpg",
  "DSCF0203.jpg",
  "DSCF0206.jpg",
  "DSCF0213.jpg",
  "DSCF0237.jpg",
  "DSCF0242.jpg",
  "DSCF0245.jpg",
  "DSCF0262.jpg",
  "DSCF0336.jpg",
  "DSCF0349.jpg",
  "DSCF0375.jpg",
  "DSCF0408.jpg",
  "DSCF0654.jpg",
  "DSCF0655.jpg",
  "DSCF0673.jpg",
  "DSCF0701.jpg",
  "DSCF0755.jpg",
  "DSCF0763.jpg",
  "DSCF0861.jpg",
  "DSCF0913.jpg",
  "DSCF0975.jpg",
  "DSCF0990.jpg",
  "DSCF1057.jpg",
  "DSCF1774.jpg",
  "DSCF1785.jpg",
  "DSCF1832.jpg",
  "DSCF4777.jpg",
  "DSCF4778.jpg",
  "DSCF4783.jpg",
  "DSCF4784.jpg",
  "DSCF4786.jpg",
  "DSCF4796.jpg",
  "DSCF4799.jpg",
  "DSCF4801.jpg",
  "DSCF4803.jpg",
  "DSCF4804.jpg",
  "DSCF4818.jpg",
  "DSCF7069.jpg",
  "DSCF9469.jpg",
  "DSCF9478.jpg",
  "DSCF9544.jpg",
  "DSCF9555.jpg",
  "DSCF9556.jpg",
  "DSCF9595.jpg",
  "DSCF9597.jpg",
  "DSCF9608.jpg",
  "DSCF9621.jpg",
  "DSCF9625.jpg",
  "DSCF9645.jpg",
  "DSCF9651.jpg",
  "DSCF9674.jpg",
  "DSCF9690.jpg",
  "DSCF9771.jpg",
  "DSCF9873.jpg",
];

const PROJECT_TITLES = [
  "Winter Light, 2024",
  "Riverside Drift",
  "Interior Notes, 2023",
  "Market Day",
  "Night Walks, 2025",
  "Coastal Fog",
  "Studio Still Life",
  "Transit Lines, 2022",
  "Highland Silence",
  "Archive Room",
  "Summer Roof, 2024",
];

const SITE_INTRO_TEXTS = [
  "Working mainly on long-form series, the practice treats the camera as a slow instrument for reading light, distance, and the habits that shape public space. Prints are produced in small editions; commissions begin with a conversation about place and duration rather than a fixed shot list. Each project is given time to settle before any public shape is proposed. The work assumes a reader who is willing to move slowly through a room or a sequence of pages. Research usually starts before the first frame, with repeated walks at different hours and notes on traffic, shadows, and informal routes through the site. Contact sheets are reviewed weeks later, so decisions are made from memory and sequence logic rather than immediate novelty. The final pacing is tested in print dummies and simple wall layouts to ensure that transitions hold their weight without captions. When needed, text fragments are added only to clarify context, never to explain what an image should already carry. If a sequence still feels restless after several passes, it is set aside until the next season or light condition can offer a clearer counterweight to what is already on the wall.",
  "The site gathers field notes from walks, interiors, and transitional zones where architecture meets weather and routine. Nothing here is staged for effect: sequences are edited for rhythm and silence, not for spectacle. Contact is open for editorial, exhibition, and limited print requests. New bodies of work surface here as they reach a coherent length, not on a fixed schedule. Many projects begin as small observations made over months, then are reassembled around recurring surfaces, distances, and gestures that survive across locations. The edit avoids narrative shortcuts, preferring small shifts that can be read over time and across neighboring frames. Installations are planned with attention to circulation and viewing speed, so the room itself supports the sequence rather than competing with it. Updates appear when the work is structurally ready, with no pressure to publish unfinished fragments for frequency alone. Correspondence is kept direct and unhurried, because the aim is to match the right piece of work to the right context rather than to fill a calendar with placeholders.",
  "Documentation here follows a simple rule: stay close to the subject until the frame stops asking for decoration. Color is used sparingly; contrast is carried by structure and air. If you are curating a show or need a restrained visual essay, write with a short description of the venue and timeline. Replies are usually sent within a few days once the brief is clear. Assignments are approached as collaborative studies of place, with practical constraints discussed early to keep decisions transparent for everyone involved. During production, attention stays on continuity between images, so each frame extends the same spatial and tonal language instead of chasing isolated highlights. After delivery, files are reviewed in relation to print behavior, wall distance, and publication format to preserve consistency across contexts. Long-term archives are maintained with the same sequencing logic, allowing older material to be revisited when it meaningfully extends a newer body of work. Where schedules allow, a second visit is built into the process so the work can respond to how a site behaves once the first round of attention has passed.",
];

const PROJECT_SERIES_TEXTS = [
  "This series was assembled from several returns to the same streets across seasons. Frames that looked empty at first later revealed small shifts in material and tone; the edit keeps those changes legible without turning the work into a report. A few rolls were set aside for years before they found their place in the sequence. The final order was tested by walking through it on paper and on a wall. Several late additions were made only after comparing edge detail and density between distant sessions, so changes in weather could sit beside changes in maintenance and use. The sequence is built as a gradual drift from open facades to tighter thresholds, allowing scale to narrow before opening again near the end. Captions are intentionally minimal to keep attention on physical evidence inside the frame. What remains unseen is part of the structure, not missing information. The closing images return to the same corner as the opening, but with a different quality of light, so the loop reads as continuity rather than repetition.",
  "The pictures come from a narrow window of days when fog and sun traded places every hour. Exposure choices favored texture over clarity, so the sequence reads less like a survey and more like a weather diary with architecture in the margins. Carrying one focal length forced a consistent distance from the scene. Prints from this set are available on request in a single size. Contacts were first grouped by atmosphere, then reordered by directional light so neighboring images answer one another through shadow depth and surface grain. Repetition of certain motifs is deliberate and used to establish tempo before small departures in perspective. The goal was not coverage of the site but a stable viewing pulse that makes each interruption noticeable. Final prints were proofed with reduced contrast to preserve low-value transitions in overcast passages. A few frames that were technically stronger were cut because they collapsed the ambiguity that the surrounding images had carefully sustained.",
  "Made without assistants or added light, the set relies on patience and repetition. What repeats is not the subject but the distance between glances; the gallery is arranged so neighboring images argue quietly rather than illustrate a thesis. Several frames were discarded when they explained too much. The title arrived only after the edit felt stable. The remaining images are spaced to alternate dense and open structures, producing a steady cadence that can hold across both small screens and physical walls. Exposure decisions were intentionally conservative to protect highlights and leave room for subtle tonal separation in print. During editing, pairs were tested for disagreement rather than similarity, so transitions create friction before resolving into quieter passages. This balance between insistence and restraint defines the series more than any single location. The quietest frame sits near the middle, where the sequence briefly yields before the tension returns in the second half.",
  "A loose archive of corners, thresholds, and temporary barriers. The order is not chronological: it follows contrast and scale so the viewer can move through the room without a single dominant vantage point. Some negatives never left the contact sheet. The series name refers to a walk repeated until the route felt unfamiliar again. Over time, the archive developed into clusters that return to the same construction details under different conditions, making duration readable without explicit dates. Distance is kept relatively constant to let material changes carry the variation, while occasional wider frames reset spatial orientation. The edit favors transitions that feel slightly unresolved, inviting a second pass through the sequence before relations fully settle. What appears peripheral in one image often becomes structural in the next, which is central to how the work is meant to be read. Even the discarded sheets remain in the studio as a reminder of what the sequence refused to simplify.",
];

function pickRandom(arr) {
  if (!arr || !arr.length) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

let projectsDataCache = null;
let projectsDataInflight = null;

function loadProjectsData() {
  if (projectsDataCache) {
    return Promise.resolve(projectsDataCache);
  }
  if (projectsDataInflight) {
    return projectsDataInflight;
  }
  projectsDataInflight = fetch("data/projects.json")
    .then((r) => {
      if (!r.ok) {
        throw new Error(`projects.json ${r.status}`);
      }
      return r.json();
    })
    .then((json) => {
      projectsDataCache = json;
      projectsDataInflight = null;
      return json;
    })
    .catch((err) => {
      projectsDataInflight = null;
      throw err;
    });
  return projectsDataInflight;
}

async function loadProjectsDataOrNull() {
  try {
    return await loadProjectsData();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function getPublishedProjectsSorted(data) {
  if (!data || !Array.isArray(data.projects)) return [];
  return data.projects
    .filter((p) => p && p.isPublished === true)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

function coverSrcFromProject(project) {
  if (!project) return "";
  const idRaw = project.coverImageId;
  const id =
    idRaw != null && String(idRaw).trim() !== "" ? String(idRaw).trim() : "";
  if (id && /^[A-Za-z0-9_-]+$/.test(id)) {
    return `assets/${id}.jpg`;
  }
  const imgs = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  if (imgs.length) {
    return imgs[Math.floor(Math.random() * imgs.length)];
  }
  return "";
}

function buildIndexSlideHtml(project) {
  const title = escapeHtml(project.title || "");
  const desc = escapeHtml(project.description || "");
  const coverSrc = escapeAttr(coverSrcFromProject(project));
  const imgs = Array.isArray(project.images) ? project.images : [];
  const dataImages = JSON.stringify(imgs).replace(/</g, "\\u003c");
  return (
    `<div class="swiper-slide swiper-slide--work" data-project-images='${dataImages}'>` +
    '<div x-data="{ show: false }" class="slide-card" @click.away="show = false">' +
    '<div class="slide-top-spacer" aria-hidden="true"></div>' +
    '<div class="slide-bottom">' +
    '<div class="slide-hit">' +
    `<h1 class="slide-title">${title}<a class="link-underline" href="#" @click.prevent="show = !show" x-text="show ? 'Images' : 'View Gallery'">View Gallery</a></h1>` +
    '<div class="slide-main">' +
    '<div x-show="show" x-cloak class="slide-overlay" x-transition>' +
    `<div class="slide-overlay-inner"><p>${desc}</p></div></div>` +
    '<div class="slide-visual" :class="show ? \'is-hidden\' : \'\'">' +
    `<div class="cover-square"><img src="${coverSrc}" alt="" width="800" height="800" loading="lazy" /></div></div>` +
    "</div></div></div></div></div>"
  );
}

function applyIndexSiteMeta(data) {
  if (!data) return;
  if (data.siteTitle) {
    document.title = data.siteTitle;
  }
  const ig = document.getElementById("navInstagram");
  const ct = document.getElementById("navContact");
  const siteNameLinks = document.querySelectorAll(".nav-site-name, .nav-trigger");
  const siteOwnerName = data.siteOwnerName && String(data.siteOwnerName).trim() ? data.siteOwnerName : "";
  if (siteOwnerName) {
    siteNameLinks.forEach((el) => {
      el.textContent = siteOwnerName;
    });
  }
  if (ig && data.instagramText && String(data.instagramText).trim()) {
    ig.textContent = data.instagramText;
  }
  if (ig && data.instagramUrl) {
    ig.href = data.instagramUrl;
  }
  if (ct && data.contactUrl) {
    ct.href = data.contactUrl;
  }
  if (data.siteDescription) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = data.siteDescription;
  }
}

function initAlpineOnIndexSlides(wrapper) {
  if (typeof window.Alpine !== "undefined" && typeof window.Alpine.initTree === "function") {
    window.Alpine.initTree(wrapper);
  }
}

const isIosSafariUi =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/**
 * Safari macOS: <meta name="theme-color"> tends to add a full-width tab row (even after removal in code,
 * cached metas or one injection is enough). Yango-style sites avoid it on desktop.
 * theme-color + status-bar meta only on iOS; macOS relies on the black overlay only.
 */
function setProjectFullscreenBrowserChrome(dark) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

  const appleId = "meta-apple-status-bar";
  document.getElementById(appleId)?.remove();

  const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
  if (dark && (isIosSafariUi || mobileViewport)) {
    const t = document.createElement("meta");
    t.name = "theme-color";
    t.id = "meta-theme-color";
    t.content = "#000000";
    t.setAttribute("media", "(prefers-color-scheme: light)");
    const tDark = document.createElement("meta");
    tDark.name = "theme-color";
    tDark.id = "meta-theme-color-dark";
    tDark.content = "#000000";
    tDark.setAttribute("media", "(prefers-color-scheme: dark)");
    const charset = document.querySelector("meta[charset]");
    if (charset?.parentNode) {
      charset.parentNode.insertBefore(t, charset.nextSibling);
      charset.parentNode.insertBefore(tDark, t.nextSibling);
    } else {
      document.head.prepend(t);
      document.head.prepend(tDark);
    }
    if (isIosSafariUi) {
      const a = document.createElement("meta");
      a.id = appleId;
      a.name = "apple-mobile-web-app-status-bar-style";
      a.content = "black";
      document.head.appendChild(a);
    }
  }
}

function updateIntroPanelMaxHeight(panel, anchorEl) {
  if (!panel || !anchorEl) return;
  const cs = window.getComputedStyle(panel);
  if (cs.display === "none") {
    panel.style.maxHeight = "";
    return;
  }
  const line =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--line-height")) || 17;
  const panelRect = panel.getBoundingClientRect();
  const anchorTop = anchorEl.getBoundingClientRect().top;
  const maxH = Math.max(0, anchorTop - line - panelRect.top);
  panel.style.overflowY = "auto";
  panel.style.maxHeight = `${Math.floor(maxH)}px`;
}

function initIndexIntro(data) {
  const textEl = document.getElementById("siteIntroText");
  const panel = document.getElementById("siteIntroPanel");
  if (textEl) {
    textEl.textContent =
      data?.siteIntroText && String(data.siteIntroText).trim()
        ? data.siteIntroText
        : pickRandom(SITE_INTRO_TEXTS);
  }

  const anchorForLayout = () =>
    document.querySelector(".swiper-slide-active.swiper-slide--work .slide-title") ||
    document.querySelector(".swiper-slide--work .slide-title");

  const layout = () => {
    const anchor = anchorForLayout();
    if (!panel || !anchor) return;
    updateIntroPanelMaxHeight(panel, anchor);
  };

  let swiperSlideBound = false;
  const tryBindSwiper = () => {
    if (swiperSlideBound) return;
    const el = document.querySelector(".carousel-section .swiper-main");
    const swiper = el?.swiper;
    if (!swiper) return;
    swiper.on("slideChange", layout);
    swiperSlideBound = true;
  };

  window.addEventListener("site-intro-layout", () => {
    requestAnimationFrame(() => requestAnimationFrame(layout));
  });
  window.addEventListener("resize", layout);
  window.addEventListener("load", () => setTimeout(layout, 100));
  setTimeout(layout, 200);
  setTimeout(layout, 600);
  setTimeout(tryBindSwiper, 0);
  setTimeout(tryBindSwiper, 120);
  setTimeout(tryBindSwiper, 500);
}

function imagesForProject(projectIndex, count = 10) {
  const images = [];
  const start = (projectIndex * 5) % ASSET_FILES.length;
  for (let i = 0; i < count; i += 1) {
    images.push(`assets/${ASSET_FILES[(start + i) % ASSET_FILES.length]}`);
  }
  return images;
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hasMirrorRhythm(scales) {
  const n = scales.length;
  /* Contiguous palindrome (length ≥3) with not all elements identical — “mirror” rhythm */
  for (let len = 3; len <= n; len += 1) {
    for (let i = 0; i + len <= n; i += 1) {
      let pal = true;
      for (let k = 0; k < len; k += 1) {
        if (scales[i + k] !== scales[i + len - 1 - k]) {
          pal = false;
          break;
        }
      }
      if (!pal) continue;
      const first = scales[i];
      const allSame = scales.slice(i, i + len).every((v) => v === first);
      if (!allSame) return true;
    }
  }
  /* Symmetric valley: a > b < c with a === c */
  for (let i = 1; i < n - 1; i += 1) {
    const a = scales[i - 1];
    const b = scales[i];
    const c = scales[i + 1];
    if (a > b && b < c && a === c) return true;
  }
  /* Five-point symmetric “W”: a > b > c < d < e with a === e and b === d */
  for (let i = 0; i <= n - 5; i += 1) {
    const a = scales[i];
    const b = scales[i + 1];
    const c = scales[i + 2];
    const d = scales[i + 3];
    const e = scales[i + 4];
    if (a > b && b > c && c < d && d < e && a === e && b === d) return true;
  }
  return false;
}

function repairAdjacentHalfPairs(scales) {
  const adjacentHalfPairs = () => {
    let pairs = 0;
    for (let i = 1; i < scales.length; i += 1) {
      if (scales[i] === 0.5 && scales[i - 1] === 0.5) {
        pairs += 1;
      }
    }
    return pairs;
  };

  let guard = 80;
  while (adjacentHalfPairs() > 1 && guard > 0) {
    guard -= 1;
    for (let i = 1; i < scales.length; i += 1) {
      if (scales[i] === 0.5 && scales[i - 1] === 0.5) {
        const swapWith = scales.findIndex((v, idx) => idx > i && v !== 0.5);
        if (swapWith > i) {
          [scales[i], scales[swapWith]] = [scales[swapWith], scales[i]];
        }
      }
    }
  }
}

function repairMirrorRhythm(scales, rand) {
  let guard = 160;
  while (hasMirrorRhythm(scales) && guard > 0) {
    guard -= 1;
    const i = Math.floor(rand() * scales.length);
    let j = Math.floor(rand() * scales.length);
    if (j === i) j = (i + 1) % scales.length;
    [scales[i], scales[j]] = [scales[j], scales[i]];
  }
}

function initIndexCoverScales() {
  const slides = document.querySelectorAll(".swiper-slide--work");
  const n = slides.length;
  if (!n) return;
  const seedBase = Math.floor(Math.random() * 2147483646) + 1;
  const scales = withMobileLeadingFullScale(buildProjectSizeSequence(n, seedBase));
  slides.forEach((slide, i) => {
    slide.style.setProperty("--cover-scale", String(scales[i]));
  });
}

function buildProjectSizeSequence(count, seedBase = 1) {
  const rand = seededRandom((seedBase + 1) * 2654435761);
  const restScales = [0.875, 0.75, 0.625, 0.5];
  const scales = [];
  const bigCount = Math.max(3, Math.min(count, 3 + (rand() < 0.5 ? 1 : 0)));

  for (let i = 0; i < bigCount; i += 1) {
    scales.push(1);
  }
  while (scales.length < count) {
    const pick = restScales[Math.floor(rand() * restScales.length)];
    scales.push(pick);
  }

  // Shuffle for variety, then repair the "only one adjacent 4/8 pair" constraint.
  for (let i = scales.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [scales[i], scales[j]] = [scales[j], scales[i]];
  }

  repairAdjacentHalfPairs(scales);
  repairMirrorRhythm(scales, rand);
  repairAdjacentHalfPairs(scales);

  return scales;
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function withMobileLeadingFullScale(scales) {
  if (!Array.isArray(scales) || scales.length === 0) return [];
  const out = scales.slice();
  if (isMobileViewport()) {
    for (let i = 0; i < out.length; i += 1) {
      if (Number(out[i]) <= 0.5) out[i] = 0.625;
    }
    out[0] = 1;
  }
  return out;
}

const VALID_PROJECT_SCALES = [1, 0.875, 0.75, 0.625, 0.5];

function getProjectImageScales(project, projectIdx) {
  const n = project?.images?.length ?? 0;
  if (!n) return [];
  const fallback = buildProjectSizeSequence(n, projectIdx + 17);
  const stored = project?.imageScales;
  if (!Array.isArray(stored) || stored.length !== n) return fallback;
  return project.images.map((_, i) => {
    const s = Number(stored[i]);
    return VALID_PROJECT_SCALES.includes(s) ? s : fallback[i];
  });
}

window.__dsGetProjectImageScales = getProjectImageScales;

function initProjectCovers() {
  const slides = document.querySelectorAll(".swiper-slide--work");
  slides.forEach((slide, index) => {
    const cover = slide.querySelector(".cover-square");
    const img = slide.querySelector(".cover-square img");
    if (!cover || !img) return;

    let gallery;
    const raw = slide.getAttribute("data-project-images");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        gallery = Array.isArray(parsed) && parsed.length ? parsed : null;
      } catch {
        gallery = null;
      }
    }
    if (!gallery) {
      gallery = imagesForProject(index, 10);
    }
    let current = Math.floor(Math.random() * gallery.length);
    img.src = gallery[current];

    const nextImage = () => {
      current = (current + 1) % gallery.length;
      img.src = gallery[current];
    };

    cover.setAttribute("role", "button");
    cover.setAttribute("tabindex", "0");
    cover.setAttribute("aria-label", "Next project image");
    cover.addEventListener("click", nextImage);
    cover.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        nextImage();
      }
    });
  });
}

function setupProjectLinks() {
  const links = document.querySelectorAll(".slide-title a.link-underline");
  const published = projectsDataCache ? getPublishedProjectsSorted(projectsDataCache) : [];
  links.forEach((link, index) => {
    const p = published[index];
    const href = p?.slug
      ? `project.html?slug=${encodeURIComponent(p.slug)}`
      : `project.html?project=${index}`;
    link.setAttribute("href", href);
    link.textContent = "View Gallery";
    link.addEventListener(
      "click",
      (event) => {
        /* Prevent Alpine title-toggle handler from mutating card state before navigation. */
        event.stopImmediatePropagation();
        event.stopPropagation();
        const card = link.closest(".slide-card");
        const visual = card?.querySelector(".slide-visual");
        if (visual) visual.classList.remove("is-hidden");
      event.preventDefault();
      window.location.href = href;
      },
      true
    );
  });
}

function readProjectIndex() {
  const params = new URLSearchParams(window.location.search);
  const raw = Number(params.get("project") || 0);
  if (Number.isNaN(raw)) return 0;
  return Math.max(0, raw);
}

function resolveProjectFromList(list) {
  const params = new URLSearchParams(window.location.search);
  const slugRaw = params.get("slug");
  if (slugRaw != null && String(slugRaw).trim() !== "" && list.length) {
    const slug = String(slugRaw).trim();
    const i = list.findIndex((p) => p && p.slug === slug);
    if (i >= 0) {
      return { project: list[i], index: i };
    }
    console.warn("Unknown project slug:", slug);
    return { project: list[0], index: 0 };
  }
  const rawIdx = readProjectIndex();
  if (list.length === 0) {
    const maxLegacy = Math.max(0, PROJECT_TITLES.length - 1);
    const projectIdx = Math.min(Math.max(0, rawIdx), maxLegacy);
    return { project: null, index: projectIdx };
  }
  const projectIdx = Math.min(Math.max(0, rawIdx), list.length - 1);
  return { project: list[projectIdx], index: projectIdx };
}

function initProjectSiteIntroPanel(data) {
  const textEl = document.getElementById("siteIntroTextProject");
  const panel = document.getElementById("siteIntroPanelProject");
  const titleAnchor = document.getElementById("projectTitle");
  if (textEl) {
    textEl.textContent =
      data?.siteIntroText && String(data.siteIntroText).trim()
        ? data.siteIntroText
        : pickRandom(SITE_INTRO_TEXTS);
  }

  const layout = () => {
    if (!panel || !titleAnchor) return;
    updateIntroPanelMaxHeight(panel, titleAnchor);
  };

  window.addEventListener("site-intro-layout", () => {
    requestAnimationFrame(() => requestAnimationFrame(layout));
  });
  window.addEventListener("resize", layout);
  setTimeout(layout, 200);
  setTimeout(layout, 600);
}

async function initProjectPage() {
  const swiperEl = document.querySelector(".project-swiper");
  const wrapper = document.querySelector("#projectWrapper");
  const titleEl = document.querySelector("#projectTitle");
  const titleBlock = document.getElementById("projectTitleBlock");
  const seriesDesc = document.getElementById("projectSeriesDesc");
  if (!swiperEl || !wrapper || typeof Swiper === "undefined") return;

  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

  const data = await loadProjectsDataOrNull();
  initProjectSiteIntroPanel(data);
  const published = data ? getPublishedProjectsSorted(data) : [];
  const allSorted = data?.projects
    ? [...data.projects].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    : [];
  if (data) {
    applyIndexSiteMeta(data);
  }
  const params = new URLSearchParams(window.location.search);
  const inEditMode = params.get("edit") === "1";
  const shouldCreateNewProject = inEditMode && params.get("new") === "1";
  const sourceProjects = inEditMode ? allSorted : published;
  let project;
  let projectIdx;
  if (shouldCreateNewProject) {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `id-${Date.now()}`;
    projectIdx = allSorted.length;
    project = {
      id,
      title: "New project",
      slug: `new-project-${String(id).slice(0, 8)}`,
      description: "",
      isPublished: false,
      orderIndex: allSorted.length,
      coverImageId: "",
      images: [],
      imageScales: [],
    };
  } else {
    const resolved = resolveProjectFromList(sourceProjects);
    project = resolved.project;
    projectIdx = resolved.index;
  }

  const resolvedProjectTitle =
    project?.title && String(project.title).trim()
      ? String(project.title).trim()
      : PROJECT_TITLES[projectIdx] ?? PROJECT_TITLES[0] ?? "Project";

  if (resolvedProjectTitle && data?.siteTitle) {
    document.title = `${resolvedProjectTitle} | ${data.siteTitle}`;
  }

  if (titleEl) {
    titleEl.textContent = resolvedProjectTitle;
  }
  if (seriesDesc) {
    seriesDesc.textContent =
      shouldCreateNewProject
        ? ""
        : project?.description && String(project.description).trim()
        ? project.description
        : pickRandom(PROJECT_SERIES_TEXTS);
  }

  if (inEditMode) {
    if (typeof window.initProjectGalleryEdit === "function") {
      await window.initProjectGalleryEdit({
        data,
        published: sourceProjects,
        project,
        projectIdx,
        wrapper,
        swiperEl,
        titleEl,
        seriesDesc,
        titleBlock,
      });
    }
    return;
  }

  const images =
    project && Array.isArray(project.images) && project.images.length
      ? project.images.slice()
      : imagesForProject(projectIdx, 10);
  const projectSlideCount = images.length;
  const sizeScales =
    project && Array.isArray(project.images) && project.images.length
      ? getProjectImageScales(project, projectIdx)
      : buildProjectSizeSequence(projectSlideCount, projectIdx + 17);
  const renderScales = withMobileLeadingFullScale(sizeScales);

  const html = images
    .map(
      (src, idx) => `
      <div class="swiper-slide swiper-slide--project" style="--project-scale: ${renderScales[idx]};">
        <div class="project-slide-card">
          <div class="slide-top-spacer" aria-hidden="true"></div>
          <div class="project-bottom">
            <div class="project-image-wrap">
              <img src="${escapeAttr(src)}" alt="" width="1200" height="1200" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
  wrapper.innerHTML = html;

  const swiper = new Swiper(swiperEl, {
    loop: false,
    rewind: false,
    centeredSlides: false,
    touchAngle: 90,
    freeMode: {
      enabled: true,
      sticky: false,
    },
    mousewheel: {
      forceToAxis: false,
    },
    slidesPerView: "auto",
    spaceBetween: 0,
  });

  /* Logical index (0..n-1): do not rely on swiper.activeIndex with slidesPerView "auto" — it can stick early. */
  let projectSlideI = swiper.activeIndex;

  function syncFullscreenFromProjectIndex() {
    const img = document.getElementById("projectFullscreenImg");
    const ctr = document.getElementById("projectFullscreenCounter");
    if (!img || !ctr) return;
    const url = images[projectSlideI];
    if (url) img.src = url;
    img.alt = "";
    ctr.textContent = `${projectSlideI + 1}/${projectSlideCount}`;
  }

  function forceSwiperToProjectSlide(i) {
    const slide = swiper.slides[i];
    if (!slide) return;
    let offset;
    const grid = swiper.slidesGrid && swiper.slidesGrid[i];
    if (typeof grid === "number" && !Number.isNaN(grid)) {
      offset = grid;
    } else if (typeof slide.swiperSlideOffset === "number" && !Number.isNaN(slide.swiperSlideOffset)) {
      offset = slide.swiperSlideOffset;
    } else {
      offset = 0;
      for (let j = 0; j < i; j += 1) {
        const s = swiper.slides[j];
        if (s) offset += s.offsetWidth + (swiper.params.spaceBetween || 0);
      }
    }
    swiper.setTransition(0);
    let nextTranslate = -offset;
    const minT =
      typeof swiper.minTranslate === "function" ? swiper.minTranslate() : swiper.minTranslate;
    const maxT =
      typeof swiper.maxTranslate === "function" ? swiper.maxTranslate() : swiper.maxTranslate;
    if (typeof minT === "number" && typeof maxT === "number") {
      const low = Math.min(minT, maxT);
      const high = Math.max(minT, maxT);
      nextTranslate = Math.max(low, Math.min(high, nextTranslate));
    }
    swiper.setTranslate(nextTranslate);
    if (swiper.updateSlidesProgress) swiper.updateSlidesProgress();
    if (swiper.updateSlidesClasses) swiper.updateSlidesClasses();
  }

  function inferProjectIndexFromTranslate(translateValue) {
    const grid = swiper.slidesGrid;
    if (!Array.isArray(grid) || !grid.length) return;
    const pos = Math.max(0, -translateValue);
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let idx = 0; idx < grid.length; idx += 1) {
      const g = Number(grid[idx]);
      if (!Number.isFinite(g)) continue;
      const d = Math.abs(g - pos);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    }
    projectSlideI = Math.max(0, Math.min(bestIdx, projectSlideCount - 1));
  }

  function getProjectTranslateBounds() {
    const minT =
      typeof swiper.minTranslate === "function" ? swiper.minTranslate() : swiper.minTranslate;
    const maxT =
      typeof swiper.maxTranslate === "function" ? swiper.maxTranslate() : swiper.maxTranslate;
    return { minT, maxT };
  }

  function scrollProjectStripBy(deltaPx, transitionMs = 360) {
    swiper.update();
    const current =
      typeof swiper.getTranslate === "function"
        ? swiper.getTranslate()
        : Number(swiper.translate) || 0;
    let next = current + deltaPx;
    const { minT, maxT } = getProjectTranslateBounds();
    if (typeof minT === "number" && typeof maxT === "number") {
      const low = Math.min(minT, maxT);
      const high = Math.max(minT, maxT);
      next = Math.max(low, Math.min(high, next));
    }
    if (Math.abs(next - current) < 0.5) return;
    swiper.setTransition(transitionMs);
    swiper.setTranslate(next);
    if (swiper.updateSlidesProgress) swiper.updateSlidesProgress();
    if (swiper.updateSlidesClasses) swiper.updateSlidesClasses();
    inferProjectIndexFromTranslate(next);
    scheduleAlignTitle();
    syncMobileIndexPlacement();
  }

  function applyProjectSlideIndex(i, transitionMs = 340) {
    const n = projectSlideCount;
    const next = Math.max(0, Math.min(i, n - 1));
    projectSlideI = next;
    const fsOpen = document.body.classList.contains("project-fullscreen-on");
    if (fsOpen) syncFullscreenFromProjectIndex();
    swiper.update();
    swiper.slideTo(next, transitionMs, true);
    requestAnimationFrame(() => {
      if (swiper.activeIndex !== next) {
        forceSwiperToProjectSlide(next);
      }
      requestAnimationFrame(() => {
        if (swiper.activeIndex !== next) {
          forceSwiperToProjectSlide(next);
        }
        if (document.body.classList.contains("project-fullscreen-on")) {
          syncFullscreenFromProjectIndex();
        }
        scheduleAlignTitle();
      });
    });
  }

  function projectGoNext() {
    if (projectSlideI >= projectSlideCount - 1) return;
    applyProjectSlideIndex(projectSlideI + 1);
  }

  function projectGoPrev() {
    if (projectSlideI <= 0) return;
    applyProjectSlideIndex(projectSlideI - 1);
  }

  const prevHit = document.getElementById("swiperPrev");
  const nextHit = document.getElementById("swiperNext");
  if (prevHit) {
    prevHit.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        projectGoPrev();
      },
      true
    );
  }
  if (nextHit) {
    nextHit.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        projectGoNext();
      },
      true
    );
  }

  const activeProjectImage = () =>
    wrapper.querySelector(".swiper-slide-active .project-image-wrap") ||
    wrapper.querySelector(".project-image-wrap");

  const setSeriesDescBounds = () => {
    if (!seriesDesc || seriesDesc.hasAttribute("hidden")) {
      if (seriesDesc) seriesDesc.style.maxHeight = "";
      return;
    }
    const firstImage = activeProjectImage();
    if (!firstImage || !seriesDesc) return;
    const g =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--g")) || 12;
    const imgTop = firstImage.getBoundingClientRect().top;
    const gutterUpper = imgTop - g;
    const descTop = seriesDesc.getBoundingClientRect().top;
    /* Keep small headroom to avoid subpixel "false overflow" scrollbars. */
    const maxH = Math.max(32, Math.ceil(gutterUpper - descTop) + 6);
    seriesDesc.style.maxHeight = `${maxH}px`;
    const hasRealOverflow = seriesDesc.scrollHeight > maxH + 4;
    seriesDesc.style.overflowY = hasRealOverflow ? "auto" : "hidden";
  };

  /* Bottom of the primary nav row only (Gleb / Index / external links). Site intro under the name
     must not change this — otherwise the gallery title jumps when that block expands. */
  const projectNavRowBottom = () => {
    const page = document.querySelector(".page-body[data-page='project']");
    if (!page) return 0;
    const candidates = [
      page.querySelector("a.nav-site-name"),
      page.querySelector(".nav-bar--project .nav-center a"),
      page.querySelector(".nav-bar--project li.nav-external-links"),
    ].filter(Boolean);
    if (!candidates.length) {
      const navRoot = page.querySelector(".nav-root");
      return navRoot ? navRoot.getBoundingClientRect().bottom : 0;
    }
    return Math.max(...candidates.map((el) => el.getBoundingClientRect().bottom));
  };

  const alignTitle = () => {
    if (!titleEl || !titleBlock) return;
    if (
      document.body.classList.contains("project-fullscreen-on") &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      const g =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--g")) || 12;
      const navPadY =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-pad-y")) ||
        8;
      const top = g + navPadY + (window.visualViewport?.offsetTop || 0);
      titleBlock.style.top = `${Math.round(top)}px`;
      titleBlock.style.bottom = "auto";
      titleBlock.style.left = `${Math.round(g)}px`;
      return;
    }
    const firstImage = activeProjectImage();
    if (!firstImage) return;

    const navBottom = projectNavRowBottom();
    const imgTop = firstImage.getBoundingClientRect().top;
    const titleH = titleEl.getBoundingClientRect().height;
    const band = imgTop - navBottom;
    let top = navBottom + (band - titleH) / 2;
    if (band < titleH) {
      top = navBottom;
    }
    titleBlock.style.top = `${Math.round(top)}px`;
    titleBlock.style.bottom = "auto";

    if (seriesDesc && !seriesDesc.hasAttribute("hidden")) {
      requestAnimationFrame(() => requestAnimationFrame(setSeriesDescBounds));
    }
    syncMobileIndexPlacement();
  };

  const scheduleAlignTitle = () => {
    requestAnimationFrame(() => requestAnimationFrame(alignTitle));
  };

  const fsRoot = document.getElementById("projectFullscreen");
  const fsImg = document.getElementById("projectFullscreenImg");
  const fsCounter = document.getElementById("projectFullscreenCounter");
  const fsBackdrop = document.getElementById("projectFullscreenBackdrop");
  const fsPrev = document.getElementById("projectFullscreenPrev");
  const fsNext = document.getElementById("projectFullscreenNext");
  const navRootEl = document.querySelector(".nav-root");
  const navCenterEl = document.querySelector(".nav-bar--project .nav-center");
  const navCenterLinkEl = navCenterEl?.querySelector("a") || null;
  const navInstagramEl = document.getElementById("navInstagram");
  let mobileIndexPinEl = null;
  let seriesDescOpenBeforeFullscreen = false;

  function ensureMobileIndexPin() {
    if (mobileIndexPinEl) return mobileIndexPinEl;
    mobileIndexPinEl = document.createElement("a");
    mobileIndexPinEl.id = "mobileProjectIndexPin";
    mobileIndexPinEl.className = "link-underline mobile-project-index-pin";
    mobileIndexPinEl.setAttribute("aria-label", "Index");
    mobileIndexPinEl.hidden = true;
    document.body.appendChild(mobileIndexPinEl);
    return mobileIndexPinEl;
  }

  function resetMobileIndexPlacement() {
    document.body.classList.remove("project-mobile-layout-ready");
    if (navCenterEl) {
      navCenterEl.style.visibility = "";
    }
    if (titleEl) {
      titleEl.style.maxWidth = "";
    }
    if (mobileIndexPinEl) {
      mobileIndexPinEl.hidden = true;
    }
  }

  function syncMobileIndexPlacement() {
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!mobileViewport || inEditMode || document.body.classList.contains("project-fullscreen-on")) {
      resetMobileIndexPlacement();
      return;
    }
    if (!navCenterEl || !navCenterLinkEl || !navInstagramEl || !titleEl) return;
    const pin = ensureMobileIndexPin();
    const titleTop = titleEl.getBoundingClientRect().top;
    const instagramLeft = navInstagramEl.getBoundingClientRect().left;
    const g =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--g")) || 12;
    navCenterEl.style.visibility = "hidden";
    pin.textContent = navCenterLinkEl.textContent || "Index";
    pin.href = navCenterLinkEl.getAttribute("href") || "index.html";
    pin.style.top = `${Math.round(titleTop)}px`;
    pin.style.left = `${Math.round(instagramLeft)}px`;
    pin.hidden = false;
    const titleMax = Math.max(48, Math.floor(instagramLeft - g - 8));
    titleEl.style.maxWidth = `${titleMax}px`;
    document.body.classList.add("project-mobile-layout-ready");
  }

  const openProjectFullscreen = () => {
    if (!fsRoot || document.body.classList.contains("project-fullscreen-on")) return;
    setProjectFullscreenBrowserChrome(true);
    document.documentElement.classList.add("project-fullscreen-on");
    document.documentElement.style.backgroundColor = "#000";
    document.documentElement.style.colorScheme = "dark";
    document.body.style.backgroundColor = "#000";
    seriesDescOpenBeforeFullscreen = Boolean(seriesDesc && !seriesDesc.hasAttribute("hidden"));
    if (seriesDescOpenBeforeFullscreen && seriesDesc) {
      seriesDesc.setAttribute("hidden", "");
      if (titleEl) titleEl.setAttribute("aria-expanded", "false");
    }
    syncFullscreenFromProjectIndex();
    fsCounter?.removeAttribute("hidden");
    document.body.classList.add("project-fullscreen-on");
    fsRoot.removeAttribute("hidden");
    fsRoot.setAttribute("aria-hidden", "false");
    if (navRootEl) navRootEl.setAttribute("aria-hidden", "true");
    resetMobileIndexPlacement();
    scheduleAlignTitle();
  };

  const closeProjectFullscreen = () => {
    if (!fsRoot || !document.body.classList.contains("project-fullscreen-on")) return;
    document.body.classList.remove("project-fullscreen-on");
    document.documentElement.classList.remove("project-fullscreen-on");
    document.documentElement.style.backgroundColor = "";
    document.documentElement.style.colorScheme = "";
    document.body.style.backgroundColor = "";
    fsRoot.setAttribute("hidden", "");
    fsRoot.setAttribute("aria-hidden", "true");
    if (navRootEl) navRootEl.removeAttribute("aria-hidden");
    fsCounter?.setAttribute("hidden", "");
    if (seriesDescOpenBeforeFullscreen && seriesDesc) {
      seriesDesc.removeAttribute("hidden");
      if (titleEl) titleEl.setAttribute("aria-expanded", "true");
    }
    seriesDescOpenBeforeFullscreen = false;
    applyProjectSlideIndex(projectSlideI);
    setProjectFullscreenBrowserChrome(false);
    scheduleAlignTitle();
    syncMobileIndexPlacement();
    setTimeout(() => {
      scheduleAlignTitle();
      syncMobileIndexPlacement();
    }, 120);
  };

  if (fsBackdrop) {
    fsBackdrop.addEventListener("click", () => closeProjectFullscreen());
  }
  if (fsPrev) {
    fsPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      projectGoPrev();
    });
  }
  if (fsNext) {
    fsNext.addEventListener("click", (e) => {
      e.stopPropagation();
      projectGoNext();
    });
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchEndTs = 0;
  if (fsRoot) {
    fsRoot.addEventListener("dblclick", (e) => {
      e.preventDefault();
    });
    fsRoot.addEventListener("gesturestart", (e) => {
      e.preventDefault();
    });
    fsRoot.addEventListener("gesturechange", (e) => {
      e.preventDefault();
    });
    fsRoot.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches?.[0];
        if (!t) return;
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      },
      { passive: true }
    );
    fsRoot.addEventListener(
      "touchend",
      (e) => {
        if (!document.body.classList.contains("project-fullscreen-on")) return;
        const t = e.changedTouches?.[0];
        if (!t) return;
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        const now = Date.now();
        if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && now - lastTouchEndTs < 320) {
          e.preventDefault();
          lastTouchEndTs = 0;
          return;
        }
        lastTouchEndTs = now;
        if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.1) return;
        if (dx > 0) {
          projectGoPrev();
        } else {
          projectGoNext();
        }
      },
      { passive: false }
    );
  }

  wrapper.addEventListener("click", (e) => {
    const img = e.target.closest?.(".project-image-wrap img");
    if (!img || !wrapper.contains(img)) return;
    const slide = img.closest(".swiper-slide");
    if (!slide) return;
    const slides = [...wrapper.querySelectorAll(".swiper-slide")];
    const idx = slides.indexOf(slide);
    if (idx < 0) return;
    applyProjectSlideIndex(idx);
    requestAnimationFrame(() => openProjectFullscreen());
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select, button, [contenteditable='true']")) return;
    if (inEditMode) return;
    if (e.key === "Escape") {
      if (!document.body.classList.contains("project-fullscreen-on")) return;
      e.preventDefault();
      closeProjectFullscreen();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (document.body.classList.contains("project-fullscreen-on")) {
        projectGoPrev();
      } else {
        const step = Math.max(140, Math.min((swiper.width || window.innerWidth) * 0.55, 420));
        scrollProjectStripBy(step);
      }
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (document.body.classList.contains("project-fullscreen-on")) {
        projectGoNext();
      } else {
        const step = Math.max(140, Math.min((swiper.width || window.innerWidth) * 0.55, 420));
        scrollProjectStripBy(-step);
      }
    }
  });

  const toggleSeriesDesc = () => {
    if (!seriesDesc || !titleEl) return;
    const isClosed = seriesDesc.hasAttribute("hidden");
    if (isClosed) {
      seriesDesc.removeAttribute("hidden");
      titleEl.setAttribute("aria-expanded", "true");
    } else {
      seriesDesc.setAttribute("hidden", "");
      titleEl.setAttribute("aria-expanded", "false");
    }
    scheduleAlignTitle();
  };

  if (titleEl) {
    titleEl.addEventListener("click", (e) => {
      if (document.body.classList.contains("project-fullscreen-on")) return;
      e.preventDefault();
      toggleSeriesDesc();
    });
    titleEl.addEventListener("keydown", (e) => {
      if (document.body.classList.contains("project-fullscreen-on")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSeriesDesc();
      }
    });
  }

  scheduleAlignTitle();
  syncMobileIndexPlacement();
  setTimeout(scheduleAlignTitle, 60);
  setTimeout(syncMobileIndexPlacement, 60);
  window.addEventListener("resize", scheduleAlignTitle);
  window.addEventListener("resize", syncMobileIndexPlacement);
  swiper.on("resize", scheduleAlignTitle);
  swiper.on("slideChange", () => {
    if (!document.body.classList.contains("project-fullscreen-on")) {
      const t =
        typeof swiper.getTranslate === "function"
          ? swiper.getTranslate()
          : Number(swiper.translate) || 0;
      inferProjectIndexFromTranslate(t);
    }
    scheduleAlignTitle();
    if (document.body.classList.contains("project-fullscreen-on")) {
      syncFullscreenFromProjectIndex();
    }
    syncMobileIndexPlacement();
  });
}

function isIndexEditMode() {
  return new URLSearchParams(window.location.search).get("edit") === "1";
}

function carousel() {
  return {
    swiper: null,
    async initSwiper() {
      let data;
      try {
        data = await loadProjectsData();
      } catch (e) {
        console.error(e);
        return;
      }
      applyIndexSiteMeta(data);
      const el = this.$refs.swiper;
      if (!el || typeof Swiper === "undefined") return;
      const wrapper = el.querySelector(".swiper-wrapper");
      if (!wrapper) return;

      if (isIndexEditMode()) {
        if (typeof window.initIndexGalleryEdit === "function") {
          await window.initIndexGalleryEdit({
            data,
            wrapper,
            swiperEl: el,
          });
        }
        return;
      }

      const published = getPublishedProjectsSorted(data);
      wrapper.innerHTML = published.map(buildIndexSlideHtml).join("");
      initAlpineOnIndexSlides(wrapper);

      if (published.length === 0) {
        return;
      }

      setTimeout(() => {
        this.swiper = new Swiper(el, {
          loop: false,
          centeredSlides: false,
          touchAngle: 90,
          freeMode: {
            enabled: true,
            sticky: false,
          },
          mousewheel: {
            forceToAxis: false,
          },
          slidesPerView: "auto",
          spaceBetween: 0,
          navigation: {
            nextEl: "#swiperNext",
            prevEl: "#swiperPrev",
          },
        });

        initProjectCovers();
        setupProjectLinks();
        initIndexCoverScales();
        this.swiper.update();

        const indexGetTranslateBounds = () => {
          const sw = this.swiper;
          if (!sw) return { low: -Infinity, high: Infinity };
          const minT = typeof sw.minTranslate === "function" ? sw.minTranslate() : sw.minTranslate;
          const maxT = typeof sw.maxTranslate === "function" ? sw.maxTranslate() : sw.maxTranslate;
          if (typeof minT !== "number" || typeof maxT !== "number") {
            return { low: -Infinity, high: Infinity };
          }
          return { low: Math.min(minT, maxT), high: Math.max(minT, maxT) };
        };

        const indexScrollStripBy = (deltaPx, transitionMs = 360) => {
          const sw = this.swiper;
          if (!sw) return;
          sw.update();
          const current =
            typeof sw.getTranslate === "function" ? sw.getTranslate() : Number(sw.translate) || 0;
          const { low, high } = indexGetTranslateBounds();
          const next = Math.max(low, Math.min(high, current + deltaPx));
          if (Math.abs(next - current) < 0.5) return;
          sw.setTransition(transitionMs);
          sw.setTranslate(next);
          if (sw.updateSlidesProgress) sw.updateSlidesProgress();
          if (sw.updateSlidesClasses) sw.updateSlidesClasses();
        };

        if (!window.__dsIndexArrowNavBound) {
          window.__dsIndexArrowNavBound = true;
          document.addEventListener("keydown", (e) => {
            if (document.body.dataset.page !== "index") return;
            if (isIndexEditMode()) return;
            if (e.target.closest("input, textarea, select, button, [contenteditable='true']")) {
              return;
            }
            if (!this.swiper) return;
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              const step = Math.max(140, Math.min((this.swiper.width || window.innerWidth) * 0.55, 420));
              indexScrollStripBy(step);
              return;
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              const step = Math.max(140, Math.min((this.swiper.width || window.innerWidth) * 0.55, 420));
              indexScrollStripBy(-step);
            }
          });
        }
      }, 0);
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "project") {
    void initProjectPage();
  }
  if (document.body.dataset.page === "index") {
    void loadProjectsDataOrNull().then((data) => initIndexIntro(data));
  }
});
