---
name: build-table
description: Google Docs/Sheets 또는 이미지 기획서에 정의된 테이블 데이터를 분석해, Figma 디자인 시스템 TableCommon의 Table Cell 및 셀 콘텐츠 컴포넌트 Instance를 조합하여 Figma에 테이블 화면을 구성하고 컴포넌트 매칭·사용 현황을 보고한다. 소스 코드는 수정하지 않는다. #btn2 해지, #state_complete, #link 텍스트, #badge_fixed, #check_true, #width120, #align_left 등 Annotation 힌트와 Table 컴포넌트명 지정, 시트 테이블 제목 행 `{페이지명}/{컴포넌트명}`(예: NoticeList/listTable, ConfirmRead/infoTable) 및 `page`/`component` 행 형식, ListTop(left/right slot) 구성, InfoTable(상세 정보 표시형, 시트 표기 infoTable) 구성을 지원한다.
---

# /build-table

## 목적

Google Docs/Sheets 또는 이미지 기획서에 정의된 테이블 데이터를 분석하고, Figma 디자인 시스템의 기존 Table 및 공통 UI 컴포넌트를 재사용하여 **Figma에 테이블 화면을 구성한다.**

기존 디자인 시스템과 컴포넌트 구조를 최대한 유지하며, 불필요한 신규 컴포넌트 생성을 방지한다.

**결과물은 Figma 화면이다. 프로젝트 소스 코드(jsx, styles, theme 등)는 생성하거나 수정하지 않는다.**

## 0. 사전 준비

- Figma 작업 전 `figma:figma-use` 스킬을 로드한다. 화면 단위 구성이면 `figma:figma-generate-design`도 함께 로드한다.
- 디자인 시스템 파일: `https://www.figma.com/design/xHDoGiS1XI5eVkCDSRw1qy/관리자-디자인시스템?node-id=375-821` (Components 페이지)
  - Table 섹션: `TableCommon`, `ListTop`, `ListTable`, `FormTable`, `InfoTable`, `Pagination`
- 테이블을 생성할 위치는 시트 제목 행의 페이지명(`{페이지명}/{컴포넌트명}`)으로 찾는다. 제목 행도 위치 입력도 없으면 생성 전에 사용자에게 확인한다.

## 1. 입력 및 기본 규칙

다음 입력을 지원한다.

- Google Docs / Google Sheets URL
- 기획서 또는 화면정의서 이미지
- 사용할 Table 컴포넌트명 (선택)
- 컴포넌트 참조 힌트 (`#btn2 해지`, `#state_complete`, `#link 텍스트` 등)
- 컬럼 너비 힌트 (`#width120` 등)
- 생성 위치 (Figma 파일/페이지/프레임 URL) — 시트 제목 행에 페이지명이 있으면 생략 가능
- 시트 테이블 제목 행 `{페이지명}/{컴포넌트명}` (예: `NoticeList/listTable`) — 2장 제목 행 규칙

**컴포넌트 명칭 규칙**

- Figma 컴포넌트명을 기준으로 한다. (Figma 컴포넌트명은 프로젝트 소스 `table.jsx`의 컴포넌트명과 동일하다.)
- 사용자가 컴포넌트명을 명시한 경우 해당 컴포넌트를 우선 사용한다.
- 컴포넌트명이 없는 경우 기획서 구조를 분석하여 적절한 컴포넌트를 선택한다.

입력 예시:

`[Google Docs URL] + ListTable로 구성해줘`

## 2. 기획서 데이터 분석

입력된 기획서의 형태에 따라 내용을 분석한다.

- Google Docs/Sheets: 문서 내용을 읽고 테이블 구조와 데이터를 추출한다. (공개 시트는 CSV export URL로 읽을 수 있다.)
- 이미지 기획서: 이미지의 시각적 구조와 텍스트를 분석하여 테이블 데이터를 추출한다.

**분석 항목**

- 테이블 영역 및 전체 구조
- Header / Column / Row / Cell
- 컬럼명 및 데이터 유형
- 셀별 데이터 및 UI 요소
- 버튼, 상태값, 링크 등의 기능
- 컴포넌트 참조 힌트
- 컬럼 너비 지정 여부

### 테이블 제목 행 규칙 (`{페이지명}/{컴포넌트명}`)

시트의 테이블은 **제목 행**으로 시작한다. 제목 행은 첫 칸에만 값이 있고 나머지 칸이 빈 행이며, 형식은 `{페이지명}/{컴포넌트명}`이다.

```
NoticeList/listTable,,,,          ← 제목 행: 페이지 NoticeList, 컴포넌트 ListTable
No,제목,작성자,작성일,관리          ← 테이블 내용
...
,,,,                              ← 빈 행 = 테이블 끝
NoticeDetail/formTable,,,,        ← 다음 테이블: 페이지 NoticeDetail, 컴포넌트 FormTable
제목,텍스트,,,
```

