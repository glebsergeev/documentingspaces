/**
 * Minimal admin for data/projects.json (static export only).
 */

const DATA_URL = "../data/projects.json";

let data = null;
/** @type {string | null} */
let editingId = null;

const $ = (sel, root = document) => root.querySelector(sel);

function setStatus(msg, isError = false) {
  const el = $("#status");
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle("error", isError);
}

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

function stemFromPath(path) {
  const base = String(path).split("/").pop() || "";
  return base.replace(/\.[^.]+$/i, "");
}

function normalizeProject(p, i) {
  return {
    id: p.id != null ? String(p.id) : `p-${i}`,
    title: p.title != null ? String(p.title) : "",
    slug: p.slug != null ? String(p.slug) : slugify(p.title || `project-${i}`),
    description: p.description != null ? String(p.description) : "",
    isPublished: Boolean(p.isPublished),
    orderIndex: Number.isFinite(Number(p.orderIndex)) ? Number(p.orderIndex) : i,
    coverImageId: p.coverImageId != null ? String(p.coverImageId) : "",
    images: Array.isArray(p.images) ? p.images.map(String) : [],
  };
}

function normalizePayload(raw) {
  const projects = Array.isArray(raw.projects) ? raw.projects : [];
  const sorted = [...projects].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  return {
    siteTitle: raw.siteTitle != null ? String(raw.siteTitle) : "",
    siteDescription:
      raw.siteDescription != null && raw.siteDescription !== ""
        ? String(raw.siteDescription)
        : null,
    instagramUrl: raw.instagramUrl != null ? String(raw.instagramUrl) : "",
    contactUrl: raw.contactUrl != null ? String(raw.contactUrl) : "",
    projects: sorted.map((p, i) => normalizeProject(p, i)),
  };
}

function renumberOrderIndices() {
  if (!data) return;
  const list = sortedProjects();
  list.forEach((p, i) => {
    p.orderIndex = i;
  });
}

function sortedProjects() {
  return [...data.projects].sort((a, b) => a.orderIndex - b.orderIndex);
}

function findProject(id) {
  return data.projects.find((p) => p.id === id) ?? null;
}

function thumbSrc(path) {
  if (!path || String(path).startsWith("http")) return path;
  return `../${String(path).replace(/^\//, "")}`;
}

function renderSiteFields() {
  const root = $("#site-fields");
  if (!root || !data) return;
  root.replaceChildren();

  const fields = [
    { key: "siteTitle", label: "Site title", type: "text" },
    { key: "siteDescription", label: "Site description (optional)", type: "textarea", nullable: true },
    { key: "instagramUrl", label: "Instagram URL", type: "url" },
    { key: "contactUrl", label: "Contact (mailto or URL)", type: "text" },
  ];

  for (const f of fields) {
    const lab = document.createElement("label");
    lab.className = "stack";
    lab.textContent = f.label;
    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
      const v = data[f.key];
      input.value = v == null ? "" : v;
      input.rows = 3;
      input.addEventListener("input", () => {
        const t = input.value.trim();
        data[f.key] = f.nullable && t === "" ? null : input.value;
      });
    } else {
      input = document.createElement("input");
      input.type = f.type;
      input.value = data[f.key] ?? "";
      input.addEventListener("input", () => {
        data[f.key] = input.value;
      });
    }
    lab.appendChild(input);
    root.appendChild(lab);
  }
}

