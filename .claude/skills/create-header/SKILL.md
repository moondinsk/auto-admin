---
name: create-header
description: 디자인 시스템(Figma Layout > Header)과 기획서(사이트맵 구글 시트 또는 Figma)를 읽어 관리자 페이지의 헤더(GNB)를 만들고, 기획서의 페이지 프레임을 분석해 src/pages 아래 페이지 파일과 라우터, SideNav 사이트맵까지 구성하는 스킬. "헤더 만들어줘", "create-header", "GNB 세팅해줘", "기획서대로 메뉴/라우터 구성해줘", "로고 넣고 헤더 잡아줘" 같은 요청에서 사용한다. 디자인 시스템 URL과 기획서 URL 중 하나 이상이 있어야 실행하며, 하나만 있으면 가능한 단계만 수행한다.
---

# 헤더 + 페이지 + 라우터 생성

디자인 시스템 Figma의 Logo / **Layout 페이지 `Header` 컴포넌트**와, 기획서(사이트맵 시트 또는 Figma 페이지 프레임)를 근거로
1. 헤더 로고(브랜드) 세팅
2. 헤더 메뉴(1depth 또는 2depth) 구성
3. 메뉴에 필요한 페이지 파일 생성 (`src/pages/{Domain}/...`)
4. 생성한 페이지로 라우터 구성 (`src/routes/paths.js`, `src/routes/router.jsx`)
5. `SideNav.jsx`에 사이트맵(메뉴 목록) 생성

을 한 번에 처리한다. **페이지는 레이아웃 뼈대만 만들고 기능(API, 상태 로직)은 만들지 않는다.**

## 핵심 원칙

1. **자료가 하나 이상 있어야 시작한다.** 둘 다 없으면 어떤 파일도 만들거나 수정하지 않는다. 하나만 있으면 가능한 단계만 수행한다.
2. **이름은 출처 그대로.** 메뉴 라벨은 기획서 헤더에 적힌 문구 그대로, 도메인/파일명은 Figma 프레임명 그대로 쓴다. 의역·축약 금지.
3. **하드코딩 금지.** 색상·폰트·간격은 `@/styles/theme`에서만 가져온다(`tokens` 직접 import 금지). 대응하는 Semantic 토큰이 없으면 임의 hex를 넣지 말고 사용자에게 어떻게 할지 묻는다.
4. **판단이 안 서면 묻는다.** depth 판정, 프레임명이 규칙에 안 맞는 경우, CRUD 여부가 모호한 경우 등은 추측하지 말고 확인한다.

## 0단계 — 필요한 자료 확인 (필수 게이트)

필요한 자료:

| 자료 | 형태 | 용도 |
|---|---|---|
| 디자인 시스템 URL | 대체로 `figma.com/design/{fileKey}/...` | Logo, Layout 페이지 `Header` 컴포넌트 (헤더 디자인), Layout 페이지 `Sidebar` 컴포넌트 (사이트맵 디자인) |
| 기획서 URL | 사이트맵 구글 시트, 또는 `figma.com/design/{fileKey}/...` | 메뉴 구성, 페이지(도메인) 목록 |

- 사용자 메시지(또는 대화 맥락)에서 두 URL을 찾는다.
- **둘 다 없으면 작업을 시작하지 말고** 아래처럼 요청한 뒤 턴을 끝낸다:
  > 헤더 생성을 위해 아래 자료 중 하나 이상이 필요합니다. 전달해 주세요.
  > 1. 디자인 시스템 URL (Figma)
  > 2. 기획서 URL (사이트맵 구글 시트 또는 Figma)
- **하나만 있어도 진행한다.** 받은 자료로 할 수 있는 단계만 수행하고, 없는 자료 때문에 건너뛴 단계는 마지막에 보고한다.

  | 받은 자료 | 수행 | 건너뜀 |
  |---|---|---|
  | 둘 다 | 전 단계 | — |
  | 디자인 시스템만 | 2단계(로고), **3-1 페이지 프레임 수집(디자인 파일 대체)**, 4~5단계(페이지 생성, 라우터), 6단계 Layout `Header` 적용 + 메뉴 데이터 | 3-2의 기획서 메뉴 분석 (메뉴 라벨·depth는 사용자에게 확인) |
  | 기획서만 | 3~5단계, 6단계 메뉴 데이터(`HEADER_MENU`), 7단계 SideNav 사이트맵 마크업 | 2단계(로고는 기존 `icon-logo.*` 유지), Layout `Header`·`Sidebar` 디자인 적용 (기존 `Header`·`SideNav` 스타일 유지) |

