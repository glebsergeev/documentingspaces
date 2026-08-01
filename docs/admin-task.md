# Content Editing Workflow

## Primary flow

Use visual editing as the default path:

- `index.html?edit=1` for index ordering and publish state.
- `project.html?slug=<project-slug>&edit=1` for per-project gallery editing.

## Backup flow

`admin/index.html` stays available as a fallback/emergency editor for JSON-first operations:

- import/export `projects.json`
- direct metadata edits
- recovery when visual editors are temporarily unavailable
