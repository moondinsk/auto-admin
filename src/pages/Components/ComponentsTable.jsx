import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosRefresh } from "react-icons/io";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, InfoTable, ListTable } from "@/components/Table/Table";
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

const infoTableRows = [
  [
    { label: "글번호", value: 10 },
    { label: "날짜", value: "2026-03-11" },
    { label: "작성자", value: "관리자" },
    { label: "조회수", value: 124 },
  ],
  [
    { label: "카테고리", value: "운영 공지" },
    { label: "상태", value: "게시중" },
  ],
  [{ label: "제목", value: "사업자 인증 운영 정책 안내" }],
  [
    {
      label: "내용",
      value:
        "사업자 인증 요청 검수 기준과 승인 처리 절차가 일부 변경되었습니다. 운영 정책을 확인한 뒤 회원 인증 및 승인 관리 업무를 진행해 주세요.",
    },
  ],
  [
    { label: "첨부파일", value: "bizauth-notice-guide.pdf" },
    { label: "다운로드", value: <Button size="xsm">파일 다운로드</Button> },
  ],
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

const getPositiveIntParam = (searchParams, key, fallback) => {
  const value = Number(searchParams.get(key));
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

const isValidLimitParam = (value) => PAGE_SIZE_OPTIONS.some((option) => option.value === value);

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

const ComponentsTable = () => {
  const { modalStore } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 쿼리스트링에서 현재 페이지 번호를 읽어옵니다.
  // 유효하지 않은 값이면 1페이지를 기본값으로 사용합니다.
  const page = getPositiveIntParam(searchParams, "page", 1);

  // URL 쿼리스트링에서 페이지당 노출 개수를 읽어옵니다.
  // 값이 없거나 잘못되면 기본 페이지 사이즈를 사용합니다.
  const rawLimit = getPositiveIntParam(searchParams, "limit", DEFAULT_PAGE_SIZE);

  // 허용된 페이지 사이즈 옵션인지 검증합니다.
  // 허용되지 않은 값이면 기본 페이지 사이즈로 보정합니다.
  const limit = isValidLimitParam(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE;

  // react-select에 넣을 현재 선택된 페이지 사이즈 옵션입니다.
  const selectedLimitOption = PAGE_SIZE_OPTIONS.find((option) => option.value === limit) || PAGE_SIZE_OPTIONS[0];

  // URLSearchParams를 페이지 전용 검색 폼 구조로 변환합니다.
  // searchParams가 바뀔 때만 다시 계산되도록 memo 처리합니다.
  const parsedFormFromParams = useMemo(() => {
    return parseSearchParamsToForm({
      searchParams,
      initialForm,
      fields: searchFormFields,
    });
  }, [searchParams]);

  // form: 사용자가 FormTable에서 현재 입력 중인 값
  const [form, setForm] = useState(parsedFormFromParams);

  // appliedForm: 실제 검색 결과 필터링에 적용되는 값
  // 검색 버튼을 누른 시점의 form이 들어갑니다.
  const [appliedForm, setAppliedForm] = useState(parsedFormFromParams);

  // 리스트 테이블 원본 데이터
  const [listTableRows, setListTableRows] = useState(() => createMockRows());

  // 체크박스로 선택된 row id 목록
  const [listTableCheckedIds, setListTableCheckedIds] = useState([]);

  // URL이 바뀌면 form / appliedForm을 모두 URL 기준으로 다시 동기화합니다.
  // 뒤로가기, 앞으로가기, 직접 URL 수정에도 화면 상태가 맞춰지도록 합니다.
  useEffect(() => {
    setForm(parsedFormFromParams);
    setAppliedForm(parsedFormFromParams);
  }, [parsedFormFromParams]);

  // 실제 리스트 검색은 appliedForm 기준으로만 수행합니다.
  // 사용자가 입력 중인 form과 검색 적용 상태를 분리해서 관리합니다.
  const filteredListTableRows = useMemo(() => {
    return listTableRows.filter((row) => matchesRow(row, appliedForm));
  }, [listTableRows, appliedForm]);

  // 검색 결과 전체 개수
  const totalCount = filteredListTableRows.length;

  // 전체 페이지 수
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // 현재 page 값이 전체 페이지 수를 넘지 않도록 보정한 값
  const safePage = Math.min(page, totalPages);

  // 현재 페이지의 시작/끝 인덱스
  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;

  // 현재 페이지에 해당하는 row만 잘라낸 값
  // ListTable이 외부 pagination 방식이면 이 값을 rows로 넘기면 됩니다.
  const paginatedRows = useMemo(() => {
    return filteredListTableRows.slice(startIndex, endIndex);
  }, [filteredListTableRows, startIndex, endIndex]);

  // 현재 페이지에 노출 중인 row id 목록
  const currentPageRowIds = paginatedRows.map((row) => row.id);

  // 현재 페이지의 모든 row가 선택되었는지 여부
  // 헤더 전체선택 체크박스 상태 계산에 사용합니다.
  const allChecked =
    currentPageRowIds.length > 0 && currentPageRowIds.every((rowId) => listTableCheckedIds.includes(rowId));

  // URLSearchParams 일부만 갱신하는 공통 함수
  // 빈 값은 삭제하고, 값이 있으면 문자열로 저장합니다.
  const updateSearchParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  // URL의 page / limit 값이 비정상이면 자동 보정합니다.
  // 예: 검색 결과가 줄어서 현재 페이지가 존재하지 않게 된 경우
  useEffect(() => {
    const nextUpdates = {};

    if (page !== safePage) {
      nextUpdates.page = safePage;
    }

    if (!isValidLimitParam(rawLimit)) {
      nextUpdates.limit = limit;
    }

    if (Object.keys(nextUpdates).length > 0) {
      updateSearchParams(nextUpdates);
    }
  }, [page, safePage, rawLimit, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // FormTable 입력 변경 핸들러
  // 일반 input/select는 단일 값으로 처리하고,
  // checkbox는 배열 값(features 등)으로 처리합니다.
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      if (type === "checkbox") {
        const prevValues = Array.isArray(prev[name]) ? prev[name] : [];

        return {
          ...prev,
          [name]: checked ? [...prevValues, value] : prevValues.filter((item) => item !== value),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // 검색 버튼 클릭 시 현재 form 값을 appliedForm으로 확정합니다.
  // 그리고 검색 조건을 URL 파라미터에도 반영합니다.
  const handleSearch = () => {
    setAppliedForm(form);

    const nextParams = createSearchParamsFromForm({
      form,
      fields: searchFormFields,
    });

    // 새 검색 시 1페이지부터 다시 시작
    nextParams.set("page", "1");
    nextParams.set("limit", String(limit));

    setSearchParams(nextParams);
    setListTableCheckedIds([]);
  };

  // 검색 조건 초기화
  // 폼 상태 / 적용 상태 / URL 파라미터 / 체크 상태를 모두 초기화합니다.
  const handleResetSearch = () => {
    setForm(initialForm);
    setAppliedForm(initialForm);

    const nextParams = createSearchParamsFromForm({
      form: initialForm,
      fields: searchFormFields,
    });

    nextParams.set("page", "1");
    nextParams.set("limit", String(DEFAULT_PAGE_SIZE));

    setSearchParams(nextParams);
    setListTableCheckedIds([]);
  };

  // 페이지 이동 시 URL의 page 값을 갱신합니다.
  const handlePageChange = (nextPage) => {
    updateSearchParams({
      page: nextPage,
      limit,
    });

    setListTableCheckedIds([]);
  };

  // 페이지당 개수 변경 시 1페이지로 이동하고 limit를 갱신합니다.
  const handleLimitChange = (option) => {
    const nextLimit = option?.value || DEFAULT_PAGE_SIZE;

    updateSearchParams({
      page: 1,
      limit: nextLimit,
    });

    setListTableCheckedIds([]);
  };

  // 개별 row 체크/해제
  const toggleOne = (id) => {
    setListTableCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((checkedId) => checkedId !== id) : [...prev, id],
    );
  };

  // 현재 페이지 기준 전체선택 / 전체해제
  const toggleAll = (checked) => {
    setListTableCheckedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...currentPageRowIds]));
      }
      return prev.filter((id) => !currentPageRowIds.includes(id));
    });
  };

  // 노출 상태 토글
  const toggleExposureStatus = (id) => {
    setListTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, exposureStatus: !row.exposureStatus } : row)),
    );
  };

  // 등록/수정 모달 오픈
  // row가 있으면 수정, 없으면 신규 등록 용도로 사용할 수 있습니다.
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

  // FormTable 렌더링용 필드 정의
  // 실제 form state의 key(name)와 연결됩니다.
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

  // ListTable 컬럼 정의
  // renderCell에서 key 기준으로 각 셀 UI를 분기합니다.
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
            onChange={handleLimitChange}
          />
        </TableTop>

        <ListTable
          pagination
          columns={listTableColumns}
          rows={filteredListTableRows}
          rowKey="id"
          currentPage={safePage}
          totalCount={totalCount}
          pageSize={limit}
          onPageChange={handlePageChange}
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

      <CardSection title="Table 컴포넌트 예시 - InfoTable">
        <InfoTable rows={infoTableRows} />
      </CardSection>
    </StyledComponents>
  );
};

const ObservedComponentsTable = observer(ComponentsTable);

export default ObservedComponentsTable;
