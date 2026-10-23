---
name: create-table
description: FormTable(입력 폼형 테이블), ListTable(목록형 테이블) 또는 InfoTable(상세 정보 표시형 테이블, 시트 표기 infoTable) 컴포넌트로 페이지의 폼/목록 레이아웃을 만들 때 사용한다. 인자에 "all"이 붙으면(예: "/create-table all {시트 URL}", "all로 테이블 다 그려줘") 시트·Figma를 읽어 모든 페이지의 테이블을 한 번에 만든다. "리스트 테이블 만들어줘", "이 피그마 목록 테이블 코드로 만들어줘" 같은 목록형 요청도 포함한다. "폼 테이블 만들어줘", "입력 폼 레이아웃 잡아줘", "이 피그마 디자인으로 폼 만들어줘", "기획서대로 검색 필터 폼 만들어줘", "controller.js에 COLUMN 추가해줘" 같은 요청, 또는 페이지에 라벨+인풋이 나열된 폼형 테이블(등록/수정/검색 폼 등)을 새로 붙여야 하는 모든 상황에서 반드시 이 스킬을 먼저 로드한다. 피그마 디자인 인스턴스가 새로 추가된 경우와, 디자인 없이 기획서(텍스트 스펙)만 있고 기존에 쓰던 컴포넌트 인스턴스를 재사용하는 경우 둘 다 다룬다.
---

# FormTable 페이지 레이아웃 생성

`src/components/Table/Table.jsx`의 `FormTable`(라벨+인풋이 나열된 입력 폼형 테이블) 또는
`ListTable`(헤더 + 데이터 행의 목록형 테이블)을 사용해 페이지의 레이아웃만 조립하는 스킬.
**기능 구현은 하지 않고 레이아웃만 만든다. 단, 페이지 이동(링크·버튼 클릭 시 라우트 이동)까지는 구현한다** — 아래 [페이지 이동] 절.
ListTable은 아래 [ListTable 모드] 절을 따른다.

## 핵심 원칙

1. **하드코딩 금지, 기존 컴포넌트 재사용.** 이미 만들어져 있는 컴포넌트(table.jsx FormTable, Select 등)를 쓴다.
   값이든 마크업이든 하드코딩이 정말 불가피하면, 먼저 **"어느 부분을 하드코딩할지"** 사용자에게 물어보고
   답을 받은 뒤에 작업한다. 스스로 판단해서 조용히 하드코딩하지 않는다.
2. **레이아웃만, 기능은 없음.** 검색/저장 API 연동, 상태 관리 로직, 유효성 검사 등은 만들지 않는다.
   `FormTable`은 controlled component라 렌더링을 위해 `formData`/`handleFormChange` 같은 props가 필요한데,
   이건 화면이 죽지 않게 하는 최소한의 뼈대(빈 값, no-op 핸들러)로만 채운다 — 실제 비즈니스 로직으로 오해하지 않는다.
   **예외: 페이지 이동은 구현한다.** 목록 → 상세 링크, 등록/목록/취소 버튼처럼 다른 화면으로 가는 동작만 실제로 연결한다
   ([페이지 이동] 절). 이동 전에 저장·검증·확인 모달을 거치는 동작은 이동 부분만 연결하지 않고 no-op으로 둔다.
3. **label / type / placeholder는 출처와 완전히 일치.** 출처가 Figma든 기획서든, 여기 세 값은 임의로
   의역하거나 축약하지 않고 그대로 옮긴다.
4. **formRows / columns는 항상 controller.js에 분리.** 페이지 컴포넌트 파일 안에 인라인으로 배열을 선언하지 않는다.

## all 모드 — 모든 페이지 테이블 일괄 생성

요청에 **`all`** 이 붙으면(예: `/create-table all {시트 또는 Figma URL}`, "all로 테이블 다 그려줘") 테이블 하나가 아니라
기획서에 있는 **모든 페이지의 모든 테이블**을 한 번에 만든다. 테이블 하나하나의 작성 규칙(ListTable/InfoTable/FormTable 모드)은 그대로 따른다.

**A1. 자료 확인**
- 시트 URL 또는 Figma URL이 이번 요청이나 대화 맥락에 있어야 한다. 둘 다 없으면 작업하지 말고 URL을 요청한다.
- 둘 다 있으면 둘 다 읽는다: 시트 = 테이블 종류·라벨·데이터, Figma = 셀 스타일·콘텐츠 컴포넌트.

**A2. 전체 테이블 목록 수집**
- **시트:** `https://docs.google.com/spreadsheets/d/{id}/htmlview`에서 시트 탭 목록(`{name, gid}`)을 모으고, `Sitemap` 같은 사이트맵 시트를 제외한
  모든 도메인 시트를 `/export?format=csv&gid={gid}`로 읽는다. 시트 안에서 아래 표기로 페이지·테이블 구간을 나눈다.
  - `page,{페이지명}` 행 → 페이지 시작, 다음 `component,{listTable|infoTable|formTable}` 행 → 그 페이지의 테이블 종류
  - 또는 첫 칸 `{페이지명}/{listTable|infoTable|formTable}` 제목 행
  - 빈 행 또는 다음 `page`/제목 행까지가 한 테이블. 한 페이지에 테이블이 여러 개면 모두 수집한다.
- **Figma:** `Pages` 같은 화면 시안 페이지의 최상위 Frame을 모으고, 각 프레임 안의 TableCommon `Table Cell`/`Form Row` 구성을 `get_metadata`로 찾는다.
  시트와 Figma가 둘 다 있으면 페이지명으로 짝을 맞추고, 한쪽에만 있는 페이지·테이블은 목록에 표시한다.

**A3. 페이지 파일 매칭**
- 페이지명 → 파일은 create-header 규칙을 따른다: 도메인에 페이지가 하나면 `src/pages/{Domain}/index.jsx`, 여러 개면 `src/pages/{Domain}/{페이지명}.jsx`.
- 파일이 **이미 있는 페이지에만** 테이블을 넣는다. 파일·라우트가 없는 페이지는 만들지 않고 목록에 "페이지 없음 → create-header 필요"로 표시한다.
- 페이지명 접미사가 CRUD 규칙과 다르면(`Detail` ↔ 파일 `Read` 등) 매칭 결과를 표에 적어 확인받는다.

**A4. 계획 표 확인 (한 번에)**
파일 작업 전에 전체 계획을 표 하나로 보여주고 확인받은 뒤 턴을 끝낸다. 표기 오류·종류 불일치·애매한 값 같은 확인 항목도 테이블마다 따로 묻지 않고 이 표 아래에 모아서 한 번에 묻는다.

```
| 도메인 | 페이지 | 테이블 종류 | 출처 | 파일 | controller 변수 | 확인 필요 |
|---|---|---|---|---|---|---|
| Notice | NoticeList | ListTable | Notice 시트 | src/pages/Notice/NoticeList.jsx | NOTICELIST_COLUMN | — |
| Confirm | ConfirmRead | InfoTable | Confirm 시트 | src/pages/Confirm/ConfirmRead.jsx | CONFIRMREAD_COLUMN | 시트 표기 formTable → infoTable? |
| Manual | — | — | 시트 없음 | — | — | 테이블 없음 → 건너뜀 |
```

