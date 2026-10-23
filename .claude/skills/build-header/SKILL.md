---
name: build-header
description: 기획서(Figma) 또는 사이트맵 구글 시트 URL을 받아 메뉴 구조를 2depth까지 분석하고, Figma 디자인 시스템 Layout > Sidebar 컴포넌트의 list를 Menu(isOpen·isActive 변형, showIcon) / MenuItem(isActive 변형) Instance로 구성한 뒤, 사이트맵의 화면 기획서 시트를 읽어 Figma Pages 페이지에 페이지별 프레임(Header + Sidebar active 상태 + 제목)을 만드는 스킬. "build-header", "사이트맵으로 피그마 헤더/사이드 메뉴 만들어줘", "기획서 메뉴 구조로 Sidebar 구성해줘", "사이트맵대로 피그마 페이지 만들어줘" 같은 요청에서 사용한다. Figma 파일만 수정하며 프로젝트 소스 코드(SideNav.jsx 등)는 절대 수정하지 않는다 (코드 반영은 create-header 스킬).
---

# /build-header

## 목적

사이트맵(구글 시트) 또는 기획서(Figma)에서 메뉴 구조를 **2depth까지** 읽어 Figma에 아래 두 가지를 만든다.

1. **사이드바 메뉴:** 디자인 시스템 **Layout > `Sidebar` 컴포넌트의 `list`** 를 사이트맵 메뉴로 구성한다.
2. **페이지 프레임:** 사이트맵의 화면 기획서 시트를 읽어 **Pages 페이지의 새 구역**에 페이지별 프레임을 만든다. 각 프레임의 사이드바는 그 페이지에 맞게 1depth·2depth가 active 상태다.

- **결과물은 Figma 파일 수정뿐이다.** 프로젝트 소스 코드(`SideNav.jsx`, `paths.js`, `theme.js`, 에셋 등)는 만들거나 수정하지 않는다. 사용자가 "SideNav"라고 말해도 Figma `Sidebar`를 뜻한다.
- 새 컴포넌트를 만들지 않는다. `Menu` / `MenuItem` 컴포넌트의 Instance를 쓰고, 문구·상태는 Instance 속성과 override로 바꾼다.

## 0. 사전 준비

- `figma:figma-use` 스킬을 먼저 로드한다.
- 디자인 시스템 파일: `https://www.figma.com/design/xHDoGiS1XI5eVkCDSRw1qy`

  | 컴포넌트 | 위치 / node-id | 역할 |
  |---|---|---|
  | `Sidebar` | Layout `421:63` | **사이드바 메뉴 생성 위치.** `profile` / `controller` / **`list`**(`421:95`, 메뉴 목록) |
  | `Menu` (Component Set) | Layout `502:132` | `list` 안의 1depth 메뉴 카드 |
  | `MenuItem` (Component Set) | Layout `515:160` | `Menu` 펼침 상태 안의 2depth 메뉴 |
  | `Header` | Layout `419:4085` | 상단 바 (Logo + btn-group). 메뉴 영역 없음 → 수정하지 않음 |
  | `SubTitle` | Components `147:853` | **페이지 제목.** 텍스트 2개: `서브페이지 제목영역`(Pretendard SemiBold 24) / `서브페이지 텍스트영역`(Pretendard Regular 16). 컴포넌트 속성 없음 → 텍스트 override로 문구를 넣는다 |
  | Pages 페이지 | `333:750` | **페이지 프레임 생성 위치** (기존 `관리` 구역 오른쪽에 새 구역) |

  `Menu` 속성:
  - **상태값은 2개다: `isOpen`(펼침)과 `isActive`(현재 메뉴). 둘은 독립이다 — `isOpen`을 active 표시로 쓰지 않는다.**
  - `isOpen` (변형, `false`/`true`) — 펼침 여부만 뜻한다.
    - `isOpen=false`: 접힌 카드 (레이어 `false`: 메뉴명 + `>` 아이콘)
    - `isOpen=true`: 펼친 카드 (레이어 `true` → `information/name` 메뉴명 + `^` 아이콘, `btn-group` 안에 `MenuItem` Instance 3개)
  - `isActive` (변형, `false`/`true`) — 현재 페이지가 속한 1depth인지.
    - `false`: 메뉴명 Medium, 배경 `layout/sideBarCardBG`
    - `true`: 메뉴명 Bold, 배경 `layout/sideBarCardActive`
  - variant 4개: `isOpen=false, isActive=false` / `isOpen=false, isActive=true` / `isOpen=true, isActive=false` / `isOpen=true, isActive=true`
  - `showIcon` (불리언, 기본 `true`) — 화살표 아이콘 표시. **하위 메뉴가 없는 1depth는 `false`.**
  - **`Menu`에 `isActive` 변형이 없으면** (예전 구조: `isOpen`만 있음) 작업 전에 보고하고, 승인받으면 위 4개 조합으로 확장한다:
    - 기존 variant 이름에 `, isActive=false`를 붙이고, 각각 `clone()`해 `, isActive=true` variant를 만든다 (메뉴명 Bold + 배경 `layout/sideBarCardActive` 변수 바인딩).
    - **`clone()`하면 `componentPropertyReferences`가 빠진다.** 복제한 variant의 `ico/*` 아이콘에 `{visible: 'showIcon#…'}`을 다시 연결하고, 하위 없는 메뉴 스크린샷에서 `>`가 안 보이는지 확인한다.

  `MenuItem` 속성:
  - `isActive` (변형, `false`/`true`) — `true` = 현재 페이지 = **굵은 글씨만** (빨간 점 없음)
  - `label` (텍스트, 키 `label#515:0`) — 메뉴 문구
  - `Menu` 안의 `MenuItem`은 노출된 Instance라서 Sidebar Instance 안에서도 `setProperties`로 바로 바꿀 수 있다.

