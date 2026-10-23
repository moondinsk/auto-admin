---
name: create-components
description: Figma 디자인 시스템 Components 페이지의 Layout 및 Asset 카드에 있는 컴포넌트를 분석하여 프로젝트 전역에서 재사용할 React 공통 컴포넌트를 생성한다. Layout은 src/components/Layout/, Asset은 src/components/asset/에 저장한다. "create-components", "피그마 컴포넌트 코드로 만들어줘", "공통 컴포넌트 만들어줘", "Grade 뱃지 컴포넌트 만들어줘", "SubTitle/ArticleTitle 컴포넌트로 만들어줘" 등의 요청에서 사용한다. Figma 파일은 수정하지 않는다.
---

# /create-components

## 목적

디자인 시스템 Figma의 **Components 페이지**에서 지정된 컴포넌트를 분석하고, 모든 페이지에서 공통으로 import하여 사용할 수 있는 React 컴포넌트로 구현한다.

### 대상 및 저장 경로

Figma `Components` 페이지의 컴포넌트를 동적으로 탐색한다.

1. Components 페이지에서 컴포넌트를 포함하는 Frame을 탐색한다.
2. 각 Frame 내부의 `_Division` 텍스트를 확인하여 컴포넌트 분류를 식별한다.
3. Frame 내부의 `COMPONENT` 및 `COMPONENT_SET`을 추출한다.
4. 프로젝트의 `src/components/` 내부 폴더 구조를 확인한다.
5. Figma `_Division` 분류에 대응하는 기존 폴더가 있으면 해당 폴더에 저장한다.
6. 최초 생성 시 이미 같은 컴포넌트에 같은 이름이 있는 경우 덮어쓰기 전에 사용자에게 확인 후 결정.
7. 기존 폴더의 대소문자 표기를 유지한다.

**저장 경로 결정 우선순위**

- 1순위: 사용자가 명시한 저장 경로
- 2순위: 프로젝트 내 기존 컴포넌트의 저장 경로 및 분류
- 3순위: Figma `_Division` 분류에 대응하는 기존 폴더

Figma의 Frame 이름과 React 폴더명이 반드시 일치한다고 가정하지 않는다.

컴포넌트 이름은 Figma의 `COMPONENT` 또는 `COMPONENT_SET` 이름을 기준으로 한다.

### 기본 원칙

- 결과물은 React 소스 코드다.
- Figma 파일은 읽기 전용으로 사용하며 수정하지 않는다.
- 페이지 컴포넌트, 라우터, 화면 전체는 생성하지 않는다.
- 기존 프로젝트의 컴포넌트 구조와 디자인 토큰을 우선 재사용한다.
- 기존 파일을 임의로 덮어쓰거나 삭제하지 않는다.
- Figma의 시각적 계층을 React 컴포넌트 계층으로 무조건 복제하지 않는다.
- 재사용 가능한 단위만 컴포넌트로 구현한다.
- 컴포넌트의 스타일은 특정 페이지에 종속되지 않도록 한다.

`src/components/Layout/`은 기존 폴더이며 `CardSection.jsx`가 존재한다.

새로운 `layout/` 폴더를 만들지 않고 기존 `Layout/`에 저장한다. 대소문자만 다른 경로가 생성되지 않도록 주의한다.

---

## 0. 입력 확인 (필수)

디자인 시스템 Figma URL이 필요하다.

현재 대화 맥락에 유효한 URL이 있으면 재사용한다.

없으면 다음과 같이 요청하고 작업을 중단한다.

> 컴포넌트 생성을 위해 디자인 시스템 Figma URL(Components 페이지)을 전달해 주세요.

### 기본 Figma 정보

- 파일 URL: https://www.figma.com/design/xHDoGiS1XI5eVkCDSRw1qy

URL에서 `fileKey`와 `node-id`를 추출한다.

URL의 `node-id`에서 `-`는 `:`으로 변환한다.

노드 ID는 탐색을 빠르게 하기 위한 기준으로 사용하며, 노드가 이동하거나 변경되었을 가능성을 고려해 실제 노드 이름과 타입을 검증한다.

### 작업 범위

