/* fx.js - practice cards (flip, multiple choice, fill-in) with KaTeX.
 * <script type="application/json" id="fx-data">{"cards":[...]}</script>
 * <script src="https://cdn.jsdelivr.net/gh/USER/REPO@TAG/fx.js"></script>
 */
(function () {
  var KX = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/';
  var CSS = [
    '.fx-bar{height:3px;background:var(--border,#e5e5e5);margin:.5rem 0 1rem}',
    '.fx-bar>i{display:block;height:100%;width:0;background:var(--text-primary,#111);transition:width .3s}',
    '.fx-c{perspective:1400px;outline:none}',
    '.fx-i{display:grid;transition:transform .5s cubic-bezier(.3,.7,.2,1);transform-style:preserve-3d}',
    '.fx-c.on .fx-i{transform:rotateY(180deg)}',
    '.fx-z{transform:rotateY(180deg)}',
    '.fx-c.on .fx-a,.fx-c:not(.on) .fx-z{pointer-events:none}',
    '.fx-f{grid-area:1/1;min-height:400px;padding:2.5rem 2rem;box-sizing:border-box;border-radius:16px;border:.5px solid var(--border,#e5e5e5);background:var(--surface-2,#fff);color:var(--text-primary,#111);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;backface-visibility:hidden;-webkit-backface-visibility:hidden}',
    '.fx-t{font-size:30px;font-weight:500;line-height:1.4;white-space:pre-wrap;max-width:560px}',
    '.fx-s{font-size:21px}',
    '.fx-w{display:grid;gap:10px;width:100%;max-width:520px;margin-top:28px}',
    '.fx-f .fx-o{text-align:left;height:auto;padding:13px 18px;border-radius:12px;font-size:16px;border:.5px solid var(--border-strong,#ccc);background:transparent;color:inherit;cursor:pointer}',
    '.fx-f .fx-o.ok{background:var(--bg-success,#e8f5e9);border-color:var(--border-success,#7bc47f);color:var(--text-success,#1b5e20)}',
    '.fx-f .fx-o.no{background:var(--bg-danger,#fdecea);border-color:var(--border-danger,#e57373);color:var(--text-danger,#b71c1c)}',
    '.fx-btn{height:44px;padding:0 26px;border-radius:999px;font-size:15px;cursor:pointer}',
    '.fx-pri{background:var(--fill-primary,#111);color:var(--on-primary,#fff);border-color:transparent}',
    '.fx-err{color:var(--text-danger,#b71c1c);font-size:15px;line-height:1.6}'
  ].join('');

  var dataEl = document.getElementById('fx-data');
  var anchor = document.currentScript || dataEl;
  if (!anchor) return;

  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  var root = document.createElement('div');
  root.innerHTML =
    '<h2 class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Practice cards: Space to flip, arrow keys to navigate</h2>' +
    '<div class="fx-bar"><i></i></div>' +
    '<div class="fx-c" tabindex="0"><div class="fx-i"><div class="fx-f fx-a"></div><div class="fx-f fx-z"></div></div></div>' +
    '<div style="display:flex;align-items:center;gap:12px;margin-top:16px">' +
    '<button class="fx-btn fx-l">← Prev</button><button class="fx-btn fx-pri fx-r">Next →</button>' +
    '<span class="fx-n" style="margin-left:auto;font-size:13px;color:var(--text-muted,#888)"></span></div>';
  anchor.parentNode.insertBefore(root, anchor.nextSibling);

  var q = function (s) { return root.querySelector(s); };
  var card = q('.fx-c'), I = q('.fx-i'), A = q('.fx-a'), Z = q('.fx-z');
  var esc = function (t) { var e = document.createElement('i'); e.textContent = t == null ? '' : String(t); return e.innerHTML; };
  var norm = function (t) { return String(t).trim().toLowerCase().replace(/\s+/g, ' '); };

  var C;
  try { C = JSON.parse(dataEl.textContent).cards; } catch (e) { A.innerHTML = '<div class="fx-err">Invalid JSON in fx-data: ' + esc(e.message) + '</div>'; return; }
  if (!Array.isArray(C) || !C.length) { A.innerHTML = '<div class="fx-err">fx-data has no cards</div>'; return; }

  function check(c) {
    if (c.front != null) return c.back == null ? 'missing back' : '';
    if (c.q == null) return 'missing q or front';
    if (c.options) {
      if (!Array.isArray(c.options) || c.options.length < 2 || c.options.length > 9) return 'options must have 2-9 items';
      if (!(c.answer >= 0 && c.answer < c.options.length && c.answer % 1 === 0)) return 'answer must be an integer from 0 to ' + (c.options.length - 1);
      return '';
    }
    return c.answer == null || [].concat(c.answer).length === 0 ? 'missing answer' : '';
  }

  var S = C.map(function () { return {}; }), E = C.map(check), i = 0;
  var ty = function () { var c = C[i]; return E[i] ? 'x' : c.front != null ? 'f' : c.options ? 'c' : 'b'; };

  function tex(el) {
    if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
  }

  function render() {
    var c = C[i], s = S[i], t = ty(), h;
    I.style.transition = 'none'; card.classList.toggle('on', !!s.open); void I.offsetWidth; I.style.transition = '';
    Z.innerHTML = '';
    if (t === 'x') h = '<div class="fx-err">Card ' + (i + 1) + ': ' + esc(E[i]) + '</div>';
    else if (t === 'f') { h = '<div class="fx-t">' + esc(c.front) + '</div>'; Z.innerHTML = '<div class="fx-t">' + esc(c.back) + '</div>'; }
    else {
      h = '<div class="fx-t fx-s">' + esc(c.q) + '</div>';
      if (t === 'c') h += '<div class="fx-w">' + c.options.map(function (o, k) {
        var cl = s.pick == null ? '' : k === c.answer ? ' ok' : k === s.pick ? ' no' : '';
        return '<button class="fx-o' + cl + '" data-k="' + k + '">' + 'ABCDEFGHI'[k] + '.  ' + esc(o) + '</button>';
      }).join('') + '</div>';
      else if (!s.done) h += '<div style="display:flex;gap:10px;margin-top:28px"><input class="fx-in" placeholder="Your answer" autocomplete="off" style="height:44px;font-size:16px;text-align:center"><button class="fx-btn fx-go">Check</button></div><div class="fx-e fx-err" style="font-size:13px;min-height:20px;margin-top:6px"></div>';
      else h += '<div style="margin-top:28px;font-size:18px;color:var(--text-' + (s.ok ? 'success,#1b5e20' : 'danger,#b71c1c') + ')">' + esc(s.val) + '</div>' + (s.ok ? '' : '<div style="font-size:18px">' + esc([].concat(c.answer)[0]) + '</div>');
    }
    A.innerHTML = h; tex(A); tex(Z);
    q('.fx-bar>i').style.width = (i + 1) / C.length * 100 + '%';
    q('.fx-n').textContent = (i + 1) + ' / ' + C.length;
    var inp = q('.fx-in');
    if (inp) inp.oninput = function () { q('.fx-e').textContent = ''; };
    try { (inp || card).focus({ preventScroll: true }); } catch (e) {}
  }

  function flip() { if (ty() === 'f') { S[i].open = !S[i].open; card.classList.toggle('on', S[i].open); } }
  function go(n) { var j = Math.max(0, Math.min(C.length - 1, i + n)); if (j !== i) { i = j; render(); } }
  function pick(k) { if (S[i].pick == null && k < C[i].options.length) { S[i].pick = k; render(); } }
  function submit() {
    var v = q('.fx-in').value;
    if (!v.trim()) { q('.fx-e').textContent = 'Enter an answer first'; return; }
    S[i] = { done: 1, val: v, ok: [].concat(C[i].answer).some(function (a) { return norm(a) === norm(v); }) };
    render();
  }
  function answered() { var s = S[i], t = ty(); return t === 'f' ? s.open : t === 'c' ? s.pick != null : t === 'b' ? s.done : true; }

  card.onclick = function (e) {
    var o = e.target.closest('.fx-o'); if (o) return pick(+o.getAttribute('data-k'));
    if (e.target.closest('.fx-go')) return submit();
    if (e.target.tagName !== 'INPUT') flip();
  };
  q('.fx-l').onclick = function () { go(-1); };
  q('.fx-r').onclick = function () { go(1); };
  document.addEventListener('keydown', function (e) {
    var k = e.key, t = ty();
    if (e.target.tagName === 'INPUT') { if (k === 'Enter') submit(); return; }
    if (k === ' ' || k === 'Enter') { e.preventDefault(); if (k === 'Enter' && answered()) go(1); else flip(); }
    else if (k === 'ArrowRight') go(1);
    else if (k === 'ArrowLeft') go(-1);
    else if (t === 'c' && /^[1-9]$/.test(k)) pick(k - 1);
  });

  render();

  // Load KaTeX, then render math on the current card
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = KX + 'katex.min.css'; document.head.appendChild(l);
  function load(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; document.head.appendChild(s); }
  load(KX + 'katex.min.js', function () { load(KX + 'contrib/auto-render.min.js', function () { tex(A); tex(Z); }); });
})();