- node-id와 속성 키(`label#515:0`, `showIcon#516:0` 등)는 바뀌었을 수 있다. 이름으로 다시 찾고 `componentPropertyDefinitions`로 키를 확인한다. 구조가 위 설명과 다르면 실제 구조를 따르고 보고한다.

### 폰트

`Menu`·`SubTitle` 등은 **Pretendard**를 쓴다. 이 환경에서 Pretendard를 로드할 수 없으면:

- **묻지 않고 Noto Sans KR로 대체한다 (기본값).** 텍스트 수정 전에 **먼저 `fontName`을 Noto Sans KR 같은 굵기로 바꾼 뒤** `characters`를 바꾼다 (Bold→Bold, Medium→Medium, Regular→Regular, SemiBold→Bold). 대체한 텍스트는 보고한다.
- Pretendard 텍스트가 든 Instance(`SubTitle` 등)는 그대로는 다른 프레임에 `appendChild`/`insertChild`할 수 없다 (`unloaded font "Pretendard …"` 오류).
  **Instance를 만든 직후, 넣기 전에** 그 안의 모든 텍스트 `fontName`을 Noto Sans KR로 바꾸면 Instance 그대로 넣을 수 있다. raw 프레임·텍스트로 다시 그리지 않는다.
  ```js
  const st = subTitleComp.createInstance();            // 아직 페이지에 붙어 있는 상태
  for (const t of st.findAll(n => n.type === 'TEXT')) {
    const nf = { family: 'Noto Sans KR', style: ({ SemiBold: 'Bold' })[t.fontName.style] || t.fontName.style };
    await figma.loadFontAsync(nf); t.fontName = nf;
  }
  // 문구 설정 후 content.appendChild(st)
  ```
- `use_figma` 스크립트는 오류 시 전체가 롤백된다. 오류가 나면 캔버스가 바뀌지 않았음을 확인하고 고쳐서 다시 실행한다.

## 1. 입력 확인 (필수 게이트)

| 입력 | 형태 | 필수 |
|---|---|---|
| 기획서 / 사이트맵 | 구글 시트 URL 또는 Figma URL | **필수** |
| 생성 위치 | Figma URL | 선택 — 없으면 사이드바는 **Layout > `Sidebar`**, 페이지는 **Pages 페이지 새 구역** (묻지 않음) |

- 기획서 URL이 없으면 작업하지 말고 요청한 뒤 턴을 끝낸다:
  > 메뉴 구성을 위해 사이트맵 구글 시트 URL 또는 기획서(Figma) URL을 전달해 주세요.
- URL에서 `fileKey`, `node-id`(`-` → `:`), 시트 `gid`를 추출한다.

## 2. 사이트맵 분석 (2depth까지)

### 2-1. 구글 시트

- `https://docs.google.com/spreadsheets/d/{id}/export?format=csv&gid={gid}`로 받는다. 읽을 수 없으면(비공개) 공유 설정 변경 또는 CSV 전달을 요청한다.
- 열 이름으로 depth를 판단한다.
  - 1depth: `1depth`, `대메뉴`, `메뉴명`, `GNB`
  - 2depth: `2depth`, `중메뉴`, `하위메뉴`, `서브메뉴`
  - 도메인: `domain`, `도메인` → 페이지 프레임 이름에 쓴다
  - 화면 기획서 링크(구글 시트 URL) → 2-3에서 페이지 목록을 읽는다
  - 3depth 이상 열은 구성하지 않고 무시한 항목을 보고한다.
