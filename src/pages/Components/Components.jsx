import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";
import TableActionButtons from "@/components/Table/TableActionButtons";

import DragDropList from "@/components/DragDropList/DragDropList";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import { CONFIRM_PAYLOAD, MODAL_PAYLOAD } from "@/constants/modal";
import { getProductsApi } from "@/api";
import { createSearchParamsFromForm, parseSearchParamsToForm, SEARCH_PARAM_TYPE } from "@/utils/searchParams";
import { theme } from "@/styles/theme";
import { StyledComponents, Buttons } from "./Components.styles";
import GuideContent from "@/components/Modal/GuideContent";
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";
import AlertModalContent from "@/components/Modal/AlertModalContent";
import SearchStepModalContent from "@/components/Modal/SearchStepModalContent";
import NestedModalContent from "@/components/Modal/NestedModalContent";
import TripleNestedModalContent from "@/components/Modal/TripleNestedModalContent";
import { useStore } from "@/store";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const LIMIT_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
];

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

const includesIgnoreCase = (source, keyword) =>
  String(source || "")
    .toLowerCase()
    .includes(String(keyword || "").toLowerCase());

const filterListRowsByForm = (rows, criteria) => {
  const keyword = String(criteria.searchValue || "").trim();
  const searchTargetKey =
    {
      name: "bannerGroupName",
      code: "bannerCode",
    }[criteria.searchCategory] || criteria.searchCategory;

  return rows.filter((row) => {
    if (criteria.bannerGroupName && !includesIgnoreCase(row.bannerGroupName, criteria.bannerGroupName)) {
      return false;
    }

    if (criteria.bannerGroupDesc && !includesIgnoreCase(row.bannerGroupDesc, criteria.bannerGroupDesc)) {
      return false;
    }

    if (criteria.searchKeyword && row.searchKeyword !== criteria.searchKeyword) {
      return false;
    }

    if (criteria.searchCategory && keyword) {
      if (!includesIgnoreCase(row[searchTargetKey], keyword)) {
        return false;
      }
    }

    if (Array.isArray(criteria.features) && criteria.features.length > 0) {
      const matchesFeatures = criteria.features.every((feature) => row.features.includes(feature));
      if (!matchesFeatures) {
        return false;
      }
    }

    if (criteria.startDate && row.createdDate < criteria.startDate) {
      return false;
    }

    if (criteria.endDate && row.createdDate > criteria.endDate) {
      return false;
    }

    return true;
  });
};

const initialForm = {
  bannerGroupName: "",
  bannerGroupDesc: "",
  searchKeyword: "",
  searchCategory: "",
  searchValue: "",
  features: [],
  startDate: "",
  endDate: "",
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
};

const searchFormFields = [
  "bannerGroupName",
  "bannerGroupDesc",
  "searchKeyword",
  "searchCategory",
  "searchValue",
  "startDate",
  "endDate",
  "page",
  "limit",
  { key: "features", type: SEARCH_PARAM_TYPE.ARRAY },
];