**A5. 일괄 작성**
- 공통 작업을 먼저 한 번만 한다: TableCommon `Table Cell`·셀 콘텐츠 스타일 비교(L2-1, I3), 없는 콘텐츠 컴포넌트(`Checkbox`, `Action` 등) 생성.
  같은 비교·생성을 테이블마다 반복하지 않는다.
- 그다음 페이지별로 해당 모드 규칙대로 `controller.js`(도메인 폴더당 하나, 페이지별 `{페이지명}_COLUMN`을 나란히)와 페이지 컴포넌트를 작성한다.
- 이미 테이블이 들어가 있는 페이지는 덮어쓰지 않고 건너뛴 뒤 보고한다 (사용자가 다시 그리라고 하면 그때만 교체).
- 계획 표에서 "확인 필요"로 남은 테이블은 답을 받기 전까지 만들지 않는다. 나머지는 진행한다.

**A6. 검증·보고**
- `npm run build`로 전체 import 오류를 확인한다. 가능하면 dev 서버에서 각 페이지를 열어 Figma `Table Cell`과 모양을 대조한다.
- 결과를 페이지별 표로 보고한다: 만든 테이블 / 건너뛴 테이블(이유) / 확인 필요 항목.

## 페이지 이동

로직은 만들지 않지만, 화면 간 이동은 실제로 동작하게 연결한다.

**이동 대상 판단**
- 출처(Figma 프로토타입 연결, 기획서의 "클릭 시 상세 이동" 같은 설명, 버튼 문구)에서 이동할 화면이 분명한 것만 연결한다.
  - 목록 행의 `Link` 셀(제목·아이디 등) → 같은 도메인의 상세 화면 (`NoticeList` → `NoticeRead`)
  - `목록` 버튼 → 목록 화면, `등록`/`글쓰기` 버튼 → 등록 화면, `수정` 버튼 → 수정 화면
  - `취소` 버튼 → 이전 화면(`navigate(-1)`) 또는 기획서에 적힌 화면
- 저장·삭제·승인·검색처럼 **데이터 처리가 본질인 버튼은 이동을 붙이지 않는다** (처리 후 이동이 기획돼 있어도 no-op 유지).
- 이동할 화면이 모호하면 짐작하지 말고 사용자에게 확인한다.

**경로 규칙**
- URL은 `src/routes/paths.js`의 `PATH`를 쓴다. 문자열 경로를 하드코딩하지 않는다.
  상세처럼 파라미터가 붙는 경로는 `` `${PATH.NOTICE}/${row.id}` `` 형태로 `PATH` + 파라미터를 조합한다.
- 이동 대상 라우트가 `paths.js`/`router.jsx`에 **이미 있으면 그대로 쓴다.** 없으면 라우트를 임의로 추가하지 말고
  `to=""` + `// TODO: 이동 경로 미정 (라우트 없음: XXX)` 주석으로 남긴 뒤 사용자에게 라우트 추가 여부를 확인한다
  (라우트·페이지 파일 구성은 create-header 스킬 범위).
- 상세 이동 파라미터는 `row.id`(rowKey)를 쓴다. 다른 키가 필요하면 사용자에게 확인한다.

**구현 방식**
- 링크 셀: react-router `<Link to={...} className="link">`. `onClick` 핸들러로 이동하지 않는다.
- 버튼: `useNavigate()`로 `onClick={() => navigate(PATH.XXX)}`. 버튼 컴포넌트·스타일은 기존 것을 그대로 쓴다.
- 이동 외의 부수 동작(상태 저장, 쿼리스트링 유지, 확인 모달 등)은 넣지 않는다.

## 0단계 — 테이블 종류 판단

먼저 만들 테이블이 어떤 종류인지 정한다.

- **FormTable:** 라벨 + 입력칸 쌍이 나열된 등록/수정/검색 폼. Figma에서는 `Form Row` 인스턴스로 구성된다.
  → 아래 입력 모드 판단 → 1~4단계를 따른다.
- **ListTable:** 헤더 1행 + 데이터 여러 행의 목록. Figma에서는 항상 TableCommon의
  `Table Cell`(Role=Header/Body) 인스턴스로 구성된다.
  → [ListTable 모드] 절을 따른다.
- **InfoTable:** 라벨 + 값(읽기 전용)이 나열된 상세 정보 표. 입력칸이 없다. 기획서 시트의 컴포넌트 표기가 `infoTable`이다.
  셀은 ListTable과 같은 TableCommon `Table Cell`(라벨 = Role=Header, 값 = Role=Body)과 셀 콘텐츠 컴포넌트를 공통으로 쓴다.
  → [InfoTable 모드] 절을 따른다.

Figma 링크가 주어졌으면 `get_metadata`로 구조를 확인해서 판단한다. 사용자가 말한 종류와 실제 디자인 구조가
다르면(예: "폼 만들어줘"인데 디자인은 목록형) 억지로 맞추지 말고 사용자에게 확인한다.

### 입력 모드 판단

사용자가 무엇을 줬는지로 아래 두 모드 중 하나를 정한다. 모호하면 먼저 확인한다.

- **모드 A: 신규 Figma 디자인 인스턴스 전달** — 새로 추가된 디자인이 있고 Figma 파일(링크/노드)이 주어진 경우.
  → **[1-A단계]** Figma를 직접 읽어서 컴포넌트명/Variant로 formRows를 만든다.
- **모드 B: 기획서만 전달** — 새로 추가된 인스턴스 없이, 이미 코드베이스에서 쓰고 있던 컴포넌트 인스턴스만
  재사용하는 경우. Figma 파일이 아니라 기획서(텍스트 스펙)만 온다.
  → **[1-B단계]** Figma를 새로 열지 않고, 기획서 + 코드베이스에 이미 있는 같은 종류의 필드 사용례를 근거로 formRows를 만든다.

어느 쪽인지 스스로 판단이 안 서면(예: 기획서에 "새 필드"라고 적혀 있는데 Figma 링크가 없는 경우 등)
추측하지 말고 사용자에게 모드를 확인한다.

## 1단계 — FormTable 컴포넌트 확인

`src/components/Table/Table.jsx`가 지금 작업 트리에 있는지 먼저 확인한다.
그 파일이 export하는 `FormTable`의 실제 props 시그니처와 `renderField`의 `case` 목록을 읽고 그대로 따른다.
아래 "FormTable API"는 참고용이며, 실제 파일 내용이 우선한다.

### FormTable API (참고용 — 실제 파일이 있으면 그 파일이 우선)

```jsx
FormTable({
  formRows,             // 행 단위 2차원 배열 (controller.js의 XXX_COLUMN) — [[필드, 필드], [필드], ...]
  formData,             // { [field.name]: value, ... }
  handleFormChange,     // (e) => void  — e.target.{name,value,type,checked}
  handleDateChange,     // (name, date) => void — type: "date-range"에서만 필요
  activeDateButton,     // string — type: "date-range"에서만 필요
  handleDateButtonClick,// (btn) => void — type: "date-range"에서만 필요
  renderComponent,      // (fieldComponent, field) => node — 선택. 필드 렌더 결과를 감쌀 때만 사용
})
```

