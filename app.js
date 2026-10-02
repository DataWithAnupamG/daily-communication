const DATA_URL = "./data/articles.json";
const STEPS = ["Read", "Speak", "Words", "Quiz", "Reflect"];
const STARTERS = ["In my opinion,", "The main point is that", "On the one hand... on the other hand...", "What surprised me was", "This matters because", "For example,", "I would argue that", "One possible outcome is", "To sum up,"];
const TOTAL = 120;
const $ = (id) => document.getElementById(id);
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const swap = (fn) => (document.startViewTransition ? document.startViewTransition(fn) : fn());
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");
const fmt = (s) => new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

let articles = [], cur = null, step = 0, timerId = null, left = TOTAL, qz = null, rating = 0, vocab = [];

/* ---------- progress log: { "2026-10-02": { steps:[0,1], quiz:80, rating:4, done:true } } ---------- */
const getLog = () => store.get("log", {});
function patchLog(key, patch) { const l = getLog(); l[key] = { steps: [], ...l[key], ...patch }; store.set("log", l); }
function streaks() {
  const l = getLog(), days = Object.keys(l).filter((k) => l[k].done).sort();
  let best = 0, run = 0, prev = null;
  for (const k of days) { run = prev && (new Date(k) - new Date(prev)) === 864e5 ? run + 1 : 1; best = Math.max(best, run); prev = k; }
  const d = new Date(); if (!l[dayKey(d)]?.done) d.setDate(d.getDate() - 1);
  let now = 0; while (l[dayKey(d)]?.done) { now++; d.setDate(d.getDate() - 1); }
  return { now, best, sessions: days.length };
}

/* ---------- loading & routing ---------- */
async function load() {
  try {
    const r = await fetch(`${DATA_URL}?v=${Date.now()}`);
    if (!r.ok) throw new Error("fetch failed");
    articles = (await r.json()).sort((a, b) => b.date.localeCompare(a.date));
    if (!articles.length) { $("loading").innerText = "No articles yet. Run the GitHub Action to create the first one."; return; }
    buildArchive(); route();
  } catch (e) { console.error(e); $("loading").innerText = "Could not load articles. Serve the site over http, not file://."; }
}
function route() { show(articles.find((a) => a.date === location.hash.slice(1)) || articles[0]); }
addEventListener("hashchange", route);

function show(a) {
  cur = a; vocab = (a.vocabulary || []).map((w) => (typeof w === "string" ? { word: w, pos: "", meaning: "", example: "" } : w));
  resetTimer(); qz = null; rating = 0;
  $("loading").classList.add("hidden"); $("article").classList.remove("hidden");
  $("category").innerText = a.category; $("level").innerText = a.level || "Medium";
  $("date").innerText = fmt(a.date); $("title").innerText = a.title; $("summary").innerText = a.summary;
  $("source").innerText = a.source; $("readArticle").href = a.url; $("angle").innerText = a.angle || "";
  $("opinionPrompt").innerText = a.opinionPrompt;
  $("keywords").innerHTML = (a.keywords || []).map((k) => `<span>${esc(k)}</span>`).join("");
  $("questions").innerHTML = a.questions.map((q) => `<li>${esc(q)}</li>`).join("");
  $("starters").innerHTML = STARTERS.map((s) => `<button type="button">${esc(s)}</button>`).join("");
  $("starters").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => copy(b)));
  renderVocab(); renderQuiz(); renderReflect();
  const saved = getLog()[a.date]; step = 0; go(0, true);
  document.querySelectorAll(".hi").forEach((h) => h.classList.toggle("on", h.dataset.date === a.date));
  if (saved?.done) toast("You already finished this session. Practise again anytime.");
}

/* ---------- stepper ---------- */
function go(i, instant) {
  step = Math.max(0, Math.min(STEPS.length - 1, i));
  const apply = () => {
    document.querySelectorAll(".panel").forEach((p) => { p.hidden = Number(p.dataset.step) !== step; });
    const seen = getLog()[cur.date]?.steps || [];
    if (!seen.includes(step)) patchLog(cur.date, { steps: [...seen, step] });
    renderSteps();
    $("back").disabled = step === 0; $("next").hidden = step === STEPS.length - 1;
  };
  instant ? apply() : swap(apply);
}
function renderSteps() {
  const seen = getLog()[cur.date]?.steps || [];
  $("steps").innerHTML = STEPS.map((s, i) => `<button class="step ${i === step ? "on" : ""} ${seen.includes(i) ? "seen" : ""}" data-i="${i}" type="button">${i + 1}. ${s}</button>`).join("");
  $("steps").querySelectorAll(".step").forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.i))));
}
$("next").addEventListener("click", () => go(step + 1));
$("back").addEventListener("click", () => go(step - 1));
addEventListener("keydown", (e) => {
  if (!cur || /INPUT|TEXTAREA/.test(e.target.tagName) || document.querySelector("dialog[open]")) return;
  if (e.key === "ArrowRight") go(step + 1); if (e.key === "ArrowLeft") go(step - 1);
});

