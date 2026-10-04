# ShipBook — 인터랙티브 선박 교과서

수만 톤의 강철이 어떻게 바다를 건너는가. 부력과 복원성에서 저항·추진, 파도와 선체 구조, 친환경 연료와 자율운항까지 다루는 한국어 조선해양공학 학습 사이트입니다.
23개 챕터, 약 220개의 시뮬레이터, 3D 선박 모델(three.js)로 구성됩니다.

자매 프로젝트: [CarBook — 인터랙티브 자동차 교과서](https://carbook.euiyun.com/)

## 실행
빌드 과정이 없는 정적 사이트입니다.

```bash
python -m http.server 8000   # → http://localhost:8000
```
`index.html`을 브라우저로 바로 열어도 동작합니다. KaTeX, three.js, 폰트는 CDN에서 불러오므로 인터넷 연결이 필요합니다.

## 구성
| 장 | 파일 | 주제 |
|---|---|---|
| 01 | chapters/overview.html | 선종, 주요 치수, 선체 각부 명칭, 6자유도 |
| 02 | chapters/buoyancy.html | 아르키메데스, 배수량·재화중량·톤수, 형상 계수, TPC, 만재 흘수선 |
| 03 | chapters/stability.html | G·B·M, GM, GZ 곡선, IMO 복원성 기준, 경사 시험 |
| 04 | chapters/trim.html | 무게 이동, 트림과 MCT, 자유수면 효과, 밸러스트, 적재 계획 |
| 05 | chapters/damage.html | 침수 계산, 수밀 구획, 가항 길이, 확률론적 손상 복원성 |
| 06 | chapters/resistance.html | 레이놀즈·프루드 상사, 마찰·조파 저항, 켈빈 파형, 선수 벌브 |
| 07 | chapters/propeller.html | 운동량·날개 요소 이론, KT·KQ·J, 캐비테이션, 3D 프로펠러 |
| 08 | chapters/propulsion.html | 반류·추력 감소, 추진 효율, 엔진–프로펠러 매칭, 시운전 |
| 09 | chapters/engine.html | 저속 2행정 디젤, 크로스헤드, 소기, 과급, 이중 연료 |
| 10 | chapters/waves.html | 선형 파 이론, 분산 관계, 군속도, 파 스펙트럼, 천수 변형 |
| 11 | chapters/seakeeping.html | 6자유도 운동, RAO, 조우 주파수, 파라메트릭 롤, 감요 장치 |
| 12 | chapters/maneuvering.html | 타, 노모토 모델, 선회·지그재그 시험, 스쿼트, 앵커와 계류 |
| 13 | chapters/structure.html | 전단력·굽힘 모멘트, 호깅·새깅, 단면 계수, 좌굴, 피로 |
| 14 | chapters/design.html | 설계 나선, 주요 치수 결정, 선도, 중량 추정, 선급 |
| 15 | chapters/building.html | 블록 공법, 용접, 탑재, 진수, 도장, 공정 계획 |
| 16 | chapters/cargo.html | 컨테이너선, 벌크선, 탱커, LNG 운반선, 운하 제약 |
| 17 | chapters/special.html | 활주선, 수중익선, 쌍동선, 쇄빙선, 잠수함, 해양 플랜트 |
| 18 | chapters/electric.html | 선박 전력 계통, 병렬 운전, 전기 추진, 배터리 하이브리드 |
| 19 | chapters/green.html | EEXI·CII, 감속 운항, 대체 연료, 풍력 보조, 공기 윤활 |
| 20 | chapters/navigation.html | 위경도, 메르카토르, 대권 항법, 추측 항법, 조석, GNSS |
| 21 | chapters/bridge.html | 레이더·ARPA, AIS, ECDIS, CPA·TCPA, COLREG, 항해등 |
| 22 | chapters/autonomous.html | MASS, 센서 융합, 경로 계획, 충돌 회피, 동적 위치 유지 |
| 23 | chapters/glossary.html | 용어집, 약어 표, 종합 퀴즈 |

공통 코드: `css/style.css`(디자인 토큰, 라이트/다크), `js/common.js`(내비게이션, 캔버스·차트·3D 헬퍼, 선체 형상·바다 그리기 헬퍼).
챕터 작성 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
챕터를 추가하거나 제목·설명을 바꾼 뒤에는 `python tools/seo.py`로 canonical/OG/JSON-LD 태그와 `sitemap.xml`을 다시 만듭니다. `node tools/check.js`는 각 챕터의 인라인 스크립트 문법과 요소 id 참조를 점검합니다.

시뮬레이터의 수치는 교육용 근사 모델입니다. 실제 선박의 설계·운항 판단에 쓰지 마세요.

## 라이선스

코드는 [MIT](LICENSE-MIT), 교재 콘텐츠는 [CC BY 4.0](LICENSE-CC-BY-4.0)으로 제공됩니다. 적용 범위와 재사용 조건, 출처 표기 예시는 [라이선스 안내](LICENSE.md)를 참고하세요.
