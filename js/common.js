/* ==========================================================================
   ShipBook 공통 스크립트 — 전역 객체 SB
   - 레이아웃(상단바, 목차, 이전/다음, 테마) 자동 생성
   - 시뮬레이터 헬퍼: canvas, chart, range, seg, 색/난수/포맷, 선박·바다 그리기(2D·3D), three.js 씬
   이 파일은 <head>에서 defer 없이 로드된다. 페이지 스크립트는 </body> 직전에 둔다.
   ========================================================================== */
(function () {
  "use strict";

  const CHAPTERS = [
    { slug: "overview",    num: "01", title: "배의 전체 그림",            desc: "선박의 종류와 주요 치수, 선체 각부의 이름. 바다 위의 거대한 구조물을 3D로 훑는다.", tags: ["기초", "3d", "sim"] },
    { slug: "buoyancy",    num: "02", title: "부력과 배수량",             desc: "아르키메데스의 원리, 배수량과 재화중량, 형상 계수, TPC와 만재 흘수선.", tags: ["정역학", "sim"] },
    { slug: "stability",   num: "03", title: "복원성",                   desc: "무게중심·부심·메타센터, GM과 GZ 곡선, 경사 시험. 배는 왜 다시 일어서는가.", tags: ["정역학", "3d", "sim"] },
    { slug: "trim",        num: "04", title: "무게 이동과 트림",          desc: "화물 이동과 트림, MCT, 밸러스트, 자유수면 효과, 적재 계획.", tags: ["정역학", "sim"] },
    { slug: "damage",      num: "05", title: "손상 복원성과 구획",        desc: "침수 계산, 수밀 격벽, 가항 길이, 확률론적 손상 복원성. 배가 가라앉지 않게 하는 법.", tags: ["정역학", "sim"] },
    { slug: "resistance",  num: "06", title: "선체 저항",                desc: "레이놀즈·프루드 상사, 마찰 저항, 조파 저항과 켈빈 파형, 선수 벌브, 모형 시험.", tags: ["저항·추진", "sim"] },
    { slug: "propeller",   num: "07", title: "프로펠러",                 desc: "운동량 이론, 날개 요소, 추력·토크 계수, 단독 효율, 캐비테이션.", tags: ["저항·추진", "3d", "sim"] },
    { slug: "propulsion",  num: "08", title: "추진 효율과 동력",          desc: "반류와 추력 감소, 추진 효율의 분해, 엔진–프로펠러 매칭, 시운전과 해상 여유.", tags: ["저항·추진", "sim"] },
    { slug: "engine",      num: "09", title: "선박 주기관",              desc: "저속 2행정 디젤, 크로스헤드와 소기, 과급, 연료유와 이중 연료 엔진.", tags: ["기관", "3d", "sim"] },
    { slug: "waves",       num: "10", title: "바다의 파도",              desc: "선형 파 이론, 분산 관계와 군속도, 파 스펙트럼, 유의파고, 천수 변형.", tags: ["파도·운동", "sim"] },
    { slug: "seakeeping",  num: "11", title: "내항성: 파도 속의 배",      desc: "6자유도 운동, 고유 주기와 RAO, 조우 주파수, 슬래밍, 횡동요 감쇠 장치.", tags: ["파도·운동", "3d", "sim"] },
    { slug: "maneuvering", num: "12", title: "조종성과 계류",            desc: "타와 선회, 노모토 모델, 지그재그 시험, 정지 거리, 스쿼트, 스러스터, 앵커와 계류.", tags: ["파도·운동", "sim"] },
    { slug: "structure",   num: "13", title: "선체 구조와 강도",          desc: "종강도와 횡강도, 전단력·굽힘 모멘트 선도, 호깅·새깅, 단면 계수, 좌굴과 피로.", tags: ["구조·설계", "3d", "sim"] },
    { slug: "design",      num: "14", title: "선박 설계",                desc: "설계 나선, 주요 치수 결정, 선도(lines plan), 일반 배치, 중량 추정과 선급 규칙.", tags: ["구조·설계", "sim"] },
    { slug: "building",    num: "15", title: "조선소와 건조",            desc: "블록 공법, 절단과 용접, 탑재와 진수, 의장과 도장, 시운전.", tags: ["구조·설계", "3d", "sim"] },
    { slug: "cargo",       num: "16", title: "상선과 화물",              desc: "컨테이너선, 벌크선, 탱커, LNG 운반선, 자동차 운반선. 화물이 배를 만든다.", tags: ["선종", "3d", "sim"] },
    { slug: "special",     num: "17", title: "특수선과 고속선",          desc: "활주선, 수중익선, 쌍동선, 쇄빙선, 잠수함, 해양 플랜트.", tags: ["선종", "sim"] },
    { slug: "electric",    num: "18", title: "선박 전력과 전기 추진",     desc: "발전기 병렬 운전, 배전, 디젤-전기 추진, 포드 추진, 배터리 하이브리드.", tags: ["기관·친환경", "sim"] },
    { slug: "green",       num: "19", title: "친환경 선박",              desc: "IMO 탄소 규제, 감속 운항, LNG·메탄올·암모니아·수소 연료, 풍력 보조, 공기 윤활.", tags: ["기관·친환경", "sim"] },
    { slug: "navigation",  num: "20", title: "항해술",                   desc: "위도와 경도, 메르카토르 해도, 항정선과 대권, 추측 항법, 조류 보정, 조석, GNSS.", tags: ["항해·자율", "3d", "sim"] },
    { slug: "bridge",      num: "21", title: "선교 장비와 충돌 회피",     desc: "레이더와 ARPA, AIS, ECDIS, CPA·TCPA, 국제 해상 충돌 예방 규칙(COLREG).", tags: ["항해·자율", "sim"] },
    { slug: "autonomous",  num: "22", title: "자율운항선박과 DP",         desc: "MASS 자율 등급, 센서 융합, 경로 계획, 충돌 회피 알고리즘, 동적 위치 유지.", tags: ["항해·자율", "sim"] },
    { slug: "glossary",    num: "23", title: "용어집 & 종합 퀴즈",        desc: "핵심 용어를 검색하고, 전체 내용을 퀴즈로 점검한다.", tags: ["정리"] },
  ];

  const SB = (window.SB = {});
  SB.CHAPTERS = CHAPTERS;

  /* ------------------------------------------------------------ math utils */
  SB.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  SB.lerp = (a, b, t) => a + (b - a) * t;
  SB.map = (x, a, b, c, d) => c + ((x - a) * (d - c)) / (b - a);
  SB.randn = function () {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  SB.poisson = function (lambda) {
    if (lambda <= 0) return 0;
    if (lambda > 40) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * SB.randn()));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  /** 숫자 포맷: 유효 자리 */
  SB.fmt = function (x, digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) return x.toExponential(digits - 1).replace("e+", "e");
    return Number(x.toPrecision(digits)).toLocaleString("en-US", { maximumFractionDigits: 6 });
  };
  /** SI 접두사 포맷: SB.si(2.3e-9,'m') → "2.3 nm" */
  SB.si = function (x, unit = "", digits = 3) {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0 " + unit;
    const pre = [[1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"], [1e-15, "f"]];
    const a = Math.abs(x);
    for (const [v, p] of pre) if (a >= v * 0.9995) return Number((x / v).toPrecision(digits)) + " " + p + unit;
    return x.toExponential(digits - 1) + " " + unit;
  };

  /* ------------------------------------------------------------ physics consts */
  SB.G = 9.81;          // 중력 가속도 m/s²
  SB.RHO = 1025;        // 해수 밀도 kg/m³ (= t/m³ × 1000)
  SB.RHO_FW = 1000;     // 담수 밀도 kg/m³
  SB.RHO_AIR = 1.225;   // 공기 밀도 kg/m³
  SB.NU = 1.188e-6;     // 해수 동점성 계수 m²/s (15 °C)
  SB.KN = 0.5144;       // 1 knot = 0.5144 m/s
  SB.NM = 1852;         // 1 해리 = 1852 m
  SB.kn = (ms) => ms / SB.KN;   // m/s → knot
  SB.ms = (kn) => kn * SB.KN;   // knot → m/s
  SB.deg = (rad) => (rad * 180) / Math.PI;
  SB.rad = (deg) => (deg * Math.PI) / 180;
  /** 심해 분산 관계: 파수 k = ω²/g, 파장 λ = gT²/2π, 위상 속도 c = gT/2π */
  SB.waveK = (omega, depth) => {
    const k0 = (omega * omega) / SB.G;
    if (!depth || !isFinite(depth)) return k0;
    let k = k0 / Math.sqrt(Math.tanh(k0 * depth));   // 초기 근사 후 뉴턴 반복: ω² = g k tanh(kh)
    for (let i = 0; i < 30; i++) {
      const th = Math.tanh(k * depth), f = SB.G * k * th - omega * omega;
      const df = SB.G * th + SB.G * k * depth * (1 - th * th);
      const dk = f / df; k -= dk; if (Math.abs(dk) < 1e-10 * k) break;
    }
    return k;
  };

  /* ------------------------------------------------------------ drawing helpers */
  /** 화살표: SB.arrow(ctx, x1,y1, x2,y2, color, width) */
  SB.arrow = function (ctx, x1, y1, x2, y2, color, width = 2) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) return;
    const h = Math.min(10 + width, L * 0.6);
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * h * 0.7, y2 - Math.sin(a) * h * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(a - 0.42) * h, y2 - Math.sin(a - 0.42) * h);
    ctx.lineTo(x2 - Math.cos(a + 0.42) * h, y2 - Math.sin(a + 0.42) * h);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  /* ------------------------------------------------------------ ship geometry */
  /**
   * 공용 선형(hull form). 단위 m. 컨테이너선/벌크선 느낌의 일반 상선.
   *   SB.SHIP = { L:Lpp, B, D, T, Cb, LOA }
   * SB.hullHalf(xi, zeta, opts) → 반폭 비율(0~1). xi: -1(선미 AP) ~ +1(선수 FP), zeta: 0(용골) ~ 1(갑판, 높이 D)
   *   opts.full(0~1): 비대도. 0.5=날씬한 고속선, 0.85=비대한 탱커(기본은 SB.SHIP.Cb에 맞춘 0.7)
   * 2D 위에서 본 그림, 횡단면, 3D 선체(SB.ship3d)가 모두 이 함수를 쓴다.
   */
  SB.SHIP = { L: 200, LOA: 210, B: 32, D: 18, T: 11, Cb: 0.7 };
  SB.hullHalf = function (xi, zeta, opts = {}) {
    const full = opts.full != null ? opts.full : 0.7;
    const pm = SB.clamp((full - 0.45) * 1.3, 0, 0.55);           // 평행 중앙부 길이 비
    const xf = pm * 0.45, xa = -pm * 0.55;
    const nf = 1.6 + full * 1.8, na = 1.4 + full * 2.2;           // 선수/선미 끝 형상 지수
    const z = SB.clamp(zeta, 0, 1);
    let f;
    if (xi > xf) f = 1 - Math.pow((xi - xf) / (1 - xf), nf);
    else if (xi < xa) {
      f = 1 - Math.pow((xa - xi) / (1 + xa), na);
      const tr = SB.clamp((z - 0.55) / 0.45, 0, 1) * 0.55;      // 선미 트랜섬(수면 위 넓은 선미)
      f = Math.max(f, tr * (1 - Math.pow((xa - xi) / (1 + xa), 6) * 0.3));
    } else f = 1;
    f = Math.max(0, f);
    // 수직 방향: 빌지(bilge) 곡률과 끝단의 V형 단면, 위로 갈수록 플레어
    const endness = SB.clamp((Math.abs(xi) - 0.3) / 0.7, 0, 1);
    const bilge = 0.12 + endness * 0.5;
    const g = z >= bilge ? 1 : Math.pow(1 - Math.pow(1 - z / bilge, 2), 0.5 + endness * 0.6);
    const flare = 1 + endness * 0.25 * z;
    return SB.clamp(f * g * Math.min(flare, 1 / Math.max(f, 1e-3)), 0, 1);
  };
  /**
   * 옆에서 본 배. (x,y)=중앙(midship) 수선면 위치 px, s=px/m. 선수는 오른쪽(+x).
   * opts: { L, D, T, color(선체 위쪽), bottom(수면 아래 방오도료 색), flip, pitch(rad, +면 선수가 숙여짐),
   *         heave(m, +위), alpha, ghost, house:true(선교), cargo:'container'|'tanker'|'bulk'|null, bulb:true, prop:true }
   * 흘수선 위치는 y(px). 그림의 수직 좌표는 위가 +.
   */
  SB.shipSide = function (ctx, x, y, s, opts = {}) {
    const P = SB.palette();
    const L = opts.L || SB.SHIP.L, D = opts.D || SB.SHIP.D, T = opts.T != null ? opts.T : SB.SHIP.T;
    const h = L / 2;
    ctx.save();
    ctx.translate(x, y - (opts.heave || 0) * s);
    if (opts.flip) ctx.scale(-1, 1);
    ctx.rotate(opts.pitch || 0);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    const yK = T * s, yD = (T - D) * s;  // 용골, 갑판 (canvas y)
    const X = (m) => m * s;
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(X(-h - 0.02 * L), yD);                       // 선미 갑판 끝
      ctx.lineTo(X(-h - 0.025 * L), yD + (D - T) * 0.55 * s);  // 트랜섬
      ctx.quadraticCurveTo(X(-h + 0.0 * L), -0.2 * T * s, X(-h + 0.035 * L), yK - 0.8 * T * s);  // 선미 카운터
      ctx.quadraticCurveTo(X(-h + 0.045 * L), yK - 0.3 * T * s, X(-h + 0.075 * L), yK);        // 선미 골재(스케그)
      ctx.lineTo(X(h - 0.06 * L), yK);
      if (opts.bulb !== false) {
        ctx.quadraticCurveTo(X(h + 0.01 * L), yK, X(h + 0.022 * L), yK - 0.32 * T * s);
        ctx.quadraticCurveTo(X(h + 0.024 * L), yK - 0.62 * T * s, X(h - 0.002 * L), yK - 0.7 * T * s);
        ctx.quadraticCurveTo(X(h + 0.0 * L), yK - 0.95 * T * s, X(h + 0.006 * L), 0);
      } else ctx.quadraticCurveTo(X(h - 0.01 * L), yK, X(h), 0);
      ctx.lineTo(X(h + 0.035 * L), yD);                       // 선수 레이크(rake)
      ctx.closePath();
    };
    if (opts.ghost) { path(); ctx.strokeStyle = opts.color || P.dim; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); return; }
    // 상부 구조물
    const deckhouse = () => {
      const hx = -h + 0.1 * L, hw = 0.07 * L, hh = Math.max(D * 1.1, L * 0.11);
      ctx.fillStyle = opts.houseColor || "#eef1f5";
      ctx.fillRect(X(hx), yD - hh * s, hw * s, hh * s);
      ctx.fillStyle = "rgba(20,30,45,0.6)";
      for (let k = 1; k < 5; k++) ctx.fillRect(X(hx) + 0.1 * hw * s, yD - hh * s * (k / 5) - 1.5, hw * s * 0.8, Math.max(1, hh * s * 0.04));
      ctx.fillStyle = opts.houseColor || "#eef1f5";
      ctx.fillRect(X(hx - 0.01 * L), yD - hh * s, (hw + 0.02 * L) * s, hh * s * 0.1);  // 선교 윙
      ctx.fillStyle = "#3a4152"; ctx.fillRect(X(hx + 0.2 * hw), yD - hh * s * 1.25, hw * s * 0.35, hh * s * 0.25); // 연돌
    };
    if (opts.house !== false && opts.cargo !== "container") deckhouse();
    if (opts.cargo === "container") {
      const cols = ["#c8443a", "#2f6fb0", "#e0a93a", "#3d8f6a", "#7a5aa8", "#5a6478"];
      const bay = 0.034 * L, tiers = 5, th = Math.max(2.6, D * 0.14);
      let k = 0;
      for (let bx = -h + 0.2 * L; bx < h - 0.12 * L; bx += bay) {
        const n = tiers - (bx > h - 0.2 * L ? 2 : 0);
        for (let t = 0; t < n; t++) { ctx.fillStyle = cols[(k * 7 + t * 3) % cols.length]; ctx.fillRect(X(bx) + 0.6, yD - (t + 1) * th * s + 0.6, bay * s - 1.2, th * s - 1.2); }
        k++;
      }
      deckhouse();
    } else if (opts.cargo === "tanker") {
      ctx.strokeStyle = "#7d8698"; ctx.lineWidth = Math.max(1, s * 0.5);
      ctx.beginPath(); ctx.moveTo(X(-h + 0.18 * L), yD - 1.5 * s); ctx.lineTo(X(h - 0.05 * L), yD - 1.5 * s); ctx.stroke();
    } else if (opts.cargo === "bulk") {
      ctx.fillStyle = "#8a93a8";
      for (let i = 0; i < 7; i++) ctx.fillRect(X(-h + 0.22 * L + i * 0.1 * L), yD - 1.6 * s, 0.07 * L * s, 1.6 * s);
    }
    // 선체: 수면 위/아래 2색
    path();
    ctx.save(); ctx.clip();
    ctx.fillStyle = opts.color || "#2b3445"; ctx.fillRect(X(-h * 1.2), yD - 2, L * 1.2 * s, (D + 2) * s);
    ctx.fillStyle = opts.bottom || P.accent2 || "#c8443a"; ctx.fillRect(X(-h * 1.2), -0.15 * s, L * 1.2 * s, (T + 2) * s);
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(X(-h * 1.2), -0.15 * s - Math.max(1, 0.25 * s), L * 1.2 * s, Math.max(1, 0.25 * s)); // 흘수선 띠
    ctx.restore();
    if (opts.prop !== false) {
      const px = X(-h + 0.022 * L), py = yK - 0.4 * T * s, pr = 0.34 * T * s;
      ctx.fillStyle = "#c9a227"; ctx.beginPath(); ctx.ellipse(px, py, Math.max(1.5, pr * 0.2), pr, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4a5266"; ctx.fillRect(X(-h - 0.004 * L), yK - 0.9 * T * s, 0.014 * L * s, 0.82 * T * s); // 타(rudder)
    }
    ctx.restore();
  };
  /**
   * 위에서 본 배(수선면 윤곽). (x,y)=선체 중심 px, heading=진행 방향(rad, 캔버스 각도: 0=오른쪽, +는 시계 방향)
   * opts: { len:px(기본 60), wid:px(기본 len*0.16), color, alpha, rudder:타각(rad), full, house:true, wake:false, outline }
   */
  SB.shipTop = function (ctx, x, y, heading, opts = {}) {
    const L = opts.len || 60, W = opts.wid || L * 0.16, P = SB.palette();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(heading);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    if (opts.rudder != null) {
      ctx.save(); ctx.translate(-L / 2, 0); ctx.rotate(-opts.rudder);
      ctx.fillStyle = P.text; ctx.fillRect(-L * 0.07, -1.2, L * 0.07, 2.4); ctx.restore();
    }
    ctx.beginPath();
    const N = 40;
    for (let i = 0; i <= N; i++) { const xi = -1 + (2 * i) / N; const b = SB.hullHalf(xi, 1, opts) * W / 2; const px = (xi * L) / 2; i ? ctx.lineTo(px, -b) : ctx.moveTo(px, -b); }
    for (let i = N; i >= 0; i--) { const xi = -1 + (2 * i) / N; const b = SB.hullHalf(xi, 1, opts) * W / 2; ctx.lineTo((xi * L) / 2, b); }
    ctx.closePath();
    ctx.fillStyle = opts.color || P.accent; ctx.fill();
    if (opts.outline) { ctx.strokeStyle = opts.outline; ctx.lineWidth = 1; ctx.stroke(); }
    if (opts.house !== false) { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(-L * 0.38, -W * 0.36, L * 0.08, W * 0.72); }
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.moveTo(L / 2 - 1, 0); ctx.lineTo(L * 0.36, -W * 0.12); ctx.lineTo(L * 0.36, W * 0.12); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  /**
   * 중앙 횡단면(선미에서 선수 쪽으로 본 모습). (cx, wy)=중심선과 흘수선이 만나는 점 px, s=px/m.
   * opts: { B, D, T, heel(rad, +면 우현(오른쪽)이 내려감), bilge(m, 빌지 반경), color, alpha, fill:true }
   * 반환: 단면 꼭짓점 배열(선체 좌표 m, 원점=용골 중심) — 잠긴 면적 계산 등에 쓸 수 있다.
   */
  SB.section = function (ctx, cx, wy, s, opts = {}) {
    const B = opts.B || SB.SHIP.B, D = opts.D || SB.SHIP.D, T = opts.T != null ? opts.T : SB.SHIP.T;
    const r = opts.bilge != null ? opts.bilge : B * 0.08, P = SB.palette();
    const pts = [];
    pts.push([-B / 2, D]);
    for (let i = 0; i <= 8; i++) { const a = Math.PI + (i / 8) * (Math.PI / 2); pts.push([-B / 2 + r + r * Math.cos(a), r + r * Math.sin(a)]); }
    for (let i = 0; i <= 8; i++) { const a = 1.5 * Math.PI + (i / 8) * (Math.PI / 2); pts.push([B / 2 - r + r * Math.cos(a), r + r * Math.sin(a)]); }
    pts.push([B / 2, D]);
    ctx.save();
    ctx.translate(cx, wy); ctx.rotate(opts.heel || 0); ctx.translate(0, T * s);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px * s, -py * s) : ctx.moveTo(px * s, -py * s))); ctx.closePath();
    if (opts.fill !== false) { ctx.fillStyle = opts.color || P.surface; ctx.fill(); }
    ctx.strokeStyle = opts.stroke || P.text; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore();
    return pts;
  };
  /**
   * 물 그리기: 수면 y0(px) 아래를 채운다. opts.wave(x)→수면 높이 변위(px, +아래). opts.color, opts.line
   *   SB.water(ctx, w, h, y0, { wave: (x) => 6*Math.sin(x/40 - t) })
   */
  SB.water = function (ctx, w, h, y0, opts = {}) {
    const col = opts.color || SB.color("water") || "#2f8fd0";
    ctx.save();
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) ctx.lineTo(x, y0 + (opts.wave ? opts.wave(x) : 0));
    ctx.lineTo(w, h); ctx.closePath();
    const g = ctx.createLinearGradient(0, y0, 0, h);
    g.addColorStop(0, SB.color("water-soft") || "rgba(47,143,208,0.18)"); g.addColorStop(1, "rgba(20,70,120,0.28)");
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) { const yy = y0 + (opts.wave ? opts.wave(x) : 0); x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
    ctx.strokeStyle = opts.line || col; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore();
  };
  /** 폴리곤 면적과 도심 [A, cx, cy] (꼭짓점 [[x,y],...], 방향 무관) */
  SB.polyArea = function (pts) {
    let A = 0, cx = 0, cy = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length], c = x1 * y2 - x2 * y1;
      A += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c;
    }
    A /= 2;
    return Math.abs(A) < 1e-12 ? [0, 0, 0] : [Math.abs(A), cx / (6 * A), cy / (6 * A)];
  };
  /** 폴리곤을 직선 a·x + b·y <= c 쪽으로 자른다(잠긴 부분 계산용). 반환: 잘린 폴리곤 */
  SB.clipPoly = function (pts, a, b, c) {
    const out = [], f = (p) => a * p[0] + b * p[1] - c;
    for (let i = 0; i < pts.length; i++) {
      const P1 = pts[i], P2 = pts[(i + 1) % pts.length], f1 = f(P1), f2 = f(P2);
      if (f1 <= 0) out.push(P1);
      if ((f1 <= 0) !== (f2 <= 0)) { const t = f1 / (f1 - f2); out.push([P1[0] + (P2[0] - P1[0]) * t, P1[1] + (P2[1] - P1[1]) * t]); }
    }
    return out;
  };
  /**
   * 포인터 드래그: SB.drag(el, { down(p,e), move(p,e), up(p,e) }), p = {x,y} (요소 기준 CSS px)
   * down이 false를 반환하면 그 드래그는 무시한다. 터치 스크롤을 막으려면 el에 touch-action:none.
   */
  SB.drag = function (el, h) {
    const pos = (e) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    let active = false;
    el.addEventListener("pointerdown", (e) => {
      if (h.down && h.down(pos(e), e) === false) return;
      active = true; try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener("pointermove", (e) => { if (active && h.move) h.move(pos(e), e); });
    const end = (e) => { if (!active) return; active = false; if (h.up) h.up(pos(e), e); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  };

  /* ------------------------------------------------------------ theme */
  const themeCbs = [];
  SB.onTheme = (cb) => themeCbs.push(cb);
  SB.isDark = function () {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  /** CSS 변수 값 읽기: SB.color('accent') */
  SB.color = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  };
  /** 자주 쓰는 색 묶음 (테마 변경 시 다시 호출할 것) */
  SB.palette = function () {
    const c = SB.color;
    return {
      bg: c("canvas-bg"), text: c("text"), dim: c("text-dim"), faint: c("text-faint"),
      grid: c("grid"), axis: c("axis"), border: c("border"), surface: c("surface"),
      accent: c("accent"), accent2: c("accent-2"), ok: c("ok"), warn: c("warn"), bad: c("bad"),
      red: c("red"), green: c("green"), blue: c("blue"),
      // 데이터 시리즈용 기본 순서
      series: [c("accent"), c("accent-2"), c("warn"), c("ok"), c("bad"), c("text-dim")],
    };
  };
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    themeCbs.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  }
  try { const saved = localStorage.getItem("sb-theme"); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
      if (!document.documentElement.getAttribute("data-theme")) applyTheme(null);
    });
  }

  /* ------------------------------------------------------------ canvas helper */
  /**
   * HiDPI 캔버스. 폭은 부모 폭을 따르고 높이는 aspect(높이/폭) 또는 height(px)로 결정.
   * draw(ctx, w, h)는 리사이즈·테마 변경 시 자동 호출된다. 애니메이션이면 직접 redraw() 호출.
   *   const cv = SB.canvas(el, (ctx,w,h)=>{...}, {aspect:0.5, maxHeight: 420});
   *   cv.redraw(); cv.ctx; cv.w; cv.h
   */
  SB.canvas = function (canvas, draw, opts = {}) {
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    const ctx = canvas.getContext("2d");
    const st = { ctx, w: 0, h: 0, canvas, dpr: 1 };
    function resize() {
      const parent = canvas.parentElement;
      const w = Math.max(200, Math.floor(opts.width || parent.clientWidth || 600));
      let h = opts.height || Math.round(w * (opts.aspect || 0.5));
      if (opts.minHeight) h = Math.max(h, opts.minHeight);
      if (opts.maxHeight) h = Math.min(h, opts.maxHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h; st.dpr = dpr;
      st.redraw();
    }
    st.redraw = function () {
      if (!st.w) return;
      ctx.save();
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (!opts.noClear) {
        ctx.clearRect(0, 0, st.w, st.h);
        ctx.fillStyle = SB.color("canvas-bg");
        ctx.fillRect(0, 0, st.w, st.h);
      }
      try { draw && draw(ctx, st.w, st.h); } finally { ctx.restore(); }
    };
    st.resize = resize;
    if (window.ResizeObserver) {
      let lastW = -1;
      new ResizeObserver(() => { const w = canvas.parentElement.clientWidth; if (w !== lastW) { lastW = w; resize(); } }).observe(canvas.parentElement);
    } else window.addEventListener("resize", resize);
    SB.onTheme(() => st.redraw());
    // 첫 그리기가 아직 초기화되지 않은 페이지 상태를 참조해 실패하면, 페이지 스크립트가 끝난 뒤 다시 그린다.
    try { resize(); } catch (e) { setTimeout(() => st.redraw(), 0); }
    return st;
  };

  /**
   * 화면에 보일 때만 도는 애니메이션 루프. fn(dt초, t초)
   *   const loop = SB.loop(el, (dt,t)=>{...}); loop.stop(); loop.start();
   */
  SB.loop = function (el, fn) {
    let raf = 0, last = 0, t = 0, visible = true, running = true;
    function frame(ts) {
      raf = 0;
      if (!running || !visible) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; t += dt;
      fn(dt, t);
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    if (window.IntersectionObserver && el) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }).observe(el);
    }
    kick();
    return {
      start() { running = true; kick(); },
      stop() { running = false; },
      get running() { return running; },
      toggle() { running ? (running = false) : ((running = true), kick()); return running; },
    };
  };

  /* ------------------------------------------------------------ chart helper */
  /**
   * 간단한 선 그래프. box = {x,y,w,h}(생략 시 캔버스 전체에 여백 자동)
   * opts: { x:[min,max], y:[min,max], logX, logY, xLabel, yLabel, xTicks, yTicks,
   *         xFmt, yFmt, series:[{data:[[x,y],...], color, width, dash, fill, label}],
   *         vlines:[{x,color,label,dash}], hlines:[{y,color,label,dash}], points:[{x,y,color,r,label}],
   *         bands:[{x0,x1,color}] }
   * 반환: { X(v)->px, Y(v)->px, box }
   */
  SB.chart = function (ctx, box, opts) {
    const P = SB.palette();
    const dpr = (ctx.getTransform && ctx.getTransform().a) || 1;
    const W = ctx.canvas.width / dpr, H = ctx.canvas.height / dpr;
    if (!box) box = { x: 58, y: 16, w: W - 58 - 18, h: H - 16 - 46 };
    const [x0, x1] = opts.x, [y0, y1] = opts.y;
    const lx = (v) => (opts.logX ? Math.log10(v) : v);
    const ly = (v) => (opts.logY ? Math.log10(v) : v);
    const X = (v) => box.x + ((lx(v) - lx(x0)) / (lx(x1) - lx(x0))) * box.w;
    const Y = (v) => box.y + box.h - ((ly(v) - ly(y0)) / (ly(y1) - ly(y0))) * box.h;
    const ticks = (a, b, log, n) => {
      if (log) { const out = []; for (let e = Math.ceil(Math.log10(a) - 1e-9); e <= Math.log10(b) + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
      const span = b - a, raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= (n || 5) + 0.5) || raw;
      const out = []; for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      return out;
    };
    const defFmt = (v) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(0).replace("e+", "e") : String(Number(v.toPrecision(4))));
    const xFmt = opts.xFmt || defFmt, yFmt = opts.yFmt || defFmt;
    ctx.save();
    ctx.font = "11px " + getComputedStyle(document.body).getPropertyValue("--mono");
    ctx.lineWidth = 1;
    // bands
    (opts.bands || []).forEach((b) => { ctx.fillStyle = b.color; ctx.fillRect(X(b.x0), box.y, X(b.x1) - X(b.x0), box.h); });
    // grid + ticks
    const xt = opts.xTicks || ticks(x0, x1, opts.logX, 6);
    const yt = opts.yTicks || ticks(y0, y1, opts.logY, 5);
    ctx.strokeStyle = P.grid; ctx.fillStyle = P.dim;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xt.forEach((v) => { const px = X(v); if (px < box.x - 1 || px > box.x + box.w + 1) return; ctx.beginPath(); ctx.moveTo(px, box.y); ctx.lineTo(px, box.y + box.h); ctx.stroke(); ctx.fillText(xFmt(v), px, box.y + box.h + 6); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach((v) => { const py = Y(v); if (py < box.y - 1 || py > box.y + box.h + 1) return; ctx.beginPath(); ctx.moveTo(box.x, py); ctx.lineTo(box.x + box.w, py); ctx.stroke(); ctx.fillText(yFmt(v), box.x - 6, py); });
    ctx.strokeStyle = P.axis;
    ctx.beginPath(); ctx.moveTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.stroke();
    // labels
    ctx.fillStyle = P.dim; ctx.font = "12px " + getComputedStyle(document.body).getPropertyValue("--font");
    if (opts.xLabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(opts.xLabel, box.x + box.w / 2, box.y + box.h + 40); }
    if (opts.yLabel) { ctx.save(); ctx.translate(Math.max(14, box.x - 44), box.y + box.h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(opts.yLabel, 0, 0); ctx.restore(); }
    // clip plot area
    ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y - 2, box.w + 2, box.h + 4); ctx.clip();
    (opts.series || []).forEach((s, i) => {
      if (!s.data || !s.data.length) return;
      ctx.strokeStyle = s.color || P.series[i % P.series.length];
      ctx.lineWidth = s.width || 2; ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      let started = false;
      s.data.forEach(([x, y]) => { if (!isFinite(y) || (opts.logY && y <= 0) || (opts.logX && x <= 0)) { started = false; return; } const px = X(x), py = Y(y); started ? ctx.lineTo(px, py) : ctx.moveTo(px, py); started = true; });
      ctx.stroke();
      if (s.fill) {
        ctx.lineTo(X(s.data[s.data.length - 1][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.lineTo(X(s.data[0][0]), Y(opts.logY ? y0 : Math.max(y0, 0)));
        ctx.closePath(); ctx.fillStyle = s.fill; ctx.fill();
      }
      ctx.setLineDash([]);
    });
    (opts.vlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(X(l.x), box.y); ctx.lineTo(X(l.x), box.y + box.h); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(l.label, X(l.x) + 4, box.y + 4); } });
    (opts.hlines || []).forEach((l) => { ctx.strokeStyle = l.color || P.faint; ctx.setLineDash(l.dash || [4, 4]); ctx.lineWidth = l.width || 1.2; ctx.beginPath(); ctx.moveTo(box.x, Y(l.y)); ctx.lineTo(box.x + box.w, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); if (l.label) { ctx.fillStyle = l.color || P.dim; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(l.label, box.x + box.w - 4, Y(l.y) - 3); } });
    (opts.points || []).forEach((p) => { ctx.fillStyle = p.color || P.accent; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.r || 4, 0, Math.PI * 2); ctx.fill(); if (p.label) { ctx.fillStyle = P.text; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(p.label, X(p.x) + 6, Y(p.y) - 4); } });
    ctx.restore();
    ctx.restore();
    return { X, Y, box };
  };

  /* ------------------------------------------------------------ controls */
  /**
   * range 입력 바인딩. output은 id+"-out" 요소 또는 <output for=id>.
   *   const get = SB.range('wl', v => v+' nm', v => redraw());  get() → 현재 값(Number)
   */
  SB.range = function (id, fmt, onInput) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const out = document.getElementById(el.id + "-out") || document.querySelector(`output[for="${el.id}"]`);
    const update = (fire) => {
      const v = Number(el.value);
      const pct = ((v - Number(el.min || 0)) / (Number(el.max || 100) - Number(el.min || 0))) * 100;
      el.style.setProperty("--fill", pct + "%");
      if (out) out.textContent = fmt ? fmt(v) : String(v);
      if (fire && onInput) onInput(v);
    };
    el.addEventListener("input", () => update(true));
    update(false);
    const get = () => Number(el.value);
    get.set = (v) => { el.value = v; update(true); };
    get.el = el;
    return get;
  };
  /**
   * 세그먼트 버튼: <div class="seg" id="mode"><button data-value="a" class="on">A</button>...</div>
   *   const mode = SB.seg('mode', v => redraw());  mode() → 현재 값
   */
  SB.seg = function (id, onChange) {
    const el = typeof id === "string" ? document.getElementById(id) : id;
    const btns = [...el.querySelectorAll("button")];
    let cur = (btns.find((b) => b.classList.contains("on")) || btns[0]).dataset.value;
    const set = (v, fire = true) => {
      cur = v;
      btns.forEach((b) => { const on = b.dataset.value === v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      if (fire && onChange) onChange(v);
    };
    btns.forEach((b) => b.addEventListener("click", () => set(b.dataset.value)));
    set(cur, false);
    const get = () => cur;
    get.set = set;
    return get;
  };
  /** 통계 표시: SB.stat('snr', '32.1 dB') → id 요소의 textContent 설정(HTML 허용) */
  SB.stat = function (id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  /* ------------------------------------------------------------ three.js helper */
  /**
   * three.js 씬 준비 (전역 THREE, THREE.OrbitControls 필요).
   *   const T = SB.three(containerEl, { camera:[x,y,z], target:[x,y,z], fov:40, autoRotate:false });
   *   T.scene, T.camera, T.renderer, T.controls, T.THREE
   *   T.onFrame((dt,t)=>{...});   T.label('텍스트', new THREE.Vector3(...)) → HTML 라벨(자동 투영)
   *   T.material(color, opts)  → MeshStandardMaterial 헬퍼
   * 조명(환경광+방향광 2개), 리사이즈, 화면 밖 일시정지, 테마 대응 포함.
   */
  SB.three = function (container, opts = {}) {
    if (typeof container === "string") container = document.querySelector(container);
    if (!window.THREE) { container.innerHTML = '<p style="padding:20px;color:var(--text-dim)">3D 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요.</p>'; return null; }
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 40, 1, 0.01, 2000);
    camera.position.set(...(opts.camera || [6, 5, 8]));
    const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.target.set(...(opts.target || [0, 0, 0]));
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.autoRotate = !!opts.autoRotate; controls.autoRotateSpeed = opts.autoRotateSpeed || 0.8;
      controls.enablePan = opts.pan !== false;
      if (opts.minDistance) controls.minDistance = opts.minDistance;
      if (opts.maxDistance) controls.maxDistance = opts.maxDistance;
      controls.update();
    } else camera.lookAt(...(opts.target || [0, 0, 0]));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 0.75));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.85); d1.position.set(5, 10, 7); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xbfd7ff, 0.35); d2.position.set(-6, 4, -5); scene.add(d2);

    const labelLayer = document.createElement("div");
    labelLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    container.appendChild(labelLayer);
    const labels = [];
    const frameCbs = [];
    const T = { THREE, scene, camera, renderer, controls, container, labels };
    T.onFrame = (cb) => frameCbs.push(cb);
    T.label = function (text, pos, cls) {
      const el = document.createElement("div");
      el.className = "overlay-label" + (cls ? " " + cls : "");
      el.innerHTML = text;
      labelLayer.appendChild(el);
      const L = { el, pos: pos.clone ? pos.clone() : new THREE.Vector3(...pos), visible: true, obj: null };
      L.setVisible = (v) => { L.visible = v; el.style.display = v ? "" : "none"; };
      L.remove = () => { el.remove(); labels.splice(labels.indexOf(L), 1); };
      labels.push(L);
      return L;
    };
    T.material = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o));
    function resize() {
      const w = container.clientWidth, h = container.clientHeight || 400;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px"; renderer.domElement.style.height = h + "px";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(container); else window.addEventListener("resize", resize);
    resize();
    const v = new THREE.Vector3();
    T.loop = SB.loop(container, (dt, t) => {
      frameCbs.forEach((cb) => cb(dt, t));
      if (controls) controls.update();
      renderer.render(scene, camera);
      const w = container.clientWidth, h = container.clientHeight;
      labels.forEach((L) => {
        if (!L.visible) return;
        v.copy(L.pos); if (L.obj) L.obj.localToWorld(v);
        v.project(camera);
        const behind = v.z > 1;
        L.el.style.display = behind ? "none" : "";
        L.el.style.left = ((v.x + 1) / 2) * w + "px";
        L.el.style.top = ((1 - v.y) / 2) * h + "px";
      });
    });
    return T;
  };

  /**
   * 공용 3D 선체(+x 선수, +y 위, +z 우현, 흘수선 y=0, 용골 y=-T). 단위는 호출자가 정한다(기본 L=10 모형 단위).
   *   const ship = SB.ship3d(T, { L:10, B:1.6, D:0.9, T:0.55, full:0.7, color, bottom, opacity, deck:true, house:true, cargo:'container'|null });
   *   ship.group(전체), ship.hull(Mesh), ship.deck, ship.house, ship.dims
   * 선체를 굴리기/기울이기: ship.group.rotation.x = 횡경사(roll), rotation.z = 종경사(pitch, +면 선수 들림)
   */
  SB.ship3d = function (T, opts = {}) {
    const THREE = T.THREE, g = new THREE.Group();
    const L = opts.L || 10, B = opts.B || L * 0.16, D = opts.D || L * 0.09, Tm = opts.T != null ? opts.T : D * 0.6;
    const NX = 48, NZ = 14, ho = { full: opts.full != null ? opts.full : 0.7 };
    const pos = [], col = [], idx = [];
    const top = new THREE.Color(opts.color != null ? opts.color : 0x2b3445), bot = new THREE.Color(opts.bottom != null ? opts.bottom : 0xc8443a), stripe = new THREE.Color(0xf2f4f7);
    const xOf = (i) => -1 + (2 * i) / NX;
    const yOf = (k) => -Tm + (k / NZ) * D;
    // 선수 선형: 갑판 쪽으로 갈수록 앞으로 나간다(레이크). 선미는 트랜섬.
    const xShift = (xi, zeta) => (xi > 0.9 ? (xi - 0.9) * 10 * zeta * 0.035 * L : 0);
    for (const side of [1, -1]) {
      for (let i = 0; i <= NX; i++) for (let k = 0; k <= NZ; k++) {
        const xi = xOf(i), zeta = k / NZ, y = yOf(k);
        const half = SB.hullHalf(xi, zeta, ho) * B / 2;
        pos.push((xi * L) / 2 + xShift(xi, zeta), y, side * half);
        const c = Math.abs(y) < D * 0.02 ? stripe : y < 0 ? bot : top;
        col.push(c.r, c.g, c.b);
      }
    }
    const V = (side, i, k) => side * (NX + 1) * (NZ + 1) + i * (NZ + 1) + k;
    for (let i = 0; i < NX; i++) for (let k = 0; k < NZ; k++) {
      const a = V(0, i, k), b = V(0, i + 1, k), c = V(0, i + 1, k + 1), d = V(0, i, k + 1);
      idx.push(a, c, b, a, d, c);
      const a2 = V(1, i, k), b2 = V(1, i + 1, k), c2 = V(1, i + 1, k + 1), d2 = V(1, i, k + 1);
      idx.push(a2, b2, c2, a2, c2, d2);
    }
    // 선미 트랜섬 막기
    for (let k = 0; k < NZ; k++) idx.push(V(0, 0, k), V(1, 0, k + 1), V(1, 0, k), V(0, 0, k), V(0, 0, k + 1), V(1, 0, k + 1));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide });
    if (opts.opacity != null && opts.opacity < 1) { mat.transparent = true; mat.opacity = opts.opacity; mat.depthWrite = false; }
    const hull = new THREE.Mesh(geo, mat); g.add(hull);
    // 갑판
    const sh = new THREE.Shape();
    for (let i = 0; i <= NX; i++) { const xi = xOf(i); const px = (xi * L) / 2 + xShift(xi, 1), b = SB.hullHalf(xi, 1, ho) * B / 2; i ? sh.lineTo(px, b) : sh.moveTo(px, b); }
    for (let i = NX; i >= 0; i--) { const xi = xOf(i); sh.lineTo((xi * L) / 2 + xShift(xi, 1), -SB.hullHalf(xi, 1, ho) * B / 2); }
    let deck = null;
    if (opts.deck !== false) {
      const dg = new THREE.ShapeGeometry(sh, 2); dg.rotateX(Math.PI / 2); dg.translate(0, D - Tm, 0);
      const dm = T.material(opts.deckColor != null ? opts.deckColor : 0x7c8a6e, { roughness: 0.8, side: THREE.DoubleSide });
      if (mat.transparent) { dm.transparent = true; dm.opacity = opts.opacity; dm.depthWrite = false; }
      deck = new THREE.Mesh(dg, dm); g.add(deck);
    }
    let house = null;
    if (opts.house !== false) {
      house = new THREE.Group();
      const hw = B * 0.9, hh = Math.max(D * 1.2, L * 0.1), hl = L * 0.07, hx = -L / 2 + L * 0.13;
      const hm = new THREE.Mesh(new THREE.BoxGeometry(hl, hh, hw * 0.85), T.material(0xeef1f5, { roughness: 0.6 }));
      hm.position.set(hx, D - Tm + hh / 2, 0); house.add(hm);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(hl * 0.7, hh * 0.08, hw * 1.08), T.material(0xeef1f5)); wing.position.set(hx + hl * 0.1, D - Tm + hh * 0.96, 0); house.add(wing);
      const win = new THREE.Mesh(new THREE.BoxGeometry(hl * 1.01, hh * 0.06, hw * 0.86), T.material(0x1e2a3a, { metalness: 0.5, roughness: 0.2 })); win.position.set(hx, D - Tm + hh * 0.88, 0); house.add(win);
      const fun = new THREE.Mesh(new THREE.BoxGeometry(hl * 0.45, hh * 0.35, hw * 0.25), T.material(0x3a4152)); fun.position.set(hx - hl * 0.15, D - Tm + hh * 1.15, 0); house.add(fun);
      g.add(house);
    }
    if (opts.cargo === "container") {
      const cols = [0xc8443a, 0x2f6fb0, 0xe0a93a, 0x3d8f6a, 0x7a5aa8, 0x5a6478];
      const bay = L * 0.034, row = B / 9, th = D * 0.3, box = new THREE.BoxGeometry(bay * 0.94, th * 0.94, row * 0.94);
      const mats = cols.map((c) => T.material(c, { roughness: 0.7 }));
      let n = 0;
      for (let bx = -L / 2 + L * 0.22; bx < L / 2 - L * 0.12; bx += bay) {
        const xi = (2 * bx) / L, half = SB.hullHalf(xi, 1, ho) * B / 2, tiers = bx > L / 2 - L * 0.22 ? 3 : 5;
        for (let r = -4; r <= 4; r++) { if (Math.abs(r * row) + row / 2 > half) continue;
          for (let t = 0; t < tiers; t++) { const m = new THREE.Mesh(box, mats[(n * 7 + r * 3 + t * 5 + 60) % mats.length]); m.position.set(bx + bay / 2, D - Tm + th * (t + 0.5), r * row); g.add(m); } }
        n++;
      }
    }
    T.scene.add(g);
    return { group: g, hull, deck, house, dims: { L, B, D, T: Tm } };
  };
  /**
   * 3D 바다 면. 높이 함수 h(x, z, t)로 매 프레임 갱신한다.
   *   const sea = SB.sea3d(T, { size:40, seg:80, color, opacity });  sea.update(t, (x,z,t)=> 0.2*Math.sin(x - t));
   */
  SB.sea3d = function (T, opts = {}) {
    const THREE = T.THREE, size = opts.size || 40, seg = opts.seg || 80;
    const geo = new THREE.PlaneGeometry(opts.sizeX || size, opts.sizeZ || size, seg, seg); geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: opts.color != null ? opts.color : 0x1f6aa8, roughness: 0.7, metalness: 0.0, transparent: true, opacity: opts.opacity != null ? opts.opacity : 0.5, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat); T.scene.add(mesh);
    const p = geo.attributes.position;
    return {
      mesh,
      update(t, fn) {
        for (let i = 0; i < p.count; i++) p.setY(i, fn(p.getX(i), p.getZ(i), t));
        p.needsUpdate = true; geo.computeVertexNormals();
      },
    };
  };
  /** 바닥 격자: SB.ground3d(T, size=20) → GridHelper */
  SB.ground3d = function (T, size = 20, div = 20) {
    const grid = new T.THREE.GridHelper(size, div, 0x8892a6, 0x8892a6);
    grid.material.transparent = true; grid.material.opacity = 0.28;
    T.scene.add(grid);
    return grid;
  };
  /* ------------------------------------------------------------ layout build */
  const LOGO = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#sbg)"/><path d="M14 7h3v7h-3z M10 11h11v4H10z" fill="#fff"/><path d="M5 16h22l-3.2 6.2H8.6z" fill="#fff"/><path d="M5 25.2c1.8 0 1.8-1.3 3.6-1.3s1.8 1.3 3.6 1.3 1.8-1.3 3.6-1.3 1.8 1.3 3.6 1.3 1.8-1.3 3.6-1.3 1.8 1.3 3.6 1.3" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const ICON_MENU = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  const ICON_MOON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
  const ICON_SUN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

  function build() {
    const body = document.body;
    const root = body.dataset.root != null ? body.dataset.root : body.dataset.chapter ? "../" : "";
    const curSlug = body.dataset.chapter || "";
    const href = (slug) => (slug ? `${root}chapters/${slug}.html` : `${root}index.html`);
    const feedbackUrl = "https://books.euiyun.com/feedback.html?book=shipbook&page=" + encodeURIComponent(location.href);

    // top bar
    const bar = document.createElement("header");
    bar.className = "sb-topbar";
    bar.innerHTML = `
      <button class="sb-btn icon" id="sb-menu" aria-label="챕터 목록">${ICON_MENU}</button>
      <a class="sb-logo" href="${href("")}" aria-label="ShipBook 홈">${LOGO}<span>ShipBook <small>선박 교과서</small></span></a>
      <span class="spacer"></span>
      <a class="sb-btn icon" href="https://books.euiyun.com/" aria-label="전체 책 보기" title="전체 책 보기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h6v14H4zM10 5.5h6v14h-6zM17 7l3-1 2 13-3 1z"/></svg></a>
      <button class="sb-btn icon" id="sb-theme" aria-label="테마 전환"></button>
      <div class="sb-progress" id="sb-progress"></div>`;
    const feedbackButton = document.createElement("a");
    feedbackButton.className = "sb-btn icon";
    feedbackButton.href = feedbackUrl;
    feedbackButton.target = "_blank";
    feedbackButton.rel = "noopener";
    feedbackButton.setAttribute("aria-label", "독자 의견 보내기");
    feedbackButton.title = "독자 의견 보내기";
    feedbackButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2z"/><path d="M8 9h8M8 13h5"/></svg>';
    bar.querySelector("#sb-theme").before(feedbackButton);
    body.prepend(bar);

    // drawer
    const drawer = document.createElement("nav");
    drawer.className = "sb-drawer";
    drawer.innerHTML = `<h4>Chapters</h4><ul class="sb-chlist">
      <li><a href="${href("")}" class="${curSlug ? "" : "active"}"><span class="num">00</span><span>홈 · 로드맵</span></a></li>
      ${CHAPTERS.map((c) => `<li><a href="${href(c.slug)}" class="${c.slug === curSlug ? "active" : ""}"><span class="num">${c.num}</span><span>${c.title}</span></a></li>`).join("")}
    </ul>`;
    const backdrop = document.createElement("div");
    backdrop.className = "sb-drawer-backdrop";
    body.append(backdrop, drawer);
    const toggleDrawer = (o) => body.classList.toggle("drawer-open", o);
    bar.querySelector("#sb-menu").addEventListener("click", () => toggleDrawer(true));
    backdrop.addEventListener("click", () => toggleDrawer(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleDrawer(false); });

    // theme toggle
    const tbtn = bar.querySelector("#sb-theme");
    const setIcon = () => (tbtn.innerHTML = SB.isDark() ? ICON_SUN : ICON_MOON);
    setIcon();
    tbtn.addEventListener("click", () => {
      const next = SB.isDark() ? "light" : "dark";
      try { localStorage.setItem("sb-theme", next); } catch (e) {}
      applyTheme(next); setIcon();
    });

    // progress
    const prog = bar.querySelector("#sb-progress");
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%"; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // chapter page extras
    const main = document.querySelector("main.chapter");
    if (main) {
      // numbered h2 + TOC
      const layout = document.createElement("div");
      layout.className = "sb-layout";
      main.parentNode.insertBefore(layout, main);
      layout.appendChild(main);
      const toc = document.createElement("aside");
      toc.className = "sb-toc";
      const h2s = [...main.querySelectorAll("section > h2")];
      let n = 0;
      toc.innerHTML = "<h4>ON THIS PAGE</h4>" + h2s.map((h, i) => {
        const sec = h.parentElement;
        if (!sec.id) sec.id = "s" + (i + 1);
        const numbered = !sec.classList.contains("keypoints") && !sec.classList.contains("quiz-sec") && !sec.hasAttribute("data-nonum");
        if (numbered && !h.querySelector(".h-num")) { n++; h.insertAdjacentHTML("afterbegin", `<span class="h-num">${String(n).padStart(2, "0")}</span>`); }
        return `<a href="#${sec.id}">${h.textContent.replace(/^\d\d/, "").trim()}</a>`;
      }).join("");
      layout.appendChild(toc);
      const links = [...toc.querySelectorAll("a")];
      if (window.IntersectionObserver && h2s.length) {
        const io = new IntersectionObserver((es) => {
          es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); } });
        }, { rootMargin: "-20% 0px -70% 0px" });
        h2s.forEach((h) => io.observe(h.parentElement));
      }

      // pager
      const idx = CHAPTERS.findIndex((c) => c.slug === curSlug);
      const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
      const next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
      const pager = document.createElement("nav");
      pager.className = "sb-pager";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${href(prev.slug)}"><small>← 이전 · ${prev.num}</small>${prev.title}</a>` : `<a class="prev" href="${href("")}"><small>← 처음으로</small>홈 · 로드맵</a>`) +
        (next ? `<a class="next" href="${href(next.slug)}"><small>다음 · ${next.num} →</small>${next.title}</a>` : "");
      layout.after(pager);
    }
    const foot = document.createElement("footer");
    foot.className = "sb-foot";
    foot.innerHTML = `ShipBook — 부력에서 자율운항까지, 인터랙티브 선박 교과서 · 수치는 교육용 근사 모델입니다.
      <br>© 2026 <a href="https://github.com/geniuskey">geniuskey</a> ·
      콘텐츠 <a href="https://creativecommons.org/licenses/by/4.0/deed.ko" rel="license">CC BY 4.0</a> ·
      코드 <a href="https://github.com/geniuskey/shipbook/blob/main/LICENSE-MIT">MIT</a> ·
      <a href="https://github.com/geniuskey/shipbook/blob/main/LICENSE.md">라이선스 안내</a>`;
    const feedbackLink = document.createElement("a");
    feedbackLink.href = feedbackUrl;
    feedbackLink.target = "_blank";
    feedbackLink.rel = "noopener";
    feedbackLink.textContent = "독자 의견";
    foot.append(" · ", feedbackLink);
    body.appendChild(foot);

    // quiz
    document.querySelectorAll(".quiz-q").forEach((q) => {
      const opts = [...q.querySelectorAll("button.opt")];
      opts.forEach((b) => b.addEventListener("click", () => {
        opts.forEach((o) => { o.disabled = true; if (o.hasAttribute("data-correct")) o.classList.add("right"); });
        if (!b.hasAttribute("data-correct")) b.classList.add("wrong");
        q.classList.add("done");
        q.dispatchEvent(new CustomEvent("answered", { bubbles: true, detail: { correct: b.hasAttribute("data-correct") } }));
      }));
    });

    // KaTeX
    const renderMath = () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
          throwOnError: false,
          ignoredClasses: ["no-math"],
        });
      }
    };
    if (window.renderMathInElement) renderMath();
    else window.addEventListener("load", renderMath);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
