import React, { useState } from "react";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { FormTable, ListTable } from "@/components/Table/Table";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";

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

  /* ========================================================
      2️⃣ LIST TABLE 체크 로직
  ======================================================== */

  const toggleOne = (id) => {
    setListTableCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = (checked) => {
    setListTableCheckedIds(checked ? listTableRows.map((row) => row.id) : []);
  };

  const allChecked = listTableRows.length > 0 && listTableCheckedIds.length === listTableRows.length;

  /* ========================================================
      3️⃣ LIST TABLE 컬럼 정의
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
      4️⃣ LIST TABLE 액션
  ======================================================== */

  const toggleExposureStatus = (id) => {
    setListTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, exposureStatus: !row.exposureStatus } : row)),
    );
  };

  /* ========================================================
      5️⃣ FORM TABLE 필드 정의
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

  /* ========================================================
      6️⃣ FORM STATE
  ======================================================== */

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

  const [form, setForm] = useState(initialForm);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ========================================================
      7️⃣ RENDER
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
    </StyledComponents>
  );
};

export default Components;