- 사용자가 특정 컴포넌트를 지정하면 해당 컴포넌트만 생성한다.
- 여러 컴포넌트를 지정하면 지정된 대상만 생성한다.
- 전체 생성을 요청하면 Layout 및 Asset 카드의 모든 유효한 컴포넌트를 대상으로 한다.
- 이미 존재하는 컴포넌트는 기본적으로 생성하지 않고 보고한다.
- 기존 컴포넌트의 수정 요청은 신규 생성과 구분한다.

---

## 1. 도구 준비

Figma 디자인 분석 전 `figma:figma-design-to-code` 스킬을 로드한다.

구조 탐색이 필요한 경우 `figma:figma-use`를 로드하고, 읽기 전용 `use_figma`를 사용한다.

도구가 제공하지 않는 기능은 임의로 가정하지 않는다.

### 탐색 순서

1. Figma 파일 접근 확인
2. Components 페이지 확인
3. Layout 및 Asset Frame 확인
4. Frame 내부 Section 탐색
5. Section 내부 Component 및 Component Set 확인
6. Component Properties 및 Variables 분석
7. 기존 React 프로젝트 구조 분석

Figma 탐색에 실패하거나 대상 컴포넌트를 식별할 수 없으면 임의로 코드를 생성하지 않고 원인을 보고한다.

Figma 파일에는 어떤 변경도 수행하지 않는다.

---

## 2. Figma 구조 분석

### 2-1. 노드 계층

다음 구조를 기준으로 탐색한다.

```text
Page: Components
│
├─ Frame: Layout
│  ├─ Text: _Division ("layout")
│  │
│  ├─ Section: SubTitle
│  │  ├─ Text: _Descriptor ("SubTitle")
│  │  └─ Component: SubTitle
│  │
│  └─ Section: ArticleTitle
│     ├─ Text: _Descriptor ("ArticleTitle")
│     └─ Component: ArticleTitle
│
└─ Frame: Asset
   ├─ Text: _Division ("asset")
   │
   └─ Section: Common
      ├─ Text: _Descriptor ("Common")
      └─ Component Set: Grade
```

### 용어 정의

- Page: Figma 페이지
- Frame: 컴포넌트 분류 카드의 컨테이너
- Section: 컴포넌트 또는 관련 컴포넌트를 묶는 구역
- Component: 메인 컴포넌트
- Component Set: Variant로 구성된 컴포넌트 집합
- Instance: 기존 컴포넌트의 인스턴스
- `_Division`: 카드 분류를 표시하는 텍스트 레이어
- `_Descriptor`: Section 설명을 표시하는 텍스트 레이어

`_Division`과 `_Descriptor`는 Figma의 공식 Component Property가 아니다.

설명용 레이어이므로 React 컴포넌트 생성 대상에서 제외한다.

### 2-2. 컴포넌트 식별 규칙

각 Section 내부에서 다음 노드를 탐색한다.

- `COMPONENT`
- `COMPONENT_SET`

컴포넌트 이름은 Figma의 메인 Component 또는 Component Set 이름을 기준으로 한다.

Section 이름이나 `_Descriptor` 텍스트로 컴포넌트 이름을 결정하지 않는다.

예:

```text
Section: Common
└─ Component Set: Grade
```

생성 결과:

`src/components/asset/Grade.jsx`

설명용 Frame, Text, 단순 Instance는 독립적인 React 컴포넌트 생성 대상에서 제외한다.

Section 내부에 여러 메인 컴포넌트가 있으면 각각 분석한다.

Component Set 내부의 개별 Variant는 독립 파일로 생성하지 않고 하나의 React 컴포넌트로 통합한다.

Section 안에 유효한 Component가 없다면 생성하지 않고 보고한다.

### 2-3. 컴포넌트 이름

- Figma 컴포넌트 이름을 원칙적으로 유지한다.
- PascalCase 이름을 사용한다.
- 의역하거나 임의로 축약하지 않는다.
- 파일명은 `{ComponentName}.jsx`로 한다.
- Figma 이름이 React 식별자로 유효하지 않으면 임의 변경하지 않고 확인을 요청한다.

---

## 3. Component Properties 분석

Figma의 Component Properties를 React Props로 변환한다.

