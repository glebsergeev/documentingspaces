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

    const toolbar = document.createElement("div");
    toolbar.className = "index-edit-toolbar";
    toolbar.innerHTML = `
      <div class="index-edit-toolbar-pill" role="group" aria-label="Index editor actions">
        <button type="button" data-action="new">New project</button>
        <span class="index-edit-pill-divider" aria-hidden="true"></span>
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
      render();
    }

    function editProjectAt(i) {
      const p = projectsOrdered[i];
      if (!p) return;
      const slug = String(p.slug || "").trim() || slugify(p.title || `project-${i + 1}`);
      p.slug = slug;
      const u = new URL(window.location.href);
      u.pathname = u.pathname.replace(/index\.html$/i, "project.html");
      u.searchParams.set("slug", slug);
      u.searchParams.set("edit", "1");
      window.location.href = u.toString();
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

      const title = escapeHtml(p.title || "(untitled)");
      const slug = escapeHtml(p.slug || "");
      const cover = escapeAttr(coverSrcFromProject(p));
      slide.innerHTML = `
        <div class="slide-card">
          <div class="slide-top-spacer" aria-hidden="true"></div>
          <div class="slide-bottom">
            <div class="slide-hit">
              <div class="index-edit-meta-row">
                <button type="button" class="index-edit-toggle ${p.isPublished ? "is-on" : "is-off"}" data-action="publish">
                  ${p.isPublished ? "Published" : "Draft"}
                </button>
                <button type="button" class="index-edit-open-btn" data-action="open">Edit project</button>
              </div>
              <h1 class="slide-title index-edit-title">${title}<span class="index-edit-slug">/${slug}</span></h1>
              <div class="slide-main">
                <div class="slide-visual">
                  <div class="cover-square"><img src="${cover}" alt="" width="800" height="800" loading="lazy" /></div>
                </div>
              </div>
              <div class="index-edit-title-input-row">
                <input type="text" class="index-edit-title-input" value="${escapeAttr(p.title || "")}" placeholder="Project title" />
              </div>
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

      slide.querySelector('[data-action="publish"]')?.addEventListener("click", () => togglePublishedAt(i));
      slide.querySelector('[data-action="open"]')?.addEventListener("click", () => editProjectAt(i));
      slide.querySelector(".index-edit-title-input")?.addEventListener("change", (e) => {
        updateTitleAt(i, e.target.value);
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

    render();
  };
})();
