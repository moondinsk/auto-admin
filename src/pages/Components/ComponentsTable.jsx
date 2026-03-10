import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosRefresh } from "react-icons/io";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";
import TableActionButtons from "@/components/Table/TableActionButtons";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import { MODAL_PAYLOAD } from "@/constants/modal";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import { createSearchParamsFromForm, parseSearchParamsToForm, SEARCH_PARAM_TYPE } from "@/utils/searchParams";
import { theme } from "@/styles/theme";
import { useStore } from "@/store";
import { StyledComponents } from "./Components.styles";
import { TableTop, TotalLength } from "@/components/Table/table.styles";

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
  searchKeyword: "",
  searchCategory: "",
  searchValue: "",
  features: [],
  startDate: "",
  endDate: "",
};

const searchFormFields = [
  "bannerGroupName",
  "bannerGroupDesc",
  "searchKeyword",
  "searchCategory",
  "searchValue",
  "startDate",
  "endDate",
  { key: "features", type: SEARCH_PARAM_TYPE.ARRAY },
];

const includesIgnoreCase = (source, keyword) =>
  String(source ?? "")
    .toLowerCase()
    .includes(
      String(keyword ?? "")
        .trim()
        .toLowerCase(),
    );

const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

const getToday = () => new Date().toISOString().split("T")[0];

const matchesRow = (row, form) => {
  if (form.bannerGroupName && !includesIgnoreCase(row.bannerGroupName, form.bannerGroupName)) {
    return false;
  }

  if (form.bannerGroupDesc && !includesIgnoreCase(row.bannerGroupDesc, form.bannerGroupDesc)) {
    return false;
  }

  if (form.searchKeyword && row.searchKeyword !== form.searchKeyword) {
    return false;
  }

  if (form.searchCategory && form.searchValue) {
    if (!includesIgnoreCase(row[form.searchCategory], form.searchValue)) {
      return false;
    }
  }

  if (Array.isArray(form.features) && form.features.length > 0) {
    const hasAllFeatures = form.features.every((feature) => row.features.includes(feature));
    if (!hasAllFeatures) {
      return false;
    }
  }

  if (form.startDate && row.createdDate < form.startDate) {
    return false;
  }

  if (form.endDate && row.createdDate > form.endDate) {
    return false;
  }

  return true;
};

const createMockRows = () => {
  const keywordPool = ["new", "sale", "best"];

  return Array.from({ length: 30 }, (_, index) => {
    const no = index + 1;
    const keyword = keywordPool[index % keywordPool.length];
    const subKeyword = keywordPool[(index + 1) % keywordPool.length];
    const created = new Date();
    created.setDate(created.getDate() - index * 2);

    return {
      id: `b${no}`,
      no,
      bannerGroupName: `배너 그룹 ${no}`,
      bannerGroupDesc: `배너 그룹 ${no}에 대한 설명입니다.`,
      searchKeyword: keyword,
      features: index % 2 === 0 ? [keyword, subKeyword] : [keyword],
      createdDate: created.toISOString().split("T")[0],
      exposureStatus: index % 2 === 0,
      imageCount: (index % 5) + 1,
      effect: index % 2 === 0 ? "슬라이드" : "페이드",
      clickCount: (index + 3) * 11,
      bannerCode: `B${String(no).padStart(7, "0")}`,
    };
  });
};

const ComponentsTable = observer(() => {
  const { modalStore } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const parsedForm = parseSearchParamsToForm({
    searchParams,
    initialForm,
    fields: searchFormFields,
  });
  const [form, setForm] = useState(parsedForm);
  const [appliedForm, setAppliedForm] = useState(parsedForm);
  const [listTableRows, setListTableRows] = useState(createMockRows);
  const [listTableCheckedIds, setListTableCheckedIds] = useState([]);
  const [selectedLimitOption, setSelectedLimitOption] = useState(
    PAGE_SIZE_OPTIONS.find((option) => option.value === DEFAULT_PAGE_SIZE) || PAGE_SIZE_OPTIONS[0],
  );

  const filteredListTableRows = useMemo(() => {
    return listTableRows.filter((row) => matchesRow(row, appliedForm));
  }, [listTableRows, appliedForm]);

  const currentPageRowIds = filteredListTableRows.map((row) => row.id);

  const allChecked =
    currentPageRowIds.length > 0 && currentPageRowIds.every((rowId) => listTableCheckedIds.includes(rowId));

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setAppliedForm(form);
    setSearchParams(
      createSearchParamsFromForm({
        form,
        fields: searchFormFields,
      }),
    );
    setListTableCheckedIds([]);
  };

  const handleResetSearch = () => {
    setForm(initialForm);
    setAppliedForm(initialForm);
    setSearchParams(
      createSearchParamsFromForm({
        form: initialForm,
        fields: searchFormFields,
      }),
    );
    setListTableCheckedIds([]);
  };

  const toggleOne = (id) => {
    setListTableCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((checkedId) => checkedId !== id) : [...prev, id],
    );
  };

  const toggleAll = (checked) => {
    setListTableCheckedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...currentPageRowIds]));
      }
      return prev.filter((id) => !currentPageRowIds.includes(id));
    });
  };

  const toggleExposureStatus = (id) => {
    setListTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, exposureStatus: !row.exposureStatus } : row)),
    );
  };

  const openRegisterModal = (row) => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.REGISTER_MODAL({
        component: RegisterModalContent,
        data: {
          title: "등록 모달",
          description: row ? `${row.bannerGroupName} 항목을 수정/등록합니다.` : "새 항목을 등록하세요.",
        },
      }),
    );
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

  const listTableColumns = [
    {
      key: "check",
      header: <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} />,
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
        <FormTable fields={formFields} values={form} onChange={handleFieldChange} />
        <TableActionButtons
          buttons={[
            {
              label: "초기화",
              onClick: handleResetSearch,
              color: theme.colors.palette.gray800,
              icon: <IoIosRefresh />,
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
          <TotalLength>총 {filteredListTableRows.length}건</TotalLength>
          <Select
            className="custom-select"
            classNamePrefix="react-select"
            options={PAGE_SIZE_OPTIONS}
            value={selectedLimitOption}
            isSearchable={false}
            onChange={(option) => setSelectedLimitOption(option || PAGE_SIZE_OPTIONS[0])}
          />
        </TableTop>
        <ListTable
          key={`list-limit-${selectedLimitOption?.value}`}
          pagination
          showPerPageControl={false}
          columns={listTableColumns}
          rows={filteredListTableRows}
          rowKey="id"
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          defaultPageSize={selectedLimitOption?.value || DEFAULT_PAGE_SIZE}
          renderCell={(row, col) => {
            if (col.key === "check") {
              return (
                <input
                  type="checkbox"
                  checked={listTableCheckedIds.includes(row.id)}
                  onChange={() => toggleOne(row.id)}
                />
              );
            }

            if (col.key === "exposureStatus") {
              return (
                <ToggleSwitch
                  checked={!!row.exposureStatus}
                  onChange={() => toggleExposureStatus(row.id)}
                  ariaLabel={`${row.bannerGroupName} 노출 상태 토글`}
                />
              );
            }

            if (col.key === "searchKeyword") {
              return KEYWORD_LABEL[row.searchKeyword] || row.searchKeyword;
            }

            if (col.key === "features") {
              return row.features.map((feature) => KEYWORD_LABEL[feature] || feature).join(", ");
            }

            if (col.key === "manage") {
              return (
                <Button size="xsm" radius={3} onClick={() => openRegisterModal(row)}>
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
});

export default ComponentsTable;