- **`formRows`는 2차원 배열이다.** 바깥 배열의 각 항목이 테이블의 한 행(`<tr>`)이고, 안쪽 배열의 각 필드가
  그 행 안의 `라벨(th) + 입력(td)` 한 쌍이 된다. 한 행에 필드가 하나면 `[필드]`, 여러 개를 나란히 두면 `[필드, 필드]`.
- 1차원 배열이나 `fields` prop으로 넘기면 FormTable이 아무것도 렌더링하지 않는다. 반드시 `formRows`로 넘긴다.

안쪽 배열의 각 필드는 아래 `type` 중 하나를 쓴다 (FormTable이 실제로 렌더링을 구현해 둔 타입들이다 —
새 타입을 임의로 만들지 않는다):

| type | 필수 키 | 비고 |
|---|---|---|
| `input` | `name`, `label`, `placeholder` | 텍스트 인풋 |
| `textarea` | `name`, `label`, `placeholder` | |
| `select` | `name`, `label`, `placeholder`, `options` | `options: [{value, label}]` |
| `select-input` | `label`, `selectName`, `selectPlaceholder`, `selectOptions`, `inputName`, `inputPlaceholder` | select + input 조합 |
| `checkbox` | `name`, `label`, `options` | 다중 선택 |
| `radio` | `name`, `label`, `options` | 단일 선택 |
| `file` | `name`, `label` | 선택 키: `accept`, `fileButtonText`(기본 "파일 선택") |
| `date-range` | `label`, `startName`, `endName`, `startPlaceholder`, `endPlaceholder`, `dateButtons` | 기간 검색. 선택 키: `selectName`, `selectOptions`, `selectPlaceholder`, `selectWidth`(기간 앞 select) |

모든 필드에 공통으로 쓸 수 있는 키:

| 키 | 설명 |
|---|---|
| `key` | React key (항상 넣는다) |
| `required` | `true`면 라벨 옆에 필수 표시(`*`) |
| `colSpan` | 입력칸(td)의 colSpan. 한 행의 필드 수가 다른 행과 달라 칸을 넓혀야 할 때 사용 |

## 2단계 — formRows 값 만들기

### 1-A. 모드 A: Figma 디자인에서 추출

1. `use_figma`/`get_design_context` 계열 도구를 쓰기 전에 **`figma-design-to-code` 스킬을 먼저 로드**한다
   (이 프로젝트의 Figma MCP 규칙 — 건너뛰면 흔한 오류가 난다).
2. Figma 링크의 node-id로 먼저 `get_metadata`를 불러서 구조를 파악한다 — 링크가 가리키는 노드가 폼 행이
   아니라 캔버스/페이지 전체일 수 있으므로, 실제 폼 필드들이 들어있는 프레임(자식 노드)을 찾는다.
3. 그 프레임에 `get_design_context`를 호출해서 레이아웃을 읽는다. 이 프로젝트는 폼의 한 행이
   **`Form Row`라는 재사용 컴포넌트**로 되어 있다. Form Row는 TableCommon `Table Cell` 인스턴스 두 개로 구성된다:
   라벨 칸 = `Table Cell`(Role=Header, Content=`Label`), 입력 칸 = `Table Cell`(Role=Body, Content=`Text/Default`·`Select/Default`·`Field/*`).
   라벨 문구와 필수 표시는 노출된 Header Cell > Label의 `Label`/`Required` 프로퍼티에서 읽는다 (`Required=true` → `required: true`).
   체크박스/라디오 옵션 문구는 `Field/Checkbox Group`·`Field/Radio Group`의 `Option 1/2 Label` 프로퍼티에 있다.
   - **행 구성:** `Form Row` 인스턴스 하나 = `formRows`의 한 행이다. 한 행 안에 라벨+입력 쌍이 여러 개 보이면
     그 개수만큼 같은 행 배열에 필드를 넣는다.
   - `Form Row`의 `Type` variant 값은 아래처럼 FormTable의 `type`과 1:1로 대응된다 — 확인된 매핑이니 그대로 쓴다:

   | Figma `Type=` variant | FormTable `type` |
   |---|---|
   | `Input` | `input` |
   | `Textarea` | `textarea` |
   | `Select` | `select` |
   | `Select+Input` | `select-input` |
   | `Checkbox` | `checkbox` |
   | `Radio` | `radio` |
   | `Date-Range` | `date-range` |

   `file` 타입은 대응되는 Figma variant가 없다. 디자인에 파일 첨부 필드가 보이면 `file`로 처리할지 사용자에게 확인한다.

   `Form Row`가 아닌 다른 컴포넌트/구조를 쓰는 디자인이라면(이 프로젝트가 컴포넌트를 바꿨거나, 다른 파일이라면)
   이 매핑을 그대로 적용하지 말고, 실제 컴포넌트명/Variant를 확인해서 위 표의 `type` 중 어디에 대응되는지
   판단한다. 명확히 대응되지 않으면 임의로 끼워 맞추지 말고 **어떤 type으로 처리할지 사용자에게 확인**한다.
4. **label은 인스턴스마다 실제로 오버라이드되지만, placeholder는 그렇지 않을 수 있다.** 이 Figma 파일 기준으로
   `Form Row`의 입력칸은 필드마다 다른 placeholder 문구를 갖지 않고, 컴포넌트 기본값(`입력해주세요.` / `선택하세요.`)
   을 그대로 쓴다 — 라벨(Header Cell > Label)만 프로퍼티로 노출돼 있다 (`Field/Textarea`는 `Placeholder` 프로퍼티가 있다). 즉 `get_design_context` 결과에 필드별로 다른
   placeholder 텍스트가 안 보이는 게 정상일 수 있다. 이 경우 기본값을 그대로 옮기고, 필드마다 구체적인
   placeholder 문구가 필요하면(기획서에 있거나 사용자가 원하면) 임의로 지어내지 말고 사용자에게 확인한다.
5. select/checkbox/radio의 `options` 목록도 Figma 인스턴스에 실제로 보이는 항목 그대로 옮긴다 — 임의로
   줄이거나 늘리지 않는다. **인스턴스가 기본(미선택) 상태라 실제 옵션 값이 안 보이는 경우가 흔하다** — 이럴 땐
   옵션을 지어내지 말고 `options: []`로 비워두고 `// TODO: 실제 옵션 목록 채우기` 주석을 남긴 뒤, 옵션 목록을
   알고 있는지 사용자에게 확인한다(레이아웃 자체는 빈 옵션으로도 정상적으로 조립된다).

### 1-B. 모드 B: 기획서 + 기존 인스턴스 재사용

1. Figma는 새로 열지 않는다 — 새로 추가된 디자인이 없다는 뜻이므로 참고할 새 노드가 없다.
2. 기획서에 적힌 라벨/타입/placeholder 텍스트를 1차 소스로 쓴다. 한 행에 여러 필드를 두는지(행 구성)도
   기획서 기준으로 정하고, 기획서에 행 구성이 없으면 한 행에 필드 하나로 둔다.
3. 같은 종류의 필드(예: 같은 "검색 필터" select-input 조합)를 이미 다른 페이지의 `controller.js`에서
   쓰고 있다면, 그 구조(타입 조합, options 형태 등)를 참고해서 일관성을 맞춘다 — 페이지마다 같은 개념의
   필드를 다른 방식으로 구현하지 않는다.
