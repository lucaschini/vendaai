# Venda.AI HUD (Chrome Extension)

Floating toolbar with Chat and Insights panels injected as an overlay on any page. Mirrors the standalone HTML UI you approved.

## Load in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this folder:
   `c:\Users\cauam\Desktop\Vscode\extensao-chrome`
4. Visit any page and refresh. The HUD appears in the top-left.

## Usage

- Pause/Play: first button toggles the timer icon/state.
- Chat (2nd button): opens/closes the chat panel; messages scroll inside the panel.
- Insights (3rd button): opens/closes the insights panel.
- Drag the toolbar by grabbing empty space on it (not the buttons). Panels follow the toolbar. Position persists per site via localStorage.

## Notes

- All styles are isolated in a Shadow DOM. Should not affect or be affected by page CSS.
- No special permissions required. Injects on all URLs by default; you can scope in `manifest.json`.
