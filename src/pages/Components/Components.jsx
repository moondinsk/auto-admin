import React, { useState } from "react";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";
import DragDropList from "@/components/DragDropList/DragDropList";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";
import { confirmStore, modalStore } from "@/store";

import { theme } from "@/styles/theme";
import { StyledComponents, Buttons } from "./Components.styles";

const Components = () => {
  /* ========================================================
      1️⃣ LIST TABLE STATE (배너 목록 데이터)
  ======================================================== */

  const [listTableRows, setListTableRows] = useState([
    {
      id: "b1",
      no: 1,
      groupName: "메인 상단 배너",
      exposureStatus: true,
      imageCount: 3,
      effect: "슬라이드",
      clickCount: 120,
      bannerCode: "B0000001",
    },
    {
      id: "b2",
      no: 2,
      groupName: "메인 하단 배너",
      exposureStatus: false,
      imageCount: 1,
      effect: "페이드",
      clickCount: 32,
      bannerCode: "B0000002",
    },
  ]);

  const [listTableCheckedIds, setListTableCheckedIds] = useState([]);

  // 드래그 앤 드롭 테이블의 행 데이터 (순서 변경 가능)
  const [dndRows, setDndRows] = useState([
    { id: "d1", order: 1, name: "메인 상단 배너", type: "메인" },
    { id: "d2", order: 2, name: "메인 하단 배너", type: "메인" },
    { id: "d3", order: 3, name: "이벤트 배너", type: "프로모션" },
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

  /* ========================================================
      FORM STATE
  ======================================================== */

  // 폼 테이블의 폼 상태 (form 객체로 관리) - FormTable 컴포넌트에 전달
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

  // 폼 테이블의 폼 상태 (form 객체로 관리) - FormTable 컴포넌트에 전달
  const [form, setForm] = useState(initialForm);

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

  // 데이터 전달이 필요한 모달 열기 예시
  const openDataModal = () => {
    modalStore.open(
      <div>
        <p>저장된 설정이 배너 운영 화면에 즉시 반영됩니다.</p>
        <p>계속 진행하시겠습니까?</p>
      </div>,
      {
        title: "배너 설정 저장",
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => console.log("모달 확인"),
        onCancel: () => console.log("모달 취소"),
      },
    );
  };

  // 확인 모달 열기 예시 (Promise 기반으로 결과 받기)
  const openConfirmModal = async () => {
    const confirmed = await confirmStore.open({
      title: "삭제 확인",
      message: "선택한 항목을 삭제하시겠습니까?",
    });

    console.log(confirmed ? "확인 선택" : "취소 선택");
  };

  // 알림 모달 열기 예시 (확인 버튼만 있는 모달)
  const openAlertModal = () => {
    modalStore.open(
      <div>
        <p>요청하신 작업이 정상적으로 처리되었습니다.</p>
      </div>,
      {
        title: "알림",
        confirmText: "확인",
        cancelText: "닫기",
        onConfirm: () => console.log("알림 확인"),
      },
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
              return <button onClick={() => console.log("관리", row.id)}>관리</button>;
            }

            return row[col.key];
          }}
        />
      </CardSection>

      {/* ================= FORM TABLE SECTION ================= */}
      <CardSection title="Table 컴포넌트 예시 - FormTable">
        <FormTable fields={formFields} values={form} onChange={onChange} />
        <div className="flex-box jc" style={{ marginTop: 20, gap: 10 }}>
          <Button outlined color={theme.colors.palette.gray800} onClick={() => setForm(initialForm)}>
            <IoIosRefresh /> 초기화
          </Button>
          <Button outlined onClick={() => console.log("검색", form)}>
            검색
          </Button>
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

      {/* ================= MODAL SECTION ================= */}
      <CardSection title="모달 예시">
        <Button outlined onClick={openDataModal}>
          데이터 전달 모달 열기
        </Button>
      </CardSection>

      {/* CONFIRM MODAL SECTION */}
      <CardSection title="확인 모달 예시">
        <Button outlined onClick={openConfirmModal}>
          확인 모달 열기
        </Button>
      </CardSection>

      {/* ALERT MODAL SECTION */}
      <CardSection title="알림 모달 예시">
        <Button outlined onClick={openAlertModal}>
          알림 모달 열기
        </Button>
      </CardSection>
    </StyledComponents>
  );
};

export default Components;