const Components = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ========================================================
      1️⃣ LIST TABLE STATE (배너 목록 데이터)
  ======================================================== */

  const [listTableRows, setListTableRows] = useState(() => {
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
  });

  // 체크된 행의 ID 목록 상태 - 체크박스 토글 시 업데이트되어 선택된 행 관리
  const [listTableCheckedIds, setListTableCheckedIds] = useState([]);

  // 드래그 앤 드롭 테이블의 행 데이터 (순서 변경 가능)
  const [dndRows, setDndRows] = useState([
    {
      id: "1",
      order: 1,
      name: "메뉴 1",
      type: "부모",
      children: [
        { id: "1-1", order: 1, name: "메뉴 1-1", type: "자식" },
        { id: "1-2", order: 2, name: "메뉴 1-2", type: "자식" },
      ],
    },
    {
      id: "2",
      order: 2,
      name: "메뉴 2",
      type: "부모",
      children: [
        { id: "2-1", order: 1, name: "메뉴 2-1", type: "자식" },
        { id: "2-2", order: 2, name: "메뉴 2-2", type: "자식" },
        { id: "2-3", order: 3, name: "메뉴 2-3", type: "자식" },
      ],
    },
  ]);

  /* ========================================================
    노출 상태 토글, 체크박스 토글 등의 액션 핸들러 정의
  ======================================================== */

  const toggleOne = (id) => {
    setListTableCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const initialParsedForm = parseSearchParamsToForm({
    searchParams,
    initialForm,
    fields: searchFormFields,
  });

  const [appliedForm, setAppliedForm] = useState(initialParsedForm);

  const filteredListTableRows = filterListRowsByForm(listTableRows, appliedForm);

  const page = toPositiveInt(appliedForm.page, DEFAULT_PAGE);
  const limit = toPositiveInt(appliedForm.limit, DEFAULT_LIMIT);
  const totalPages = Math.max(1, Math.ceil(filteredListTableRows.length / limit));
  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * limit;
  const pagedListTableRows = filteredListTableRows.slice(startIndex, startIndex + limit);

  const currentPageRowIds = pagedListTableRows.map((row) => row.id);

  const toggleAll = (checked) => {
    setListTableCheckedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...currentPageRowIds]));
      }

      return prev.filter((id) => !currentPageRowIds.includes(id));
    });
  };

  const allChecked =
    currentPageRowIds.length > 0 && currentPageRowIds.every((rowId) => listTableCheckedIds.includes(rowId));

  /* ========================================================
    LIST TABLE 컬럼 정의
  ======================================================== */

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

  /* ========================================================
      LIST TABLE 액션
  ======================================================== */

  const toggleExposureStatus = (id) => {
    setListTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, exposureStatus: !row.exposureStatus } : row)),
    );
  };

  /* ========================================================
      FORM TABLE 필드 정의
  ======================================================== */

  const getDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formFields = [
    {
      key: "name",
      label: "배너 그룹명",
      required: true,
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
      selectOptions: [
        { value: "bannerGroupName", label: "배너명" },
        { value: "bannerCode", label: "배너코드" },
        { value: "bannerGroupDesc", label: "배너 설명" },
        { value: "searchKeyword", label: "배너 키워드" },
      ],
      inputName: "searchValue",
      inputPlaceholder: "검색어를 입력하세요",
    },
    {
      key: "pagination",
      label: "limit / 페이지",
      type: "select-input",
      selectName: "limit",
      selectPlaceholder: "limit 선택",
      selectOptions: LIMIT_OPTIONS,
      inputName: "page",
      inputPlaceholder: "페이지 번호",
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
          onClick: (onChange) => {
            const today = getToday();
            onChange({ target: { name: "startDate", value: today } });
            onChange({ target: { name: "endDate", value: today } });
          },
        },
        {
          label: "7일",
          value: "7days",
          onClick: (onChange) => {
            const { start, end } = getDateRange(7);
            onChange({ target: { name: "startDate", value: start } });
            onChange({ target: { name: "endDate", value: end } });
          },
        },
        {
          label: "15일",
          value: "15days",
          onClick: (onChange) => {
            const { start, end } = getDateRange(15);
            onChange({ target: { name: "startDate", value: start } });
            onChange({ target: { name: "endDate", value: end } });
          },
        },
        {
          label: "1개월",
          value: "1month",
          onClick: (onChange) => {
            const { start, end } = getDateRange(30);
            onChange({ target: { name: "startDate", value: start } });
            onChange({ target: { name: "endDate", value: end } });
          },
        },
        {
          label: "전체",
          value: "all",
          onClick: (onChange) => {
            onChange({ target: { name: "startDate", value: "" } });
            onChange({ target: { name: "endDate", value: "" } });
          },
        },
      ],
    },
  ];

  const column2Fields = [
    {
      key: "username",
      label: "사용자명",
      name: "username",
      type: "input",
      placeholder: "사용자명을 입력하세요",
    },
    {
      key: "role",
      label: "역할",
      name: "role",
      type: "select",
      placeholder: "역할을 선택하세요",
      options: [
        { value: "admin", label: "관리자" },
        { value: "editor", label: "편집자" },
        { value: "viewer", label: "뷰어" },
      ],
    },
    {
      key: "bio",
      label: "소개",
      name: "bio",
      type: "textarea",
      placeholder: "자기소개를 입력하세요",
      colSpan: 3,
    },
    {
      key: "searchFilter",
      label: "검색 필터",
      type: "select-input",
      selectName: "searchCategory",
      selectPlaceholder: "카테고리 선택",
      selectOptions: [
        { value: "bannerGroupName", label: "배너명" },
        { value: "bannerCode", label: "배너코드" },
        { value: "bannerGroupDesc", label: "배너 설명" },
        { value: "searchKeyword", label: "배너 키워드" },
      ],
      inputName: "searchValue",
      inputPlaceholder: "검색어를 입력하세요",
      colSpan: 3,
    },
  ];

  /* ========================================================
      FORM STATE
  ======================================================== */

  // 폼 테이블의 폼 상태 (form 객체로 관리) - FormTable 컴포넌트에 전달

  const [form, setForm] = useState(initialParsedForm);

  // 컬럼 2개인 테이블의 폼 상태 (colSpan 필드도 포함) - FormTable 컴포넌트에 전달
  const initialColumn2Form = {
    username: "",
    role: "",
    bio: "",
  };

  // 컬럼 2개인 테이블의 폼 상태 (colSpan 필드도 포함)
  const [column2Form, setColumn2Form] = useState(initialColumn2Form);

  // 폼 테이블의 onChange 핸들러 (모든 필드 업데이트) - FormTable 컴포넌트에 전달
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 컬럼 2개인 테이블의 onChange 핸들러 (colSpan 필드도 함께 업데이트)
  const onColumn2Change = (e) => {
    const { name, value } = e.target;
    setColumn2Form((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const nextLimit = toPositiveInt(form.limit, DEFAULT_LIMIT);
    const nextPage = toPositiveInt(form.page, DEFAULT_PAGE);

    const normalizedForm = {
      ...form,
      page: nextPage,
      limit: nextLimit,
    };

    const searchedRows = filterListRowsByForm(listTableRows, normalizedForm);
    const searchedTotalPages = Math.max(1, Math.ceil(searchedRows.length / nextLimit));
    const safeSearchedPage = Math.min(nextPage, searchedTotalPages);

    const searchForm = {
      ...normalizedForm,
      page: safeSearchedPage,
    };

    setForm(searchForm);
    setAppliedForm(searchForm);

    setSearchParams(
      createSearchParamsFromForm({
        form: searchForm,
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
  const { modalStore, confirmStore } = useStore();
  // 관리 버튼/등록 버튼에서 공통으로 사용하는 등록 모달 열기
  const openRegisterModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.REGISTER_MODAL({
        component: RegisterModalContent,
        data: {
          title: "등록 모달",
          description: "새 항목을 등록하세요.",
        },
      }),
    );
  };

  // 가이드 모달 열기 예시
  const openGuideModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "배너 운영 가이드",
          description: "배너 등록 전 노출 효과와 기간을 먼저 확인하세요.",
        },
      }),
    );
  };

  // 알림 모달 열기 예시
  const openAlertModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.ALERT_MODAL({
        component: AlertModalContent,
        message: "요청하신 작업이 정상적으로 처리되었습니다.",
      }),
    );
  };

  // 2중 모달 열기 예시 - 가이드 모달에서 버튼 클릭 시 NestedModalContent로 2차 모달 열림
  const openNestedModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: NestedModalContent,
        data: {
          description: "1차 모달에서 버튼을 눌러 2차 모달을 열 수 있습니다.",
        },
      }),
    );
  };

  // 2중 모달 예시 - 입력형(1차/2차) 모달
  const openNestedInputModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: SearchStepModalContent,
        data: {},
      }),
    );
  };

  const openTripleNestedModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: TripleNestedModalContent,
        data: {
          description: "1차 모달에서 2차, 3차까지 순차적으로 열 수 있습니다.",
        },
      }),
    );
  };

  // 삭제 모달 예시
  const openDeleteModal = () => {
    confirmStore.openByPayload(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        data: {
          selectedIds: listTableCheckedIds,
        },
        message: "선택한 항목을 삭제하시겠습니까?",
      }),
    );
  };

  const handleGetProductsExample = async () => {
    try {
      const data = await getProductsApi({
        page: 1,
        size: 10,
      });

      const products = Array.isArray(data) ? data : (data?.items ?? data?.list ?? []);

      modalStore.openByPayload(
        MODAL_PAYLOAD.ALERT_MODAL({
          component: AlertModalContent,
          message: `상품 조회 성공 (${products.length}건) - 콘솔에서 상세 결과를 확인하세요.`,
        }),
      );
    } catch (error) {
      modalStore.openByPayload(
        MODAL_PAYLOAD.ALERT_MODAL({
          component: AlertModalContent,
          message: error?.response?.data?.message || "상품 조회에 실패했습니다.",
        }),
      );
    }
  };

  /* ========================================================
      RENDER
  ======================================================== */

  return (
    <StyledComponents className="flex-box col">
      {/* ================= BUTTON SECTION ================= */}
      <CardSection title="Button 컴포넌트 예시">
        <Buttons className="flex-box">
          <Button bgColor={theme.colors.gray.black}>Filled</Button>

          <Button outlined color={theme.colors.primary.main} radius="half">
            Outlined
            <IoIosArrowForward size={14} />
          </Button>

          <Button disabled>Filled (Disabled)</Button>

          <Button outlined disabled radius={0}>
            Outlined (Disabled)
          </Button>

          <Button size="sm">수정</Button>

          <Button size="xsm" radius={3}>
            삭제
          </Button>

          <Button fullWidth>Full Width</Button>
        </Buttons>
      </CardSection>

      {/* ================= FORM TABLE SECTION ================= */}
      <CardSection title="Table 컴포넌트 예시 - FormTable">
        <FormTable fields={formFields} values={form} onChange={onChange} />
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

      {/* ================= LIST TABLE SECTION ================= */}
      <CardSection title="Table 컴포넌트 예시 - ListTable">
        <ListTable
          pagination={false}
          columns={listTableColumns}
          rows={pagedListTableRows}
          rowKey="id"
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
              const keywordLabel = {
                new: "신상품",
                sale: "세일",
                best: "베스트",
              };

              return keywordLabel[row.searchKeyword] || row.searchKeyword;
            }

            if (col.key === "features") {
              const featureLabel = {
                new: "신상품",
                sale: "세일",
                best: "베스트",
              };

              return row.features.map((feature) => featureLabel[feature] || feature).join(", ");
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
        <div style={{ marginTop: 10 }}>
          총 {filteredListTableRows.length}건 / page {safePage} / limit {limit}
        </div>
      </CardSection>

      {/* ================= COLUMN 2 TABLE SECTION ================= */}
      <CardSection title="컬럼 2개인 Table 컴포넌트 예시">
        <FormTable columns={2} fields={column2Fields} values={column2Form} onChange={onColumn2Change} />
      </CardSection>

      {/* ================= DRAG & DROP LIST SECTION ================= */}
      <CardSection title="드래그 앤 드롭이 가능한 리스트 예시">
        <DragDropList items={dndRows} onChange={setDndRows} />
      </CardSection>

      <CardSection title="Axios API 호출 예시 - getProductsApi">
        <div className="flex-box col" style={{ gap: 12 }}>
          <Button outlined onClick={handleGetProductsExample}>
            상품 목록 조회
          </Button>
          <div>조회 결과는 콘솔과 알림 모달에서 확인할 수 있습니다.</div>
        </div>
      </CardSection>

      {/* ================= MODAL SECTION ================= */}
      <CardSection title="모달 예시">
        <div className="flex-box" style={{ gap: 10 }}>
          <Button outlined onClick={() => openRegisterModal()}>
            등록 모달 열기
          </Button>
          <Button outlined onClick={openGuideModal}>
            가이드 모달 열기
          </Button>
        </div>
      </CardSection>

      {/* CONFIRM MODAL SECTION */}
      <CardSection title="삭제 모달 예시">
        <Button outlined onClick={openDeleteModal}>
          삭제 모달 열기
        </Button>
      </CardSection>

      {/* ALERT MODAL SECTION */}
      <CardSection title="알림 모달 예시">
        <Button outlined onClick={openAlertModal}>
          알림 모달 열기
        </Button>
      </CardSection>

      <CardSection title="2중 모달 예시">
        <div className="flex-box" style={{ gap: 10 }}>
          <Button outlined onClick={openNestedModal}>
            기본 2중 모달 열기
          </Button>
          <Button outlined onClick={openNestedInputModal}>
            입력형 2중 모달 열기
          </Button>
        </div>
      </CardSection>

      <CardSection title="3중 모달 예시">
        <div className="flex-box" style={{ gap: 10 }}>
          <Button outlined onClick={openTripleNestedModal}>
            기본 3중 모달 열기
          </Button>
        </div>
      </CardSection>
    </StyledComponents>
  );
});

export default Components;
