# 2열 FormTable 가이드

## 위치

`src/components/Table/Table.jsx` (`FormTable`, `columns={2}` 사용)

## 목적

입력 항목이 많은 폼을 `FormTable`의 2열 레이아웃으로 효율적으로 구성합니다.

## 기본 사용법

```jsx
import { useState } from "react";
import { FormTable } from "@/components/Table/Table";

const fields = [
  { key: "username", label: "사용자명", name: "username", type: "input" },
  {
    key: "role",
    label: "역할",
    name: "role",
    type: "select",
    options: [
      { value: "admin", label: "관리자" },
      { value: "editor", label: "편집자" },
    ],
  },
  { key: "bio", label: "소개", name: "bio", type: "textarea", colSpan: 3 },
];

const [form, setForm] = useState({ username: "", role: "", bio: "" });

<FormTable
  columns={2}
  fields={fields}
  values={form}
  onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
/>;
```

## 레이아웃 규칙

- `columns={2}`일 때 한 행의 최대 unit은 `4`입니다.
- 필드 1개는 `1 + colSpan` unit을 사용합니다.
- `colSpan`은 내부에서 안전 범위로 보정됩니다.
- 현재 행에 들어가지 않는 필드는 다음 행으로 자동 이동합니다.

## 권장 패턴

- 짧은 입력 필드는 기본 너비로 배치합니다.
- 긴 텍스트나 결합 컨트롤은 `colSpan: 3`을 권장합니다.
- 모든 필드에서 공통 `onChange` 핸들러를 재사용합니다.

## 참고

- 별도 컴포넌트가 아니라 `FormTable`의 구성 방식입니다.
- 동작 예시는 `src/pages/Components/ComponentsTable.jsx`를 참고하세요.