- **테이블 범위:** 제목 행 다음 행부터 빈 행 또는 다음 제목 행 전까지. 한 시트에 제목 행이 여러 개면 테이블을 모두 구성한다.
- **페이지명 → 생성 위치:** Pages 페이지(`333:750`)에서 같은 이름의 페이지 프레임(구역 안 포함)을 찾아 그 안 `content` 프레임의 `SubTitle` 아래에 테이블을 넣는다. 테이블 프레임 이름은 `{페이지명} Table`.
  - 제목 행으로 위치를 찾으면 생성 위치를 따로 묻지 않는다.
  - 같은 이름 프레임이 없으면 만들지 말고 멈추고 보고한다 (`build-header`로 페이지 프레임을 먼저 만들도록 안내). 2개 이상이면 어느 것인지 묻는다.
  - 프레임에 이미 `{페이지명} Table`이 있으면 덮어쓸지 묻는다.
- **컴포넌트명 → 테이블 유형:** Components 페이지 Table 섹션 컴포넌트명과 대소문자 무시로 정확히 일치해야 한다.

  | 제목 행 컴포넌트명 | Figma 컴포넌트 | 구성 방식 |
  |---|---|---|
  | `listTable` | `ListTable` | 첫 행 = 컬럼 헤더, 이후 행 = 데이터 행 → 3장 리스트형 구조 |
  | `formTable` | `FormTable` | 한 행 = 라벨·값 한 쌍 (헤더 행 없음) → 3장 폼형 구조 |
  | `listTop` | `ListTop` | `left` / `right` 행 → 아래 **ListTop 규칙** (Left/Right slot 채우기) |
  | `infoTable` | `InfoTable` | 한 행 = `라벨, 값` 쌍 1개 이상 (헤더 행 없음, 읽기 전용) → 3장 InfoTable 구조 |

  - 표에 없는 이름(`pagination` 등)이나 오타는 짐작해서 매칭하지 말고 매칭 실패로 보고하고 사용자에게 확인한다.
  - 사용자가 메시지에서 다른 컴포넌트명을 지정하면 차이를 보고하고 어느 쪽을 쓸지 묻는다.
- **제목 행이 규칙에 맞지 않으면** (`/` 없음, 페이지명만 있음, 한글 제목 등) 짐작하지 말고 어떻게 읽을지 사용자에게 확인한다.
- 제목 행은 테이블 데이터가 아니므로 Figma 화면에 노출하지 않는다.

**`page` / `component` 행 형식**

제목 행을 `page`, `component` 행으로 나눠 쓴 시트도 같은 뜻으로 읽는다. `page` 행 2열 = 페이지명, `component` 행 2열 = 컴포넌트명이다. `page` 행 하나 아래에 `component` 행이 여러 개 올 수 있다(같은 페이지의 ListTop + ListTable 등).

```
page,NoticeList,,,           ← 페이지명 = NoticeList
component,listTop,,,         ← NoticeList/listTop
left,"총 1,340건",,,
right,#select #btn 다운로드,,,
component,listTable,,,       ← NoticeList/listTable
No,제목,작성자,작성일,관리
...
,,,,                         ← 빈 행 = 이 페이지 끝
```

- `component` 행 범위: 다음 `component` 행, `page` 행, 빈 행 전까지.
- `page` 행 없이 `component` 행만 있으면 페이지명을 짐작하지 말고 사용자에게 확인한다.

### ListTop 규칙 (`listTop`)

테이블 위에 놓이는 상단 바. `ListTop` 컴포넌트(Components 페이지 `369:1117`)는 `Left` / `Right` 두 개의 **SLOT** 속성을 가지며 SPACE_BETWEEN으로 양 끝에 붙는다.

| 시트 행 | 넣는 위치 | 내용 해석 |
|---|---|---|
| `left,값` | `Left` slot (왼쪽 정렬) | Annotation 규칙으로 해석. `#` 없으면 텍스트 |
| `right,값` | `Right` slot (오른쪽 정렬) | Annotation 규칙으로 해석. `#` 없으면 텍스트 |

- 한 칸에 표기가 여러 개면 표기 순서대로 slot 안에 나란히 넣는다 (slot 간격 6px). `#select #btn 다운로드` → `Select` 다음 `ActionBtn`(Action=Btn, "다운로드").
- `left` / `right` 행이 없으면 해당 slot은 비워 둔다. 기본 내용(slot 기본 텍스트)을 남기지 않는다.
- 같은 페이지에 `listTop` 블록이 2개 이상이면 어느 것을 쓸지 짐작하지 말고 사용자에게 확인한다.
- `left` / `right` 외의 행 이름은 매칭 실패로 보고하고 사용자에게 확인한다.
- **ListTop 컴포넌트 매칭 순서**
  - `#` 없는 텍스트 → slot 기본 텍스트 노드에 문구를 넣는다 (`Left` 기본 텍스트 스타일 유지).
  - `#` 표기는 아래 순서로 찾고, 앞 순위에서 찾으면 뒤 순위는 보지 않는다.
  - **이름 비교 방법 (모든 순위 공통):** 컴포넌트 이름의 첫 구간(`/` 앞, variant set이면 set 이름)과 표기 컴포넌트명을 대소문자 무시로 정확히 비교한다. `#select` ↔ `Select/Default`. (`#btn`/`#btnN`은 이름 비교가 아니라 2순위의 버튼 예외 규칙으로 `ActionBtn`에 매칭된다.)
    같은 순위에서 2개 이상 일치하면 임의로 고르지 않고 사용자에게 확인한다.
    `_variant` 표기는 그 컴포넌트의 variant에서 찾고, 뒤 문구는 컴포넌트의 텍스트(Select는 placeholder)로 넣는다.
  1. **ListTop 컴포넌트 안** → `ListTop` Main Component(Left/Right slot 기본 내용 포함) 안에 들어 있는 인스턴스의 Main Component.
  2. **TableCommon 라벨** → 위 Annotation 규칙·컴포넌트명 매칭 표 그대로 (버튼 예외 포함).
  3. **slot 추천 목록** → `ListTop`의 해당 SLOT 속성(`Left` / `Right`) `preferredValues`의 key로 찾은 컴포넌트.
  4. **상위 공통 컴포넌트** → 아래 **상위 공통 컴포넌트 탐색** 규칙 (예: `#button` → 공통 `Button`).
  5. 모두 없으면 매칭 실패로 보고한다. node-id를 고정으로 쓰지 않는다.
  - 문구가 필요한 컴포넌트(버튼 등)에 문구가 없으면 기본 문구를 두고 확인 필요 항목으로 보고한다.
  - 8-2 보고에 매칭 출처(`ListTop 내부` / `TableCommon` / `slot 추천 목록` / `상위 공통 컴포넌트`)를 함께 적는다.