- 1depth 칸이 비어 있고 2depth만 있으면 **바로 위 행의 1depth**에 속한다.
- 1depth만 있는 행 = 하위 없는 1depth. 공백만 있는 행은 무시한다.
- 열 매핑을 정할 수 없으면 추측하지 말고 묻는다.

### 2-2. Figma 기획서

- `get_metadata`로 구조, `get_screenshot`으로 GNB·사이드 메뉴를 확인한다. 사이트맵 표/프레임이 있으면 우선한다.
- 1depth 메뉴명이 화면마다 다르면 화면들을 묶는 **섹션 프레임 이름**을 1depth로 쓴다.

### 2-3. 페이지 목록 (화면 기획서 시트)

각 메뉴 행의 화면 기획서 링크(같은 스프레드시트의 다른 `gid`)를 CSV로 받아 **구역 제목 행**으로 페이지를 나눈다.
**페이지(프레임) 이름은 그 페이지 시트에 적힌 이름을 따른다.** 임의로 `List` 등을 붙이지 않는다.

| 시트 내용 | 페이지 프레임 이름 |
|---|---|
| 구역 제목에 도메인이 붙어 있음 (`ConfirmList`, `ConfirmDetail`) | 제목 그대로 하나씩 → `ConfirmList`, `ConfirmDetail` |
| 구역 제목에 도메인이 없음 (`Index`) | 도메인 + 제목 → `NoticeIndex`, `ClientIndex` |
| 기획서 링크 없음 | 도메인 + `Index` → `ManualIndex` (빈 페이지) |

- 구역 제목 행 = 첫 칸에만 값이 있고 나머지가 빈 행.
- 한 시트에 구역이 여러 개면 모두 같은 2depth에 속한 페이지다 (4-1에서 나란히 배치).
- 페이지 이름 규칙이 애매하면(한글 제목, `Sheet1` 등) 묻는다.

### 2-4. 규칙

- **메뉴 문구는 기획서 그대로.** 의역·축약·띄어쓰기 수정 금지 (시트가 "수동처리"면 "수동 처리"로 고치지 않는다). 순서도 그대로.
- 판단이 안 서는 항목(depth 애매, 중복 메뉴명, 빈 메뉴명)은 근거와 함께 묻는다.

### 2-5. 구성 계획 보고

Figma를 수정하기 전에 보여주고 진행 여부를 확인한다.

```
사이드바: Layout > Sidebar (421:63) > list

| 1depth | 2depth | Menu |
|---|---|---|
| 공지사항 | — | isOpen=false, isActive=false, showIcon=false |
| 인증관리 | 회원 리스트 조회 / 승인 관리 / 수동처리 | isOpen=true, isActive=false, MenuItem 3개 (모두 isActive=false) |

페이지: Pages > 새 구역 "사이트맵 페이지"

| 구역(1depth) | 행(2depth) | 페이지 (시트 이름) | 근거 |
|---|---|---|---|
| 공지사항 | — | NoticeIndex | 시트 Index |
| 인증관리 | 회원 리스트 조회 | ClientIndex | 시트 Index |
| 인증관리 | 승인 관리 | ConfirmList · ConfirmDetail (나란히) | 시트 ConfirmList / ConfirmDetail 구역 |
| 인증관리 | 수동처리 | ManualIndex | 기획서 링크 없음 → 빈 페이지 |
```

## 3. 사이드바 메뉴 구성 (Layout > Sidebar > list)

`Sidebar`는 메인 컴포넌트이므로 detach 없이 `list`에 직접 자식을 넣을 수 있다.

1. `list` 안의 기존 `Menu` Instance를 지운다. `empty` 텍스트(숨김)는 그대로 두고, 새 메뉴는 `empty` 앞에 넣는다.
2. 사이트맵 1depth 순서대로 `Menu` Instance를 만들고 `layoutSizingHorizontal = 'FILL'`.
   - 모든 `Menu`는 `isActive=false` (기본 상태엔 현재 메뉴가 없다).
   - 하위 없는 1depth → `isOpen=false`, `showIcon=false`.
   - 하위 있는 1depth → `isOpen=true` (하위 메뉴 목록이 보이는 기준 상태). 모든 `MenuItem`은 `isActive=false`.
   - 페이지별 active는 이 기본 상태를 쓰는 각 페이지 프레임의 Sidebar Instance에서 바꾼다 (4-3).
