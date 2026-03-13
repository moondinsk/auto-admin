import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosRefresh } from "react-icons/io";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import {
  buildSearchParams,
  getKeywordLabel,
  parseSearchParams,
  setFormField,
  updateFormData,
  updateSearchParams,
} from "@/utils/searchParams";
import { useStore } from "@/store";
import { StyledComponents } from "./Components.styles";
import { TableTop, TotalLength } from "@/components/Table/table.styles";
import { theme } from "@/styles/theme";
import TableActionButtons from "@/components/Table/TableActionButtons";
import { getDateRange, getToday, toggleAllCheck } from "@/utils";

const KEYWORD_LABEL = {
  new: "신상품",
  sale: "세일",
  best: "베스트",
};

const SEARCH_CATEGORY_OPTIONS = [
  { value: "bannerGroupName", label: "배너명" },
  { value: "bannerCode", label: "배너코드" },
  { value: "bannerGroupDesc", label: "배너 설명" },
  { value: "searchKeyword", label: "배너 키워드" },
];

const initialForm = {
  bannerGroupName: "",
  bannerGroupDesc: "",
  searchKeyword: KEYWORD_LABEL.new,
  searchCategory: SEARCH_CATEGORY_OPTIONS[0].value,
  searchValue: "",
  features: [],
  startDate: "",
  endDate: "",
};

const formFields = [
  {
    key: "name",
    label: "배너 그룹명",
    name: "bannerGroupName",
    type: "input",
    placeholder: "배너 그룹명을 입력하세요",
  },
  {
    key: "desc",
    label: "배너 그룹 설명",
    name: "bannerGroupDesc",
    type: "textarea",
    placeholder: "설명을 입력하세요",
  },
  {
    key: "searchKeyword",
    label: "배너 키워드",
    name: "searchKeyword",
    type: "select",
    placeholder: "배너 키워드 선택",
    options: [
      { value: "new", label: "신상품" },
      { value: "sale", label: "세일" },
      { value: "best", label: "베스트" },
    ],
  },
  {
    key: "searchFilter",
    label: "검색 필터",
    type: "select-input",
    selectName: "searchCategory",
    selectPlaceholder: "카테고리 선택",
    selectOptions: SEARCH_CATEGORY_OPTIONS,
    inputName: "searchValue",
    inputPlaceholder: "검색어를 입력하세요",
  },
  {
    key: "features",
    label: "배너 특징",
    name: "features",
    type: "checkbox",
    options: [
      { value: "new", label: "신상품" },
      { value: "sale", label: "세일" },
      { value: "best", label: "베스트" },
    ],
  },
  {
    key: "dateSearch",
    label: "조회 기간",
    type: "date-range",
    startName: "startDate",
    endName: "endDate",
    startPlaceholder: "시작 날짜",
    endPlaceholder: "종료 날짜",
    dateButtons: [
      {
        label: "오늘",
        value: "today",
        onClick: (handleChange) => {
          const today = getToday();
          handleChange({ target: { name: "startDate", value: today } });
          handleChange({ target: { name: "endDate", value: today } });
        },
      },
      {
        label: "7일",
        value: "7days",
        onClick: (handleChange) => {
          const { start, end } = getDateRange(7);
          handleChange({ target: { name: "startDate", value: start } });
          handleChange({ target: { name: "endDate", value: end } });
        },
      },
      {
        label: "15일",
        value: "15days",
        onClick: (handleChange) => {
          const { start, end } = getDateRange(15);
          handleChange({ target: { name: "startDate", value: start } });
          handleChange({ target: { name: "endDate", value: end } });
        },
      },
      {
        label: "1개월",
        value: "1month",
        onClick: (handleChange) => {
          const { start, end } = getDateRange(30);
          handleChange({ target: { name: "startDate", value: start } });
          handleChange({ target: { name: "endDate", value: end } });
        },
      },
      {
        label: "전체",
        value: "all",
        onClick: (handleChange) => {
          handleChange({ target: { name: "startDate", value: "" } });
          handleChange({ target: { name: "endDate", value: "" } });
        },
      },
    ],
  },
];