- **구성:** `ListTop` 인스턴스를 만들어 `content` 프레임의 `SubTitle` 바로 아래(같은 페이지의 `{페이지명} Table` 위)에 넣고 가로 FILL로 맞춘다. 이름은 `{페이지명} ListTop`.
  - slot 내용은 인스턴스의 `Left` / `Right` slot 자식을 지우고 새 인스턴스를 append해서 채운다. Main Component의 slot 기본 내용은 수정하지 않는다.
  - 이미 `{페이지명} ListTop`이 있으면 덮어쓸지 묻는다.
- 크기가 다른 컴포넌트를 한 slot에 넣으면(예: Select 46px + ActionBtn 36px) 임의로 리사이즈하지 말고 확인 필요 항목으로 보고한다.

### Annotation 처리 규칙 (셀 표기)

기획서 셀의 `#` 표기를 아래 규칙으로**만** 해석한다.
규칙에 안 맞는 표기를 짐작으로 보정하면 틀린 기획서가 그대로 통과되므로 보정하지 않는다.

| 표기 | 의미 | 예 |
|---|---|---|
| `#컴포넌트_variant` | Figma 컴포넌트의 variant 선택. 표시 문구는 Figma variant 안의 텍스트를 따른다 | `#badge_fixed` → Badge=fixed ("고정") |
| `#컴포넌트 텍스트` (띄어쓰기) | 그 텍스트를 컴포넌트 문구로 넣는다 | `#link dmodj_02` → Link, 문구 "dmodj_02" |
| `#컴포넌트_variant 텍스트` | variant 선택 + 문구 | `#actionbtn_btn2 해지` → ActionBtn Action=Btn2, 문구 "해지" |
| `#check_true` / `#check_false` | 체크박스 체크 / 해제. `#check`만 있으면 해제 | |
| 한 셀에 버튼 표기 여러 개 | 버튼 여러 개를 나란히. 표기 순서 = 버튼 순서. 아래 **한 셀 다중 버튼** 규칙 | `#btn2 승인하기 #btn4 거절하기` |
| 헤더의 `#width숫자` | 컬럼 너비(px) | `서비스 이용기간 #width300` |
| `#align_left` / `_center` / `_right` | 텍스트 정렬. `Table Cell`의 Align variant. 표기가 없으면 Center | `아이디 #align_left` |
| `#` 없음 | 일반 텍스트 (아래 고정 문구 매칭 규칙 적용) | |

**덧붙이는 표기(`#width`, `#align`)**: 셀 값 뒤에 띄어쓰기로 붙인다. 이 표기는 문구가 아니므로 셀 텍스트에 노출하지 않는다.
- 헤더 셀의 `#align_*` → 그 컬럼의 Header·Body `Table Cell` 전체에 같은 Align variant 적용.
- 바디 셀의 `#align_*` → 그 `Table Cell` 하나에만 적용 (헤더 지정보다 우선).
- `left`/`center`/`right` 외의 값은 Align variant에 없으므로 매칭 실패로 보고하고 사용자에게 확인한다.

예전 `@` 표기(`@grade free`, `@button2 해지` 등)는 띄어쓰기 의미가 새 규칙과 다르다.
`@` 표기가 보이면 임의로 해석하지 말고 `#` 규칙으로 고쳐야 하는지 사용자에게 확인한다.

**컴포넌트명 매칭**

`#` 뒤의 컴포넌트명은 TableCommon(node `442:727`)의 라벨과 대소문자 무시하고 정확히 일치해야 한다.

