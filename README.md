# Publishing_ — StudyPort HTML/CSS 스터디 프로젝트

네이버 포털 UI를 참고한 **멀티 페이지 퍼블리싱 템플릿**과, 윈도우 클래식 **클론다이크 솔리테어**를 포함한 HTML/CSS(＋솔리테어 JS) 학습용 저장소입니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 목적 | HTML 시맨틱, CSS 레이아웃·컴포넌트, 반응형, 폼·테이블 UI 연습 |
| 메인 진입 | [`site/index.html`](site/index.html) |
| 페이지 수 | **18개** HTML (`site/` 17 + 루트 연습 파일 2) |
| JS 사용 | 솔리테어(`solitaire.js`)만 — 나머지는 HTML/CSS |
| 디자인 톤 | 흰 배경 · 포인트 컬러 `#03c75a` · 카드형 패널 |

---

## 폴더 구조

```
Publishing_/
├── README.md
├── .gitignore
├── pub.html              # 초기 HTML/CSS 연습 파일
├── !DOCTYPE.html
└── site/                 # 메인 스터디 사이트
    ├── styles.css        # 공통 포털 스타일 (토큰·컴포넌트)
    ├── index.html        # 메인 (검색·바로가기·2단 레이아웃)
    ├── highlights.html   # 뉴스 (탭·순위 리스트)
    ├── features.html     # 서비스 허브
    ├── pricing.html      # 쇼핑·가격 카드
    ├── faq.html          # FAQ (details/summary)
    ├── sitemap.html      # 전체 페이지 맵
    ├── login.html        # 로그인 폼
    ├── signup.html       # 회원가입 (유효성 속성)
    ├── search.html       # 검색결과·필터
    ├── board.html        # 게시판 (table·페이징)
    ├── board-view.html   # 글 상세·댓글
    ├── board-write.html  # 글쓰기·첨부
    ├── gallery.html      # 이미지 그리드
    ├── calendar.html     # 7열 캘린더
    ├── contact.html      # 1:1 문의 폼
    ├── mypage.html       # 마이페이지·탭
    ├── notice.html       # 공지 목록
    ├── solitaire.html    # 솔리테어 게임
    ├── solitaire.css
    └── solitaire.js
```

---

## 페이지별 기능·학습 포인트

### 포털 · 콘텐츠
| 페이지 | 핵심 UI | CSS/HTML 연습 |
|--------|---------|----------------|
| `index.html` | 검색창, 8+ 바로가기, 뉴스 패널, 로그인 박스, 2단 `grid` | sticky 헤더, `portal` 레이아웃, 카드 호버 |
| `highlights.html` | 탭, 순위 뉴스 리스트 | `.tab--active`, ellipsis, 순위 색상 |
| `features.html` | 서비스 그리드 | `.svcGrid`, 링크 허브 |
| `pricing.html` | 상품 카드, 멤버십 비교 | 가격 타이포, 추천 플랜 강조 |
| `faq.html` | FAQ 아코디언 | `<details>` / `<summary>` |
| `notice.html` | 공지 리스트 | badge, 날짜 정렬 |
| `sitemap.html` | 3열 사이트맵 | 카테고리별 링크 구조 |

### 회원 · 폼
| 페이지 | 핵심 UI | 연습 |
|--------|---------|------|
| `login.html` | id/pw, checkbox | `.form`, `:focus` 링 |
| `signup.html` | email, radio, date, pattern | HTML5 validation |
| `mypage.html` | 프로필, 탭 | `.pageTab`, 2단 카드 |
| `contact.html` | select, file, 2단 레이아웃 | `.layout2`, 사이드 안내 |

### 게시판 · 검색
| 페이지 | 핵심 UI | 연습 |
|--------|---------|------|
| `search.html` | 필터 사이드바, 결과 카드 | `.searchLayout` |
| `board.html` | `<table>`, pagination | `.table`, `.pagination` |
| `board-view.html` | 본문, 댓글 | breadcrumb, `.article` |
| `board-write.html` | textarea, file | 폼 전송 UI |

### 미디어 · 기타
| 페이지 | 핵심 UI | 연습 |
|--------|---------|------|
| `gallery.html` | 4열 그리드, hover 확대 | `aspect-ratio`, transform |
| `calendar.html` | 7열 달력 | CSS Grid, 오늘 강조 |