/* ---------- vocabulary ---------- */
function renderVocab() {
  const learned = store.get("learned", []);
  $("vocabulary").innerHTML = vocab.map((w, n) => `
    <button type="button" class="flip ${learned.includes(w.word) ? "learned" : ""}" data-n="${n}" aria-label="${esc(w.word)}"><div class="flip-inner">
      <div class="face front"><span class="w">${esc(w.word)}</span><span class="pos">${esc(w.pos)}</span></div>
      <div class="face back"><span>${esc(w.meaning)}</span><em>${esc(w.example)}</em><div class="tools"><span data-say>Hear it</span><span data-know>I know it</span></div></div>
    </div></button>`).join("");
  $("vocabulary").querySelectorAll(".flip").forEach((c) => c.addEventListener("click", (e) => {
    const w = vocab[c.dataset.n];
    if (e.target.dataset.say !== undefined) return speak(w.word);
    if (e.target.dataset.know !== undefined) {
      const l = store.get("learned", []), has = l.includes(w.word);
      store.set("learned", has ? l.filter((x) => x !== w.word) : [...l, w.word]); return c.classList.toggle("learned", !has);
    }
    c.classList.toggle("open");
  }));
  const i = cur.idiom;
  $("idiom").hidden = !i; $("idiom").innerHTML = i ? `<b>${esc(i.phrase)}</b><p>${esc(i.meaning)}.</p><p><em>${esc(i.example)}</em></p>` : "";
}
function speak(t) { if (!("speechSynthesis" in window)) return; const u = new SpeechSynthesisUtterance(t); u.lang = "en-GB"; speechSynthesis.cancel(); speechSynthesis.speak(u); }
async function copy(b) { try { await navigator.clipboard.writeText(b.innerText); } catch { /* blocked */ } b.classList.add("on"); setTimeout(() => b.classList.remove("on"), 900); }

/* ---------- quiz: weak words first, meaning and fill-in-the-blank questions ---------- */
function renderQuiz() {
  const box = $("quiz");
  const pool = vocab.filter((w) => w.meaning);
  if (pool.length < 4) { box.innerHTML = `<p class="muted">Quiz unlocks once this article has full word data.</p>`; return; }
  if (!qz) {
    const weak = store.get("weak", []);
    const list = [...pool].sort((a, b) => weak.includes(b.word) - weak.includes(a.word) || Math.random() - .5).slice(0, 5);
    qz = { list, i: 0, score: 0, done: false, picked: null };
  }
  if (qz.i >= qz.list.length) {
    const pct = Math.round((qz.score / qz.list.length) * 100);
    if (!qz.done) { qz.done = true; patchLog(cur.date, { quiz: pct }); }
    box.innerHTML = `<div class="score">${pct}%</div><p>${qz.score} of ${qz.list.length} correct. Words you missed will come back first next time.</p><button class="btn" id="again" type="button">Try again</button>`;
    $("again").addEventListener("click", () => { qz = null; renderQuiz(); }); return;
  }
  const w = qz.list[qz.i], cloze = qz.i % 2 === 1;
  const text = cloze ? w.example.replace(new RegExp(w.word, "i"), "_____") : `Which word means: "${w.meaning}"?`;
  const opts = [w, ...pool.filter((x) => x !== w).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
  box.innerHTML = `<div class="q-meta"><span>Question ${qz.i + 1} of ${qz.list.length}</span><span>${qz.score} correct</span></div>
    <p class="q-text">${esc(text)}</p><div class="opts">${opts.map((o) => `<button class="opt" type="button" data-w="${esc(o.word)}">${esc(o.word)}</button>`).join("")}</div>`;
  box.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
    const ok = b.dataset.w === w.word, weak = store.get("weak", []);
    box.querySelectorAll(".opt").forEach((o) => { o.disabled = true; if (o.dataset.w === w.word) o.classList.add("good"); });
    if (!ok) b.classList.add("bad");
    qz.score += ok; store.set("weak", ok ? weak.filter((x) => x !== w.word) : [...new Set([...weak, w.word])]);
    setTimeout(() => { qz.i++; renderQuiz(); }, 900);
  }));
}

