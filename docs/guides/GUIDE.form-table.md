# FormTable 가이드

## 위치
`src/components/Table/Table.jsx` (`FormTable` export)

## 목적
테이블 레이아웃(`th` + `td`) 안에서 다양한 타입의 폼 필드를 렌더링합니다.

## 기본 사용법
```jsx
import { useState } from "react";
import { FormTable } from "@/components/Table/Table";

const fields = [
  { key: "name", label: "이름", name: "name", type: "input", required: true },
  {
    key: "role",
    label: "역할",
    name: "role",
    type: "select",
    options: [
      { value: "admin", label: "관리자" },
      { value: "viewer", label: "조회자" },
    ],
  },
];

const [values, setValues] = useState({ name: "", role: "" });

<FormTable
  fields={fields}
  values={values}
  onChange={(e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
/>;
```

## 주요 Props
- `fields` (`Array`, required): 필드 정의 배열.
- `values` (`Object`, required): 현재 폼 값 객체.
- `onChange` (`function`, required): 이벤트 형태를 따르는 공통 변경 핸들러.
- `columns` (`number`, default: `1`): 한 행에 배치할 필드 그룹 수.

## 지원 필드 타입
- `input`: 기본 텍스트 입력.
- `textarea`: 여러 줄 텍스트 입력.
- `select`: `react-select` 단일 선택.
- `select-input`: 선택 + 입력 결합 컨트롤.
- `radio`: 단일 선택 옵션.
- `checkbox`: 다중 선택(배열 값).
- `date-range`: 시작/종료 날짜와 빠른 선택 버튼.

## 필드 스키마 팁
- 자주 쓰는 키: `key`, `label`, `name`, `type`, `placeholder`, `required`.
- `td` 영역을 넓히려면 `colSpan`을 사용합니다.
- `date-range`는 `startName`, `endName`, `dateButtons`를 함께 정의하세요.

## 참고
- `columns` 값은 내부에서 최소 `1`로 보정됩니다.
- 레이아웃은 unit(`th` + `td`) 기준으로 계산되어 자동 줄바꿈됩니다.
- 날짜 값은 `onChange`로 `yyyy-mm-dd` 문자열 형태로 전달됩니다.