| 표기 컴포넌트명 | TableCommon 라벨 / variant |
|---|---|
| `link` | `#Link` |
| `check` | `#Check` (Checkbox 해제/체크) |
| `align` | `#Align` → `Table Cell` Align (Left/Center/Right) |
| `width` | `#Width` → `Table Cell` 너비 |
| `state` | `#State` (complete/pending) |
| `badge` | `#Badge` (fixed) |
| `actionbtn` | `#ActionBtn` → `ActionBtn` (Action=Btn/Btn2/Btn3/Btn4) |
| `btn`, `btnN` (예외) | `#ActionBtn` Action=Btn / BtnN |
| 한 셀 버튼 여러 개 | `Table Cell` `Content` slot에 버튼을 표기 순서대로 나란히 |

**상위 공통 컴포넌트 탐색** — TableCommon 라벨에 없는 표기는 바로 실패로 보지 말고 디자인 시스템 공통 컴포넌트에서 찾는다.

- 대상: 디자인 시스템 파일의 로컬 Main Component / Component Set (Components 페이지, Design systems 페이지 등). TableCommon 콘텐츠 컴포넌트는 이미 본 것이므로 제외.
- 비교: 컴포넌트 이름의 첫 구간(`/` 앞, variant set이면 set 이름)과 표기 컴포넌트명을 대소문자 무시로 **정확히** 비교한다. 부분 일치·유사어는 매칭하지 않는다.
  - `#button 상세보기` → 공통 `Button`, 문구 "상세보기". `#grade_free` → `Grade` Grade=Free. `#select` → `Select/Default`.
- variant 표기가 없으면 Component Set의 기본 variant(`defaultVariant`)를 쓴다. `_variant` 표기는 그 컴포넌트의 variant 값에서 찾고, 없으면 매칭 실패.
- 같은 이름이 2개 이상이면 임의로 고르지 않고 사용자에게 확인한다.
- 여기서도 없으면 매칭 실패로 보고한다.
- 보고 8-2에 `(상위 공통 컴포넌트)`로 출처를 적는다.

- 작업 전에 `get_metadata`로 TableCommon 라벨을 다시 읽어 위 표가 최신인지 확인한다.
- **버튼 예외:** `#btn`, `#btn2`, `#btn3`, `#btnN`은 컴포넌트명 없이 `ActionBtn`의 Action variant에 바로 대응한다.
  `#btn 해지` → Action=Btn, `#btn2 해지` → Action=Btn2, 텍스트 "해지".
  `#actionbtn_btn2 해지`도 같은 뜻으로 받는다. `BtnN` variant가 Figma에 없으면 매칭 실패로 보고한다.
  - `#button`은 버튼 예외가 아니다. TableCommon에 `button` 라벨이 없으므로 **상위 공통 컴포넌트 탐색**으로 공통 `Button`에 매칭한다.
- **한 셀 다중 버튼:** 한 셀에 버튼 표기(`#btn`/`#btnN` + 텍스트)가 여러 개 있으면 `Table Cell`의 `Content` slot에 `ActionBtn` 인스턴스를 표기 순서대로 나란히 넣는다 (slot 간격 10px). 버튼 개수 제한은 없다.
  - 표기는 띄어쓰기로 이어 쓴다. 각 버튼의 텍스트는 다음 `#` 앞까지다. `#btn2 승인하기 #btn4 거절하기` → Btn2 "승인하기", Btn4 "거절하기".
  - 버튼과 다른 컴포넌트를 한 셀에 섞은 표기(예: `#link 보기 #btn 삭제`)는 규칙에 없으므로 매칭 실패로 보고하고 사용자에게 확인한다.
- **TableCommon과 상위 공통 컴포넌트 어디에도 이름이 정확히 맞는 게 없으면 짐작해서 매칭하지 말고 매칭 실패로 보고하고 사용자에게 확인한다.**
  예: `#status_complete`는 `Status` 컴포넌트가 없다. State로 추정하지 말고 `#state_complete`로 고쳐야 하는지 묻는다.

**variant 선택 규칙**

- 컴포넌트를 찾을 때는 TableCommon 콘텐츠 컴포넌트를 먼저 보고, 없을 때만 디자인 시스템 공통 컴포넌트를 본다.
- variant 이름은 대소문자를 구분하지 않고 비교한다 (`btn2` = `Btn2`).
- 지정한 variant가 Figma에 없으면 임의로 비슷한 variant를 고르지 않고 매칭 실패로 보고하고 사용자에게 확인한다.
- variant 속성 이름(`Property 1`, `Type` 등)은 Figma 실제 이름을 읽어서 쓴다.

**컬럼 너비 규칙**

- Header 셀에 `#width숫자`가 있으면 해당 값을 px 단위로 적용한다.
- 너비가 명시되지 않은 경우 데이터 길이와 테이블 구조를 고려하여 적절한 너비를 지정한다.
- 너비는 각 컬럼의 Table Cell 인스턴스 너비로 지정한다. 남는 폭은 너비 지정이 없는 컬럼이 채운다(FILL).
- Annotation은 실제 셀 데이터에 노출하지 않는다.

**데이터 분석 원칙**

