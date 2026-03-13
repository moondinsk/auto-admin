# 2열 FormTable 가이드 (현행 상태)

## 위치

`src/components/Table/Table.jsx` (`FormTable`)

## 목적

기존 2열 문서의 사용법을 현재 코드 기준으로 정리합니다.

## 현재 상태

- 현재 `FormTable`은 `columns` prop을 지원하지 않습니다.
- 한 행에 하나의 필드(`th` + `td`)를 렌더링하는 구조입니다.
- 따라서 `columns={2}` 기반 2열 배치는 동작하지 않습니다.

## 대체 패턴

- 많은 필드를 2열로 보여야 한다면, 상위 레이아웃에서 섹션을 나눠 `FormTable`을 분리 배치합니다.
- 또는 필드 그룹을 카드/아코디언으로 구분해 세로 폼 밀도를 조절합니다.

## 실제 구현 패턴 (URL Sync)

`src/pages/Components/ComponentsTable.jsx`는 URL 쿼리와 폼 상태를 다음 흐름으로 동기화합니다.

- 초기 상태: `parseSearchParams(searchParams)` 결과를 `useState` 초기값에 합성
- 검색 실행: `buildSearchParams(formData)`로 쿼리 문자열 생성
- 데이터 조회: `useEffect`에서 `searchParams` 변경 시 API 호출
- 페이지/limit 변경: URL 파라미터만 갱신하고 목록을 재조회

```jsx
const [formData, setFormData] = useState(() => ({
  ...initialForm,
  ...parseSearchParams(searchParams),
}));

useEffect(() => {
  exampleStore.getBanners({ searchParams });
}, [searchParams, exampleStore]);
```

## FormTable 연결 예시

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
  { key: "bio", label: "소개", name: "bio", type: "textarea" },
];

const [formData, setFormData] = useState({ username: "", role: "", bio: "" });

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

<FormTable fields={fields} formData={formData} handleFormChange={handleFormChange} />;
```

## 참고

- 향후 2열 레이아웃이 필요하면 `FormTable` 컴포넌트 확장(`columns`, `colSpan`)을 별도 이슈로 관리하세요.