function renderProjectList() {
  const root = $("#project-list");
  if (!root || !data) return;
  root.replaceChildren();

  const list = sortedProjects();
  list.forEach((p, sortedIndex) => {
    const row = document.createElement("div");
    row.className = "project-row";

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.className = "project-row-title";
    title.textContent = p.title || "(untitled)";
    const meta = document.createElement("div");
    meta.className = "project-row-meta";
    meta.textContent = `${p.isPublished ? "Published" : "Draft"} · ${p.images.length} images · /?slug=${p.slug}`;
    left.appendChild(title);
    left.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const pubLabel = document.createElement("label");
    pubLabel.className = "check-inline";
    const pubCb = document.createElement("input");
    pubCb.type = "checkbox";
    pubCb.checked = p.isPublished;
    pubCb.addEventListener("change", () => {
      p.isPublished = pubCb.checked;
      renderProjectList();
      if (editingId === p.id) renderEditor();
    });
    pubLabel.appendChild(pubCb);
    pubLabel.appendChild(document.createTextNode("Published"));

    const up = document.createElement("button");
    up.type = "button";
    up.textContent = "↑";
    up.title = "Move up";
    up.disabled = sortedIndex === 0;
    up.addEventListener("click", () => moveProject(sortedIndex, -1));

    const down = document.createElement("button");
    down.type = "button";
    down.textContent = "↓";
    down.title = "Move down";
    down.disabled = sortedIndex === list.length - 1;
    down.addEventListener("click", () => moveProject(sortedIndex, 1));

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = editingId === p.id ? "Editing…" : "Edit";
    editBtn.disabled = editingId === p.id;
    editBtn.addEventListener("click", () => openEditor(p.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteProject(p.id));

    actions.appendChild(pubLabel);
    actions.appendChild(up);
    actions.appendChild(down);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(actions);
    root.appendChild(row);
  });
}

function moveProject(sortedIndex, delta) {
  const list = sortedProjects();
  const j = sortedIndex + delta;
  if (j < 0 || j >= list.length) return;
  const a = list[sortedIndex];
  const b = list[j];
  const t = a.orderIndex;
  a.orderIndex = b.orderIndex;
  b.orderIndex = t;
  renumberOrderIndices();
  renderAll();
}

function openEditor(id) {
  editingId = id;
  const sec = $("#editor-section");
  if (sec) sec.hidden = false;
  renderEditor();
  renderProjectList();
  sec?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeEditor() {
  editingId = null;
  const sec = $("#editor-section");
  if (sec) sec.hidden = true;
  $("#editor-body")?.replaceChildren();
  renderProjectList();
}

function renderEditor() {
  const body = $("#editor-body");
  const legend = $("#editor-legend");
  if (!body || !data) return;
  body.replaceChildren();

  const p = editingId ? findProject(editingId) : null;
  if (!p) {
    closeEditor();
    return;
  }
  if (legend) legend.textContent = `Edit · ${p.title || p.slug}`;

  const titleLab = document.createElement("label");
  titleLab.className = "stack";
  titleLab.textContent = "Title";
  const titleIn = document.createElement("input");
  titleIn.type = "text";
  titleIn.value = p.title;
  titleIn.addEventListener("input", () => {
    p.title = titleIn.value;
    renderProjectList();
  });
  titleLab.appendChild(titleIn);
  body.appendChild(titleLab);

  const slugRow = document.createElement("div");
  slugRow.style.marginTop = "0.65rem";
  const slugLab = document.createElement("label");
  slugLab.className = "stack";
  slugLab.textContent = "Slug (URL)";
  const slugIn = document.createElement("input");
  slugIn.type = "text";
  slugIn.value = p.slug;
  slugIn.addEventListener("input", () => {
    p.slug = slugIn.value;
    renderProjectList();
  });
  slugLab.appendChild(slugIn);
  const slugBtn = document.createElement("button");
  slugBtn.type = "button";
  slugBtn.textContent = "Slug from title";
  slugBtn.style.marginTop = "0.35rem";
  slugBtn.addEventListener("click", () => {
    p.slug = slugify(p.title);
    slugIn.value = p.slug;
    renderProjectList();
  });
  slugRow.appendChild(slugLab);
  slugRow.appendChild(slugBtn);
  body.appendChild(slugRow);

  const descLab = document.createElement("label");
  descLab.className = "stack";
  descLab.textContent = "Description";
  const descTa = document.createElement("textarea");
  descTa.value = p.description;
  descTa.rows = 4;
  descTa.addEventListener("input", () => {
    p.description = descTa.value;
  });
  descLab.appendChild(descTa);
  body.appendChild(descLab);

  const coverLab = document.createElement("label");
  coverLab.className = "stack";
  coverLab.textContent = "Cover image ID (filename without extension, optional)";
  const coverIn = document.createElement("input");
  coverIn.type = "text";
  coverIn.placeholder = "e.g. DSCF0007";
  coverIn.value = p.coverImageId;
  coverIn.addEventListener("input", () => {
    p.coverImageId = coverIn.value.trim();
  });
  coverLab.appendChild(coverIn);
  body.appendChild(coverLab);

  const pubLab = document.createElement("label");
  pubLab.className = "check-inline stack";
  pubLab.style.marginTop = "0.75rem";
  const pubEd = document.createElement("input");
  pubEd.type = "checkbox";
  pubEd.checked = p.isPublished;
  pubEd.addEventListener("change", () => {
    p.isPublished = pubEd.checked;
    renderProjectList();
  });
  pubLab.appendChild(pubEd);
  pubLab.appendChild(document.createTextNode("Published"));
  body.appendChild(pubLab);

  const imgH = document.createElement("h3");
  imgH.style.fontSize = "0.95rem";
  imgH.style.margin = "1.25rem 0 0.5rem";
  imgH.textContent = "Images";
  body.appendChild(imgH);

  const imgHint = document.createElement("p");
  imgHint.className = "hint";
  imgHint.textContent =
    "Paths are stored as on the site (e.g. assets/photo.jpg). Upload only picks filenames — copy files into assets/ yourself.";
  body.appendChild(imgHint);

  const imgList = document.createElement("div");
  imgList.style.border = "1px solid var(--border, #ccc)";
  imgList.style.borderRadius = "6px";
  imgList.style.padding = "0 0.5rem";
  p.images.forEach((src, idx) => {
    const row = document.createElement("div");
    row.className = "image-row";

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = thumbSrc(src);
    img.addEventListener("error", () => {
      img.dataset.broken = "1";
    });

    const pathLab = document.createElement("label");
    pathLab.className = "stack";
    pathLab.style.margin = "0";
    pathLab.textContent = "Path";
    const pathIn = document.createElement("input");
    pathIn.type = "text";
    pathIn.value = src;
    pathIn.addEventListener("input", () => {
      p.images[idx] = pathIn.value;
      img.src = thumbSrc(pathIn.value);
      img.dataset.broken = "";
    });
    pathLab.appendChild(pathIn);

    const btns = document.createElement("div");
    btns.className = "row-actions";

    const up = document.createElement("button");
    up.type = "button";
    up.textContent = "↑";
    up.disabled = idx === 0;
    up.addEventListener("click", () => {
      moveImage(p, idx, -1);
      renderEditor();
    });

    const down = document.createElement("button");
    down.type = "button";
    down.textContent = "↓";
    down.disabled = idx === p.images.length - 1;
    down.addEventListener("click", () => {
      moveImage(p, idx, 1);
      renderEditor();
    });

    const coverBtn = document.createElement("button");
    coverBtn.type = "button";
    coverBtn.textContent = "Cover";
    coverBtn.title = "Set as cover (coverImageId)";
    coverBtn.addEventListener("click", () => {
      p.coverImageId = stemFromPath(p.images[idx]);
      coverIn.value = p.coverImageId;
    });

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "danger";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      p.images.splice(idx, 1);
      renderEditor();
    });

    btns.appendChild(up);
    btns.appendChild(down);
    btns.appendChild(coverBtn);
    btns.appendChild(rm);

    row.appendChild(img);
    row.appendChild(pathLab);
    row.appendChild(btns);
    imgList.appendChild(row);
  });
  body.appendChild(imgList);

  const addRow = document.createElement("div");
  addRow.className = "row-actions";
  addRow.style.marginTop = "0.65rem";

  const pathAdd = document.createElement("input");
  pathAdd.type = "text";
  pathAdd.placeholder = "assets/new.jpg";
  pathAdd.style.flex = "1";
  pathAdd.style.minWidth = "12rem";
  const addPathBtn = document.createElement("button");
  addPathBtn.type = "button";
  addPathBtn.textContent = "Add path";
  addPathBtn.addEventListener("click", () => {
    const v = pathAdd.value.trim();
    if (!v) return;
    p.images.push(v);
    pathAdd.value = "";
    renderEditor();
  });

  addRow.appendChild(pathAdd);
  addRow.appendChild(addPathBtn);
  body.appendChild(addRow);

  const uploadLab = document.createElement("label");
  uploadLab.className = "stack";
  uploadLab.style.marginTop = "0.75rem";
  uploadLab.textContent = "Add from file names (upload UI — no server)";
  const fileIn = document.createElement("input");
  fileIn.type = "file";
  fileIn.accept = "image/*";
  fileIn.multiple = true;
  fileIn.addEventListener("change", () => {
    if (!fileIn.files?.length) return;
    for (const f of fileIn.files) {
      p.images.push(`assets/${f.name}`);
    }
    fileIn.value = "";
    renderEditor();
  });
  uploadLab.appendChild(fileIn);
  body.appendChild(uploadLab);

  const closeRow = document.createElement("p");
  closeRow.style.marginTop = "1rem";
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Close editor";
  closeBtn.addEventListener("click", () => closeEditor());
  closeRow.appendChild(closeBtn);
  body.appendChild(closeRow);
}

