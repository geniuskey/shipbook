# ShipBook 챕터 작성 가이드

## 기여물의 라이선스

기여하는 코드는 MIT, 교재 콘텐츠는 CC BY 4.0으로 제공하는 데 동의해야 합니다. HTML 안에 코드와 콘텐츠가 함께 있어도 각 부분에 해당하는 라이선스를 적용합니다. 적용 범위는 [라이선스 안내](LICENSE.md)를 참고하세요. 제3자 자료를 추가할 때는 재사용·배포가 허용되는지 확인하고 출처와 해당 라이선스를 명시하세요.

빌드 과정 없는 정적 사이트다. `index.html` + `chapters/<slug>.html` + 공통 `css/style.css`, `js/common.js`.
로컬 실행: `python -m http.server 8000` → http://localhost:8000 (file://로 열어도 동작하게 classic script만 사용한다. ES module 금지.)

## 원칙
- **한국어**, 대상은 배와 바다에 관심 있는 일반 독자부터 조선해양공학과 학부생까지. 고등학교 물리 수준에서 출발해 학부 수준까지 올라간다. 영어 원어는 `<span class="en">(Metacentric Height)</span>`처럼 병기.
- 문체는 평서형 "~다". 개념 → 직관 그림(SVG) → 수식(KaTeX) → 시뮬레이터 → 실제 수치 예 → 요약/퀴즈 순서.
- **만져서 이해하게 한다.** 기구(메커니즘)는 정지 그림으로 끝내지 말고, 슬라이더로 한 단계씩 움직여 보거나 캔버스 위에서 직접 끌어 볼 수 있게 한다. 설명 문단 바로 아래에 그 문단이 말한 것을 보여 주는 인터랙션을 둔다.
- 수치는 실제 선박에서 합리적인 범위를 쓴다(예: 14,000 TEU 컨테이너선 Lpp 350 m·B 51 m·T 15 m·Cb 0.65·22 kn, VLCC Lpp 320 m·B 60 m·T 21 m·Cb 0.82·15 kn, 해수 밀도 1.025 t/m³, GM 0.5~3 m). 특정 선박의 제원을 단정적으로 인용하지 말고 "대표적인 값"으로 쓴다. 단위는 SI와 함께 해운 관용 단위(노트, 해리, 톤)를 병기한다.
- 외부 라이브러리는 아래 head 템플릿에 있는 것만(KaTeX, three.js r147). 이미지 파일 대신 인라인 SVG/canvas로 그린다.
- 색은 하드코딩하지 말고 CSS 변수(`var(--accent)` 등)나 `SB.palette()`를 쓴다. 라이트/다크 둘 다 읽혀야 한다. 단, 물리적 색(선체 방오도료 빨강, 항해등 빨강/초록, 불꽃, 고전압 주황 등)은 고정색 가능. 물은 `var(--water)`, `var(--water-soft)`를 쓴다.
- 모바일(폭 360px)에서 가로 스크롤이 생기면 안 된다. SVG는 `viewBox`만 주고 width/height 속성 생략.
- 다른 장은 `<a href="stability.html">3장</a>`처럼 상대 링크로 참조한다.

## head 템플릿
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<title>복원성 · ShipBook</title>
<meta name="description" content="한 문장 설명">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<link rel="stylesheet" href="../css/style.css">
<script src="../js/common.js"></script>
<!-- 3D가 필요한 페이지만 -->
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body data-chapter="stability">
<main class="chapter">
  <header class="chapter-hero">
    <div class="eyebrow">Chapter 03</div>
    <h1>복원성</h1>
    <p class="lead">...</p>
    <ul class="objectives"><li>...</li></ul>
  </header>

  <section id="intro"><h2>제목</h2> ... </section>   <!-- h2 번호와 우측 목차는 자동 생성 -->
  ...
  <section class="keypoints" id="summary"><h2>핵심 정리</h2><ol><li>...</li></ol></section>
  <section class="quiz-sec" id="quiz"><h2>확인 퀴즈</h2><div class="quiz"> ... </div></section>