- 받은 각 URL에서 `fileKey`와 `node-id`(있으면, `-`를 `:`로 변환)를 추출한다.
- 디자인 시스템 URL은 이번 메시지에 없어도 대화 맥락에 있으면 그것을 쓴다.
- 구글 시트는 `/export?format=csv&gid={gid}`로 받아 읽는다. Figma·시트가 아닌 기획서(문서/PDF 등)가 오면 읽을 수 있는 형태인지 확인하고, 읽을 수 없으면 사용자에게 다른 형태를 요청한다.

## 1단계 — Figma 도구 준비

- `get_design_context`를 쓰기 전에 **`figma:figma-design-to-code` 스킬을 먼저 로드**한다.
- `use_figma`를 써야 하면 **`figma:figma-use` 스킬을 먼저 로드**한다.
- 구조 파악은 `get_metadata`, 시각 확인은 `get_screenshot`, 코드용 스타일 정보는 `get_design_context`로 한다.

## 2단계 — 브랜드 세팅 (로고)

1. 디자인 시스템 파일에서 `Logo` 컴포넌트/프레임을 찾는다 (`get_metadata`로 트리 탐색, 또는 `search_design_system`으로 "Logo" 검색).
   - 이름이 정확히 `Logo`가 아니어도(`logo`, `Brand/Logo` 등) 후보를 찾고, 여러 개면(가로형/심볼형 등) 헤더에 쓸 것을 사용자에게 확인한다.
2. 로고 노드에 `get_design_context`를 호출해 에셋(SVG 권장)을 받는다. 필요하면 `download_assets`를 쓴다.
3. `src/assets/icons/common/icon-logo.{svg|png}`에 저장한다 — 확장자는 받은 에셋 형식 그대로 (SVG가 아닌 PNG면 `.svg`로 저장하지 않는다). 형식이 바뀌면 이전 로고 파일을 지우고 import 경로를 맞춘다.
   - 이미 파일이 있어도 **묻지 않고 덮어쓴다.**
4. 로고 크기(width/height)는 Header 디자인에서 로고 인스턴스의 실제 크기를 따른다.

## 3단계 — 기획서 분석

### 3-0. 사이트맵 시트 (기획서가 구글 시트인 경우)

사이트맵 시트는 한 행이 메뉴 하나다: `1depth, 2depth, domain, 화면 기획서 링크` (예: `공지사항,,Notice,https://docs.google.com/...gid=1278383854`).
1depth 칸이 비어 있으면 바로 위 행의 1depth 아래 하위 메뉴다.

- **메뉴명** → `HEADER_MENU`의 `label` (문구 그대로), 행 순서 = 메뉴 순서.
- **도메인** → `src/pages/{도메인}/` 폴더명과 경로(`/{도메인 소문자}`). 시트 값을 그대로 쓴다.
- **화면 기획서 링크** → 페이지 본문(테이블 등)용. 이 스킬에서는 페이지 수·페이지명만 읽고(3-0-1), 본문 구성은 `create-table`로 넘긴다.
- 하위 메뉴 열이 없으면 1depth로 본다. 하위 메뉴 표기가 있으면 3-2 규칙으로 2depth를 판정한다.
- Figma 파일에 같은 도메인의 페이지 프레임(`{Domain}List` 등)이 있으면 메뉴↔프레임 짝을 확인하고, 안 맞는 것은 보고한다.

#### 3-0-1. 도메인 시트로 페이지 수 결정

사이트맵 주소만으로 도메인별 페이지 수를 정한다. **도메인명과 이름이 같은 시트**를 찾아 그 안의 페이지 표기를 센다.

1. 시트 탭 목록 읽기: `https://docs.google.com/spreadsheets/d/{id}/htmlview`를 받아 `{name: "...", ..., gid: "..."}` 항목에서 시트명과 gid를 모은다.
2. 도메인 ↔ 시트 매칭: 사이트맵의 `domain` 값과 시트명이 같은 시트를 찾는다 (대소문자 무시). 사이트맵 행의 링크 gid보다 **시트명 매칭을 우선**하고, 둘이 다르면 보고한다.
3. 도메인 시트를 `/export?format=csv&gid={gid}`로 받아 페이지 표기를 모은다. 두 가지 형식이 있다:
   - `page,{페이지명}` 행 (예: `page,NoticeList`, `page,NoticeRead`)
   - 첫 칸이 `{페이지명}/{컴포넌트}` (예: `ConfirmList/listTable`, `ConfirmDetail/formTable`, `ClientIndex/listTable`)
   같은 페이지명이 여러 번 나오면 하나로 센다.