const ComponentsTable = () => {
  const { exampleStore } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    ...parseSearchParams(searchParams),
  }));

  const [listTableCheckedIds, setListTableCheckedIds] = useState([]);
  const [activeDateButton, setActiveDateButton] = useState("all");

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
  const totalCount = exampleStore.totalCount;

  const selectedLimitOption = PAGE_SIZE_OPTIONS.find((option) => option.value === limit) ?? PAGE_SIZE_OPTIONS[1];

  const isAllChecked =
    exampleStore.list.length > 0 && exampleStore.list.every((row) => listTableCheckedIds.includes(row.id));

  const toggleCheck = (id) => {
    setListTableCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((checkedId) => checkedId !== id) : [...prev, id],
    );
  };

  const handleLimitChange = (option) => {
    setSearchParams(updateSearchParams(searchParams, { page: 1, limit: option.value }));
    setListTableCheckedIds([]);
  };

  const handlePageChange = (page) => {
    setSearchParams(updateSearchParams(searchParams, { page }));
    setListTableCheckedIds([]);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(updateFormData(name, value, type, checked));
  };

  const handleDateChange = (name, date) => {
    setFormData(setFormField(name, date));
    setActiveDateButton("");
  };

  const handleDateButtonClick = (btn) => {
    btn.onClick(handleFormChange);
    setActiveDateButton(btn.value);
  };

  const handleResetSearch = () => {
    setFormData(initialForm);
    setActiveDateButton("all");
    setSearchParams({});
  };

  const handleSearch = () => {
    setSearchParams({
      ...buildSearchParams(formData),
      page: 1,
      limit,
    });
  };

  useEffect(() => {
    exampleStore.getBanners({
      searchParams,
    });
  }, [searchParams]);

  const listTableColumns = [
    {
      key: "check",
      header: (
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={() => setListTableCheckedIds(toggleAllCheck(exampleStore.list, listTableCheckedIds))}
        />
      ),
      width: 44,
    },
    { key: "no", header: "No", width: 70 },
    { key: "bannerGroupName", header: "그룹명", align: "left", width: 150 },
    { key: "bannerGroupDesc", header: "그룹 설명", align: "left", width: 220 },
    { key: "searchKeyword", header: "배너 키워드", width: 120 },
    { key: "features", header: "배너 특징", align: "left", width: 150 },
    { key: "createdDate", header: "등록일", width: 120 },
    { key: "exposureStatus", header: "노출 상태", width: 120 },
    { key: "imageCount", header: "이미지 수", width: 50 },
    { key: "effect", header: "배너 효과", width: 120 },
    { key: "clickCount", header: "클릭 수", width: 100 },
    { key: "bannerCode", header: "배너 코드", width: 100 },
    { key: "manage", header: "관리", width: 100 },
  ];

  return (
    <StyledComponents className="flex-box col">
      <CardSection title="Table 컴포넌트 예시 - FormTable">
        <FormTable
          fields={formFields}
          formData={formData}
          handleFormChange={handleFormChange}
          handleDateChange={handleDateChange}
          activeDateButton={activeDateButton}
          handleDateButtonClick={handleDateButtonClick}
        />
        <TableActionButtons
          buttons={[
            {
              label: "초기화",
              color: theme.colors.palette.gray800,
              icon: <IoIosRefresh />,
              onClick: handleResetSearch,
            },
            {
              label: "검색",
              onClick: handleSearch,
            },
          ]}
        />
      </CardSection>
      <CardSection title="Table 컴포넌트 예시 - ListTable">
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
        </TableTop>
        <ListTable
          pagination
          columns={listTableColumns}
          rows={exampleStore.list}
          rowKey="id"
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={limit}
          onPageChange={handlePageChange}
          renderCell={(row, col) => {
            if (col.key === "check") {
              return (
                <input
                  type="checkbox"
                  checked={listTableCheckedIds.includes(row.id)}
                  onChange={() => toggleCheck(row.id)}
                />
              );
            }

            if (col.key === "exposureStatus") {
              return (
                <ToggleSwitch
                  checked={!!row.exposureStatus}
                  onChange={() => exampleStore.toggleExposureStatus(row.id)}
                />
              );
            }

            if (col.key === "searchKeyword") {
              return getKeywordLabel(row.searchKeyword, KEYWORD_LABEL);
            }

            if (col.key === "features") {
              return row.features.map((feature) => getKeywordLabel(feature, KEYWORD_LABEL)).join(", ");
            }

            if (col.key === "manage") {
              return (
                <Button size="xsm" radius={3}>
                  관리
                </Button>
              );
            }

            return row[col.key];
          }}
        />
      </CardSection>
    </StyledComponents>
  );
};

const ObservedComponentsTable = observer(ComponentsTable);

export default ObservedComponentsTable;