3. 1depth 메뉴명: `isOpen=false`면 `false` 레이어 텍스트, `isOpen=true`면 `true > information > name` 텍스트. 두 레이어 모두 같은 문구로 맞춘다.
4. 2depth: `true > btn-group` 안의 `MenuItem` Instance에 순서대로 `label`을 넣고 `isActive=false`.
   - 2depth가 `MenuItem`보다 **적으면** 남는 `MenuItem`은 `visible = false`.
   - 2depth가 `MenuItem`보다 **많으면** detach·복제하지 말고 멈추고 묻는다 (`Menu`에 `MenuItem` 추가 / 일부만 표시).
5. `profile`, `controller` 영역과 `Header`는 건드리지 않는다.
6. `Sidebar`를 쓰는 다른 화면에 자동 반영된다는 점을 보고한다.

주의:
- Instance 안 자식에는 `layoutSizingHorizontal`을 설정하지 않는다 (`node does not exist` 오류).
- 메뉴명이 카드 너비를 넘치면 줄이지 말고 스크린샷으로 확인해 보고한다.

## 4. 페이지 프레임 구성 (Pages 페이지)

### 4-1. 위치

- **1depth마다 구역(Section)을 따로 만든다.** 구역 이름 = 1depth 메뉴명 (예: `공지사항`, `인증관리`).
  - 구역들은 기존 노드와 겹치지 않게 Pages 페이지 오른쪽 빈 곳에 세로로 쌓는다 (구역 사이 200).
  - 같은 이름 구역이 이미 있으면 새로 만들지 말고 그 안의 같은 이름 프레임을 갱신할지 묻는다.
- **구역 안 배치:**
  - 2depth마다 한 **행**. 행 순서 = 사이트맵 2depth 순서.
  - **같은 2depth에 속한 페이지는 같은 행에 나란히** 둔다 (예: `ConfirmList` 옆에 `ConfirmDetail`). 순서는 시트 구역 순서.
  - 하위 없는 1depth는 행 하나에 그 페이지만.
  - 간격: 구역 안쪽 여백 100, 프레임 사이 가로·세로 200. 구역 크기는 안의 프레임에 맞춘다.
- 기존 구역(`관리` 등)의 프레임은 건드리지 않는다. 기존 프레임의 Instance가 비어 보이면(자식 0개) 수정하지 말고 보고한다.

### 4-2. 프레임 구조 (페이지마다)

```
{PageName}            ← auto-layout VERTICAL, 너비 1920, 흰 배경, 높이 hug
├─ Header             ← Header Instance (FILL)
└─ body               ← auto-layout HORIZONTAL, 높이 900
   ├─ Sidebar         ← Sidebar Instance (detach 하지 않음, 높이 FILL)
   └─ content         ← auto-layout VERTICAL, padding 48, 배경 #F9F9FD, FILL
      └─ SubTitle     ← SubTitle Instance (Components 147:853, detach 하지 않음, 너비 FILL)
```

- 페이지 본문(테이블 등)은 만들지 않는다 → `build-table` 스킬로 안내한다.

**페이지 제목 = `SubTitle` 컴포넌트 Instance** (raw 텍스트·프레임으로 제목을 만들지 않는다)
- `서브페이지 제목영역` 텍스트 = 메뉴 문구 그대로 (2depth가 있으면 2depth 문구, 하위 없는 1depth면 1depth 문구). 같은 2depth의 페이지(`ConfirmList`·`ConfirmDetail`)는 같은 제목.
- `서브페이지 텍스트영역` 텍스트 = 사이트맵·화면 기획서에 페이지 설명이 있으면 그 문구, 없으면 `visible = false` (임의 설명 문구를 만들지 않는다).
- Pretendard를 로드할 수 없으면 **넣기 전에** 텍스트 폰트를 Noto Sans KR로 바꾼다 (위 폰트 절 코드). 결과 보고에 대체 사실을 적는다.
- `SubTitle`이 Components 페이지에 없거나 구조(텍스트 2개)가 다르면 raw로 대신 그리지 말고 멈추고 보고한다.

### 4-3. 페이지별 active 상태 (Sidebar Instance 안에서 설정)

| 대상 | 활성 페이지일 때 | 아닐 때 |
|---|---|---|
| 하위 있는 1depth `Menu` | `isOpen=true, isActive=true` | `isOpen=false, isActive=false` |
| 하위 없는 1depth `Menu` | `isOpen=false, isActive=true`, `showIcon=false` | `isOpen=false, isActive=false`, `showIcon=false` |
| 2depth `MenuItem` | `isActive=true` (굵은 글씨) | `isActive=false` |