4. 페이지 수에 따라 파일을 정한다:

   | 시트 결과 | 파일 | 컴포넌트명 |
   |---|---|---|
   | 페이지 1개 (`{Domain}Index`, `{Domain}List` 하나 등) | `src/pages/{Domain}/index.jsx` | `{Domain}` |
   | 페이지 여러 개 | 페이지명마다 `src/pages/{Domain}/{페이지명}.jsx` | 페이지명 |
   | 도메인 시트 없음 | `src/pages/{Domain}/index.jsx` (빈 페이지) | `{Domain}` |

   - 페이지명 접미사가 CRUD 규칙(`List`/`Register`/`Read`/`Modify`)과 다르면(`Detail`, `Create`, `Edit` 등) 3-1 규칙대로 바꿔 부를지 확인한다 (예: `ConfirmDetail` → `ConfirmRead`?).
   - 경로는 5단계 CRUD 경로 규칙을 따른다 (`List` = `/{domain}`, `Read` = `/{domain}/:id` …).
5. 결과(도메인 / 시트 안 페이지 표기 / 페이지 수 / 파일)를 3-3 계획 표에 반영해 확인받는다.

예 (현재 사이트맵 기준):

| 도메인 | 시트 표기 | 페이지 수 | 파일 |
|---|---|---|---|
| Notice | `page,NoticeList` / `page,NoticeRead` | 2 | `Notice/NoticeList.jsx`, `Notice/NoticeRead.jsx` |
| Client | `ClientIndex/listTable` | 1 | `Client/index.jsx` |
| Confirm | `ConfirmList/listTable` / `ConfirmDetail/formTable` | 2 | `Confirm/ConfirmList.jsx`, `Confirm/ConfirmRead.jsx`(이름 확인) |
| Manual | 시트 없음 | 1 | `Manual/index.jsx` (빈 페이지) |

### 3-1. 페이지 프레임 수집

기획서/디자인 파일에 `get_metadata`를 호출해 Pages 아래의 **최상위 Frame 이름**을 전부 수집한다.
(node-id가 특정 페이지를 가리키면 그 페이지부터, 아니면 파일 전체 Pages를 본다.)

**기획서가 없으면 건너뛰지 말고 디자인 시스템 파일에서 페이지 프레임을 찾는다.**
- 디자인 파일의 Figma 페이지 목록(`figma.root.children`)에서 화면 시안용 페이지(예: 이름이 `Pages`, `Screens`, `화면`인 페이지)를 찾아 최상위 Frame을 수집한다.
  (현재 디자인 시스템 파일 기준: `Pages` 페이지 `333:750` — `ProductList`, `ProductDetail`, `Home`)
- 디자인 시스템 구성용 페이지(`Design systems`, `function`, `Figma Annotations` 등)는 페이지 프레임이 아니므로 제외한다.
- 수집한 프레임과 아래 규칙으로 페이지·라우터를 만든다. 이미 있는 페이지(예: `Home`)는 건너뛴다.
- 디자인 파일에는 메뉴 문구가 없으므로 **메뉴 라벨과 depth는 사용자에게 확인**한다 (프레임 안 텍스트를 라벨로 추측하지 않는다).

프레임명 → 파일 규칙:

| 경우 | 프레임명 예 | 파일 |
|---|---|---|
| 도메인에 페이지가 **하나** (사이트맵에 그 도메인 행이 하나) | `Notice`, `NoticeList` | `src/pages/Notice/index.jsx` |
| 도메인에 페이지가 **여러 개** | `InquiryList`, `InquiryRegister`, `InquiryRead`, `InquiryModify` | `src/pages/Inquiry/InquiryList.jsx`, `InquiryRegister.jsx`, `InquiryRead.jsx`, `InquiryModify.jsx` |

- **도메인** = 프레임명에서 접미사(`List`/`Register`/`Read`/`Modify`)를 뗀 PascalCase 이름.
- **CRUD 네이밍은 `Register`(등록) / `Read`(상세) / `Modify`(수정)** 로 통일한다. 목록은 `List`.
  기획서 프레임명이 `Create`/`Detail`/`Edit`/`Write`/`Update` 등 다른 이름이면 위 규칙으로 바꿔 부를지 사용자에게 확인한다(프레임명과 파일명이 달라지는 유일한 예외).
- 프레임명이 한글이거나 규칙과 맞지 않으면(예: `문의 목록`, `Frame 12`) 도메인명을 추측하지 말고 사용자에게 매핑을 확인한다.
- 헤더/공통 컴포넌트/가이드용 프레임(예: `Header`, `Cover`, `Components`)은 페이지가 아니므로 제외한다. 애매하면 확인한다.
- 프레임명이 한글일 경우 파일명은 그대로 PascalCase로 변환한다. 예: `공지사항` → `Notice`, `상품 관리` → `ProductManagement`.

