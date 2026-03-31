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
  "Working mainly on long-form series, the practice treats the camera as a slow instrument for reading light, distance, and the habits that shape public space. Prints are produced in small editions; commissions begin with a conversation about place and duration rather than a fixed shot list. Each project is given time to settle before any public shape is proposed. The work assumes a reader who is willing to move slowly through a room or a sequence of pages.",
  "The site gathers field notes from walks, interiors, and transitional zones where architecture meets weather and routine. Nothing here is staged for effect: sequences are edited for rhythm and silence, not for spectacle. Contact is open for editorial, exhibition, and limited print requests. New bodies of work surface here as they reach a coherent length, not on a fixed schedule.",
  "Documentation here follows a simple rule: stay close to the subject until the frame stops asking for decoration. Color is used sparingly; contrast is carried by structure and air. If you are curating a show or need a restrained visual essay, write with a short description of the venue and timeline. Replies are usually sent within a few days once the brief is clear.",
];

const PROJECT_SERIES_TEXTS = [
  "This series was assembled from several returns to the same streets across seasons. Frames that looked empty at first later revealed small shifts in material and tone; the edit keeps those changes legible without turning the work into a report. A few rolls were set aside for years before they found their place in the sequence. The final order was tested by walking through it on paper and on a wall.",
  "The pictures come from a narrow window of days when fog and sun traded places every hour. Exposure choices favored texture over clarity, so the sequence reads less like a survey and more like a weather diary with architecture in the margins. Carrying one focal length forced a consistent distance from the scene. Prints from this set are available on request in a single size.",
  "Made without assistants or added light, the set relies on patience and repetition. What repeats is not the subject but the distance between glances; the gallery is arranged so neighboring images argue quietly rather than illustrate a thesis. Several frames were discarded when they explained too much. The title arrived only after the edit felt stable.",
  "A loose archive of corners, thresholds, and temporary barriers. The order is not chronological: it follows contrast and scale so the viewer can move through the room without a single dominant vantage point. Some negatives never left the contact sheet. The series name refers to a walk repeated until the route felt unfamiliar again.",
];

function pickRandom(arr) {
  if (!arr || !arr.length) return "";
  return arr[Math.floor(Math.random() * arr.length)];
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

function initIndexIntro() {
  const textEl = document.getElementById("siteIntroText");
  const panel = document.getElementById("siteIntroPanel");
  if (textEl) {
    textEl.textContent = pickRandom(SITE_INTRO_TEXTS);
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

function initProjectCovers() {
  const slides = document.querySelectorAll(".swiper-slide--work");
  slides.forEach((slide, index) => {
    const cover = slide.querySelector(".cover-square");
    const img = slide.querySelector(".cover-square img");
    if (!cover || !img) return;

    const gallery = imagesForProject(index, 10);
    let current = 0;
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
  links.forEach((link, index) => {
    const href = `project.html?project=${index}`;
    link.setAttribute("href", href);
    link.textContent = "View Gallery";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = href;
    });
  });
}

function readProjectIndex() {
  const params = new URLSearchParams(window.location.search);
  const raw = Number(params.get("project") || 0);
  if (Number.isNaN(raw)) return 0;
  return Math.max(0, raw);
}

function initProjectSiteIntroPanel() {
  const textEl = document.getElementById("siteIntroTextProject");
  const panel = document.getElementById("siteIntroPanelProject");
  const titleAnchor = document.getElementById("projectTitle");
  if (textEl) {
    textEl.textContent = pickRandom(SITE_INTRO_TEXTS);
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

function initProjectPage() {
  const swiperEl = document.querySelector(".project-swiper");
  const wrapper = document.querySelector("#projectWrapper");
  const titleEl = document.querySelector("#projectTitle");
  const titleBlock = document.getElementById("projectTitleBlock");
  const seriesDesc = document.getElementById("projectSeriesDesc");
  if (!swiperEl || !wrapper || typeof Swiper === "undefined") return;

  initProjectSiteIntroPanel();

  const projectIndex = readProjectIndex();
  if (titleEl) {
    titleEl.textContent = PROJECT_TITLES[projectIndex] || PROJECT_TITLES[0];
  }
  if (seriesDesc) {
    seriesDesc.textContent = pickRandom(PROJECT_SERIES_TEXTS);
  }

  const images = imagesForProject(projectIndex, 12);

  const html = images
    .map(
      (src) => `
      <div class="swiper-slide swiper-slide--project">
        <div class="project-slide-card">
          <div class="slide-top-spacer" aria-hidden="true"></div>
          <div class="project-bottom">
            <div class="project-image-wrap">
              <img src="${src}" alt="" width="1200" height="1200" loading="lazy" />
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
    centeredSlides: false,
    freeMode: false,
    mousewheel: {
      forceToAxis: true,
    },
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: "#swiperNext",
      prevEl: "#swiperPrev",
    },
    breakpoints: {
      768: {
        slidesPerView: "auto",
        spaceBetween: 0,
        freeMode: {
          enabled: true,
          sticky: false,
        },
        mousewheel: {
          forceToAxis: false,
        },
      },
    },
  });

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
    const maxH = Math.max(32, gutterUpper - descTop);
    seriesDesc.style.overflowY = "auto";
    seriesDesc.style.maxHeight = `${Math.floor(maxH)}px`;
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
  };

  const scheduleAlignTitle = () => {
    requestAnimationFrame(() => requestAnimationFrame(alignTitle));
  };

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
      e.preventDefault();
      toggleSeriesDesc();
    });
    titleEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSeriesDesc();
      }
    });
  }

  scheduleAlignTitle();
  setTimeout(scheduleAlignTitle, 60);
  window.addEventListener("resize", scheduleAlignTitle);
  swiper.on("resize", scheduleAlignTitle);
  swiper.on("slideChange", scheduleAlignTitle);
}

function carousel() {
  return {
    swiper: null,
    initSwiper() {
      setTimeout(() => {
        const el = this.$refs.swiper;
        if (!el || typeof Swiper === "undefined") return;

        this.swiper = new Swiper(el, {
          loop: false,
          centeredSlides: false,
          freeMode: false,
          mousewheel: {
            forceToAxis: true,
          },
          slidesPerView: 1,
          spaceBetween: 0,
          navigation: {
            nextEl: "#swiperNext",
            prevEl: "#swiperPrev",
          },
          breakpoints: {
            768: {
              slidesPerView: "auto",
              spaceBetween: 0,
              freeMode: {
                enabled: true,
                sticky: false,
              },
              mousewheel: {
                forceToAxis: false,
              },
            },
          },
        });

        initProjectCovers();
        setupProjectLinks();
      }, 0);
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "project") {
    initProjectPage();
  }
  if (document.body.dataset.page === "index") {
    initIndexIntro();
  }
});
