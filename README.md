# fx.js

Practice cards for Claude's visualize widget: flip cards, multiple choice, fill-in-the-blank. KaTeX supported.

## Usage

```html
<script type="application/json" id="fx-data">
{"cards":[
  {"front":"Front","back":"Back"},
  {"q":"Question","options":["A","B","C","D"],"answer":0},
  {"q":"Question ___","answer":["answer","alt"]}
]}
</script>
<script src="https://cdn.jsdelivr.net/gh/USER/REPO@TAG/fx.js"></script>
```

## Data

- `front` → flip card (needs `back`)
- `options` → multiple choice; `answer` is a 0-based index; 2–9 options
- otherwise → fill-in; `answer` is a string or array (case/whitespace-insensitive)
- Math: `$...$` inline, `$$...$$` display; escape backslashes in JSON (`"$\\frac{1}{2}$"`)
- Literal dollar sign: `\\$`. Never include `</script>`.

## Keys

Space: flip · 1–9: choose · Enter: submit / next · ←/→: navigate