### 3-2. 헤더 메뉴와 depth 판정

기획서 안의 헤더(GNB) 영역을 찾아 메뉴 구조를 읽는다 (`get_screenshot`으로 눈으로도 확인).

- 최상위 메뉴만 있고 각 메뉴가 바로 한 페이지로 이동 → **1depth**
- 최상위 메뉴 아래에 하위 메뉴(서브 메뉴, 드롭다운, 2단 탭)가 있음 → **2depth**
- 하나라도 하위 메뉴가 있으면 전체를 2depth로 본다.
- **상위(1depth) 메뉴명이 화면마다 다르게 적혀 있으면**(GNB, 브레드크럼 등 표기가 엇갈림) 사용자에게 묻기 전에 `get_metadata`로 해당 페이지들을 **묶고 있는 섹션 프레임의 이름**을 확인하고, 그 이름을 1depth 메뉴명으로 쓴다. 화면 안 텍스트는 복붙 오류가 많고 섹션 프레임명이 기획 의도에 가깝다.
  예: `고객/계약관리` 프레임 안에 Contact 관리·거래처 관리 화면 → 1depth = "고객/계약관리" (GNB의 "고객·계약관리", 브레드크럼의 "거래처 및 계약 관리"는 무시)
- 기획서에 헤더가 명시돼 있지 않거나 depth가 애매하면 판정 근거와 함께 사용자에게 확인한다.
- 기획서 없이 디자인 파일 프레임으로 진행하는 경우, 도메인별 메뉴 라벨을 사용자에게 받는다 (선택지 예: 기능명 기반 "상품 관리", "메뉴에 넣지 않음").

메뉴 ↔ 페이지 매핑:
- 각 메뉴(1depth면 최상위, 2depth면 하위 메뉴)는 하나의 **도메인**에 연결된다.
- 메뉴 클릭 시 가는 곳은 그 도메인의 대표 페이지 — 여러 페이지 도메인이면 `{Domain}List`, 단일 페이지면 `{Domain}`.
- 메뉴에는 있는데 프레임이 없거나, 프레임은 있는데 메뉴에 없는 경우 목록으로 정리해서 사용자에게 보고하고 처리 방법을 확인한다.
- **기본값:** 메뉴(사이트맵 행)는 있는데 화면 기획서 링크도 Figma 프레임도 없으면 묻지 않고 **빈 페이지(제목만 있는 뼈대) + 라우트만 생성**한다. 결과 보고에 "기획 자료 없음 → 빈 페이지" 로 표시한다.

### 3-3. 작업 계획 보고

**시트(기획서)를 읽은 뒤, 작업을 시작하기 전에 반드시 페이지명과 저장 위치를 사용자에게 확인받는다.**
확인을 받기 전에는 어떤 파일도 만들거나 수정하지 않는다 (페이지, `paths.js`, `router.jsx`, `controller.js`, `SideNav.jsx`, 로고 포함).

- 아래 표에 메뉴별로 **페이지명(컴포넌트명)** 과 **저장 위치(전체 파일 경로)** 를 빠짐없이 적는다. `index`처럼 줄여 쓰지 않고 `src/pages/Notice/index.jsx`처럼 전체 경로를 적는다.
- 스타일 파일 경로(`src/pages/{Domain}/{Domain}.style.js`)와 URL 경로도 같이 적는다.
- 이미 있는 폴더/파일이 있으면 표에 표시한다 (예: "폴더 있음(비어 있음)", "파일 있음 → 건너뜀").
- 사용자가 페이지명이나 저장 위치를 바꾸라고 하면 표를 고쳐서 다시 보여주고 확인받은 뒤 시작한다.
- 확인 질문은 평문 메시지로 하고 턴을 끝낸다 (사용자의 답을 받은 뒤 4단계로 넘어간다).

```
depth: 2depth (헤더 디자인: Figma Layout > Header)

| 1depth 메뉴 | 2depth 메뉴 | 도메인 | 페이지명 | 저장 위치 | 경로 |
|---|---|---|---|---|---|
| 고객지원 | 1:1 문의 | Inquiry | InquiryList | src/pages/Inquiry/InquiryList.jsx | /inquiry |
| 고객지원 | 1:1 문의 | Inquiry | InquiryRegister | src/pages/Inquiry/InquiryRegister.jsx | /inquiry/register |
| 고객지원 | 공지사항 | Notice | Notice | src/pages/Notice/index.jsx | /notice |

스타일: src/pages/Inquiry/Inquiry.style.js, src/pages/Notice/Notice.style.js

위 페이지명과 저장 위치로 진행할까요? 바꿀 부분이 있으면 알려 주세요.
```