4. 기획서에 label/type/placeholder 중 하나라도 빠져 있거나 모호하면, 추측해서 채우지 말고 사용자에게
   확인한다.

## 3단계 — controller.js 작성

- **도메인 폴더 = Figma 프레임명.** 페이지는 `src/pages/{Domain}/`처럼 도메인별 폴더로 구분하고, `{Domain}`은
  Figma의 프레임 이름을 그대로 쓴다(기획서 기반인 모드 B라면 기획서가 가리키는 화면명을 쓴다). `controller.js`는
  그 도메인 폴더 안에 둔다.
- **페이지 파일명 규칙**: 그 도메인 안에 프레임이 하나뿐이면 페이지 파일은 `index.jsx`로 만든다. 프레임이
  여러 개(같은 도메인 안에 화면이 여러 개)면 프레임 이름별로 파일을 분리한다(`InquiryList.jsx`, `InquiryDetail.jsx` 등).
  ```
  src/
    pages/
      Home/                  ← 프레임 하나("Home")뿐인 도메인
        index.jsx
        controller.js
      Inquiry/                ← 프레임이 여러 개("InquiryList", "InquiryDetail")인 도메인
        InquiryList.jsx
        InquiryDetail.jsx
        controller.js        ← 이 폴더의 모든 페이지 컴포넌트가 쓰는 COLUMN들을 여기서 export
  ```
  한 도메인 폴더에 페이지 컴포넌트가 여러 개면, 각각의 COLUMN을 같은 `controller.js` 안에 나란히 export한다.
- **변수명 컨벤션**: `{컴포넌트명}_COLUMN` — 여기서 컴포넌트명은 **파일명이 아니라 Figma 프레임명**이다
  (PascalCase 그대로 이어붙여 전부 대문자로 바꾼 뒤 `_COLUMN`을 붙이고, 단어 사이에 언더스코어를 넣지 않는다).
  `InquiryList` → `INQUIRYLIST_COLUMN`, `InquiryDetail` → `INQUIRYDETAIL_COLUMN`. 프레임이 하나라 파일명이
  `index.jsx`가 된 경우에도 `INDEX_COLUMN`이 아니라 프레임명 기준으로 짓는다 — `Home` → `HOME_COLUMN`
  (`index`라는 파일명은 단일 프레임일 때의 파일 위치 규칙일 뿐, 컴포넌트 정체성과 무관하다).
- **내용**: `export const XXX_COLUMN = [ [필드, ...], [필드], ... ]` 형태의 **행 단위 2차원 배열**로,
  2단계에서 만든 formRows를 그대로 내보낸다.

```js
// src/pages/Inquiry/controller.js
export const INQUIRYLIST_COLUMN = [
  // 1행: 필드 두 개를 나란히
  [
    {
      key: "title",
      name: "title",
      label: "제목",
      type: "input",
      placeholder: "제목을 입력하세요",
      required: true,
    },
    {
      key: "category",
      name: "category",
      label: "카테고리",
      type: "select",
      placeholder: "카테고리 선택",
      options: [
        { value: "billing", label: "결제" },
        { value: "etc", label: "기타" },
      ],
    },
  ],
  // 2행: 필드 하나 (1행보다 필드 수가 적으므로 colSpan으로 입력칸을 넓힌다)
  [
    {
      key: "content",
      name: "content",
      label: "내용",
      type: "textarea",
      placeholder: "내용을 입력하세요",
      colSpan: 3,
    },
  ],
];
```

## 4단계 — 페이지 컴포넌트에서 조립

페이지 컴포넌트에서 `controller.js`의 COLUMN을 import해서 `FormTable`의 **`formRows`** prop에 그대로 넘긴다.
기능은 만들지 않으므로 `formData`/`handleFormChange`는 화면이 죽지 않을 정도의 최소 뼈대만 둔다.

```jsx
import { FormTable } from "@/components/Table/Table";
import { INQUIRYLIST_COLUMN } from "./controller";

const InquiryList = () => {
  // 레이아웃 전용 — 실제 상태 관리/검색 로직은 이 스킬 범위가 아니다.
  const formData = {};
  const handleFormChange = () => {};

  return <FormTable formRows={INQUIRYLIST_COLUMN} formData={formData} handleFormChange={handleFormChange} />;
};

export default InquiryList;
```

`date-range` 타입이 포함된 경우에만 `handleDateChange`/`activeDateButton`/`handleDateButtonClick`도
같은 방식의 no-op/더미 값으로 채운다.

## ListTable 모드

### L1. ListTable 컴포넌트 확인

`src/components/Table/Table.jsx`의 `ListTable` 실제 props를 읽고 그대로 따른다. 아래는 참고용이며 실제 파일이 우선한다.

```jsx
ListTable({
  columns,      // [{ key, header, width?, align? }] — controller.js의 XXX_COLUMN
  rows,         // 데이터 배열
  rowKey,       // 행 고유 키 필드명 (기본 "id")
  renderCell,   // (row, col) => node — 셀 콘텐츠를 컴포넌트로 그릴 때 사용
  pagination,   // boolean — 기획서/디자인에 페이지네이션이 있을 때만 true
  currentPage, totalCount, pageSize, onPageChange, // pagination 사용 시에만
})
```

- `width`는 px 숫자. 생략하면 남는 폭을 나눠 갖는다.
- `align`은 `"left" | "center" | "right"` (기본 center). Figma `Table Cell`의 `Align` variant를 그대로 옮긴다.

### L2. Figma → columns 추출

1. `figma-design-to-code` 스킬을 먼저 로드하고, `get_metadata`로 헤더 행과 데이터 행을 찾는다.
2. 헤더 행의 각 셀 → `columns` 한 항목. `header`는 헤더 셀 텍스트 그대로, 순서도 그대로.
3. `width`는 Figma 셀 너비 그대로. Figma에서 남는 폭을 채우는(FILL) 셀은 `width`를 생략한다.
4. `key`는 컬럼 의미를 나타내는 camelCase 영문으로 짓는다 (예: 아이디 → `userId`, 처리상태 → `state`).

### L2-0. 기획서(구글 시트) 셀 표기 해석

기획서가 구글 시트로 오면 셀 값을 아래 규칙으로**만** 해석한다.
코드에는 이 표기를 읽는 파서가 없고, 시트를 읽어 `controller.js`를 쓰는 것은 이 스킬을 실행하는 쪽이다.
그래서 규칙에 안 맞는 표기를 짐작으로 보정하면 틀린 시트가 그대로 통과된다. 보정하지 않는다.

| 표기 | 의미 | 예 |
|---|---|---|
| `#컴포넌트_variant` | Figma 컴포넌트의 variant 선택. 표시 문구는 Figma variant 안의 텍스트를 따른다 | `#grade_free` → Grade=Free ("Free Trial") |
| `#컴포넌트 텍스트` (띄어쓰기) | 그 텍스트를 컴포넌트 문구로 넣는다 | `#link dmodj_02` → 링크 문구 "dmodj_02" |
| `#컴포넌트_variant 텍스트` | variant 선택 + 문구 | `#action_button2 해지` → `<Action variant="button2">해지</Action>` |
| `#check_true` / `#check_false` | 체크박스 체크 / 해제 (`defaultChecked`). `#check`만 있으면 해제 | |
| 한 셀에 버튼 표기 여러 개 | 버튼 여러 개를 나란히. 표기 순서 = 버튼 순서. 아래 **한 셀 다중 버튼** 규칙 | `#button2 승인하기 #button4 거절하기` |
| 헤더의 `#width숫자` | 컬럼 width(px). 헤더 텍스트에서는 이 표기를 뺀다 | `서비스 이용기간 #width300` |
| `#align_left` / `_center` / `_right` | 텍스트 정렬. Figma `Table Cell`의 Align variant. 표기가 없으면 center | `아이디 #align_left` |
| `#` 없음 | 일반 텍스트 | |