function moveImage(proj, i, delta) {
  const j = i + delta;
  if (j < 0 || j >= proj.images.length) return;
  const t = proj.images[i];
  proj.images[i] = proj.images[j];
  proj.images[j] = t;
}

function addProject() {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `id-${Date.now()}`;
  const n = data.projects.length;
  data.projects.push({
    id,
    title: "New project",
    slug: `new-project-${id.slice(0, 8)}`,
    description: "",
    isPublished: false,
    orderIndex: n,
    coverImageId: "",
    images: [],
  });
  renumberOrderIndices();
  renderAll();
  openEditor(id);
}

function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  const i = data.projects.findIndex((p) => p.id === id);
  if (i < 0) return;
  data.projects.splice(i, 1);
  renumberOrderIndices();
  if (editingId === id) closeEditor();
  else renderAll();
}

function exportPayload() {
  renumberOrderIndices();
  const out = {
    siteTitle: data.siteTitle,
    siteDescription: data.siteDescription,
    instagramUrl: data.instagramUrl,
    contactUrl: data.contactUrl,
    projects: sortedProjects().map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      isPublished: p.isPublished,
      orderIndex: p.orderIndex,
      coverImageId: p.coverImageId,
      images: [...p.images],
    })),
  };
  return JSON.stringify(out, null, 2);
}

