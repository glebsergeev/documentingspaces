/**
 * Visual editor for index page (?edit=1).
 * Keeps public look and adds lightweight controls.
 */
(function () {
  function slugify(text) {
    return (
      String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "") || "project"
    );
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
    const id = idRaw != null && String(idRaw).trim() !== "" ? String(idRaw).trim() : "";
    if (id && /^[A-Za-z0-9_-]+$/.test(id)) {
      return `assets/${id}.jpg`;
    }
    const imgs = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
    return imgs[0] || "";
  }

  function stemFromPath(path) {
    const base = String(path || "").split("/").pop() || "";
    return base.replace(/\.[^.]+$/i, "");
  }

  function downloadJson(data, projectsOrdered) {
    const out = JSON.parse(JSON.stringify(data || {}));
    out.projects = projectsOrdered.map((p, i) => ({
      ...p,
      orderIndex: i,
    }));
    const json = JSON.stringify(out, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projects.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  window.initIndexGalleryEdit = async function initIndexGalleryEdit(ctx) {
    const { data, wrapper, swiperEl } = ctx || {};
    if (!data || !wrapper || !swiperEl) return;

    document.body.classList.add("index-gallery-edit");
    swiperEl.classList.add("index-swiper--edit");
    wrapper.classList.add("index-edit-strip");
    wrapper.innerHTML = "";

    const all = Array.isArray(data.projects) ? data.projects : [];
    let projectsOrdered = [...all].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    let dragFrom = null;
    let dragInsertIndex = null;
    const coverPreviewUrls = new Map();

    const toolbar = document.createElement("div");
    toolbar.className = "index-edit-toolbar";
    toolbar.innerHTML = `
      <button type="button" class="index-edit-toolbar-new" data-action="new">New project</button>
      <div class="index-edit-toolbar-pill" role="group" aria-label="Index editor actions">
        <button type="button" data-action="save">Save</button>
        <span class="index-edit-pill-divider" aria-hidden="true"></span>
        <button type="button" data-action="exit">Exit</button>
      </div>
    `;
    document.body.appendChild(toolbar);

    function syncOrderIndices() {
      projectsOrdered.forEach((p, i) => {
        p.orderIndex = i;
      });
    }

    function clearInsertIndicator() {
      dragInsertIndex = null;
      wrapper
        .querySelectorAll(".index-edit-insert-gap--drag-insert")
        .forEach((el) => el.classList.remove("index-edit-insert-gap--drag-insert"));
    }

    function setInsertIndicator(insertIndex) {
      const next = Math.max(0, Math.min(insertIndex, projectsOrdered.length));
      if (next === dragInsertIndex) return;
      dragInsertIndex = next;
      wrapper
        .querySelectorAll(".index-edit-insert-gap--drag-insert")
        .forEach((el) => el.classList.remove("index-edit-insert-gap--drag-insert"));
      const el = wrapper.querySelector(`.index-edit-insert-gap[data-insert-index="${next}"]`);
      if (el) el.classList.add("index-edit-insert-gap--drag-insert");
    }

    function moveToInsertIndex(from, insertAt) {
      if (from < 0 || from >= projectsOrdered.length) return;
      let at = Math.max(0, Math.min(insertAt, projectsOrdered.length));
      if (from < at) at -= 1;
      if (at === from) return;
      const item = projectsOrdered.splice(from, 1)[0];
      projectsOrdered.splice(at, 0, item);
      syncOrderIndices();
      render();
    }

    function addProject() {
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `id-${Date.now()}`;
      const p = {
        id,
        title: "New project",
        slug: `new-project-${id.slice(0, 8)}`,
        description: "",
        isPublished: false,
        orderIndex: projectsOrdered.length,
        coverImageId: "",
        images: [],
        imageScales: [],
      };
      projectsOrdered.push(p);
      syncOrderIndices();
      render();
    }

    function projectCoverSrc(p) {
      if (!p) return "";
      const preview = coverPreviewUrls.get(p.id);
      if (preview) return preview;
      return coverSrcFromProject(p);
    }

    function togglePublishedAt(i) {
      const p = projectsOrdered[i];
      if (!p) return;
      p.isPublished = !p.isPublished;
      render();
    }

    function updateTitleAt(i, val) {
      const p = projectsOrdered[i];
      if (!p) return;
      p.title = val;
      if (!String(p.slug || "").trim()) {
        p.slug = slugify(val);
      }
    }

    function editProjectAt(i) {
      const p = projectsOrdered[i];
      if (!p) return;
      const slug = String(p.slug || "").trim() || slugify(p.title || `project-${i + 1}`);
      p.slug = slug;
      const u = new URL(window.location.href);
      const baseDir = u.pathname.endsWith("/")
        ? u.pathname
        : u.pathname.replace(/[^/]+$/, "");
      u.pathname = `${baseDir}project.html`;
      u.searchParams.set("slug", slug);
      u.searchParams.set("edit", "1");
      window.location.href = u.toString();
    }

    function setCoverFileAt(i, file) {
      const p = projectsOrdered[i];
      if (!p || !file || !file.type.startsWith("image/")) return;
      const path = `assets/${file.name}`;
      const stem = stemFromPath(path);
      p.coverImageId = stem;
      if (!Array.isArray(p.images)) p.images = [];
      if (!p.images.includes(path)) {
        p.images.unshift(path);
      }
      const prev = coverPreviewUrls.get(p.id);
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      coverPreviewUrls.set(p.id, URL.createObjectURL(file));
      render();
    }

    function buildInsertGap(insertIndex) {
      const gap = document.createElement("div");
      gap.className = "index-edit-insert-gap";
      gap.dataset.insertIndex = String(insertIndex);
      const hit = document.createElement("div");
      hit.className = "index-edit-insert-gap-hit";
      hit.setAttribute("aria-hidden", "true");
      gap.appendChild(hit);

      ["dragenter", "dragover"].forEach((ev) => {
        gap.addEventListener(ev, (e) => {
          if (dragFrom == null) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
          setInsertIndicator(insertIndex);
        });
      });
      gap.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const from = parseInt(e.dataTransfer?.getData("text/plain"), 10);
        if (!Number.isNaN(from)) {
          moveToInsertIndex(from, insertIndex);
        }
        clearInsertIndicator();
      });
      return gap;
    }

    function buildSlide(p, i) {
      const slide = document.createElement("div");
      slide.className = "swiper-slide swiper-slide--work index-edit-slide";
      slide.draggable = true;
      slide.dataset.index = String(i);
      if (!p.isPublished) {
        slide.classList.add("index-edit-slide--draft");
      }

      const title = p.title || "";
      const slug = escapeHtml(p.slug || "");
      const cover = escapeAttr(projectCoverSrc(p));
      const publishLabel = p.isPublished ? "Unpublish" : "Publish";
      const editLabel = p.isPublished ? "Edit" : "Edit Draft";
      slide.innerHTML = `
        <div class="slide-card">
          <div class="slide-top-spacer" aria-hidden="true"></div>
          <div class="slide-bottom">
            <div class="slide-hit">
              <h1 class="slide-title index-edit-title-row">
                <span class="index-edit-title-frame">
                  <input type="text" class="index-edit-title-input" value="${escapeAttr(title)}" placeholder="Project title" />
                </span>
                <span class="index-edit-btn-pill">
                  <button type="button" class="index-edit-inline-btn" data-action="publish">${publishLabel}</button>
                </span>
                <span class="index-edit-btn-pill">
                  <button type="button" class="index-edit-inline-btn" data-action="open">${editLabel}</button>
                </span>
                <span class="index-edit-slug">/${slug}</span>
              </h1>
              <div class="slide-main">
                <div class="slide-visual">
                  <div class="cover-square index-edit-cover" role="button" tabindex="0" aria-label="Choose cover image">
                    <img src="${cover}" alt="" width="800" height="800" loading="lazy" />
                  </div>
                </div>
              </div>
              <input type="file" class="index-edit-cover-input" accept="image/*" hidden />
            </div>
          </div>
        </div>
      `;

      slide.addEventListener("dragstart", (e) => {
        dragFrom = i;
        slide.classList.add("index-edit-slide--dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(i));
      });
      slide.addEventListener("dragend", () => {
        dragFrom = null;
        slide.classList.remove("index-edit-slide--dragging");
        clearInsertIndicator();
      });
      slide.addEventListener("dragover", (e) => {
        if (dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = slide.getBoundingClientRect();
        const insertIndex = e.clientX < rect.left + rect.width / 2 ? i : i + 1;
        setInsertIndicator(insertIndex);
      });
      slide.addEventListener("drop", (e) => {
        e.preventDefault();
        if (dragFrom == null) return;
        const rect = slide.getBoundingClientRect();
        const insertIndex = e.clientX < rect.left + rect.width / 2 ? i : i + 1;
        const from = parseInt(e.dataTransfer?.getData("text/plain"), 10);
        if (!Number.isNaN(from)) {
          moveToInsertIndex(from, insertIndex);
        }
        clearInsertIndicator();
      });

      const titleInput = slide.querySelector(".index-edit-title-input");
      const publishBtn = slide.querySelector('[data-action="publish"]');
      const openBtn = slide.querySelector('[data-action="open"]');
      const coverEl = slide.querySelector(".index-edit-cover");
      const coverInput = slide.querySelector(".index-edit-cover-input");

      function syncTitleWidth() {
        if (!titleInput) return;
        const len = Math.max(1, (titleInput.value || "").trim().length);
        titleInput.style.width = `${Math.min(42, len)}ch`;
      }

      syncTitleWidth();
      titleInput?.addEventListener("input", (e) => {
        updateTitleAt(i, e.target.value);
        syncTitleWidth();
      });
      titleInput?.addEventListener("change", () => {
        render();
      });
      titleInput?.addEventListener("click", (e) => e.stopPropagation());
      titleInput?.addEventListener("keydown", (e) => {
        e.stopPropagation();
      });

      publishBtn?.addEventListener("click", () => togglePublishedAt(i));
      openBtn?.addEventListener("click", () => editProjectAt(i));

      function openCoverPicker() {
        coverInput?.click();
      }
      coverEl?.addEventListener("click", (e) => {
        e.stopPropagation();
        openCoverPicker();
      });
      coverEl?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCoverPicker();
        }
      });
      coverInput?.addEventListener("change", () => {
        const file = coverInput.files?.[0];
        coverInput.value = "";
        if (file) setCoverFileAt(i, file);
      });
      return slide;
    }

    function buildAddTile() {
      const wrap = document.createElement("div");
      wrap.className = "index-edit-add-tile";
      wrap.innerHTML = `
        <div class="index-edit-add-tile-inner" role="button" tabindex="0" aria-label="Create new project">
          <button type="button" class="index-edit-add-btn" aria-hidden="true">+</button>
          <div class="index-edit-add-hint">New project</div>
        </div>
      `;
      const hit = wrap.querySelector(".index-edit-add-tile-inner");
      const onAct = () => addProject();
      hit?.addEventListener("click", onAct);
      hit?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAct();
        }
      });
      return wrap;
    }

    function render() {
      clearInsertIndicator();
      syncOrderIndices();
      wrapper.replaceChildren();
      for (let i = 0; i < projectsOrdered.length; i += 1) {
        wrapper.appendChild(buildInsertGap(i));
        wrapper.appendChild(buildSlide(projectsOrdered[i], i));
      }
      wrapper.appendChild(buildInsertGap(projectsOrdered.length));
      wrapper.appendChild(buildAddTile());
    }

    function exitEdit() {
      const u = new URL(window.location.href);
      u.searchParams.delete("edit");
      window.location.href = u.toString();
    }

    toolbar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      if (action === "new") addProject();
      if (action === "save") downloadJson(data, projectsOrdered);
      if (action === "exit") exitEdit();
    });

    window.addEventListener(
      "beforeunload",
      () => {
        coverPreviewUrls.forEach((u) => {
          if (u && u.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(u);
            } catch {
              /* ignore */
            }
          }
        });
      },
      { once: true }
    );

    render();
  };
})();