**덧붙이는 표기(`#width`, `#align`)**: 셀 값 뒤에 띄어쓰기로 붙인다. 이 표기는 문구가 아니므로 화면 텍스트에서 뺀다.
- 헤더 셀의 `#align_*` → 그 컬럼 전체 정렬. `XXX_COLUMN`의 `align`에 `"left" | "center" | "right"`로 넣는다.
- 바디 셀의 `#align_*` → 그 셀만 정렬. 현재 `ListTable`은 컬럼 단위 `align`만 지원하므로, 바디 셀에만 있으면
  임의로 컬럼 전체에 적용하지 말고 사용자에게 처리 방법을 확인한다.
- `left`/`center`/`right` 외의 값은 Figma Align variant에 없으므로 사용자에게 확인한다.

**컴포넌트명 매칭:** `#` 뒤의 컴포넌트명은 Figma TableCommon(파일 `xHDoGiS1XI5eVkCDSRw1qy`, node `442:727`)의
라벨과 대소문자 무시하고 정확히 일치해야 한다. 현재 라벨과 코드 대응은 다음과 같다.

| 시트 컴포넌트명 | Figma (TableCommon) | 코드 |
|---|---|---|
| `link` | `#Link` | `<Link className="link">` |
| `check` | `#Check` (Checkbox 해제/체크) | `<Checkbox />` / `<Checkbox defaultChecked />` |
| `align` | `#Align` → `Table Cell` Align (Left/Center/Right) | `XXX_COLUMN`의 `align` |
| `width` | `#Width` → 셀 너비 | `XXX_COLUMN`의 `width` |
| `grade` | `#Grade` (Basic/Free/Standard/Premium/Enterprise) | `<Grade grade="…" />` |
| `state` | `#State` (complete/pending) | `<Badge state="…" />` |
| `badge` | `#Badge` (fixed) | `<Fixed />` |
| `action` | `#Action` (Action=Button/Button2/Button3/Button4) | `<Action variant="…">` |
| `button`, `buttonN` (예외) | `#Action` Action=Button / ButtonN | `<Action variant="buttonN">` |
| 한 셀 버튼 2개 | `#ActionGroup` → `Action Group` (Action 1, Action 2) | `<ActionGroup>` + `<Action>` × 2 |

- 작업 전에 `get_metadata`로 TableCommon 라벨을 다시 읽어 위 표가 최신인지 확인한다.
- **버튼 예외:** `#button`, `#button2`, `#button3`, `#buttonN`은 컴포넌트명 없이 Action variant에 바로 대응한다.
  `#button 해지` → Action=Button, `#button2 해지` → Action=Button2 (`<Action variant="button2">해지</Action>`).
  `#action_button2 해지`도 같은 뜻으로 받는다. `ButtonN` variant가 Figma에 없으면 사용자에게 확인한다.
- **한 셀 다중 버튼:** 한 셀에 버튼 표기가 2개 있으면 Figma `Action Group`(TableCommon `#ActionGroup`, node `487:329`)에 대응한다.
  각 버튼의 텍스트는 다음 `#` 앞까지다. 코드는 `<ActionGroup>` 안에 `<Action>`을 표기 순서대로 넣는다.
  버튼이 3개 이상이거나 버튼과 다른 컴포넌트를 한 셀에 섞은 표기는 Figma에 대응 컴포넌트가 없으므로 사용자에게 확인한다.
- **버튼 외에는 이름이 맞지 않으면 짐작해서 채우지 말고 사용자에게 알린다.** 예: `#status_complete`는 Figma에 `#Status` 라벨이 없으므로
  `#State`라고 추정해서 넣지 말고, `#state_complete`로 고쳐야 하는지 확인한다.
- variant 값이 해당 Figma 컴포넌트에 없을 때도 같은 방식으로 확인한다.
- 시트 링크는 `/export?format=csv&gid={gid}`로 CSV를 받아 읽는다. 사용자가 시트를 고쳤다고 하면 다시 받아 읽는다.

### L2-1. 셀 스타일 확인 (Figma Table Cell → 코드)

**기존 코드의 ListTable 스타일(`table.styles.js` list 영역, `/components/table` 예시)을 Figma 디자인으로 간주하지 않는다.**
셀 자체 스타일도 반드시 Figma에서 읽어서 비교한다.

1. TableCommon `Table Cell`(Role=Header/Body)에 `get_design_context`를 호출해 아래 값을 읽는다.
   - 헤더: 배경, 위/아래 테두리, 높이, 패딩, 글자 크기·굵기·줄 높이·색
   - 바디: 아래 테두리, 높이, 패딩, 글자 크기·굵기·줄 높이·색
   - 기본 정렬(Align variant)
2. 셀 콘텐츠(Text, Link 등)의 글자 크기·굵기·줄 높이·색도 같은 방식으로 읽는다.
3. 현재 `table.styles.js`의 list 영역과 **항목별로 비교표를 만들어 보고**한다.
4. 차이가 있으면 적용 범위를 사용자에게 확인한 뒤 Figma 값으로 맞춘다. 색상은 theme.js 토큰(`colors.table` 등)으로 쓴다.
   - **공통 적용:** `table.styles.js`의 list 영역을 수정한다. ListTable을 쓰는 모든 화면(예: `/components/table`)의 모양이 바뀌므로 영향받는 화면을 먼저 알린다.
   - **페이지에만 적용:** 공통 스타일은 그대로 두고, 페이지 폴더의 `{Domain}.styles.js`에 래퍼(예: `UserListTableWrap`)를 만들어
     `table th`, `table td`로 덮어쓴 뒤 ListTable을 감싼다.
5. 글꼴 family가 프로젝트 전역 글꼴과 다르면 임의로 바꾸지 말고 사용자에게 확인한다.

### L3. 셀 콘텐츠 매칭 (Figma TableCommon → 코드)

데이터 행 각 셀의 `Table Cell` Content(Instance Swap)를 확인해서 아래처럼 매칭한다. 확인된 매핑이니 그대로 쓴다.

