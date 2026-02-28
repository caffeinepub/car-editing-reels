# Specification

## Summary
**Goal:** Build a single-PNG thumbnail uploader app with a clean minimal UI and a backend that stores one thumbnail at a time.

**Planned changes:**
- Add a backend actor with upload, retrieve, and delete functions that stores a single PNG blob with a unique ID and timestamp; uploading a new file replaces the previous one
- Build a single-page UI with a file picker button and drag-and-drop zone that accepts PNG files only
- Show a live preview of the selected PNG before confirming the upload
- Display clear error messages for non-PNG file selections
- Show success state with the uploaded thumbnail after a successful upload
- Provide a delete/replace button to remove the current thumbnail and start a new upload
- Apply a clean, minimal theme: light neutral background, dashed rounded upload zone, drag-over highlight, consistent visual states (idle, drag-over, preview, uploading, success, error), centered responsive layout

**User-visible outcome:** Users can drag-and-drop or pick a single PNG file, preview it, upload it to the backend, view the stored thumbnail, and delete or replace it — all within a clean, minimal interface.
