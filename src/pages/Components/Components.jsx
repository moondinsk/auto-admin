import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";

import DragDropList from "@/components/DragDropList/DragDropList";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import { CONFIRM_PAYLOAD, MODAL_PAYLOAD } from "@/constants/modal";
import { confirmStore, formTableStore, modalStore } from "@/store";

import { theme } from "@/styles/theme";
import { StyledComponents, Buttons } from "./Components.styles";
import GuideModal from "@/components/Modal/GuideModal";
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";
import AlertModalContent from "@/components/Modal/AlertModalContent";
import SearchStepModalContent from "@/components/Modal/SearchStepModalContent";
import GuideExampleContent from "@/components/Modal/GuideExampleContent";

// 2중 모달에서 사용할 2차 모달 콘텐츠 컴포넌트
const NestedModalContent = ({ data }) => {
  const handleOpenSecondModal = () => {
    confirmStore.openByPayload(
      CONFIRM_PAYLOAD.INPUT_CONFIRM({
        component: GuideExampleContent,
        data: {
          title: "2차 안내 모달",
          description: "이 모달은 삭제가 아닌 안내/입력 확인 예시입니다.",
        },
        message: "2차 모달 내용을 확인해주세요.",
        successToastMessage: "2차 모달에서 확인을 눌렀습니다.",
      }),
    );
  };

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <p>{data?.description || "1차 모달입니다."}</p>
      <div>
        <Button outlined onClick={handleOpenSecondModal}>
          2차 모달 열기
        </Button>
      </div>
    </div>
  );
};

const initialForm = {
  bannerGroupName: "",
  bannerGroupDesc: "",
  searchKeyword: "",
  searchCategory: "",
  searchValue: "",
  exposureStatus: "",
  features: [],
  startDate: "",
  endDate: "",
};

// URLSearchParams에서 폼 상태로 변환하는 함수 - 초기 폼 상태를 URL 파라미터에서 가져올 때 사용
const parseSearchParamsToForm = (searchParams) => {
  const exposureStatusParam = searchParams.get("exposureStatus");

  return {
    ...initialForm,
    bannerGroupName: searchParams.get("bannerGroupName") || "",
    bannerGroupDesc: searchParams.get("bannerGroupDesc") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    searchCategory: searchParams.get("searchCategory") || "",
    searchValue: searchParams.get("searchValue") || "",
    exposureStatus: exposureStatusParam === "true" ? true : exposureStatusParam === "false" ? false : "",
    features: searchParams.get("features")?.split(",").filter(Boolean) || [],
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };
};

// 폼 상태에서 URLSearchParams 객체를 생성하는 함수 - 검색 버튼 클릭 시 URL 업데이트할 때 사용
const createSearchParamsFromForm = (form) => {
  const params = new URLSearchParams();
  [
    "bannerGroupName",
    "bannerGroupDesc",
    "searchKeyword",
    "searchCategory",
    "searchValue",
    "startDate",
    "endDate",
  ].forEach((key) => {
    if (form[key]) {
      params.set(key, form[key]);
    }
  });

  if (form.exposureStatus !== "") {
    params.set("exposureStatus", String(form.exposureStatus));
  }

  if (Array.isArray(form.features) && form.features.length > 0) {
    params.set("features", form.features.join(","));
  }

  return params;
};