</main>
<script> /* 페이지 스크립트: 여기서 SB 사용. 전역 오염을 막기 위해 IIFE로 감싼다. */ </script>
</body>
</html>
```
상단바, 챕터 서랍, 목차, 이전/다음, 푸터, 테마 토글, 퀴즈 동작, KaTeX 렌더는 `common.js`가 자동 처리한다.
`<meta name="description">`는 반드시 한 줄로 쓰고 바로 다음 줄에서 끝나야 한다(`tools/seo.py`가 그 아래에 태그를 삽입한다).
새 챕터는 `common.js`의 `CHAPTERS`에 등록한 뒤 `python tools/seo.py`를 실행한다. canonical·Open Graph·JSON-LD 태그와 `sitemap.xml`이 갱신된다(직접 쓰지 않는다).

## 컴포넌트
```html
<figure class="diagram"><svg viewBox="0 0 800 300">...</svg><figcaption><b>그림 3-1.</b> 설명</figcaption></figure>
```
SVG 안 유틸 클래스: `.t .t-dim .t-mono .t-acc`(텍스트), `.s-line .s-axis .s-acc .s-water`(선), `.f-surface .f-elev .f-acc .f-acc-soft .f-acc2-soft .f-water .f-hull .f-dim-soft`(면).
SVG 글자가 모바일에서 너무 작아지지 않게 viewBox 폭은 680~800 정도로 잡는다.

```html
<div class="sim" id="sim-gz">
  <div class="sim-head"><span class="sim-tag">SIMULATOR</span><h3>제목</h3></div>   <!-- 3D는 <span class="sim-tag three">3D</span> -->
  <div class="sim-body side">                                    <!-- side: 넓은 화면에서 컨트롤을 오른쪽에 -->
    <div class="sim-view"><canvas id="cv-gz"></canvas></div>     <!-- 3D는 <div class="sim-view three" id="v3d"></div> -->
    <div class="sim-controls">
      <label class="ctrl"><span>횡경사각 <output id="heel-out"></output></span><input type="range" id="heel" min="0" max="80" value="10"></label>
      <div class="ctrl"><span>모드</span><div class="seg" id="mode"><button data-value="box" class="on">상자형</button><button data-value="ship">선형</button></div></div>
      <label class="check"><input type="checkbox" id="showx"> 옵션</label>
      <button class="btn primary" id="run">실행</button>
    </div>
  </div>
  <div class="sim-readout">
    <div class="stat"><span class="k">GZ</span><span class="v" id="o-tq">—</span></div>
  </div>
  <div class="sim-note">해볼 것: ...</div>
</div>
```
콜아웃: `<div class="callout">`, `.tip`, `.warn`, `.deep`(심화). 수식: `<div class="formula">$$...$$<div class="where">여기서 ...</div></div>`, 인라인 `\( ... \)`.
수식 안에는 한글을 쓰지 않는다(영문 첨자 사용, 설명은 `.where`에).
표: `<div class="table-wrap"><table>...</table></div>`. 퀴즈:
```html
<div class="quiz-q"><p>질문?</p><div class="opts">
  <button class="opt">보기</button><button class="opt" data-correct>정답</button>