### 3-1. Props 매핑

| Figma 속성 | React 변환 |
|---|---|
| Variant | 문자열 또는 유니온 성격의 prop |
| Boolean | boolean prop |
| Text | 문자열 prop |
| Instance Swap | ReactNode 또는 컴포넌트 prop |
| 중첩 Instance | 필요할 경우 기존 React 컴포넌트 재사용 |

### Variant

예:

```text
Figma:
Grade = Basic / Standard / Premium / Enterprise / Free
```

React:

```jsx
<Grade grade="Premium" />
```

규칙:

- Figma Property 이름을 camelCase로 변환한다.
- Variant 값은 Figma 원문을 유지한다.
- 기본값은 Figma에서 실제 확인된 기본 속성값을 사용한다.
- 기본값을 확인할 수 없으면 임의로 추정하지 않는다.
- 모든 Variant의 색상, 크기, 텍스트, 상태를 분석한다.
- Component Set 분석 결과가 불완전하면 개별 Variant를 추가로 조회한다.

### Boolean

예:

```text
Show Icon = true / false
```

React:

```jsx
<Component showIcon={true} />
```

Boolean 속성은 요소의 노출 여부 또는 Figma에서 정의된 상태를 반영한다.

### Text

텍스트 레이어의 역할을 분석하여 의미 있는 prop 이름을 사용한다.

예:

- `title`
- `desc`
- `tip`
- `label`

Figma에서 Text Property 이름이 명확하면 해당 이름을 우선 사용한다.

기본 텍스트는 Figma에서 확인된 값을 사용한다.

**텍스트 미전달과 빈 문자열을 구분한다.**

- `undefined`: 정의된 기본값 사용 또는 선택적 콘텐츠 생략
- `""`: 명시적으로 빈 문자열을 전달한 것으로 처리
- `null`: 선택적 콘텐츠를 의도적으로 제거하는 값으로 사용할 수 있음

선택적 요소는 해당 컴포넌트의 의도에 맞게 처리한다.

텍스트가 비었다는 이유만으로 모든 요소를 자동 제거하지 않는다.

### Instance Swap

Figma Instance Swap을 무조건 `children`으로 변환하지 않는다.

콘텐츠 역할에 따라 다음 중 적합한 방식으로 구현한다.

- `children`
- `ReactNode` prop
- 컴포넌트 prop
- 기존 공통 컴포넌트 조합

예:

```jsx
<Card icon={<Icon />} />
<Card action={<Button />} />
<Card><CustomContent /></Card>
```

중첩 컴포넌트의 재사용이 가능하면 새로운 구현을 중복 생성하지 않는다.

### 고정 텍스트

Variant별 표시 문구가 고정되어 있으면 컴포넌트 내부 상수로 관리한다.

예:

```jsx
const GRADE_LABELS = {
  Basic: "Basic",
  Free: "Free Trial",
};
```

문구는 Figma 원문을 유지한다.

---

## 4. 기존 프로젝트 분석

코드 작성 전 다음 항목을 확인한다.

- `src/components/` 폴더 구조
- 기존 공통 컴포넌트
- `src/styles/theme`
- styled-components 사용 방식
- import alias 설정
- 기존 `index.js`
- 아이콘 및 이미지 에셋
- 기존 컴포넌트의 Props와 재사용 가능 여부

기존 구현과 중복되는 컴포넌트가 있으면 새로 만들지 않는다.

기존 파일이 존재하지만 Figma와 구조가 다르면 자동 수정하지 않고 차이를 보고한다.

---

## 5. 작업 계획 보고 (필수)

실제 코드 작성 전에 계획을 한글로 보고하고 사용자 확인을 받는다.

| 카드 | 컴포넌트 | Figma 노드 | 생성 파일 | Props |
|---|---|---|---|---|
| Layout | SubTitle | 147:853 | Layout/SubTitle.jsx | title, desc |
| Asset | Grade | 507:5533 | asset/Grade.jsx | grade |

위 표의 노드와 Props는 형식 예시이며 실제 Figma 분석 결과를 사용한다.

함께 보고할 내용:

- 생성 대상
- 기존 파일로 인해 건너뛸 대상
- 재사용할 공통 컴포넌트
- 확인이 필요한 속성
- TableCommon 관련 작업 여부

