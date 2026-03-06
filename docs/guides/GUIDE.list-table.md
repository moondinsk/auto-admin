# ListTable 가이드

## 위치
`src/components/Table/Table.jsx` (`ListTable` export)

## 목적
목록형 테이블 데이터를 렌더링하며, 필요 시 내장 페이지네이션을 사용할 수 있습니다.

## 기본 사용법
```jsx
import { ListTable } from "@/components/Table/Table";

<ListTable
  pagination
  columns={columns}
  rows={rows}
  rowKey="id"
  renderCell={(row, col) => {
    if (col.key === "actions") return <button type="button">수정</button>;
    return row[col.key];
  }}
/>
```

## 주요 Props
- `columns` (`Array`, required): 헤더/셀 메타데이터 배열.
- `columns[*]`: `key`, `header`, `width`, `align` 지원.
- `rows` (`Array`, required): 행 데이터 배열.
- `rowKey` (`string`, default: `"id"`): 각 행의 React key로 사용할 속성명.
- `renderCell` (`function`): 커스텀 셀 렌더러 `(row, col) => ReactNode`.
- `pagination` (`boolean`, default: `false`): 페이지 크기 선택 및 페이지 버튼 활성화.
- `pageSizeOptions` (`Array`, default from `src/constants/pagination.js`): 페이지 크기 옵션.
- `defaultPageSize` (`number`, default: `10`): 초기 페이지 크기.

## 페이지네이션 동작
- `react-select`로 페이지 크기를 선택합니다.
- 페이지 크기를 바꾸면 현재 페이지는 1페이지로 초기화됩니다.
- 데이터가 없으면 빈 상태 안내 행을 렌더링합니다.

## 참고
- 체크박스, 토글, 액션 버튼 같은 셀 커스터마이징은 `renderCell`에서 처리하는 것을 권장합니다.
- 컬럼 정렬은 `col.align`(`left`, `center`, `right`)으로 설정합니다.