## 4단계 — 페이지 파일 생성

도메인마다 `src/pages/{Domain}/` 폴더를 만든다.

```
src/pages/
  Notice/                    ← 단일 페이지 도메인
    index.jsx
    Notice.style.js
  Inquiry/                   ← 여러 페이지 도메인
    InquiryList.jsx
    InquiryRegister.jsx
    InquiryRead.jsx
    InquiryModify.jsx
    Inquiry.style.js         ← 스타일은 폴더명.style.js 하나로 분리
```

- **스타일은 `{폴더명}.style.js`** 에 styled-components로 분리한다. 페이지 jsx 안에 styled 선언을 두지 않는다.
- 단일 페이지 도메인은 파일명이 `index.jsx`여도 **컴포넌트명은 도메인명**으로 짓는다 (`const Notice = () => ...; export default Notice;`). 스타일 파일은 똑같이 `{폴더명}.style.js`(예: `Notice.style.js`)다.
- 이미 존재하는 폴더/파일은 **덮어쓰지 않는다.** 없는 파일만 만들고, 기존 파일은 건너뛴 것을 보고한다.
- 페이지 내용은 뼈대만: 페이지 제목(기획서 메뉴명 그대로) 정도만 두고 기능 로직은 넣지 않는다.
  폼/테이블 레이아웃이 필요하면 이 스킬에서 만들지 말고 `create-table` 스킬로 이어서 작업하도록 안내한다 (사이트맵의 화면 기획서 링크를 넘긴다).

```jsx
// src/pages/Inquiry/InquiryList.jsx
import { PageTitle } from "./Inquiry.style";

const InquiryList = () => {
  return <PageTitle>1:1 문의</PageTitle>;
};

export default InquiryList;
```

```js
// src/pages/Inquiry/Inquiry.style.js
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const PageTitle = styled.h2`
  font-size: ${theme.typography.headingH1.fontSize};
  font-weight: ${theme.typography.headingH1.fontWeight};
`;
```

(위 theme 키는 예시다. 실제 `src/styles/theme.js`에 있는 키만 쓴다.)

## 5단계 — 라우터 구성

### paths.js

기존 `PATH`(절대경로) / `SEGMENT`(children용 상대경로) 구조를 유지하면서 추가한다. 키는 UPPER_SNAKE_CASE, URL은 kebab-case 소문자.

```js
export const PATH = {
  HOME: "/",
  INQUIRY: "/inquiry",
  NOTICE: "/notice",
};

export const SEGMENT = {
  FORBIDDEN: "403",
  INQUIRY: "inquiry",
  INQUIRY_REGISTER: "register",
  INQUIRY_READ: ":id",
  INQUIRY_MODIFY: ":id/modify",
  NOTICE: "notice",
};
```

CRUD 경로 규칙:

| 페이지 | 경로 |
|---|---|
| `{Domain}List` | `/{domain}` (index) |
| `{Domain}Register` | `/{domain}/register` |
| `{Domain}Read` | `/{domain}/:id` |
| `{Domain}Modify` | `/{domain}/:id/modify` |
| `{Domain}` (단일) | `/{domain}` |

### router.jsx

- 기존 방식대로 `lazy(() => import(...))`로 페이지를 불러오고, `Root`의 `children`에 추가한다.
- 여러 페이지 도메인은 도메인 경로 아래 중첩 children으로 묶는다.
- 기존 `index`(Home), `errorElement`, `PrivateRoute` 사용 여부는 건드리지 않는다.

```jsx
const InquiryList = lazy(() => import("../pages/Inquiry/InquiryList"));
const InquiryRegister = lazy(() => import("../pages/Inquiry/InquiryRegister"));
const Notice = lazy(() => import("../pages/Notice")); // 단일 페이지는 폴더(index.jsx)로 import
// ...

children: [
  { index: true, element: <Home /> },
  {
    path: SEGMENT.INQUIRY,
    children: [
      { index: true, element: <InquiryList /> },
      { path: SEGMENT.INQUIRY_REGISTER, element: <InquiryRegister /> },
      { path: SEGMENT.INQUIRY_READ, element: <InquiryRead /> },
      { path: SEGMENT.INQUIRY_MODIFY, element: <InquiryModify /> },
    ],
  },
  { path: SEGMENT.NOTICE, element: <Notice /> },
],
```

## 6단계 — 헤더 구현

### 메뉴 데이터

메뉴 구조는 `src/components/Header/controller.js`에 `HEADER_MENU`로 분리한다 (Header.jsx 안에 인라인 선언하지 않는다). 링크는 반드시 `PATH` 상수를 쓴다.