- Figma 구성 직전에 기획서(Docs/Sheets)를 다시 읽어 최신 내용인지 확인한다. 최초 분석 이후 행·컬럼·Annotation이 바뀌었으면 최신 내용 기준으로 구성하고, 변경 사항을 보고에 기록한다.
- Google Sheets는 데이터 행 전체를 읽는다. 일부 행만 보고 구성하지 않는다.
- 이미지에서 식별할 수 없는 데이터를 임의로 생성하지 않는다.
- 기획서에 명시된 데이터와 UI 요소를 우선한다.
- 분석이 불확실한 항목은 별도로 기록한다.
- 문서에 없는 기능을 임의로 추가하지 않는다.

## 3. 테이블 컴포넌트 결정

**테이블의 컬럼·행 구성은 항상 TableCommon `Table Cell` 인스턴스 조합으로 만든다.**
`ListTable`(`List`) 등 완성형 테이블 컴포넌트는 인스턴스로 가져다 쓰지 않고, 구조·스타일 참고용으로만 본다.
사용자가 "ListTable로 구성해줘"처럼 테이블 유형을 지정해도 마찬가지로 Table Cell 조합으로 만들고, 지정한 유형은 레이아웃 판단(리스트형/검색+리스트형 등)에만 쓴다.

**Table Cell 조합 구조**

```
{테이블명} (세로 Auto Layout, itemSpacing 0)
├─ Header (가로 Auto Layout) ─ Table Cell(Role=Header) × 컬럼 수
├─ Row 1  (가로 Auto Layout) ─ Table Cell(Role=Body)   × 컬럼 수
└─ Row N  ...
```

- 셀 이름은 헤더 텍스트, 셀 너비는 컬럼 너비로 맞춘다. 셀 내용은 `Content` **slot**에 넣는다. 인스턴스의 `Content` slot 자식(기본 Text)을 지우고 Text/Link/State/Badge/ActionBtn 등 인스턴스를 append한다. 여러 개면 순서대로 나란히 append한다. 내용이 셀 너비를 채워야 하면(FormTable 입력 필드 등) slot과 내용 모두 가로 FILL로 맞춘다.
- `Align` variant는 기획서/디자인에 지정이 없으면 Center를 쓴다.

**FormTable(폼형) 조합 구조** — `FormTable` 컴포넌트 variant와 같은 구조로 만든다.

```
{페이지명} Table (세로 Auto Layout, itemSpacing 0)
├─ {라벨} (가로 Auto Layout) ─ Header Cell: Table Cell(Role=Header, Align=Left, 너비 200) + Content=Label
│                            └ Field Cell:  Table Cell(Role=Body,   Align=Left, FILL)      + Content=값 컴포넌트
└─ ...
```

- 시트 1열 = 라벨 → `Label` 컴포넌트의 `Label` 텍스트. `Required`는 기획서에 필수 표기가 없으면 `false`.
- 시트 2열 = 값 → Annotation 규칙으로 Content를 고른다 (`#link 파일명` → Link, `#` 없음 → Text).
  `#check 문구`처럼 체크박스에 문구가 붙으면 `Field/Checkbox Group`의 옵션 1 문구로 넣고 남는 옵션은 숨긴다.
- 입력 필드(Input/Textarea/Select 등 `FormTable` Type) 표기 규칙은 아직 없다. 값이 입력 필드로 보여도 짐작하지 말고 확인 필요 항목으로 보고한다.

**InfoTable(상세 정보 표시형) 조합 구조** — Components 페이지 `InfoTable` 컴포넌트(`Type=Text`, `531:3146`)의 한 행 구조와 같게 만든다.
상세(`Read`) 화면처럼 라벨 + 값을 **보여주기만** 하는 표다. 입력 필드는 넣지 않는다. 시트 해석은 코드 쪽 `create-table` InfoTable 모드(I2·I3)와 같다.

```
{페이지명} Table (세로 Auto Layout, itemSpacing 0, 가로 FILL)
├─ {첫 라벨} (가로 Auto Layout) ─ Header Cell: Table Cell(Role=Header, Align=Left, 너비 200) + Content=LabelRequire(라벨)
│                               └ Field Cell:  Table Cell(Role=Body,   Align=Left, FILL)      + Content=값 컴포넌트
│                               (한 행에 쌍이 더 있으면 Header Cell + Field Cell을 같은 행에 이어 붙인다)
└─ ...
```

- **시트 → 행 변환:** 시트 한 줄 = Figma 한 행. 칸을 왼쪽부터 2개씩 묶어 `라벨, 값` 한 쌍으로 만들고, 값이 없는 뒤쪽 빈 칸은 버린다.
  ```
  component,infoTable,,
  제목,제목영역입니다.,고정,#check 게시글 고정   → 행 1: [제목 | 제목영역입니다.] [고정 | ☐ 게시글 고정]
  내용,아 이것좀 확인해주세요!!!!!!!!!!!          → 행 2: [내용 | 아 이것좀 확인해주세요!!!!!!!!!!!]
  첨부파일,34230.jpg                              → 행 3: [첨부파일 | 34230.jpg]
  ```
  - 쌍이 맞지 않는 행(라벨만 있고 값 칸이 없음, 칸 개수 홀수)은 짐작하지 말고 사용자에게 확인한다.
