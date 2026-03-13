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
  currentPage={currentPage}
  totalCount={totalCount}
  pageSize={limit}
  onPageChange={handlePageChange}
  renderCell={(row, col) => {
    if (col.key === "actions") return <button type="button">수정</button>;
    return row[col.key];
  }}
/>;
```

## 외부 limit 셀렉트와 함께 사용하기 (권장)

`src/pages/Components/ComponentsTable.jsx`처럼 리스트 상단 우측에 limit 선택 UI를 두고,
URL 쿼리(`page`, `limit`)를 기준으로 목록을 제어합니다.

```jsx
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { ListTable } from "@/components/Table/Table";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import { TableTop, TotalLength } from "@/components/Table/table.styles";

const [searchParams, setSearchParams] = useSearchParams();
const currentPage = Number(searchParams.get("page")) || 1;
const limit = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
const selectedLimitOption = PAGE_SIZE_OPTIONS.find((option) => option.value === limit) ?? PAGE_SIZE_OPTIONS[1];

const handleLimitChange = (option) => {
  const next = new URLSearchParams(searchParams);
  next.set("page", 1);
  next.set("limit", option.value);
  setSearchParams(next);
};

const handlePageChange = (page) => {
  const next = new URLSearchParams(searchParams);
  next.set("page", page);
  setSearchParams(next);
};

<TableTop>
  <TotalLength>총 {totalCount}건</TotalLength>
  <Select
    className="custom-select"
    classNamePrefix="react-select"
    options={PAGE_SIZE_OPTIONS}
    value={selectedLimitOption}
    isSearchable={false}
    onChange={handleLimitChange}
  />
</TableTop>;

<ListTable
  pagination
  columns={columns}
  rows={rows}
  currentPage={currentPage}
  totalCount={totalCount}
  pageSize={limit}
  onPageChange={handlePageChange}
/>;
```

## 주요 Props

- `columns` (`Array`, required): 헤더/셀 메타데이터 배열.
- `columns[*]`: `key`, `header`, `width`, `align` 지원.
- `rows` (`Array`, required): 행 데이터 배열.
- `rowKey` (`string`, default: `"id"`): 각 행의 React key로 사용할 속성명.
- `renderCell` (`function`): 커스텀 셀 렌더러 `(row, col) => ReactNode`.
- `pagination` (`boolean`, default: `false`): 페이지 버튼 UI 활성화.
- `currentPage` (`number`, required when `pagination=true`): 현재 페이지.
- `totalCount` (`number`, required when `pagination=true`): 전체 데이터 개수.
- `pageSize` (`number`, required when `pagination=true`): 페이지당 행 수.
- `onPageChange` (`function`, required when `pagination=true`): 페이지 변경 콜백.

## 페이지네이션 동작

- `ListTable`은 페이지 버튼 렌더링과 페이지 이동 이벤트 전달만 담당합니다.
- 페이지 크기(limit) 선택 UI는 상위 컴포넌트에서 별도로 렌더링합니다.
- 페이지 변경/페이지 크기 변경에 따른 실제 데이터 조회는 상위에서 처리합니다.
- 데이터가 없으면 빈 상태 안내 행을 렌더링합니다.

## 참고

- 체크박스, 토글, 액션 버튼 같은 셀 커스터마이징은 `renderCell`에서 처리하는 것을 권장합니다.
- 컬럼 정렬은 `col.align`(`left`, `center`, `right`)으로 설정합니다.
- 현재 구현에는 내부 `pageSizeOptions`, `defaultPageSize`, `showPerPageControl` 옵션이 없습니다.