```js
// 1depth
export const HEADER_MENU = [
  { key: "notice", label: "공지사항", path: PATH.NOTICE },
];

// 2depth
export const HEADER_MENU = [
  {
    key: "support",
    label: "고객지원",
    children: [
      { key: "inquiry", label: "1:1 문의", path: PATH.INQUIRY },
      { key: "notice", label: "공지사항", path: PATH.NOTICE },
    ],
  },
];
```

### 디자인 적용 — Figma Layout > Header

- **헤더는 디자인 시스템 Layout 페이지의 `Header` 컴포넌트**(현재 파일 기준 `419:4085`)로 구현한다. `get_metadata`/`get_design_context`로 읽고 그대로 옮긴다. (`Header1Depth`/`Header2Depth`는 쓰지 않는다.)
  - 헤더 바: 배경·높이·패딩·정렬. 높이는 `theme.size.headerHeight`에 Figma 값으로 맞춘다 (`Root.style.js`·`SideNav.styles.js`가 이 값을 쓴다).
  - 로고: 2단계에서 저장한 `@/assets/icons/common/icon-logo.*`. 크기는 Header 안 로고 인스턴스 크기, 클릭 시 `PATH.HOME`, `alt`는 브랜드명.
  - 버튼 그룹(`btn-group`): 문구·아이콘·순서를 그대로 옮긴다. 버튼 기능(이동 경로, 다운로드 등)이 기획서에 없으면 핸들러를 달지 않는다.
    버튼은 기존 `Button` 컴포넌트를 재사용하고, 크기·패딩·글자 차이는 `Button`의 transient prop(`$padding`, `$fontSize` 등)으로 맞춘다.
  - **메뉴 영역:** Layout `Header`에 메뉴 영역이 있으면 그 디자인(기본/hover/active)대로 `HEADER_MENU`를 렌더링한다. active는 `NavLink`(또는 `useLocation`)로 현재 경로 기준 처리한다.
    메뉴 영역이 없으면 메뉴 노출 위치·스타일을 지어내지 말고 `HEADER_MENU` 데이터와 라우터까지만 만든 뒤 보고한다.
- 기존 `src/components/Header/Header.jsx`, `Header.styles.js`를 **수정**한다 (새 헤더 컴포넌트를 따로 만들지 않는다).
- **기본값:** 기존 예시용 버튼(`ACTIONS`: 컴포넌트-Table/Modal/Etc 링크)은 **그대로 둔다.** Layout `Header` 버튼 그룹(스크립트 설치 등)으로 바꾸지 않는다. 사용자가 교체를 요청할 때만 바꾼다.
- 색상·폰트·간격·높이는 `theme` 값으로 매핑한다 (Figma에서 Primitive에 직접 연결돼 있으면 create-design-system 3단계 규칙대로 Semantic 변수를 먼저 추가). Figma 변수(`get_variable_defs`)와 코드 토큰이 1:1로 대응되지 않으면 임의로 hex를 넣지 말고 사용자에게 확인한다.
- 헤더 높이가 바뀌면 `src/layouts/Root.style.js`의 본문 상단 여백(헤더가 `position: fixed`이므로)이 헤더를 가리지 않는지 확인한다.

## 7단계 — SideNav 사이트맵

사이트맵(메뉴 목록)을 `src/components/SideNav/SideNav.jsx`에 만든다. 헤더 메뉴와 같은 데이터를 쓰고, 디자인은 Figma Layout > `Sidebar`를 따른다.

### 데이터

- 6단계의 `HEADER_MENU`(`src/components/Header/controller.js`)를 import해서 그대로 쓴다. SideNav용 메뉴 배열을 따로 만들지 않는다 (메뉴가 바뀌면 한 곳만 고친다).
- 메뉴 순서·문구는 사이트맵 시트 그대로다. 링크는 `PATH` 상수.

### 디자인 — Figma Layout > Sidebar