const Components = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchForm = useMemo(() => parseSearchParamsToForm(searchParams), [searchParams]);

  /* ========================================================
      1️⃣ LIST TABLE STATE (배너 목록 데이터)
  ======================================================== */

  const [listTableRows, setListTableRows] = useState([
    // 데이터 20개 추가
    ...Array.from({ length: 15 }, (_, index) => ({
      id: `b${index + 3}`,
      no: index + 3,
      groupName: `배너 그룹 ${index + 3}`,
      exposureStatus: index % 2 === 0,
      imageCount: (index % 5) + 1,
      effect: index % 2 === 0 ? "슬라이드" : "페이드",
      clickCount: (index + 3) * 11,
      bannerCode: `B${String(index + 3).padStart(7, "0")}`,
    })),
  ]);

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

  const toggleAll = (checked) => {
    setListTableCheckedIds(checked ? listTableRows.map((row) => row.id) : []);
  };

  const allChecked = listTableRows.length > 0 && listTableCheckedIds.length === listTableRows.length;

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
    { key: "groupName", header: "그룹명", align: "left" },
    { key: "exposureStatus", header: "노출 상태", width: 120 },
    { key: "imageCount", header: "이미지 수", width: 110 },
    { key: "effect", header: "배너 효과", width: 120 },
    { key: "clickCount", header: "클릭 수", width: 110 },
    { key: "bannerCode", header: "배너 코드", width: 160 },
    { key: "manage", header: "관리", width: 120 },
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
        { value: "name", label: "배너명" },
        { value: "code", label: "배너코드" },
      ],
      inputName: "searchValue",
      inputPlaceholder: "검색어를 입력하세요",
    },
    {
      key: "exposure",
      label: "노출 여부",
      name: "exposureStatus",
      type: "radio",
      options: [
        { value: true, label: "노출" },
        { value: false, label: "비노출" },
      ],
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
        { value: "name", label: "배너명" },
        { value: "code", label: "배너코드" },
      ],
      inputName: "searchValue",
      inputPlaceholder: "검색어를 입력하세요",
      colSpan: 3,
    },
  ];

  const storeFormFields = [
    {
      key: "managerName",
      label: "담당자명",
      name: "managerName",
      type: "input",
      placeholder: "담당자명을 입력하세요",
    },
    {
      key: "managerRole",
      label: "담당자 권한",
      name: "managerRole",
      type: "select",
      placeholder: "권한을 선택하세요",
      options: [
        { value: "admin", label: "관리자" },
        { value: "editor", label: "편집자" },
        { value: "viewer", label: "조회자" },
      ],
    },
    {
      key: "managerStatus",
      label: "활성 상태",
      name: "managerStatus",
      type: "radio",
      options: [
        { value: "active", label: "활성" },
        { value: "inactive", label: "비활성" },
      ],
    },
    {
      key: "managerMemo",
      label: "메모",
      name: "managerMemo",
      type: "textarea",
      placeholder: "메모를 입력하세요",
      rows: 3,
      colSpan: 3,
    },
  ];

  /* ========================================================
      FORM STATE
  ======================================================== */

  // 폼 테이블의 폼 상태 (form 객체로 관리) - FormTable 컴포넌트에 전달
  const [form, setForm] = useState(initialSearchForm);

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

  const onStoreFormChange = (e) => {
    const { name, value } = e.target;
    if (!name) {
      return;
    }

    formTableStore.setField(name, value);
  };

  const handleStoreFormSave = () => {
    console.log("[FormTable Store Save]", formTableStore.values);
  };

  const handleSearch = () => {
    setSearchParams(createSearchParamsFromForm(form));
    setListTableCheckedIds([]);
  };

  const handleResetSearch = () => {
    setForm(initialForm);
    setSearchParams(new URLSearchParams());
    setListTableCheckedIds([]);
  };

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
        component: GuideModal,
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

  // 2중 모달 예시 - SearchStepModalContent에서 버튼 클릭 시 SearchResultFormContent로 2차 모달 열림, 2차 모달에서 입력한 값이 다시 1차 모달에 반영되는 형태
  const openNestedSearchModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: SearchStepModalContent,
        data: {},
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

      {/* ================= LIST TABLE SECTION ================= */}
      <CardSection title="Table 컴포넌트 예시 - ListTable">
        <ListTable
          pagination
          columns={listTableColumns}
          rows={listTableRows}
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
                  ariaLabel={`${row.groupName} 노출 상태 토글`}
                />
              );
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

      {/* ================= FORM TABLE SECTION ================= */}
      <CardSection title="Table 컴포넌트 예시 - FormTable">
        <FormTable fields={formFields} values={form} onChange={onChange} />
        <div className="flex-box jc" style={{ marginTop: 20, gap: 10 }}>
          <Button outlined color={theme.colors.palette.gray800} onClick={handleResetSearch}>
            <IoIosRefresh /> 초기화
          </Button>
          <Button outlined onClick={handleSearch}>
            검색
          </Button>
        </div>
      </CardSection>

      {/* ================= COLUMN 2 TABLE SECTION ================= */}
      <CardSection title="컬럼 2개인 Table 컴포넌트 예시">
        <FormTable columns={2} fields={column2Fields} values={column2Form} onChange={onColumn2Change} />
      </CardSection>

      <CardSection title="Table 컴포넌트 예시 - FormTable (Store 관리)">
        <FormTable columns={2} fields={storeFormFields} values={formTableStore.values} onChange={onStoreFormChange} />
        <div className="flex-box jc" style={{ marginTop: 20, gap: 10 }}>
          <Button outlined color={theme.colors.palette.gray800} onClick={() => formTableStore.reset()}>
            <IoIosRefresh /> 초기화
          </Button>
          <Button outlined onClick={handleStoreFormSave}>
            저장
          </Button>
        </div>
      </CardSection>

      {/* ================= DRAG & DROP LIST SECTION ================= */}
      <CardSection title="드래그 앤 드롭이 가능한 리스트 예시">
        <DragDropList items={dndRows} onChange={setDndRows} />
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
          <Button outlined onClick={openNestedSearchModal}>
            찾기/검색형 2중 모달 열기
          </Button>
        </div>
      </CardSection>
    </StyledComponents>
  );
};

const ObservedComponents = observer(Components);

export default ObservedComponents;
