/**
 * Horizontal in-page gallery editor (?edit=1). Requires app.js (getProjectImageScales on window).
 */
(function () {
  const SCALE_OPTIONS = [
    { v: 1, label: "8/8" },
    { v: 0.875, label: "7/8" },
    { v: 0.75, label: "3/4" },
    { v: 0.625, label: "5/8" },
    { v: 0.5, label: "1/2" },
  ];

  const SCALE_VALUES = SCALE_OPTIONS.map((o) => o.v);

  function randomScale() {
    return SCALE_VALUES[Math.floor(Math.random() * SCALE_VALUES.length)];
  }

  function pillDivider() {
    const d = document.createElement("span");
    d.className = "project-edit-pill-divider";
    d.setAttribute("aria-hidden", "true");
    return d;
  }

  function dataTransferHasFiles(dt) {
    if (!dt?.types) return false;
    try {
      return typeof dt.types.contains === "function"
        ? dt.types.contains("Files")
        : Array.from(dt.types).includes("Files");
    } catch {
      return false;
    }
  }

  /** Thin chevrons, Safari-like stroke weight */
  function chevronLeftSvg() {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "project-edit-sf-icon");
    s.setAttribute("width", "14");
    s.setAttribute("height", "17");
    s.setAttribute("viewBox", "0 0 12 14");
    s.setAttribute("fill", "none");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M7.25 1.75L3.25 7l4 5.25");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "1.62");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    s.appendChild(p);
    return s;
  }

  function chevronRightSvg() {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "project-edit-sf-icon");
    s.setAttribute("width", "14");
    s.setAttribute("height", "17");
    s.setAttribute("viewBox", "0 0 12 14");
    s.setAttribute("fill", "none");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M4.75 1.75L8.75 7l-4 5.25");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "1.62");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    s.appendChild(p);
    return s;
  }

  function imgSrcForIndex(images, displayUrls, i) {
    const u = displayUrls[i];
    if (u) return u;
    const p = images[i];
    if (!p) return "";
    if (p.startsWith("blob:") || p.startsWith("data:")) return p;
    return p;
  }

  function fileLabelFromPath(p) {
    if (!p || typeof p !== "string") return "";
    const s = p.replace(/^\.\//, "");
    const slash = s.lastIndexOf("/");
    return slash >= 0 ? s.slice(slash + 1) : s;
  }

  function revokeAll(displayUrls) {
    displayUrls.forEach((u) => {
      if (u && String(u).startsWith("blob:")) {
        try {
          URL.revokeObjectURL(u);
        } catch {
          /* ignore */
        }
      }
    });
  }

  window.initProjectGalleryEdit = async function initProjectGalleryEdit(ctx) {
    const { data, project, projectIdx, wrapper, swiperEl, titleEl, titleBlock } = ctx;

    if (!data || !project || !wrapper || !swiperEl) {
      wrapper.innerHTML =
        '<p class="project-edit-error">No project data. Open from the site with a valid <code>slug</code> (and run a local server).</p>';
      return;
    }
    if (window.matchMedia("(max-width: 767px)").matches) {
      wrapper.classList.remove("project-edit-strip");
      wrapper.innerHTML = `
        <div class="edit-desktop-only-note" role="status" aria-live="polite">
          <p>Editing is available on desktop only.</p>
          <p>Open this page on a desktop device to edit the gallery.</p>
        </div>
      `;
      return;
    }

    document.body.classList.add("project-gallery-edit");

    const getProjectImageScales =
      typeof window.__dsGetProjectImageScales === "function"
        ? window.__dsGetProjectImageScales
        : () => [];

    const images = Array.isArray(project.images) ? [...project.images] : [];
    let scales =
      images.length > 0 ? getProjectImageScales(project, projectIdx).slice() : [];
    while (scales.length < images.length) {
      scales.push(randomScale());
    }
    const displayUrls = images.map(() => null);

    let selectedIndex = images.length > 0 ? 0 : -1;
    let dragFrom = null;
    let dragInsertIndex = null;

    swiperEl.classList.add("project-swiper--edit");
    wrapper.classList.add("project-edit-strip");
    wrapper.innerHTML = "";

    const navCenter = document.querySelector(".nav-bar--project .nav-center");
    const navSiteName = document.querySelector(".nav-site-name");
    const navInstagram = document.getElementById("navInstagram");
    const siteIntroTextEl = document.getElementById("siteIntroTextProject");
    const projectTitleEl = titleEl || document.getElementById("projectTitle");
    const projectSeriesDescEl = document.getElementById("projectSeriesDesc");
    const navActions = document.createElement("div");
    navActions.className = "project-edit-nav-actions";
    navActions.setAttribute("role", "group");
    navActions.setAttribute("aria-label", "Editor actions");
    navActions.innerHTML = `
      <button type="button" class="project-edit-nav-btn" data-action="index-edit">Edit Index</button>
      <button type="button" class="project-edit-nav-btn" data-action="new-project">New Project</button>
      <button type="button" class="project-edit-nav-btn project-edit-nav-btn--save" data-action="save" title="Download projects.json — replace data/projects.json; copy new files into assets/">Save</button>
      <button type="button" class="project-edit-nav-btn project-edit-nav-btn--exit" data-action="exit" title="Leave editor">Exit</button>
      <button type="button" class="project-edit-nav-btn" data-action="admin">Admin</button>
    `;
    if (navCenter) {
      navCenter.replaceChildren(navActions);
    }

    if (data.siteOwnerName && String(data.siteOwnerName).trim() && navSiteName) {
      navSiteName.textContent = data.siteOwnerName;
    }
    if (data.instagramText && String(data.instagramText).trim() && navInstagram) {
      navInstagram.textContent = data.instagramText;
    }
    if (data.siteIntroText && String(data.siteIntroText).trim() && siteIntroTextEl) {
      siteIntroTextEl.textContent = data.siteIntroText;
    }
    if (projectTitleEl) {
      const titleText = String(project.title || "").trim() || `Project ${projectIdx + 1}`;
      projectTitleEl.textContent = titleText;
    }

    function positionEditProjectTitle() {
      if (!titleBlock) return;
      const navRoot = document.querySelector(".nav-root");
      const navBottom = navRoot ? navRoot.getBoundingClientRect().bottom : 0;
      const g =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--g")) || 12;
      titleBlock.style.top = `${Math.round(navBottom + g)}px`;
      titleBlock.style.bottom = "auto";
    }
    positionEditProjectTitle();
    window.addEventListener("resize", positionEditProjectTitle);

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    }
    function escapeAttr(str) {
      return String(str).replace(/"/g, "&quot;");
    }

    function openSystemPopup(opts) {
      const { title, fields, onSave } = opts || {};
      const overlay = document.createElement("div");
      overlay.className = "edit-system-modal-overlay";
      overlay.innerHTML = `
        <div class="edit-system-modal" style="background:transparent;border:0;box-shadow:none;padding:0;" role="dialog" aria-modal="true" aria-label="${escapeAttr(title || "Edit")}">
          <form class="edit-system-modal-form"></form>
          <div class="edit-system-modal-actions">
            <button type="button" class="edit-system-modal-btn edit-system-modal-btn--save">Save</button>
            <button type="button" class="edit-system-modal-btn edit-system-modal-btn--cancel">Cancel</button>
          </div>
        </div>
      `;
      const modal = overlay.querySelector(".edit-system-modal");
      const form = overlay.querySelector(".edit-system-modal-form");
      const cancelBtn = overlay.querySelector(".edit-system-modal-btn--cancel");
      const saveBtn = overlay.querySelector(".edit-system-modal-btn--save");
      const inputs = {};

      (fields || []).forEach((f) => {
        const row = document.createElement("div");
        row.className = "edit-system-modal-field";
        let input;
        if (f.multiline) {
          input = document.createElement("textarea");
          input.rows = 4;
        } else {
          input = document.createElement("input");
          input.type = f.type || "text";
        }
        input.className = "edit-system-modal-input";
        input.value = f.value || "";
        input.placeholder = f.placeholder || "";
        row.appendChild(input);
        form.appendChild(row);
        if (f.id) inputs[f.id] = input;
      });

      function close() {
        overlay.remove();
      }

      cancelBtn?.addEventListener("click", close);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });
      document.body.appendChild(overlay);
      const firstInput = form.querySelector(".edit-system-modal-input");
      firstInput?.focus();

      saveBtn?.addEventListener("click", () => {
        const values = {};
        Object.keys(inputs).forEach((k) => {
          values[k] = inputs[k].value;
        });
        onSave?.(values);
        close();
      });

      overlay.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
          e.preventDefault();
          saveBtn?.click();
        }
      });
      modal?.addEventListener("click", (e) => e.stopPropagation());
    }

    navSiteName?.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSystemPopup({
          title: "Edit site title",
          fields: [
            {
              id: "title",
              label: "Title text",
              value: data.siteOwnerName || navSiteName.textContent || "",
            },
            {
              id: "intro",
              label: "Text shown on title click",
              value: data.siteIntroText || siteIntroTextEl?.textContent || "",
              multiline: true,
            },
          ],
          onSave: ({ title, intro }) => {
            const nextTitle = String(title || "").trim();
            const nextIntro = String(intro || "").trim();
            data.siteOwnerName = nextTitle;
            data.siteIntroText = nextIntro;
            navSiteName.textContent = nextTitle || "Gleb Sergeev";
            if (siteIntroTextEl) siteIntroTextEl.textContent = nextIntro;
          },
        });
      },
      true
    );

    navInstagram?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSystemPopup({
        title: "Edit Instagram",
        fields: [
          {
            id: "label",
            label: "Link text",
            value: data.instagramText || navInstagram.textContent || "Instagram",
          },
          {
            id: "url",
            label: "Link URL",
            value: data.instagramUrl || navInstagram.getAttribute("href") || "",
            type: "url",
          },
        ],
        onSave: ({ label, url }) => {
          const nextLabel = String(label || "").trim();
          const nextUrl = String(url || "").trim();
          data.instagramText = nextLabel || "Instagram";
          data.instagramUrl = nextUrl;
          navInstagram.textContent = data.instagramText;
          navInstagram.href = nextUrl || "#";
        },
      });
    });

    projectTitleEl?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSystemPopup({
        title: "Edit project title",
        fields: [
          {
            id: "title",
            label: "Title text",
            value: project.title || projectTitleEl.textContent || "",
          },
          {
            id: "description",
            label: "Text shown on title click",
            value: project.description || projectSeriesDescEl?.textContent || "",
            multiline: true,
          },
        ],
        onSave: ({ title, description }) => {
          const nextTitle = String(title || "").trim();
          const nextDescription = String(description || "").trim();
          project.title = nextTitle;
          project.description = nextDescription;
          projectTitleEl.textContent = nextTitle;
          if (projectSeriesDescEl) projectSeriesDescEl.textContent = nextDescription;
        },
      });
    });

    function syncScalesLength() {
      while (scales.length < images.length) {
        scales.push(randomScale());
      }
      while (scales.length > images.length) {
        scales.pop();
      }
      while (displayUrls.length < images.length) {
        displayUrls.push(null);
      }
      while (displayUrls.length > images.length) {
        const u = displayUrls.pop();
        if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
      }
    }

    function selectIndex(i) {
      if (i < 0 || i >= images.length) {
        selectedIndex = -1;
      } else {
        selectedIndex = i;
      }
      render();
    }

    function moveIndex(i, delta) {
      const j = i + delta;
      if (j < 0 || j >= images.length) return;
      const tmpI = images[i];
      images[i] = images[j];
      images[j] = tmpI;
      const tmpS = scales[i];
      scales[i] = scales[j];
      scales[j] = tmpS;
      const tmpD = displayUrls[i];
      displayUrls[i] = displayUrls[j];
      displayUrls[j] = tmpD;
      selectedIndex = j;
      render();
    }

    function removeAt(i) {
      const u = displayUrls[i];
      if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
      images.splice(i, 1);
      scales.splice(i, 1);
      displayUrls.splice(i, 1);
      if (selectedIndex === i) selectedIndex = images.length > 0 ? Math.min(i, images.length - 1) : -1;
      else if (selectedIndex > i) selectedIndex -= 1;
      render();
    }

    /** Same gallery index and scale; path + preview updated for Save JSON. */
    function replaceImageAt(index, file) {
      if (!file || !file.type.startsWith("image/")) return;
      if (index < 0 || index >= images.length) return;
      const u = displayUrls[index];
      if (u && String(u).startsWith("blob:")) {
        try {
          URL.revokeObjectURL(u);
        } catch {
          /* ignore */
        }
      }
      images[index] = `assets/${file.name}`;
      displayUrls[index] = URL.createObjectURL(file);
      render();
    }

    /**
     * @param {FileList|null} fileList
     * @param {number} [insertAt] index 0..length; default length = append at end
     */
    function addFiles(fileList, insertAt) {
      if (!fileList?.length) return;
      let at =
        insertAt == null || Number.isNaN(insertAt)
          ? images.length
          : Math.max(0, Math.min(insertAt, images.length));
      let added = 0;
      for (const file of fileList) {
        if (!file.type.startsWith("image/")) continue;
        const path = `assets/${file.name}`;
        const url = URL.createObjectURL(file);
        images.splice(at + added, 0, path);
        scales.splice(at + added, 0, randomScale());
        displayUrls.splice(at + added, 0, url);
        added += 1;
      }
      if (added === 0) return;
      syncScalesLength();
      selectedIndex = at + added - 1;
      render();
    }

    function reorderDrag(from, to) {
      if (from === to || from < 0 || to < 0 || from >= images.length || to >= images.length) return;
      const item = images.splice(from, 1)[0];
      const sc = scales.splice(from, 1)[0];
      const du = displayUrls.splice(from, 1)[0];
      images.splice(to, 0, item);
      scales.splice(to, 0, sc);
      displayUrls.splice(to, 0, du);
      selectedIndex = to;
      render();
    }

    function clearInsertDragIndicator() {
      dragInsertIndex = null;
      wrapper
        .querySelectorAll(".project-edit-insert-gap--drag-insert")
        .forEach((el) => el.classList.remove("project-edit-insert-gap--drag-insert"));
    }

    function setInsertDragIndicator(insertIndex) {
      const next = Math.max(0, Math.min(insertIndex, images.length));
      if (dragInsertIndex === next) return;
      dragInsertIndex = next;
      wrapper
        .querySelectorAll(".project-edit-insert-gap--drag-insert")
        .forEach((el) => el.classList.remove("project-edit-insert-gap--drag-insert"));
      const marker = wrapper.querySelector(`.project-edit-insert-gap[data-insert-index="${next}"]`);
      if (marker) marker.classList.add("project-edit-insert-gap--drag-insert");
    }

    function moveToInsertIndex(from, insertAt) {
      if (from < 0 || from >= images.length) return;
      let at = Math.max(0, Math.min(insertAt, images.length));
      if (from < at) at -= 1;
      if (at === from) return;
      const item = images.splice(from, 1)[0];
      const sc = scales.splice(from, 1)[0];
      const du = displayUrls.splice(from, 1)[0];
      images.splice(at, 0, item);
      scales.splice(at, 0, sc);
      displayUrls.splice(at, 0, du);
      selectedIndex = at;
      render();
    }

    function buildAddTile() {
      const outer = document.createElement("div");
      outer.className = "project-edit-add-tile";

      const inner = document.createElement("div");
      inner.className = "project-edit-add-tile-inner";
      inner.setAttribute("data-drop-zone", "1");
      inner.setAttribute("role", "button");
      inner.tabIndex = 0;
      inner.setAttribute("aria-label", "Add images");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "project-edit-add-btn";
      btn.setAttribute("aria-label", "Add images");
      btn.textContent = "+";

      const hint = document.createElement("div");
      hint.className = "project-edit-add-hint";
      hint.textContent = images.length === 0 ? "Drop images here or tap +" : "Add more";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true;
      fileInput.hidden = true;

      function openPicker() {
        fileInput.click();
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openPicker();
      });
      inner.addEventListener("click", () => openPicker());
      inner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      });
      fileInput.addEventListener("change", () => {
        addFiles(fileInput.files, images.length);
        fileInput.value = "";
      });

      ["dragenter", "dragover"].forEach((ev) => {
        inner.addEventListener(ev, (e) => {
          if (!dataTransferHasFiles(e.dataTransfer)) return;
          e.preventDefault();
          e.stopPropagation();
          inner.classList.add("project-edit-drop-active");
        });
      });
      inner.addEventListener("dragleave", () => {
        inner.classList.remove("project-edit-drop-active");
      });
      inner.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        inner.classList.remove("project-edit-drop-active");
        if (e.dataTransfer?.files?.length) {
          addFiles(e.dataTransfer.files, images.length);
        }
      });

      inner.appendChild(btn);
      inner.appendChild(hint);
      outer.appendChild(inner);
      outer.appendChild(fileInput);
      return outer;
    }

    /** Full-height strip between slides: click or drop to insert; dashed outline on hover like add tile. */
    function buildInsertGap(insertIndex) {
      const outer = document.createElement("div");
      outer.className = "project-edit-insert-gap";
      outer.dataset.insertIndex = String(insertIndex);
      if (insertIndex === 0) outer.classList.add("project-edit-insert-gap--first");

      const ariaInsert =
        insertIndex === 0
          ? "Insert images before the first slide"
          : insertIndex >= images.length
            ? "Insert images after the last slide"
            : `Insert images before slide ${insertIndex + 1}`;

      const hit = document.createElement("div");
      hit.className = "project-edit-insert-gap-hit";
      hit.setAttribute("role", "button");
      hit.tabIndex = 0;
      hit.setAttribute("aria-label", ariaInsert);

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true;
      fileInput.hidden = true;

      function openPicker() {
        fileInput.click();
      }

      hit.addEventListener("click", (e) => {
        e.stopPropagation();
        openPicker();
      });
      hit.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      });

      fileInput.addEventListener("change", () => {
        addFiles(fileInput.files, insertIndex);
        fileInput.value = "";
      });

      function clearDropHighlight() {
        outer.classList.remove("project-edit-insert-gap--drop-target");
      }

      ["dragenter", "dragover"].forEach((ev) => {
        outer.addEventListener(ev, (e) => {
          if (dataTransferHasFiles(e.dataTransfer)) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
            outer.classList.add("project-edit-insert-gap--drop-target");
            return;
          }
          if (dragFrom == null) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
          setInsertDragIndicator(insertIndex);
        });
      });
      outer.addEventListener("dragleave", (e) => {
        if (outer.contains(e.relatedTarget)) return;
        clearDropHighlight();
      });
      outer.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearDropHighlight();
        if (e.dataTransfer?.files?.length) {
          addFiles(e.dataTransfer.files, insertIndex);
          return;
        }
        const from = parseInt(e.dataTransfer?.getData("text/plain"), 10);
        if (!Number.isNaN(from)) {
          moveToInsertIndex(from, insertIndex);
          clearInsertDragIndicator();
        }
      });

      outer.appendChild(hit);
      outer.appendChild(fileInput);
      return outer;
    }

    function buildSlide(i) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide swiper-slide--project project-edit-slide";
      if (i === selectedIndex) slide.classList.add("project-edit-slide--selected");
      slide.style.setProperty("--project-scale", String(scales[i]));
      slide.dataset.editIndex = String(i);
      slide.draggable = true;

      slide.addEventListener("click", (e) => {
        if (e.target.closest("button, select, input, option")) return;
        selectIndex(i);
      });

      slide.addEventListener("dragstart", (e) => {
        dragFrom = i;
        slide.classList.add("project-edit-dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(i));
      });
      slide.addEventListener("dragend", () => {
        slide.classList.remove("project-edit-dragging");
        dragFrom = null;
        clearInsertDragIndicator();
      });
      slide.addEventListener("dragover", (e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          return;
        }
        if (dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = slide.getBoundingClientRect();
        const insertIndex = e.clientX < rect.left + rect.width / 2 ? i : i + 1;
        setInsertDragIndicator(insertIndex);
      });
      slide.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer?.files?.length) {
          addFiles(e.dataTransfer.files, i);
          return;
        }
        if (dragFrom == null) return;
        const rect = slide.getBoundingClientRect();
        const insertIndex = e.clientX < rect.left + rect.width / 2 ? i : i + 1;
        const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (!Number.isNaN(from)) {
          moveToInsertIndex(from, insertIndex);
          clearInsertDragIndicator();
        }
      });

      const row = document.createElement("div");
      row.className = "project-edit-chrome-row";

      const navPill = document.createElement("div");
      navPill.className = "project-edit-pill project-edit-pill--nav";
      navPill.setAttribute("role", "group");
      navPill.setAttribute("aria-label", "Reorder");

      const left = document.createElement("button");
      left.type = "button";
      left.className = "project-edit-icon-btn";
      left.appendChild(chevronLeftSvg());
      left.title = "Move left";
      left.setAttribute("aria-label", "Move left");
      left.disabled = i === 0;
      left.addEventListener("click", () => moveIndex(i, -1));

      const right = document.createElement("button");
      right.type = "button";
      right.className = "project-edit-icon-btn";
      right.appendChild(chevronRightSvg());
      right.title = "Move right";
      right.setAttribute("aria-label", "Move right");
      right.disabled = i === images.length - 1;
      right.addEventListener("click", () => moveIndex(i, 1));

      navPill.appendChild(left);
      navPill.appendChild(pillDivider());
      navPill.appendChild(right);

      const scalePill = document.createElement("div");
      scalePill.className = "project-edit-pill project-edit-pill--scale";

      const sel = document.createElement("select");
      sel.className = "project-edit-scale";
      sel.setAttribute("aria-label", "Slide size");
      SCALE_OPTIONS.forEach((opt) => {
        const o = document.createElement("option");
        o.value = String(opt.v);
        o.textContent = opt.label;
        if (opt.v === scales[i]) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", () => {
        scales[i] = Number(sel.value);
        slide.style.setProperty("--project-scale", String(scales[i]));
      });
      scalePill.appendChild(sel);

      const removePill = document.createElement("div");
      removePill.className = "project-edit-pill project-edit-pill--remove";

      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "project-edit-remove-btn";
      rm.textContent = "Remove";
      rm.setAttribute("aria-label", "Remove image");
      rm.addEventListener("click", () => removeAt(i));
      removePill.appendChild(rm);

      row.appendChild(navPill);
      row.appendChild(scalePill);
      row.appendChild(removePill);

      const card = document.createElement("div");
      card.className = "project-slide-card";

      const slideMeta = document.createElement("div");
      slideMeta.className = "project-edit-slide-meta";

      const orderFrame = document.createElement("span");
      orderFrame.className = "project-edit-slide-meta-order";
      const orderInput = document.createElement("input");
      orderInput.type = "text";
      orderInput.inputMode = "numeric";
      orderInput.autocomplete = "off";
      orderInput.className = "project-edit-slide-meta-input";
      orderInput.value = String(i + 1);
      orderInput.setAttribute(
        "aria-label",
        `Gallery position (1–${images.length}), press Enter to move`
      );
      orderInput.title = "Position (1–" + images.length + "). Press Enter to apply.";

      function commitOrderInput() {
        const raw = orderInput.value.trim();
        const n = parseInt(raw, 10);
        if (!Number.isFinite(n) || n < 1 || n > images.length) {
          orderInput.value = String(i + 1);
          return;
        }
        const target = n - 1;
        if (target === i) return;
        reorderDrag(i, target);
      }

      orderInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commitOrderInput();
        }
      });
      orderInput.addEventListener("blur", () => {
        orderInput.value = String(i + 1);
      });
      orderInput.addEventListener("click", (e) => e.stopPropagation());

      orderFrame.appendChild(orderInput);

      const nameFrame = document.createElement("span");
      nameFrame.className = "project-edit-slide-meta-name-frame";
      const nameBtn = document.createElement("button");
      nameBtn.type = "button";
      nameBtn.className = "project-edit-slide-meta-name-btn";
      const label = fileLabelFromPath(images[i]);
      nameBtn.textContent = label;
      nameBtn.title = "Replace with another image — same position and size";
      nameBtn.setAttribute("aria-label", `Replace image: ${label}`);

      const replaceInput = document.createElement("input");
      replaceInput.type = "file";
      replaceInput.accept = "image/*";
      replaceInput.hidden = true;

      nameBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        replaceInput.click();
      });
      replaceInput.addEventListener("change", () => {
        const f = replaceInput.files?.[0];
        replaceInput.value = "";
        if (f) replaceImageAt(i, f);
      });

      nameFrame.appendChild(nameBtn);
      slideMeta.appendChild(orderFrame);
      slideMeta.appendChild(nameFrame);
      slideMeta.appendChild(replaceInput);

      const spacer = document.createElement("div");
      spacer.className = "slide-top-spacer";
      spacer.setAttribute("aria-hidden", "true");

      const bottom = document.createElement("div");
      bottom.className = "project-bottom";
      const wrap = document.createElement("div");
      wrap.className = "project-image-wrap";
      const img = document.createElement("img");
      img.alt = "";
      img.width = 1200;
      img.height = 1200;
      img.loading = "lazy";
      img.src = imgSrcForIndex(images, displayUrls, i);
      img.draggable = false;
      wrap.appendChild(img);
      bottom.appendChild(wrap);

      card.appendChild(slideMeta);
      card.appendChild(row);
      card.appendChild(spacer);
      card.appendChild(bottom);
      slide.appendChild(card);
      return slide;
    }

    function render() {
      syncScalesLength();
      clearInsertDragIndicator();
      wrapper.replaceChildren();
      for (let i = 0; i < images.length; i += 1) {
        wrapper.appendChild(buildInsertGap(i));
        wrapper.appendChild(buildSlide(i));
      }
      wrapper.appendChild(buildInsertGap(images.length));
      wrapper.appendChild(buildAddTile());
      wrapper.querySelectorAll(".project-image-wrap img").forEach((imgEl) => {
        const reveal = () => imgEl.classList.add("is-loaded");
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          reveal();
          return;
        }
        imgEl.addEventListener("load", reveal, { once: true });
        imgEl.addEventListener("error", reveal, { once: true });
      });
    }

    function onKeyDown(e) {
      if (e.target.closest("select, input, textarea, button")) return;
      if (images.length === 0) return;
      if (selectedIndex < 0) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveIndex(selectedIndex, -1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveIndex(selectedIndex, 1);
      }
    }

    function saveJson() {
      const clone = JSON.parse(JSON.stringify(data));
      const list = Array.isArray(clone.projects) ? clone.projects : [];
      const target = list.find((p) => p.id === project.id || p.slug === project.slug);
      let editableTarget = target;
      if (!editableTarget) {
        const id =
          project.id ||
          (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `id-${Date.now()}`);
        editableTarget = {
          id,
          title: project.title || "New project",
          slug: project.slug || `new-project-${String(id).slice(0, 8)}`,
          description: project.description || "",
          isPublished: Boolean(project.isPublished),
          orderIndex: Number.isFinite(project.orderIndex) ? project.orderIndex : list.length,
          coverImageId: project.coverImageId || "",
          images: [],
          imageScales: [],
        };
        list.push(editableTarget);
      }
      editableTarget.images = [...images];
      editableTarget.imageScales = scales.map((s) => s);
      editableTarget.title = project.title || editableTarget.title || "";
      editableTarget.description = project.description || "";
      editableTarget.slug = project.slug || editableTarget.slug || "";
      const body = {
        siteTitle: clone.siteTitle,
        siteDescription: clone.siteDescription,
        siteOwnerName: clone.siteOwnerName ?? data.siteOwnerName ?? "",
        siteIntroText: clone.siteIntroText ?? data.siteIntroText ?? "",
        instagramText: clone.instagramText ?? data.instagramText ?? "",
        instagramUrl: clone.instagramUrl,
        contactUrl: clone.contactUrl,
        projects: list,
      };
      const json = JSON.stringify(body, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "projects.json";
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function exitEdit() {
      const u = new URL(window.location.href);
      u.searchParams.delete("edit");
      window.location.href = u.toString();
    }

    function openIndexEdit() {
      const u = new URL(window.location.href);
      const baseDir = u.pathname.endsWith("/")
        ? u.pathname
        : u.pathname.replace(/[^/]+$/, "");
      u.pathname = `${baseDir}index.html`;
      u.search = "";
      u.searchParams.set("edit", "1");
      window.location.href = u.toString();
    }

    function openNewProjectEdit() {
      const u = new URL(window.location.href);
      const baseDir = u.pathname.endsWith("/")
        ? u.pathname
        : u.pathname.replace(/[^/]+$/, "");
      u.pathname = `${baseDir}project.html`;
      u.search = "";
      u.searchParams.set("edit", "1");
      u.searchParams.set("new", "1");
      window.location.href = u.toString();
    }

    function openAdmin() {
      const u = new URL(window.location.href);
      const baseDir = u.pathname.endsWith("/")
        ? u.pathname
        : u.pathname.replace(/[^/]+$/, "");
      u.pathname = `${baseDir}admin/index.html`;
      u.search = "";
      window.location.href = u.toString();
    }

    navActions.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const act = btn.getAttribute("data-action");
      if (act === "save") saveJson();
      if (act === "index-edit") openIndexEdit();
      if (act === "new-project") openNewProjectEdit();
      if (act === "exit") exitEdit();
      if (act === "admin") openAdmin();
    });

    document.addEventListener("keydown", onKeyDown);

    window.addEventListener(
      "beforeunload",
      () => {
        revokeAll(displayUrls);
      },
      { once: true }
    );

    render();
  };
})();