사용자가 승인하면 코드 생성을 시작한다.

---

## 6. React 컴포넌트 생성

### 6-1. 파일 구조

```text
src/components/
├─ Layout/
│  ├─ CardSection.jsx
│  ├─ SubTitle.jsx
│  ├─ ArticleTitle.jsx
│  └─ index.js
│
└─ asset/
   ├─ Grade.jsx
   └─ index.js
```

### 파일 생성 규칙

- 컴포넌트 하나당 `{Name}.jsx` 파일 하나를 생성한다.
- styled-components 선언은 같은 JSX 파일 아래쪽에 둔다.
- `{Name}.styles.js`를 별도로 생성하지 않는다.
- 이 규칙은 해당 스킬에서 생성하는 소규모 공통 컴포넌트에 적용하는 프로젝트 예외다.
- 기존 파일은 덮어쓰지 않는다.
- 기존 컴포넌트를 수정해야 한다면 별도 승인을 받는다.

### index.js

각 폴더의 `index.js`에서 named export를 제공한다.

```js
export { default as CardSection } from "./CardSection";
export { default as SubTitle } from "./SubTitle";
```

기존 export를 유지하며 필요한 항목만 추가한다.

중복 export를 만들지 않는다.

기존 컴포넌트의 실제 export 형식을 확인하고 일치시킨다.

### Styled Components

DOM으로 전달하면 안 되는 스타일 전용 prop에는 transient prop을 사용한다.

```jsx
const Grade = ({ grade = "Basic" }) => (
  <StyledGrade $grade={grade}>
    {grade}
  </StyledGrade>
);
```

Figma Variant를 불필요하게 DOM attribute로 전달하지 않는다.

---

## 7. 스타일 및 디자인 토큰

각 컴포넌트에 대해 `get_design_context`를 사용하여 디자인 정보를 분석한다.

Component Set 분석 결과에 필요한 정보가 빠져 있으면 개별 Variant를 조회한다.

### 7-1. 색상

색상은 `@/styles/theme`의 기존 토큰을 우선 사용한다.

컴포넌트 스타일에 hex 값을 직접 하드코딩하지 않는다.

매칭 우선순위:

1. Figma Variable과 정확히 대응하는 기존 theme 토큰
2. 동일한 hex 값을 가진 기존 theme 토큰
3. 의미가 같고 시각적 차이가 허용 가능한 기존 theme 토큰
4. 적합한 토큰이 없는 경우 보고

의미 토큰이 존재하면 palette 직접 참조보다 의미 토큰을 우선한다.

예:

```js
theme.colors.text.primary
theme.colors.table.border
```

단순히 RGB 거리가 가장 가깝다는 이유만으로 의미가 다른 토큰을 사용하지 않는다.

새 토큰은 임의로 추가하지 않는다.

근사값을 사용한 경우 결과 보고에 원본 hex와 매칭된 토큰을 기록한다.

색상 차이가 명확하거나 의미가 달라지는 경우 사용자 확인을 받는다.

### 7-2. 크기 및 타이포그래피

프로젝트에 해당 토큰이 있으면 토큰을 우선 사용한다.

없는 경우 Figma 값을 적용한다.

분석 대상:

- Width / Height
- Padding / Gap
- Radius
- Font Size
- Font Weight
- Line Height
- Letter Spacing
- Border
- Shadow

폰트 패밀리는 별도로 지정하지 않는다.

프로젝트 전역 폰트인 Pretendard를 상속한다.

Figma의 Inter와 차이가 발생할 수 있음을 인지하고 크기, 굵기, 행간을 기준으로 최대한 일치시킨다.

### 7-3. 레이아웃

Figma Auto Layout은 가능한 범위에서 CSS Flexbox로 변환한다.

- Horizontal → flex-direction: row
- Vertical → flex-direction: column
- Gap → gap
- Padding → padding
- Alignment → justify-content / align-items

모든 고정 크기를 무조건 제거하지 않는다.

아이콘, 버튼, 배지처럼 고정 크기가 필요한 요소는 유지한다.