- 하위 없는 1depth의 active는 **`isActive=true`만으로** 표시한다. `isOpen=true` + `btn-group` 숨김 같은 우회는 쓰지 않는다.
- 같은 2depth에 속한 페이지(예: `ConfirmList`, `ConfirmDetail`)는 모두 그 2depth가 active다.
- `isOpen`/`isActive`를 바꾼 뒤에는 보이는 레이어의 메뉴명을 다시 넣고, 폰트 굵기를 `isActive`에 맞춘다 (true=Bold, false=Medium).
- **detach하지 않는다.** 상태는 모두 Instance 속성(`Menu`의 `isOpen`·`isActive`·`showIcon`, `MenuItem`의 `isActive`)과 텍스트 override로만 바꾼다.

### 4-4. 검증

- 페이지마다 Sidebar의 `Menu`·`MenuItem` 속성값을 읽어 표로 확인한다 (스크린샷이 빈 화면으로 나올 수 있으므로 값 확인이 필수).
- 사이드바 `list` 스크린샷을 1~2장 찍어 아이콘·굵은 글씨·펼침 상태를 눈으로 확인한다.
- 페이지마다 제목이 `SubTitle` Instance인지(`mainComponent` = `SubTitle`), 제목 문구가 메뉴 문구와 같은지 확인한다.

## 5. 결과 보고

```
사이드바: Layout > Sidebar (421:63) > list
| 1depth | 2depth | Menu | 비고 |
|---|---|---|---|

페이지: Pages > 구역 공지사항 ({id}) / 인증관리 ({id})
| 구역(1depth) | 행(2depth) | 페이지 | 1depth active | 2depth active | 비고 |
|---|---|---|---|---|---|

Noto Sans KR로 대체한 텍스트 / 숨긴 MenuItem / 무시한 3depth / 확인 필요 항목: …
```

코드 반영이 필요하면 `create-header` 스킬, 페이지 본문 테이블은 `build-table` 스킬로 이어서 작업하도록 안내한다.

## 보고 언어

- 구성 계획 보고, **확인 메시지(질문·진행 여부 확인·멈춤 안내)**, 결과 보고는 **모두 한글로** 작성한다. 코드·컴포넌트명·node-id 같은 식별자만 원문 그대로 둔다.
- **보내기 직전 점검:** 메시지 전체를 다시 읽고 영어 문장(제목·표 헤더·설명 포함)이 하나라도 있으면 한글로 바꾼 뒤 보낸다. 작업을 중간에 멈추고 묻는 메시지도 예외가 아니다.
- 작업이 끝나면 한글로 완료 보고를 한다 (무엇을 했는지 / 못 한 것 / 확인 필요 항목).

## 체크리스트

- [ ] 구성 계획 보고·질문·결과 보고를 한글로 작성했는가 (식별자 제외)
- [ ] 기획서/사이트맵 URL을 받은 뒤 시작했는가
- [ ] Pretendard를 로드할 수 없을 때 묻지 않고 Noto Sans KR로 대체하고, 대체 목록을 보고했는가
- [ ] 2depth까지만 구성하고 3depth 이상은 보고했는가
- [ ] 작업 전 구성 계획 표(사이드바 + 페이지)로 확인받았는가
- [ ] 메뉴 문구·순서가 기획서와 정확히 같은가
- [ ] 하위 없는 1depth는 `showIcon=false`인가
- [ ] 화면 기획서 시트의 구역 제목으로 페이지를 나눴는가 (예: ConfirmList + ConfirmDetail)
- [ ] 페이지 이름이 시트에 적힌 이름과 같은가 (`Index` → `{도메인}Index`, `List`를 임의로 붙이지 않음)
- [ ] 1depth마다 구역을 따로 만들었는가
- [ ] 같은 2depth의 페이지를 같은 행에 나란히 두었는가
- [ ] 페이지마다 1depth(`Menu isActive=true`, 하위 있으면 `isOpen=true`)와 2depth(`MenuItem isActive=true`)가 모두 active이고, 나머지는 비활성인가
- [ ] `isOpen`(펼침)과 `isActive`(현재 메뉴)를 따로 설정했는가 — `isOpen`을 active 표시로 쓰지 않았는가
- [ ] active 표시에 빨간 점이 없는가 (굵은 글씨만)
- [ ] 페이지 제목을 `SubTitle` Instance로 넣었는가 (raw 텍스트·프레임 금지, 설명 텍스트는 기획서에 없으면 숨김)
- [ ] Sidebar·Menu·SubTitle을 detach하지 않았는가
- [ ] 남는 MenuItem은 숨기고, 부족하면 묻고 멈췄는가
- [ ] 새 컴포넌트를 만들지 않았는가
- [ ] **소스 코드를 하나도 수정하지 않았는가**