</div><div class="quiz-exp">해설</div></div>
```

## JS 헬퍼 (`js/common.js`)
- `SB.canvas(el, (ctx,w,h)=>{}, {aspect:0.5, height, minHeight, maxHeight})` → `{ctx,w,h,redraw()}` HiDPI, 리사이즈/테마 시 자동 redraw(배경 `--canvas-bg`로 칠해 줌). 좌표는 CSS px.
- `SB.chart(ctx, box|null, {x:[a,b], y:[a,b], logX, logY, xLabel, yLabel, series:[{data:[[x,y]],color,width,dash,fill}], vlines, hlines, points, bands, xFmt, yFmt})` → `{X,Y,box}`. box = `{x,y,w,h}`.
- `SB.loop(el, (dt,t)=>{})` 화면에 보일 때만 도는 rAF 루프 `{start,stop,toggle,running}`.
- `SB.range(id, fmt, onInput)` → getter `get()`, `get.set(v)`. `SB.seg(id, onChange)` → getter, `get.set(v)`. `SB.stat(id, html)`.
- `SB.drag(el, {down(p,e), move(p,e), up(p,e)})` 포인터 드래그, `p={x,y}` 요소 기준 CSS px. 끌 수 있는 캔버스에는 `style="touch-action:none"`.
- `SB.palette()` 테마 색 `{bg,text,dim,faint,grid,axis,border,surface,accent,accent2,ok,warn,bad,red,green,blue,series[]}`, `SB.color('accent')`, `SB.onTheme(cb)`, `SB.isDark()`.
- `SB.randn()`, `SB.poisson(λ)`, `SB.fmt(x, digits)`, `SB.si(x,'W')`, `SB.clamp/lerp/map`, `SB.deg(rad)`, `SB.rad(deg)`.
- 상수: `SB.G`(9.81), `SB.RHO`(해수 1025 kg/m³), `SB.RHO_FW`(1000), `SB.RHO_AIR`(1.225), `SB.NU`(해수 동점성 1.188e-6 m²/s), `SB.KN`(0.5144 m/s), `SB.NM`(1852 m), `SB.kn(ms)`→노트, `SB.ms(kn)`→m/s.
- `SB.waveK(ω, depth?)` 분산 관계 ω² = gk·tanh(kh)를 풀어 파수 k 반환(depth 생략 시 심해).
- `SB.arrow(ctx, x1,y1, x2,y2, color, width)` 화살표(힘 벡터 등).
- `SB.SHIP = {L:200, LOA:210, B:32, D:18, T:11, Cb:0.7}` 공용 대표 선박 치수(m).
- `SB.hullHalf(xi, zeta, {full})` 공용 선형의 반폭 비율(0~1). xi −1(선미)~+1(선수), zeta 0(용골)~1(갑판). full은 비대도(0.5 날씬~0.85 비대).
- `SB.shipSide(ctx, x, y, s, {L, D, T, color, bottom, flip, pitch, heave, alpha, ghost, house, cargo:'container'|'tanker'|'bulk', bulb, prop})` 옆에서 본 배. (x,y)=선체 중앙의 흘수선 위치 px, s=px/m, 선수는 오른쪽. pitch +면 선수가 숙여짐.
- `SB.shipTop(ctx, x, y, heading, {len, wid, color, alpha, rudder, full, house, outline})` 위에서 본 배. heading은 캔버스 각도(0=오른쪽, +는 시계 방향). 레이더·항해·조종 시뮬레이터용.
- `SB.section(ctx, cx, wy, s, {B, D, T, heel, bilge, color, stroke, fill})` 중앙 횡단면(선미에서 본 모습). (cx,wy)=중심선과 흘수선이 만나는 점. heel +면 오른쪽(우현)이 내려감. 반환값은 선체 좌표(m, 원점=용골 중심, y 위+) 꼭짓점 배열.
- `SB.polyArea(pts)` → `[면적, cx, cy]`, `SB.clipPoly(pts, a, b, c)` → a·x+b·y ≤ c 쪽 부분 다각형. 경사 시 잠긴 단면과 부심을 계산할 때 쓴다.
- `SB.water(ctx, w, h, y0, {wave:(x)=>dy, color, line})` 수면 y0 아래를 물로 칠한다. 배를 물속에 잠긴 것처럼 보이게 하려면 배를 먼저 그리고 물을 나중에 그린다(반투명).
- `SB.three(el, {camera:[x,y,z], target:[x,y,z], fov, autoRotate, minDistance, maxDistance, pan})` → `T = {THREE, scene, camera, renderer, controls, onFrame(cb), label(html, Vector3|[x,y,z]), material(color, opts)}`. 조명/리사이즈/화면밖 정지 포함. 라벨의 `L.obj = mesh`로 두면 로컬 좌표를 따라감. `L.setVisible(bool)`.
- `SB.ship3d(T, {L:10, B, D, T, full, color, bottom, deckColor, opacity, deck, house, cargo:'container'})` → `{group, hull, deck, house, dims}` 공용 3D 선체(+x 선수, +y 위, +z 우현, 흘수선 y=0, 용골 y=−T, 기본 길이 10 단위). `group.rotation.x`=횡경사, `rotation.z`=종경사. 반투명(`opacity:0.3`)으로 두고 안에 탱크·기관을 그리면 투시도가 된다.
- `SB.sea3d(T, {size, sizeX, sizeZ, seg, color, opacity})` → `{mesh, update(t, (x,z,t)=>높이)}` 출렁이는 바다 면. `SB.ground3d(T, size, div)` 격자.

three.js는 r147 전역 빌드(`THREE.BoxGeometry`, `CylinderGeometry`, `ExtrudeGeometry`, `LatheGeometry`, `TubeGeometry` 등)만 쓴다. addon 로더·후처리는 쓰지 않는다.