/* ---------- reflect: live writing check + self rating ---------- */
function renderReflect() {
  $("notes").value = store.get(`draft:${cur.date}`, "");
  $("rating").innerHTML = [1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" data-n="${n}">${n}</button>`).join("");
  $("rating").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
    rating = Number(b.dataset.n); $("rating").querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", x === b)); check();
  }));
  check();
}
function check() {
  const t = $("notes").value, words = t.trim() ? t.trim().split(/\s+/).length : 0;
  const sentences = (t.match(/[^.!?]+[.!?]+/g) || []).length;
  const used = vocab.filter((w) => new RegExp(`\\b${w.word}`, "i").test(t));
  $("wc").innerText = `${words} words`; $("sc").innerText = `${sentences} sentences`; $("uc").innerText = `${used.length} of ${vocab.length} words used`;
  $("used").innerHTML = vocab.map((w) => `<span class="${used.includes(w) ? "on" : ""}">${esc(w.word)}</span>`).join("");
  const need = [words < 30 && `${30 - words} more words`, used.length < 3 && `${3 - used.length} more of today's words`, !rating && "a self rating"].filter(Boolean);
  $("finish").disabled = need.length > 0; $("hint").innerText = need.length ? `To finish, add: ${need.join(", ")}.` : "Ready to save this session.";
  store.set(`draft:${cur.date}`, t);
  return { words, used: used.length };
}
$("notes").addEventListener("input", check);
$("finish").addEventListener("click", () => {
  const { words, used } = check();
  patchLog(cur.date, { done: true, rating, words, used, spoke: left < TOTAL || getLog()[cur.date]?.spoke });
  $("streak").innerText = streaks().now; toast(`Session saved. ${streaks().now}-day streak!`); openStats();
});

/* ---------- speaking timer ---------- */
function draw() { $("time").innerText = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; $("timer").style.setProperty("--p", `${((TOTAL - left) / TOTAL) * 360}deg`); }
function resetTimer() { clearInterval(timerId); timerId = null; left = TOTAL; $("timer").classList.remove("live"); $("start").innerText = "Start"; draw(); }
$("reset").addEventListener("click", resetTimer);
$("start").addEventListener("click", () => {
  if (timerId) { clearInterval(timerId); timerId = null; $("timer").classList.remove("live"); $("start").innerText = "Resume"; return; }
  $("timer").classList.add("live"); $("start").innerText = "Pause";
  timerId = setInterval(() => { left--; draw(); if (left <= 0) { patchLog(cur.date, { spoke: true }); resetTimer(); $("time").innerText = "Done!"; toast("Two minutes complete. Nice work."); } }, 1000);
});

/* ---------- archive, stats, theme ---------- */
function buildArchive() {
  $("history").innerHTML = articles.map((a) => `<button class="hi" type="button" data-date="${a.date}" data-text="${esc((a.title + " " + a.category).toLowerCase())}"><small>${fmt(a.date)} - ${esc(a.category)}</small><b>${esc(a.title)}</b></button>`).join("");
  $("history").querySelectorAll(".hi").forEach((b) => b.addEventListener("click", () => { location.hash = b.dataset.date; $("archive").close(); }));
}
$("search").addEventListener("input", (e) => { const q = e.target.value.toLowerCase().trim(); document.querySelectorAll(".hi").forEach((h) => { h.hidden = q && !h.dataset.text.includes(q); }); });
function openStats() {
  const l = getLog(), s = streaks(), quizzes = Object.values(l).map((x) => x.quiz).filter((x) => x != null);
  const avg = quizzes.length ? Math.round(quizzes.reduce((a, b) => a + b, 0) / quizzes.length) : 0;
  const cells = [[s.now, "current streak"], [s.best, "best streak"], [s.sessions, "sessions"], [store.get("learned", []).length, "words known"], [quizzes.length ? `${avg}%` : "-", "avg quiz score"], [store.get("weak", []).length, "words to review"]];
  $("statGrid").innerHTML = cells.map(([v, t]) => `<div class="stat"><b>${v}</b><span>${t}</span></div>`).join("");
  const d = new Date(); d.setDate(d.getDate() - 34); let h = "";
  for (let i = 0; i < 35; i++) { const e = l[dayKey(d)]; h += `<i class="${e?.done ? "h2" : e?.steps?.length ? "h1" : ""}" title="${dayKey(d)}"></i>`; d.setDate(d.getDate() + 1); }
  $("heat").innerHTML = h; $("stats").showModal();
}
$("openStats").addEventListener("click", openStats);
$("openArchive").addEventListener("click", () => $("archive").showModal());
$("export").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ log: getLog(), learned: store.get("learned", []), weak: store.get("weak", []) }, null, 2)], { type: "application/json" }));
  a.download = "daily-practice-progress.json"; a.click(); URL.revokeObjectURL(a.href);
});
$("reset-all").addEventListener("click", () => { if (confirm("Delete all saved progress on this device?")) { ["log", "learned", "weak"].forEach((k) => localStorage.removeItem(k)); $("stats").close(); $("streak").innerText = 0; if (cur) show(cur); } });
document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
let toastTimer; function toast(m) { $("toast").innerText = m; $("toast").classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2800); }

const setTheme = (t) => { document.documentElement.dataset.theme = t; store.set("theme", t); };
setTheme(store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("theme").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
$("streak").innerText = streaks().now;
load();