### 게임 (JavaScript)
| 페이지 | 설명 |
|--------|------|
| `solitaire.html` | **클론다이크 솔리테어** — 스톡/웨이스트/완성 더미/7열, 클릭·더블클릭 이동, 점수·타이머, 승리 모달 |

---

## CSS 아키텍처 분석 (`styles.css`)

### 1. 디자인 토큰 (`:root`)
- `--green`, `--green-dark`, `--green-light` — 브랜드 컬러
- `--bg`, `--surface`, `--text`, `--muted`, `--line` — 표면·텍스트 계층
- `--container`, `--radius`, `--shadow` — 레이아웃·깊이

### 2. 레이아웃 패턴
| 클래스 | 용도 |
|--------|------|
| `.container` | 최대 너비 1100px 중앙 정렬 |
| `.portal` | 메인 2단 (콘텐츠 + 사이드바) |
| `.grid--2/3/4` | 반응형 카드 그리드 |
| `.searchLayout` | 검색 필터 + 결과 |
| `.layout2` | 폼 + 사이드 2단 |

### 3. 컴포넌트
- **헤더**: `.topbar`, `.header`, `.nav`, `.btn`
- **검색**: `.searchBox`, `.searchHero`
- **콘텐츠**: `.panel`, `.card`, `.newsList`, `.tabs`
- **폼**: `.form`, `.input`, `.checkbox`, `.pagination`
- **게시판**: `.table`, `.article`, `.comment`

### 4. 반응형 (`@media`)
- **960px 이하**: 네비 숨김, 2단→1단, 그리드 2열
- **560px 이하**: 헤더 액션 숨김, 1열, 검색 로고 축소

---

## 솔리테어 구현 분석 (`solitaire.js`)

- **규칙**: Klondike, Draw 1, 빨강/검정 교차, K on empty, A→K foundation
- **상태**: `stock`, `waste`, `foundations[4]`, `tableau[7]`
- **조작**: 카드 클릭 선택 → 목적지 클릭 / 더블클릭 자동 foundation
- **검증**: `isValidTableauStack`, `canPlaceOnTableau`, `canPlaceOnFoundation`
- **UI**: 초록 펠트 배경, 카드 DOM 동적 렌더, 이동·점수·타이머

---

## 실행 방법

1. 저장소 클론
   ```bash
   git clone https://github.com/Jerry97s/Publishing_.git
   cd Publishing_
   ```
2. 브라우저에서 `site/index.html` 열기 (더블클릭 또는 Live Server)
3. 솔리테어: `site/solitaire.html`

> GitHub Pages 사용 시: Settings → Pages → Source `main` / folder `/site` → `https://jerry97s.github.io/Publishing_/`

---

## 기술 스택

- HTML5 (시맨틱: `header`, `nav`, `main`, `section`, `article`, `footer`)
- CSS3 (Flexbox, Grid, custom properties, media queries)
- Vanilla JavaScript (솔리테어만)

---

## 스터디 추천 순서

1. `styles.css`의 `:root` 색상 변경 → 전체 톤 바꿔보기  
2. `index.html` → `highlights.html` 카드/리스트 복제  
3. `board.html` → `board-view.html` 테이블·상세 흐름  
4. `login.html` / `signup.html` 폼 속성 실험  
5. `solitaire.js`에서 `render`, `tryMoveToTableau` 읽으며 로직 이해  

---

## 향후 확장 아이디어

- [ ] GitHub Pages 배포  
- [ ] 모바일 햄버거 메뉴  
- [ ] 다크 모드 (`body.dark` + 토큰 스왑)  
- [ ] 솔리테어 실행 취소(undo 스택)  
- [ ] 스파이더 / 프리셀 추가  

---

## 라이선스·유의

- **StudyPort**는 학습용 템플릿이며, 실제 네이버(NAVER)와 무관합니다.  
- UI는 포털·솔리테어 **스타일 참고** 수준입니다.

---

## 작성 정보

- Repository: [Jerry97s/Publishing_](https://github.com/Jerry97s/Publishing_)
- 브랜치: `main`