텍스트 길이에 따라 늘어나야 하는 요소는 콘텐츠 기반 크기 또는 유연한 레이아웃으로 구현한다.

Figma 절대 좌표는 일반 레이아웃에 사용하지 않는다.

단, 의도적인 오버레이나 장식 요소는 position을 사용할 수 있다.

### 7-4. 아이콘 및 이미지

- 기존 프로젝트 에셋이 있으면 우선 재사용한다.
- Figma 에셋이 필요하면 제공된 내보내기 기능을 사용한다.
- 저장 경로는 `src/assets/icons/`를 기본으로 한다.
- SVG는 가능한 경우 원본 벡터를 유지한다.
- 접근할 수 없는 에셋을 임의로 대체하지 않는다.
- 에셋을 가져오지 못하면 보고한다.

---

## 8. TableCommon 예외 처리

TableCommon은 Layout/Asset의 일반 공통 컴포넌트와 다르게 처리한다.

Figma 위치:

`Components → Table → TableCommon`

노드 ID: `442:727`

**TableCommon 자체의 React 컴포넌트 파일은 생성하지 않는다.**

기존 프로젝트의 `ListTable`, `Table.jsx`, `table.styles.js`를 기준으로 적용한다.

### 역할 분리

- `ListTable`: 테이블 구조 및 셀 렌더링
- `Table.jsx`: 셀 콘텐츠 컴포넌트
- `table.styles.js`: 공통 테이블 스타일

TableCommon의 디자인 변경은 테이블 공통 스타일에 반영한다.

페이지별 래퍼에서 공통 테이블 스타일을 임의로 덮어쓰지 않는다.

### Figma → 코드 매핑

| Figma | 코드 위치 | 규칙 |
|---|---|---|
| Table Cell / Header | table.styles.js | th |
| Table Cell / Body | table.styles.js | td |
| Align | ListTable columns | left / center / right |
| Badge / fixed | Table.jsx | Fixed |
| Action | Table.jsx | Action |
| Text / Link / Grade / State / Action Group / Check | Table.jsx | 필요 시 기존 매핑 확장 |

기본 셀 정렬은 center로 한다.

### Table Cell 스타일

| 항목 | Figma 기준 | 코드 |
|---|---|---|
| 셀 높이 | 65px | height: 65px |
| Padding | 12px 24px | padding: 12px 24px |
| 헤더 배경 | #FAFAFA | theme.colors.table.theadBG |
| 테두리 | #F2F2F2 | theme.colors.table.border |
| 텍스트 색 | #404040 | theme.colors.table.text |
| 글자 | 14px / 400 | 14px / 400 |

높이 65px은 기본 디자인 기준이며, 콘텐츠가 넘치는 경우 잘리지 않도록 레이아웃을 검토한다.

### Badge / fixed

- 문구: 고정
- 배경: #404040
- Padding: 5px 8px
- Radius: 4px
- Font Size: 13px
- Font Weight: 500
- Line Height: 14px

사용 토큰:

`theme.colors.badge.fixedBG`

### Action / Button

- 배경: #2B7FFF
- 높이: 36px
- Padding: 0 15px
- Radius: 2px
- Font Size: 14px
- Font Weight: 600
- 텍스트: White

사용 토큰:

`theme.colors.tableAction.buttonBG`

### TableCommon 토큰 예외

일반 Layout/Asset 컴포넌트와 달리 TableCommon은 기존에 합의된 의미 토큰 구조를 사용한다.

- `theme.colors.table`
- `theme.colors.badge`
- `theme.colors.tableAction`

필요한 의미 키가 없으면 기존 palette 값을 참조하여 추가할 수 있다.

단, 기존 토큰이 있으면 중복 생성하지 않는다.

### 변경 규칙

- TableCommon 디자인이 변경되면 공통 테이블 스타일에 반영한다.
- 영향을 받는 모든 ListTable 화면을 확인한다.
- 변경 범위와 영향도를 보고한다.
- 기존 코드 변경이 필요한 경우 사전 승인을 받는다.
- TableCommon 관련 규칙이 일반 컴포넌트 생성 규칙과 충돌하면 이 섹션을 우선한다.

---

## 9. 검증

### 9-1. 정적 검증