- **셀 구성:** `Header Cell`/`Field Cell`은 `InfoTable` 컴포넌트 안 인스턴스의 Main Component(TableCommon `Table Cell`)를 `get_metadata`로 확인해 같은 variant로 만든다.
  - Header Cell 너비는 200 고정, Field Cell은 가로 FILL. 쌍이 여러 개인 행은 Field Cell끼리 남는 폭을 나눠 갖고, 쌍이 1개인 행은 Field Cell이 끝까지 채운다 (코드 `InfoTable`의 colSpan 자동 계산과 같은 모양).
  - `InfoTable` 인스턴스를 행마다 넣거나 Detach하지 않는다. 쌍 개수가 행마다 다르므로 Table Cell 조합으로 만든다 (`InfoTable`은 구조·스타일 참고용).
- **라벨 칸:** 시트 라벨 문구를 그대로 Header Cell의 `LabelRequire` 라벨 텍스트에 넣는다. InfoTable은 표시용이므로 필수 표시는 끈다 (시트에 필수 표기가 있으면 확인 필요로 보고). 프로퍼티 이름은 Figma 실제 이름을 읽어서 쓴다.
- **값 칸 — 라벨 매칭은 ListTable과 동일:** 값 칸의 `#` 표기는 위 **Annotation 처리 규칙**·**컴포넌트명 매칭**(TableCommon `442:727` 라벨과 대소문자 무시 정확 일치)·**상위 공통 컴포넌트 탐색**·5장 **고정 문구 매칭**을 그대로 쓴다. InfoTable 전용 매칭 규칙은 없다.

  | 시트 값 | Field Cell `Content` slot |
  |---|---|
  | 일반 텍스트 (`#` 없음) | `Text` (TableCommon 고정 문구와 정확히 일치하면 해당 컴포넌트) |
  | `#link 텍스트` | `Link`, 문구 "텍스트" |
  | `#check` / `#check_false` / `#check_true` | `Checkbox` 해제 / 해제 / 체크 |
  | `#check 텍스트` | `Checkbox`(해제) + `Text`("텍스트")를 순서대로 나란히. 간격은 대응 디자인이 없으면 확인 필요로 보고 |
  | `#state_*` / `#badge_fixed` | `State` / `Badge` 해당 variant |
  | `#btn` / `#btnN` / `#actionbtn_*` (다중 버튼 포함) | `ActionBtn` — 버튼 예외·한 셀 다중 버튼 규칙 그대로 |
  | `#grade_*`, `#button 텍스트` 등 TableCommon에 없는 이름 | 상위 공통 컴포넌트 탐색 (`Grade`, `Button` 등) |
  | 어디에도 없는 이름 (`#status_complete` 등) | ❌ 매칭 실패 — 짐작하지 않고 사용자 확인 |

  - `#width` / `#align` 표기는 InfoTable에 헤더 행이 없으므로 그 셀 하나에만 적용한다. 표기가 없으면 Align=Left (InfoTable 컴포넌트 기본값).
  - 체크박스는 TableCommon `Checkbox`(`158:588`)만 쓴다. FormTable의 `Field/Checkbox Group`(입력 폼용)으로 대체하지 않는다.
- **컴포넌트 표기 확인:** 상세(읽기 전용) 화면인데 시트가 `formTable`로 적혀 있으면 InfoTable로 바꿔 짐작하지 말고, 시트를 `infoTable`로 고쳐야 하는지 사용자에게 확인한다.

사용자가 컴포넌트명을 지정한 경우 해당 컴포넌트를 우선 사용하고, 별도의 테이블 유형 추론을 생략한다.

컴포넌트명이 없는 경우 다음 우선순위로 판단한다.

1. 기획서 테이블 제목 행의 컴포넌트명 (`{페이지명}/{컴포넌트명}`)
2. 기획서에 명시된 그 밖의 컴포넌트 정보
3. 실제 데이터 및 화면 구조
4. 페이지/섹션/도메인명

**테이블 유형 예시**

- 리스트형
- 검색 + 리스트형
- 기타 디자인 시스템에 정의된 Table 유형

도메인명은 보조 판단 기준으로 활용한다.

예:

- `ProductList` → 리스트형 가능성이 높음
- `*ListPage` → 검색 영역과 리스트 테이블의 결합 여부 확인

도메인명만으로 유형을 확정하지 않으며, 실제 화면 구조를 우선한다.

## 4. 기존 컴포넌트 구조 탐색 (Figma)

선택된 Table 컴포넌트와 관련된 상위 공통 컴포넌트까지 Figma에서 확인한다.

탐색 예시:

`TableCommon (Table Cell[Content slot], Text, Link, Checkbox, State, Badge, ActionBtn) → 공통 UI 컴포넌트`
(`ListTable` 등 완성형 테이블은 구조 참고용으로만 확인한다.)

**확인 항목**

- Table 컴포넌트의 레이어 구조와 Auto Layout
- 상위 공통 컴포넌트 (TableCommon)
- Header / Body Cell 구성 (`Table Cell`: Role=Header/Body, Align=Left/Center/Right)
- 지원하는 Cell 콘텐츠 유형
- Variant 및 Component Property (텍스트, Boolean, Instance Swap, Slot 등)
- 기존 ActionBtn/State/Link/Badge 등의 variant 구성
- 사용 중인 Variable / Style (색상, 타이포)

