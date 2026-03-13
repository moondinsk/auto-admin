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

const [formData, setFormData] = useState({ name: "", role: "" });

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

<FormTable fields={fields} formData={formData} handleFormChange={handleFormChange} />;
```

## 주요 Props

- `fields` (`Array`, required): 필드 정의 배열.
- `formData` (`Object`, required): 현재 폼 값 객체.
- `handleFormChange` (`function`, required): 입력 변경 핸들러.
- `handleDateChange` (`function`): `date-range` DatePicker 변경 핸들러.
- `activeDateButton` (`string`): `date-range` 빠른 버튼 활성 상태.
- `handleDateButtonClick` (`function`): `date-range` 빠른 버튼 클릭 핸들러.

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
- `select-input`은 `selectName`, `selectOptions`, `inputName`을 사용합니다.
- `date-range`는 `startName`, `endName`, `dateButtons`를 함께 정의하세요.

## 참고

- `FormTable`은 현재 한 행당 하나의 필드(`th` + `td`)를 렌더링합니다.
- 날짜 값은 `handleDateChange(name, date)`로 전달되며, `date`는 `Date | null` 형식입니다.
- 현재 데모 페이지는 `src/pages/Components/ComponentsTable.jsx`이며, `limit` 선택은 `FormTable`이 아니라 `ListTable` 상단(`TableTop`)에서 처리합니다.