생성한 모든 컴포넌트에 대해 확인한다.

- JSX 문법
- import/export
- 컴포넌트 이름
- Props 기본값
- Variant별 분기
- Boolean 동작
- Text Property
- Instance Swap 대응
- theme 토큰 참조
- styled-components transient props

### 9-2. 빌드 검증

```bash
npm run build
```

빌드에 실패하면 이번 작업으로 발생한 오류인지 기존 오류인지 구분한다.

생성한 파일이 아직 페이지에서 import되지 않았다면 전체 빌드만으로 검증을 완료했다고 판단하지 않는다.

### 9-3. 개별 컴포넌트 검증

필요한 경우 esbuild로 개별 파일을 검사한다.

```bash
npx esbuild src/components/asset/Grade.jsx --bundle --format=esm --jsx=automatic --loader:.js=jsx --alias:@=./src --external:react --external:react/jsx-runtime --external:styled-components --external:react-router-dom --outfile=component-check.js --log-level=error
```

검증 후 임시 출력 파일은 삭제한다.

`/dev/null`을 사용하지 않아 Windows 환경에서도 실행할 수 있도록 한다.

프로젝트의 실제 빌드 설정에 따라 필요한 외부 패키지 옵션을 추가할 수 있다.

### 9-4. 디자인 검증

다음 항목을 Figma와 비교한다.

- Variant별 색상
- 텍스트
- 크기 및 간격
- 정렬
- 테두리
- 아이콘
- 조건부 요소 표시
- 기본 Props

시각적 비교가 불가능하면 실제로 확인하지 않은 항목을 검증 완료로 표시하지 않는다.

---

## 10. 결과 보고

모든 결과는 한글로 보고한다.

### 생성 결과

| 카드 | 컴포넌트 | 파일 | Props | 상태 |
|---|---|---|---|---|

### 추가 보고

- 생성한 파일
- 기존 파일로 인해 건너뛴 항목
- 생성하지 않은 Section
- 기존 컴포넌트 재사용 내역
- 색상 매칭 내역
- 적용하지 못한 효과 또는 에셋
- 빌드 및 검증 결과
- 확인이 필요한 사항

사용 예시 import 코드나 JSX 예시는 결과 보고에 포함하지 않는다.

### 색상 매칭 보고

| Figma 원본 | 적용한 Theme 토큰 | 비고 |
|---|---|---|

근사값을 적용했다면 그 사실을 명시한다.

---

## 11. 보고 언어

작업 계획, 질문, 진행 여부 확인, 오류 보고, 결과 보고는 모두 한글로 작성한다.

코드, 파일명, 컴포넌트명, Figma node-id, API 이름 등의 식별자는 원문을 유지한다.

작업을 중간에 멈추고 사용자에게 확인을 요청할 때도 한글을 사용한다.

---

## 12. 최종 체크리스트

- [ ] Figma URL과 대상 노드를 확인했는가
- [ ] Layout/Asset Frame을 정확하게 식별했는가
- [ ] Section 내부의 Component/Component Set을 탐색했는가
- [ ] 설명용 Frame과 Text를 생성 대상에서 제외했는가
- [ ] Figma 컴포넌트 이름을 유지했는가
- [ ] 모든 Variant와 Component Properties를 분석했는가
- [ ] Props 기본값을 확인했는가
- [ ] 기존 공통 컴포넌트를 우선 재사용했는가
- [ ] Layout/Asset 경로를 올바르게 적용했는가
- [ ] 스타일을 JSX 파일 내부에 작성했는가
- [ ] index.js에 필요한 export를 추가했는가
- [ ] 기존 파일을 임의로 덮어쓰지 않았는가
- [ ] theme 토큰을 우선 사용했는가
- [ ] 색상 근사 매칭 내역을 보고했는가
- [ ] TableCommon 예외 규칙을 준수했는가
- [ ] Figma 파일을 수정하지 않았는가
- [ ] 생성 파일의 개별 문법 검증을 수행했는가
- [ ] npm run build 결과를 확인했는가
- [ ] 결과 보고를 한글로 작성했는가

모든 작업이 완료되면 생성 내역, 검증 결과, 미완료 항목을 한글로 보고한다.