현재 컴포넌트에서 지원하지 않는 기능이라도 상위 공통 컴포넌트에서 지원하는지 반드시 확인한다.

기존 구조로 구현할 수 있는 경우 신규 컴포넌트를 생성하지 않는다.

## 5. Cell 컴포넌트 매칭

각 Cell의 데이터와 Annotation을 분석하여 Figma 디자인 시스템의 기존 컴포넌트와 매칭한다.

**탐색 우선순위**

1. 현재 Table 컴포넌트에서 사용 중인 컴포넌트
2. 상위 공통 Table 컴포넌트 (TableCommon)
3. 디자인 시스템 공통 UI 컴포넌트

**매칭 예시**

| 기획서 데이터 | 매칭 대상 |
|---|---|
| `#btn 수정` | ActionBtn Action=Btn, 텍스트 "수정" (버튼 예외) |
| `#btn2 해지` | ActionBtn Action=Btn2, 텍스트 "해지" (버튼 예외) |
| `#actionbtn_btn3 해지` | ActionBtn Action=Btn3, 텍스트 "해지" |
| `#btn2 승인하기 #btn4 거절하기` | Content slot에 Btn2 "승인하기", Btn4 "거절하기" 순서로 |
| `#btn 수정 #btn2 복사 #btn4 삭제` | Content slot에 버튼 3개 순서대로 |
| `#button 상세보기` | 공통 `Button`(기본 variant), 텍스트 "상세보기" (상위 공통 컴포넌트) |
| `#state_complete` | State=complete |
| `#badge_fixed` | Badge=fixed |
| `#link 상품명` | Link, 텍스트 "상품명" |
| `#grade_free` | `Grade` Grade=Free (상위 공통 컴포넌트) |
| `#check_true` | Checkbox (체크) |
| `아이디 #align_left` (헤더) | 아이디 컬럼 Table Cell 전체 Align=Left |
| `#status_complete` | ❌ 매칭 실패 — TableCommon에 `Status` 라벨 없음. 사용자 확인 |
| `고정` (Annotation 없음) | Badge=fixed (아래 고정 문구 매칭 규칙) |
| 일반 텍스트 | 기본 Table Cell (Text) |

### Annotation 없는 텍스트의 고정 문구 매칭

`#` 표기가 없는 셀 텍스트라도, TableCommon 콘텐츠 컴포넌트(Badge, State 등)에 고정으로 들어 있는 문구와 **정확히 일치**하면 해당 컴포넌트를 사용한다.

1. TableCommon 콘텐츠 컴포넌트와 각 variant 안의 텍스트를 수집한다. (Text, Link, ActionBtn처럼 문구를 자유롭게 바꾸는 컴포넌트의 기본 문구는 제외한다.)
2. 셀 텍스트와 공백까지 정확히 같은 문구를 찾는다. 부분 일치·유사어는 매칭하지 않는다.
3. variant set이면 해당 문구를 가진 variant를 선택한다. (예: `처리완료` → Badge State=complete)
4. 일치하는 컴포넌트가 2개 이상이면 임의로 고르지 않고 사용자에게 확인한다.
5. 일치하는 문구가 없으면 기본 Text Cell을 사용한다.
6. 이 규칙으로 매칭한 셀은 보고서 8-2에 `(Annotation 없음, 문구 일치)`로 표시한다.

`#` Annotation이 있으면 Annotation을 우선한다.

**매칭 원칙**

- 기존 컴포넌트를 우선 재사용한다.
- 단순히 이름이 비슷하다는 이유만으로 매칭하지 않는다.
- 컴포넌트의 역할, Variant, Component Property, Figma 설명(description)을 확인한다.
- 동일한 역할의 컴포넌트가 여러 개라면 현재 Table에서 사용하는 컴포넌트를 우선한다.
- 기존 컴포넌트의 Variant와 Property를 활용하여 구현한다.

### 매칭되는 컴포넌트가 없는 경우

Annotation에 해당하는 컴포넌트를 찾지 못하면 다음 순서로 처리한다.

1. 현재 Table 및 상위 공통 컴포넌트에서 재확인한다.
2. 디자인 시스템 공통 UI 컴포넌트에서 대체 가능한 컴포넌트를 검색한다.
3. 매칭 가능한 컴포넌트가 없다면 사용자에게 신규 컴포넌트 생성 여부를 질문한다.
4. 사용자가 `yes`로 승인한 경우에만 신규 컴포넌트를 생성한다.
5. 생성한 컴포넌트는 기존 디자인 시스템의 Variable, Style, 네이밍 규칙을 따른다.

사용자 승인 없이 신규 공통 컴포넌트를 생성하거나 기존 공통 컴포넌트(Main Component)를 임의로 변경하지 않는다.

## 6. 테이블 구성 (Figma)

분석 및 컴포넌트 매칭 결과를 바탕으로 대상 Figma 위치에 테이블을 구성한다.

**구성 원칙**