- 디자인 시스템 Layout 페이지의 `Sidebar` 컴포넌트(현재 파일 기준 `421:63`)의 **`list` 영역(메뉴 카드 목록)** 을 `get_metadata`/`get_design_context`로 읽고 그대로 옮긴다.
  - 카드 = Figma `Menu` 컴포넌트 (변형 `isOpen`, 불리언 `showIcon`). 하위 메뉴 = `MenuItem` 컴포넌트 (변형 `isActive`).
  - 1depth 메뉴 = 접힌 `card` (`isOpen=false`: 배경, 크기, 패딩, 모서리, 메뉴 문구 글자, 카드 사이 간격).
  - 2depth 메뉴 = 펼친 `card` (`isOpen=true`: 카드 안에 `MenuItem` 목록). 상위 카드 클릭으로 펼침/접힘만 하고 그 외 기능은 넣지 않는다.
  - **아이콘:** 하위 메뉴가 있는 1depth만 화살표 아이콘(접힘 `>`, 펼침 `^`)을 그린다. **하위 메뉴가 없는 1depth(링크 카드)는 아이콘을 그리지 않는다** (Figma `showIcon=false`).
  - **active (현재 경로):**
    - 1depth active = `isOpen=true` 모양 (펼친 카드 배경 + 굵은 글씨). 하위 없는 1depth는 하위 목록 없이 이 모양만.
    - 2depth active = `MenuItem isActive=true` = **굵은 글씨만**. **빨간 점(강조 점)은 넣지 않는다.**
  - 1depth 메뉴(하위 없음)는 카드 전체가 `NavLink`, 2depth는 각 항목이 `NavLink`이고 `.active`로 위 스타일을 준다.
- 사이드바 너비·배경은 `Sidebar` 컴포넌트 값으로 맞추고, 너비는 `theme.size.sidebarWidth`에 Figma 값으로 넣는다.
- `Sidebar`의 나머지 영역(`profile`: 사용자/버전 만료, `controller`: 폴더 관리·폴더 추가·배너 복원, `empty` 안내 문구)은 사이트맵이 아니다. 이 스킬에서 만들지 않고, 필요하면 넣을지 사용자에게 묻는다.
- **색상 매칭 (기본값, 묻지 않음):** 사이드바 색상은 `theme.js`의 **기존 값 중 가장 가까운 색**에 매칭한다. 새 토큰을 추가하지 않는다.
  - 의미 키가 있으면 의미 키 (`layout.sidebarBG`, `layout.sidebarCardBG`, `gray.white`), 없으면 `theme.colors.palette.*` (예: 접힌 카드 `#44475C` → `palette.gray800`).
  - 대응 토큰이 없는 그림자 등 색 외 값은 넣지 않고 보고한다.
  - 색이 박힌 SVG 아이콘(화살표 등)은 에셋 그대로 쓴다.
- **Figma 변수 연결 (기본값):** 코드에서 매칭한 색을 Figma `Sidebar`/`Menu`에도 변수로 연결한다 (`figma:figma-use` 로드).
  - Primitive: `theme.js` palette 값과 같은 변수가 없으면 만든다 (예: `color/layout/dark` = layoutDark, `color/layout/card` = layoutCard, `color/layout/menu` = gray800, `color/red/600` = red600). scopes는 `[]`.
  - Semantic: `theme.colors.layout` 키에 대응하는 변수(`layout/sideBarBG`, `layout/sideBarCardBG` 등)를 위 Primitive alias로 맞춘다. 기존 Semantic 값을 바꾸기 전에 그 변수가 다른 노드에 바인딩돼 있는지 페이지별로 확인하고, 쓰이고 있으면 바꾸지 말고 묻는다.
  - 바인딩: Sidebar 배경, Menu 변형 배경, 흰 글자(`text/inverse`). 바인딩한 노드 수를 보고한다.
- 기존 `SideNav.jsx`, `SideNav.styles.js`를 **수정**한다 (새 컴포넌트를 따로 만들지 않는다). 아이콘이 Figma 벡터면 SVG로 받아 `src/assets/icons/`에 저장해서 쓴다.

## 8단계 — Figma 시안 대조 (종료 전 필수)

결과 보고 전에 **구현한 헤더·사이드바가 Figma 시안과 같은지 마지막으로 확인**한다. 빌드 통과만으로 끝내지 않는다.

1. **브라우저 기본 스타일 점검** — 프로젝트 reset(`styled-reset`)은 아래 기본값을 지우지 않으므로, 새로 만든 요소마다 직접 확인한다.
   - `a` (`NavLink`/`Link` 포함): `text-decoration: underline`(밑줄), `color`(파란색/방문 보라색), `:hover`·`:visited`·`:focus` 색 → 시안에 없으면 `text-decoration: none`, `color`는 theme 값으로 지정.
   - `button`: 배경(회색), 테두리, `padding`, `text-align: center`, `color`, `line-height`, `cursor` → 시안대로 덮어쓴다 (`background: none; border: 0; padding: 0; color: inherit; text-align: left;` 등).
   - `ul`/`li`: 들여쓰기·마커, `img`: inline 아래 여백(`display: block`), focus outline이 시안과 다르게 보이는지.