| Figma 셀 콘텐츠 | 코드 |
|---|---|
| `Text` | 기본 텍스트 (`row[col.key]` 그대로 반환) |
| `Link` | react-router `<Link to={`${PATH.XXX}/${row.id}`} className="link">` — [페이지 이동] 규칙. 라우트가 없거나 대상이 모호하면 `to=""` + `// TODO` 주석 |
| `Grade` (Grade=Free 등) | `<Grade grade="free" />` — variant 값을 소문자로 |
| `Badge` (State=complete 등) | `<Badge state="complete" />` |
| `Fixed` | `<Fixed />` |
| `Action` (Button / Button2 / Button3 / Button4) | `<Action variant="button2">{문구}</Action>` — variant 값을 소문자로, 기본 `button`. className은 `action button2` |
| `Action Group` (Action 1, Action 2) | `<ActionGroup>{actions.map(a => <Action key={a.label} variant={a.variant}>{a.label}</Action>)}</ActionGroup>` — className `action-group`. 버튼 사이 간격은 Figma `spacing/default`(10px) |
| `Checkbox` (Check=False / True, State=Disabled) | `<Checkbox />` — 체크는 `defaultChecked`, Disabled는 `disabled`. 기본 `<input type="checkbox" />`를 그대로 쓰지 않는다 |

- variant가 있는 컴포넌트는 Figma variant 값을 소문자로 바꿔 className 두 번째 클래스로 쓴다
  (`Grade=Free` → `grade free`, `State=pending` → `badge pending`, `Action=Button3` → `action button3`).
  Figma에 variant가 추가되면 `table.styles.js`에도 같은 이름으로 스타일을 추가한다.
- `ActionGroup`이 `Table.jsx`에 없으면 아래 기본 처리대로 만든다 (`<div className="action-group">{children}</div>`, 스타일은 `table.styles.js` 리스트 영역에 `display: inline-flex; gap: 10px;`).
- `Grade`/`Badge`/`Fixed`/`Action`/`Checkbox`는 `Table.jsx`에 className 방식(`grade free`, `badge complete`, `badge fixed`, `action button`, `checkbox`)으로 있고,
  스타일은 `table.styles.js`의 리스트 테이블 영역, 색상은 `theme.js` 토큰(`colors.grade`, `colors.badge`, `colors.tableAction`, `colors.link`, `colors.checkbox`)에 있다.
- `Checkbox`는 Figma Checkbox(Design systems 페이지 `158:588`)의 SVG 아이콘을 그대로 쓰고, 실제 `<input type="checkbox">`는 투명하게 위에 덮는다.
  SVG에는 색을 넣지 않고 `table.styles.js`에서 `colors.checkbox` 토큰으로 칠한다. 전역 GlobalStyle 체크박스(20px)는 Figma와 다르므로 리스트 테이블에서 쓰지 않는다.

**TableCommon 콘텐츠 컴포넌트의 기본 처리**

- TableCommon의 셀 콘텐츠(Action, Grade, Badge, Fixed 등)에 해당하는 전용 컴포넌트가 코드에 따로 없는 것은 **정상**이다.
  `Button` 같은 범용 공통 컴포넌트로 대체하지 않는다.
- 코드에 없으면 **기본으로 `Table.jsx`에 className 기반 컴포넌트를 만든다** (별도 승인 불필요).
  - 컴포넌트명·variant 값은 Figma 이름 그대로 쓴다 (`Action` → `<Action>`, `State=pending` → `badge pending`).
  - 크기·여백·모서리·글자 등 스타일 값은 Figma `get_design_context` 값을 그대로 `table.styles.js`의 리스트 테이블 영역에 옮긴다.
  - 색상은 `theme.js` 토큰으로 추가해서 쓰고, Figma 색상 값을 스타일에 직접 쓰지 않는다.
- TableCommon에 없는 콘텐츠(디자인 시스템 밖의 새 요소)는 만들기 전에 사용자에게 확인한다.

### L4. controller.js 작성

- 파일 위치·도메인 폴더·변수명 규칙은 3단계와 같다 (`{프레임명}_COLUMN`). 사용자가 파일 위치를 직접 지정하면 그 위치를 따르고, 변수명은 프레임명 기준을 유지한다.
- `XXX_COLUMN`에는 `{ key, header, width, align }`만 둔다. controller.js는 JSX를 쓸 수 없으므로,
  헤더에 체크박스 같은 요소가 필요하면 `header`에는 텍스트를 두고 페이지에서 해당 컬럼만 바꿔 끼운다.
- **기획서 시트에 데이터 행이 있으면 기본으로 그 행을 그대로 더미 데이터로 넣는다 (별도 승인 불필요).**
  `XXX_DUMMY_ROWS`로 controller.js에 두고 `// 레이아웃 확인용 더미 데이터 (기획서 시트 그대로) — API 연동 시 교체` 주석을 단다.
  - 시트의 데이터 행 전체를 순서대로 옮긴다. 행을 줄이거나 늘리지 않고, 값을 바꾸거나 지어내지 않는다.
  - 셀 값은 L2-0 표기 규칙으로 해석해 필드에 나눠 넣는다 (`#grade_free` → `grade: "free"`, `#link dmodj_02` → `userId: "dmodj_02"`,
    `#check_true` → `checked: true`, `#badge_fixed` → `fixed: true`, `#button2 해지` → `manage: "해지", manageVariant: "button2"`,
    한 셀 다중 버튼 `#button2 승인하기 #button4 거절하기` → `manageActions: [{ variant: "button2", label: "승인하기" }, { variant: "button4", label: "거절하기" }]`).
    `#width`/`#align` 같은 덧붙이는 표기는 값에서 뺀다.
  - 각 행에는 고유 `id`를 넣는다 (시트 행 순서대로 1부터).
- 기획서에 데이터 행이 없거나(Figma만 있는 경우 등) 시트 외 출처의 값을 쓰려면, 하드코딩이므로 넣기 전에 사용자에게 확인한다.

```js
// src/pages/Home/controller.js
export const USERLISTTABLE_COLUMN = [
  { key: "check", header: "선택", width: 60 },
  { key: "grade", header: "등급", width: 130 },
  { key: "userId", header: "아이디" },            // Figma에서 FILL → width 생략
  { key: "state", header: "처리상태", width: 120 },
];

// 레이아웃 확인용 더미 데이터 (기획서 시트 그대로) — API 연동 시 교체
export const USERLISTTABLE_DUMMY_ROWS = [
  { id: 1, fixed: true, grade: "free", userId: "dfjasdhjfk01", state: "complete" },
];
```

### L5. 페이지 컴포넌트에서 조립

```jsx
import { Badge, Checkbox, Fixed, Grade, ListTable } from "@/components/Table/Table";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/paths";
import { USERLISTTABLE_COLUMN, USERLISTTABLE_DUMMY_ROWS } from "./controller";

// 레이아웃 전용 — 체크/버튼 등 기능 로직은 포함하지 않는다. 페이지 이동만 연결한다.
const columns = USERLISTTABLE_COLUMN.map((col) =>
  col.key === "check" ? { ...col, header: <Checkbox aria-label={col.header} /> } : col,
);

const renderCell = (row, col) => {
  switch (col.key) {
    case "check":
      return row.fixed ? <Fixed /> : <Checkbox defaultChecked={row.checked} />;
    case "grade":
      return <Grade grade={row.grade} />;
    case "userId":
      // 상세 화면 이동 — PATH 키는 paths.js에 실제로 있는 것만 쓴다 (예: PATH.NOTICE → NOTICE_READ ":id")
      // 라우트가 없으면 to="" + TODO 주석으로 두고 사용자에게 확인
      return <Link to={`${PATH.NOTICE}/${row.id}`} className="link">{row.userId}</Link>;
    case "state":
      return <Badge state={row.state} />;
    default:
      return row[col.key];
  }
};

const Home = () => <ListTable columns={columns} rows={USERLISTTABLE_DUMMY_ROWS} rowKey="id" renderCell={renderCell} />;
```

