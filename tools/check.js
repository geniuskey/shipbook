// 챕터 정적 점검: 인라인 스크립트 문법, getElementById/CB.range/CB.seg/CB.stat id 존재 여부, 구성 요소 수
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..", "chapters");
let bad = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".html")).sort()) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  const scripts = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const errs = [];
  scripts.forEach((code, i) => { try { new vm.Script(code); } catch (e) { errs.push(`script#${i}: ${e.message}`); } });
  const ids = new Set([...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const js = scripts.join("\n");
  const refs = new Set([...js.matchAll(/(?:getElementById|CB\.range|CB\.seg|CB\.stat)\(\s*["']([\w-]+)["']\s*[,)]/g)].map((m) => m[1]));
  const dynamic = new Set([...js.matchAll(/id=\\?["']([\w-]+)/g)].map((m) => m[1]));
  const missing = [...refs].filter((id) => !ids.has(id) && !dynamic.has(id));
  if (missing.length) errs.push("missing ids: " + missing.join(", "));
  const n = (re) => (s.match(re) || []).length;
  const info = `${String(s.split("\n").length).padStart(5)} lines  sim ${n(/class="sim"/g)}  fig ${n(/<figure/g)}  quiz ${n(/class="quiz-q"/g)}  h2 ${n(/<h2/g)}`;
  console.log(`${f.padEnd(20)} ${info}${errs.length ? "  !! " + errs.join(" | ") : ""}`);
  bad += errs.length;
}
process.exit(bad ? 1 : 0);