2. **값 대조** — `get_design_context` 결과와 스타일 코드를 항목별로 맞춰 본다: 크기(너비·높이), 패딩·간격(gap), 모서리, 배경색, 글자 크기·굵기·줄높이·자간·색, 아이콘 크기·방향·색, 상태별(기본/hover/active/open) 모양.
3. **화면 대조** — dev 서버를 띄워 헤더·사이드바를 화면에서 확인하고(가능하면 브라우저 스크린샷 또는 계산된 스타일 `getComputedStyle`), Figma `get_screenshot`과 비교한다. 1depth 링크 카드, 펼친/접힌 카드, 현재 경로 active 상태를 각각 본다.
4. 다른 부분은 고치고, 토큰이 없거나 의도적으로 다르게 둔 부분(예: 그림자, 자간, 폰트 대체)은 결과 보고에 "시안과 다른 점"으로 적는다.

## 보고 언어

- 작업 계획 보고, **확인 메시지(질문·진행 여부 확인·멈춤 안내)**, 결과 보고는 **모두 한글로** 작성한다. 코드·파일명·컴포넌트명·node-id 같은 식별자만 원문 그대로 둔다.
- **보내기 직전 점검:** 메시지 전체를 다시 읽고 영어 문장(제목·표 헤더·설명 포함)이 하나라도 있으면 한글로 바꾼 뒤 보낸다. 작업을 중간에 멈추고 묻는 메시지도 예외가 아니다.
- 작업이 끝나면 한글로 완료 보고를 한다 (무엇을 했는지 / 못 한 것 / 확인 필요 항목).

## 마지막 검증 체크리스트

- [ ] 작업 계획 보고·질문·결과 보고를 한글로 작성했는가 (식별자 제외)
- [ ] 시트를 읽은 뒤 페이지명·저장 위치(전체 경로)를 사용자에게 확인받고 나서 파일 작업을 시작했는가
- [ ] 기획 자료(링크·프레임)가 없는 메뉴는 빈 페이지 + 라우트로 만들었는가
- [ ] 헤더 예시 버튼(`ACTIONS`)을 그대로 두었는가 (교체 요청이 없을 때)
- [ ] 사이드바 색상을 새 토큰 없이 기존 `theme.js` 값에 매칭했고, Figma `Sidebar`/`Menu`에도 같은 값의 변수를 연결했는가
- [ ] 자료를 하나 이상 받은 뒤에 시작했는가 (둘 다 없으면 요청만 하고 멈췄는가)
- [ ] 자료가 하나뿐이었다면, 없는 자료 때문에 건너뛴 단계를 보고했는가
- [ ] 기획서가 없을 때 디자인 파일의 페이지 프레임(`Pages` 등)으로 페이지·라우터를 구성했는가
- [ ] (디자인 시스템이 있을 때) 로고가 디자인 시스템 `Logo`에서 추출한 에셋으로 `icon-logo.*`(에셋 형식 그대로)에 저장됐는가
- [ ] 헤더를 Figma Layout > `Header` 컴포넌트 그대로 구현했는가 (헤더 바·로고·버튼 그룹, 메뉴 영역이 있으면 메뉴까지)
- [ ] Layout `Header`에 메뉴 영역이 없을 때 메뉴 노출을 지어내지 않고 보고했는가
- [ ] `SideNav.jsx`가 `HEADER_MENU`를 그대로 써서 사이트맵을 그리고, 디자인이 Figma Layout > `Sidebar`의 `list` 카드와 일치하는가 (profile/controller 영역은 묻지 않고 넣지 않았는가)
- [ ] 도메인명과 같은 이름의 시트를 찾아 페이지 수를 정했는가 — 페이지가 하나(또는 시트 없음)면 `{Domain}/index.jsx`, 여러 개면 `{Domain}/{페이지명}.jsx`로 분리했는가
- [ ] CRUD 페이지가 `Register` / `Read` / `Modify` 네이밍을 따르는가
- [ ] 스타일이 `{폴더명}.style.js`로 분리돼 있는가
- [ ] 메뉴 라벨이 기획서 문구와 정확히 일치하는가
- [ ] 모든 페이지가 `paths.js` + `router.jsx`에 등록됐고, 헤더 링크가 `PATH` 상수를 쓰는가
- [ ] 기존 파일을 덮어쓰지 않았고, 건너뛴 파일/메뉴-프레임 불일치를 보고했는가
- [ ] 하드코딩한 값이 있다면 사용자에게 먼저 확인받았는가
- [ ] `npm run build`(또는 dev 서버)로 import 경로·라우터 오류가 없는지 확인했는가
- [ ] 8단계 Figma 시안 대조를 했는가 — `a` 밑줄·색, `button` 기본 배경·테두리·패딩 등 브라우저 기본값이 시안과 다르게 보이지 않는가, 다른 점은 보고했는가