- 디자인 시스템 컴포넌트는 Instance로 배치한다. Detach하거나 raw 도형/텍스트로 다시 그리지 않는다.
- 테이블은 3장의 Table Cell 조합 구조로 만든다. `ListTable`(`List`) 인스턴스를 넣거나 Detach해서 쓰지 않는다.
- 기획서의 Column 순서와 Cell 구성을 유지한다.
- Annotation에 따라 적절한 컴포넌트와 Variant를 적용한다.
- 컬럼 너비는 지정된 값을 우선 적용한다.
- 색상·타이포는 하드코딩하지 않고 디자인 시스템의 Variable/Style을 사용한다.
- 기존 Main Component를 수정하지 않는다. (다른 사용처에 영향 금지)
- 기획서에 없는 데이터나 기능을 임의로 추가하지 않는다.
- 소스 코드는 수정하지 않는다.

## 7. 구성 결과 검증

테이블 구성 완료 후 기획서와 Figma 결과를 비교하여 검증한다. (`get_screenshot`으로 렌더링 확인)

**검증 항목**

- 모든 Column이 반영되었는지
- Column 순서가 일치하는지
- 누락된 Cell이 없는지
- 각 Annotation이 올바른 컴포넌트/Variant에 매칭되었는지
- 지정된 컬럼 너비가 적용되었는지
- 디자인 시스템 컴포넌트를 Detach하거나 중복으로 다시 그리지 않았는지
- 기획서에 없는 데이터나 UI가 추가되지 않았는지
- 제목 행의 페이지명 프레임에, 제목 행의 컴포넌트명 유형(listTable/formTable/infoTable)대로 구성했는지
- Table Cell 조합 구조(Header/Row 행 + Table Cell 인스턴스)를 지켰는지
- ListTop: `left`/`right` 내용이 각 slot에 표기 순서대로 들어갔고, `SubTitle`과 테이블 사이에 가로 FILL로 놓였는지
- InfoTable: 시트 한 줄 = 한 행, 칸 2개씩 `Header Cell + Field Cell` 쌍으로 옮겼는지 / Header 200 고정·Field FILL인지 / 값 칸 `#` 표기를 ListTable과 같은 TableCommon 라벨 규칙으로 매칭했는지 / 입력 필드를 넣지 않았는지

문제가 발견되면 수정 후 재검증한다.

## 보고 언어

- 작업 계획 보고, **확인 메시지(질문·진행 여부 확인·멈춤 안내)**, 결과 보고는 **모두 한글로** 작성한다. 코드·컴포넌트명·node-id 같은 식별자만 원문 그대로 둔다.
- **보내기 직전 점검:** 메시지 전체를 다시 읽고 영어 문장(제목·표 헤더·설명 포함)이 하나라도 있으면 한글로 바꾼 뒤 보낸다. 작업을 중간에 멈추고 묻는 메시지도 예외가 아니다.
- 작업이 끝나면 한글로 완료 보고를 한다 (무엇을 했는지 / 못 한 것 / 확인 필요 항목).

## 8. 결과 보고

테이블 구성이 완료되면 실제 사용된 컴포넌트와 매칭 결과를 정리하여 보고한다. 생성한 Figma 노드 링크를 함께 제공한다.

### 8-1. 구성 결과

| 컴포넌트 | 사용 건수 |
|---|---:|
| Table Cell (Role=Header) | 3 |
| Table Cell (Role=Body) | 9 |
| Text | 7 (헤더 3, 바디 4) |
| ActionBtn | 3 |
| Badge | 2 |

(Text·ActionBtn·Badge는 Table Cell 안의 콘텐츠이므로 Table Cell 건수와 따로 합산하지 않는다.)

### 8-2. 컴포넌트 매칭 결과

| 기획서 Annotation | 적용 컴포넌트 | 사용 건수 |
|---|---|---:|
| `#btn 상세보기` | ActionBtn Action=Btn | 2 |
| `#btn2 수정` | ActionBtn Action=Btn2 | 1 |
| `#state_complete` | State=complete | 1 |
| `#state_pending` | State=pending | 1 |

### 8-3. 신규 생성 컴포넌트

- 신규 생성한 컴포넌트명
- 생성 사유
- 적용 위치

신규 생성 컴포넌트가 없으면 `없음`으로 표시한다.

### 8-4. 매칭 실패 및 확인 필요 항목

- 매칭하지 못한 Annotation
- 불확실한 데이터 또는 구조
- 사용자 확인이 필요한 사항

해당 항목이 없으면 `없음`으로 표시한다.

### 8-5. 최종 검증 결과

- 전체 Column 수
- 정상 반영된 Column 수
- 컴포넌트 매칭 성공/실패 건수
- 최종 구현 완료 여부

**집계 기준**

- 컴포넌트 종류 수와 실제 사용 건수를 구분한다.
- 실제 사용 건수는 구성된 Cell 또는 컴포넌트 Instance 기준으로 계산한다.
- 반복 데이터로 생성되는 컴포넌트는 실제 Figma에 배치된 Instance 기준으로 집계한다.
- 정확한 Instance 수를 확정할 수 없다면 정적 구성 건수와 반복 배치 건수를 구분하여 보고한다.
- TableCommon 등 상위 공통 컴포넌트는 하위 Cell의 사용 건수와 중복 합산하지 않는다.
- 결과 보고에는 실제 Figma에서 확인한 컴포넌트명과 사용 건수만 기재한다.