- 체크박스는 상태 없이(uncontrolled) 두고, 데이터 처리 버튼(해지·승인·삭제 등)에는 핸들러를 달지 않는다.
- 링크·이동 버튼은 [페이지 이동] 규칙대로 실제 경로를 연결한다.
- `pagination`은 디자인/기획서에 페이지네이션이 있을 때만 켜고, 이때도 `onPageChange`는 no-op으로 둔다.

## InfoTable 모드

상세(`Read`) 화면처럼 라벨 + 값을 보여주기만 하는 표. `src/components/Table/Table.jsx`의 `InfoTable`을 쓴다.

### I1. InfoTable 컴포넌트 확인

`InfoTable`의 실제 props를 읽고 그대로 따른다. 아래는 참고용이며 실제 파일이 우선한다.

```jsx
InfoTable({
  rows,          // 행 단위 2차원 배열 — [[{ label, value, colSpan? }, ...], ...]
  emptyMessage,  // rows가 비었을 때 문구
})
```

- 바깥 배열 항목 하나 = `<tr>` 한 줄, 안쪽 항목 하나 = `라벨(th) + 값(td)` 한 쌍.
- 행마다 쌍 개수가 달라도 `InfoTable`이 가장 긴 행 기준으로 `colSpan`을 자동 계산한다. 직접 `colSpan`을 넣지 않는다 (기획서에 칸 병합이 따로 적혀 있을 때만).
- `value`는 텍스트 또는 JSX(셀 콘텐츠 컴포넌트)를 받는다.

### I2. 기획서 시트 → rows 변환

시트에서 `component,infoTable` 행(또는 `{페이지명}/infoTable` 제목 행)부터 빈 행 또는 다음 `page`/제목 행 전까지가 그 표다.

- **시트 한 줄 = rows 한 행.** 칸을 왼쪽부터 2개씩 묶어 `라벨, 값` 한 쌍으로 만든다. 값이 없는 뒤쪽 빈 칸은 버린다.
  ```
  제목,제목영역입니다.,고정,#check 게시글 고정   → [ {제목}, {고정} ]
  내용,아 이것좀 확인해주세요!!!!!!!!!!!          → [ {내용} ]
  첨부파일,34230.jpg                              → [ {첨부파일} ]
  ```
- 라벨 칸 문구는 그대로 `label`. 값 칸은 L2-0 표기 규칙으로 해석한다 (`#` 없으면 일반 텍스트).
- 쌍이 맞지 않는 행(라벨만 있고 값 칸이 없는 경우, 칸 개수가 홀수)은 짐작하지 말고 사용자에게 확인한다.
- **컴포넌트 표기 확인:** 상세(읽기 전용) 화면인데 시트에 `formTable`로 적혀 있으면 `InfoTable`로 바꿔 짐작하지 말고,
  시트를 `infoTable`로 고쳐야 하는지 사용자에게 확인한다. (`formTable` = 입력 폼 `FormTable`, `infoTable` = 표시용 `InfoTable`)

### I3. 셀 콘텐츠 — TableCommon 공통 사용

InfoTable의 값 칸은 **ListTable과 같은 TableCommon 셀 콘텐츠 컴포넌트**를 쓴다. 매핑은 L2-0(컴포넌트명 매칭)·L3 표를 그대로 따른다.

| 시트 값 | 코드 (`value`) |
|---|---|
| 일반 텍스트 | 문자열 그대로 |
| `#link 텍스트` | `<Link to={...} className="link">텍스트</Link>` — [페이지 이동] 규칙 |
| `#check` / `#check_false` / `#check_true` | `<Checkbox />` / `<Checkbox defaultChecked />` |
| `#check 텍스트` | `<Checkbox />` + 옆에 텍스트 문구 (예: `#check 게시글 고정` → 체크 해제 체크박스 + "게시글 고정") |
| `#grade_*`, `#state_*`, `#badge_fixed` | `<Grade />`, `<Badge />`, `<Fixed />` |
| `#button…`, `#action_…`, 한 셀 다중 버튼 | `<Action />`, `<ActionGroup>` |

- 체크박스는 전역 `input[type="checkbox"]`나 `<label><input/></label>`을 직접 쓰지 않고 TableCommon `Checkbox`(Figma `158:588`)를 쓴다.
  `#check 텍스트`처럼 문구가 붙는 경우 Figma Checkbox에 문구 슬롯이 없으면, 체크박스와 문구를 어떻게 묶을지(간격 등) Figma `Table Cell` 값을 읽어 맞추고, 대응 디자인이 없으면 사용자에게 확인한다.
- 일반 `Button` 같은 범용 컴포넌트로 대체하지 않는다. 필요한 콘텐츠 컴포넌트가 `Table.jsx`에 없으면 L3 "기본 처리"대로 만든다.
- 콘텐츠 컴포넌트 스타일이 `table.styles.js`의 리스트 테이블 영역에만 걸려 있으면 InfoTable(`variant="info"`)에서도 같은 모양이 나오도록
  공통 영역으로 옮기거나 info 영역에도 적용한다 (모양을 따로 만들지 않는다).
- 셀 자체 스타일(라벨 칸 배경·테두리·패딩·글자, 값 칸 패딩·글자)도 L2-1과 같은 방식으로 Figma `Table Cell`(Role=Header/Body)과 `table.styles.js`의 info 영역을 비교해 보고한다.

### I4. controller.js 작성

controller.js에는 JSX를 쓸 수 없으므로 **구조(라벨)와 데이터(값)를 나눠** 둔다. 파일 위치·변수명 규칙은 3단계와 같다.

```js
// src/pages/Confirm/controller.js
// ConfirmRead — InfoTable 행 구성 (기획서 시트 순서 그대로)
export const CONFIRMREAD_COLUMN = [
  [
    { key: "title", label: "제목" },
    { key: "fixed", label: "고정" },
  ],
  [{ key: "content", label: "내용" }],
  [{ key: "file", label: "첨부파일" }],
];

// 레이아웃 확인용 더미 데이터 (기획서 시트 그대로) — API 연동 시 교체
export const CONFIRMREAD_DUMMY_DATA = {
  title: "제목영역입니다.",
  fixed: { checked: false, label: "게시글 고정" }, // #check 게시글 고정
  content: "아 이것좀 확인해주세요!!!!!!!!!!!",
  file: "34230.jpg",
};
```

- 시트 값은 L4와 같은 방식으로 해석해 필드로 넣는다 (`#check_true` → `checked: true`, `#button2 해지` → `{ label: "해지", variant: "button2" }` 등). 값을 지어내지 않는다.

### I5. 페이지 컴포넌트에서 조립