function downloadJson() {
  const blob = new Blob([exportPayload()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "projects.json";
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus("Download started. Replace data/projects.json in the repo.");
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const raw = JSON.parse(reader.result);
      data = normalizePayload(raw);
      editingId = null;
      $("#editor-section").hidden = true;
      renderAll();
      setStatus("Imported. Review and download to save.");
    } catch (e) {
      setStatus(`Invalid JSON: ${e.message}`, true);
    }
  };
  reader.readAsText(file, "utf-8");
}

function renderAll() {
  renderSiteFields();
  renderProjectList();
  if (editingId) renderEditor();
}

async function init() {
  try {
    const r = await fetch(DATA_URL, { cache: "no-store" });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const raw = await r.json();
    data = normalizePayload(raw);
  } catch (e) {
    setStatus(
      `Could not load ${DATA_URL}. Open this admin via a local server (e.g. from the site root). ${e.message}`,
      true
    );
    data = normalizePayload({
      siteTitle: "",
      siteDescription: null,
      instagramUrl: "",
      contactUrl: "",
      projects: [],
    });
  }

  $("#add-project")?.addEventListener("click", () => addProject());
  $("#download-json")?.addEventListener("click", () => downloadJson());
  $("#import-json")?.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) importJsonFile(f);
    e.target.value = "";
  });

  renderAll();
  if (!data.projects.length) {
    setStatus("No projects loaded. Add one or import JSON.");
  } else {
    setStatus(`Loaded ${data.projects.length} project(s). Edits stay in the page until you download.`);
  }
}

init();