```jsx
import { Checkbox, InfoTable } from "@/components/Table/Table";
import { CONFIRMREAD_COLUMN, CONFIRMREAD_DUMMY_DATA } from "./controller";

// 레이아웃 전용 — 체크/버튼 기능 로직은 넣지 않는다.
const renderValue = (key, data) => {
  switch (key) {
    case "fixed":
      return (
        <span className="check-text">
          <Checkbox defaultChecked={data.fixed.checked} aria-label={data.fixed.label} />
          {data.fixed.label}
        </span>
      );
    default:
      return data[key];
  }
};

const infoTableRows = CONFIRMREAD_COLUMN.map((row) =>
  row.map(({ key, label }) => ({ key, label, value: renderValue(key, CONFIRMREAD_DUMMY_DATA) })),
);

const ConfirmRead = () => <InfoTable rows={infoTableRows} />;
```

- 행 배열을 페이지 안에 직접 리터럴로 쓰지 않고, controller.js의 COLUMN + 데이터를 `renderValue`로 변환해 만든다.
- 체크박스는 uncontrolled(`defaultChecked`)로 두고, 데이터 처리 버튼에는 핸들러를 달지 않는다. 이동 버튼·링크만 [페이지 이동] 규칙대로 연결한다.

## 보고 언어

- 작업 계획 보고, **확인 메시지(질문·진행 여부 확인·멈춤 안내)**, 결과 보고는 **모두 한글로** 작성한다. 코드·파일명·컴포넌트명·node-id 같은 식별자만 원문 그대로 둔다.
- **보내기 직전 점검:** 메시지 전체를 다시 읽고 영어 문장(제목·표 헤더·설명 포함)이 하나라도 있으면 한글로 바꾼 뒤 보낸다. 작업을 중간에 멈추고 묻는 메시지도 예외가 아니다.
- 작업이 끝나면 한글로 완료 보고를 한다 (무엇을 했는지 / 못 한 것 / 확인 필요 항목).

## 마지막 검증 체크리스트

- [ ] 확인 메시지·결과 보고를 한글로 작성했는가 (식별자 제외)
**all 모드**
- [ ] 사이트맵을 뺀 모든 도메인 시트(와 Figma 화면 프레임)에서 페이지·테이블을 빠짐없이 모았는가
- [ ] 파일 작업 전에 전체 계획 표와 확인 항목을 한 번에 보여주고 답을 받았는가
- [ ] 페이지 파일이 없는 테이블은 만들지 않고 "create-header 필요"로 보고했는가
- [ ] 공통 스타일 비교·콘텐츠 컴포넌트 생성을 한 번만 했고, 이미 테이블이 있는 페이지는 건너뛰었는가
- [ ] 빌드 확인 후 페이지별 결과 표(만든 것 / 건너뛴 것 / 확인 필요)로 보고했는가
**ListTable 모드**
- [ ] 헤더·바디 셀 스타일(배경, 테두리, 높이, 패딩, 글자, 정렬)을 Figma `Table Cell`에서 읽어 비교했고, 기존 코드 스타일을 Figma 값으로 착각하지 않았는가
- [ ] 시트 기획서라면 셀 표기를 L2-0 규칙대로만 해석했고, Figma TableCommon 라벨·variant와 안 맞는 표기는 짐작하지 않고 사용자에게 알렸는가
- [ ] columns가 controller.js의 `{프레임명}_COLUMN`에 있고, header 순서·문구·width가 Figma와 일치하는가
- [ ] 셀 콘텐츠가 L3 매핑대로(Grade/Badge/Fixed/Action/ActionGroup/Link/Checkbox) 연결됐고, TableCommon 콘텐츠를 `Button` 등 범용 컴포넌트로 대체하지 않았는가
- [ ] 새로 만든 TableCommon 콘텐츠 컴포넌트의 스타일이 Figma 값과 일치하고, 색상은 theme.js 토큰으로만 썼는가
- [ ] TableCommon에 없는 새 요소를 만들었다면 사용자 확인을 받았는가
- [ ] 기획서 시트에 데이터 행이 있으면 전체 행을 그대로 `XXX_DUMMY_ROWS` + 교체 주석으로 controller.js에 넣었는가 (시트에 없는 값은 사용자 확인)
- [ ] 체크/데이터 처리 버튼/페이지네이션에 기능 로직을 넣지 않았는가
- [ ] 링크·이동 버튼은 `PATH` 기반 실제 경로로 연결했고, 라우트가 없거나 대상이 모호한 것은 TODO + 사용자 확인으로 남겼는가

**InfoTable 모드**
- [ ] 시트 한 줄 = rows 한 행, 칸 2개씩 `label`/`value` 쌍으로 옮겼고, 빈 칸·홀수 칸은 짐작하지 않고 확인했는가
- [ ] 상세 화면인데 시트가 `formTable`로 적혀 있으면 `infoTable`로 고칠지 사용자에게 확인했는가
- [ ] 값 칸의 `#` 표기를 L2-0/L3 매핑대로 TableCommon 콘텐츠 컴포넌트(`Checkbox`/`Link`/`Grade`/`Badge`/`Fixed`/`Action`/`ActionGroup`)로 그렸고, 전역 체크박스나 `Button`으로 대체하지 않았는가
- [ ] 콘텐츠 컴포넌트가 InfoTable 안에서도 ListTable과 같은 모양으로 보이는가 (스타일이 리스트 영역에만 걸려 있지 않은가)
- [ ] 구조(`{프레임명}_COLUMN`)와 더미 데이터(`{프레임명}_DUMMY_DATA`)를 controller.js에 두고, 페이지에서 `renderValue`로 rows를 만들었는가

**FormTable 모드**
- [ ] formRows가 페이지 컴포넌트 안이 아니라 `controller.js`에 있고, 변수명이 `{프레임명}_COLUMN` 규칙(파일명이 아닌 프레임명 기준)을 따르는가
- [ ] COLUMN이 행 단위 2차원 배열이고, 페이지에서 `fields`가 아니라 `formRows` prop으로 넘겼는가
- [ ] 도메인 폴더명 = 프레임명이고, 프레임이 하나면 `index.jsx`, 여러 개면 프레임별로 파일이 분리돼 있는가
- [ ] 모든 필드의 `label`/`type`/`placeholder`가 출처(Figma 또는 기획서)와 정확히 일치하는가 — Figma 기준일 때
      placeholder가 필드마다 다르지 않고 컴포넌트 기본값 그대로인 게 이 디자인 시스템에서는 정상일 수 있음을 확인했는가
- [ ] `type`이 FormTable이 실제로 지원하는 값(`input`/`textarea`/`select`/`select-input`/`checkbox`/`radio`/`file`/`date-range` 중
      현재 `Table.jsx`의 `renderField`에 구현된 것) 중 하나인가
- [ ] select/checkbox/radio의 `options`을 Figma/기획서에서 확인할 수 없었다면, 지어내지 않고 `options: []` + TODO
      주석으로 남기고 사용자에게 확인했는가
- [ ] 새로 만든 컴포넌트나 값 없이, 기존 `FormTable` 그대로 재사용했는가
- [ ] 하드코딩한 부분(옵션 값, 테마 색상 매핑 등)이 있다면, 무엇을 왜 하드코딩했는지 사용자에게 먼저 확인받았는가
- [ ] 검색/저장/유효성 검사 같은 기능 로직을 추가하지 않고 레이아웃만 만들었는가
- [ ] 목록/취소/등록 등 화면 이동 버튼은 `useNavigate` + `PATH`로 연결했는가 (저장·삭제 등 데이터 처리 버튼은 no-op)
