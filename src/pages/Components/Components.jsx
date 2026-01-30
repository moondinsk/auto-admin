import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import { theme } from "@/styles/theme";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { StyledComponents, Buttons } from "./Components.styles";
import { FormTable, ListTable } from "@/components/Table/Table";
import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";

const Components = () => {
  // ListTable (예: 상품 목록)

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

  const toggleOne = (id) => {
    setListTableCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = (checked) => {
    setListTableCheckedIds(checked ? listTableRows.map((r) => r.id) : []);
  };

  const allChecked = listTableRows.length > 0 && listTableCheckedIds.length === listTableRows.length;

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

  const toggleExposureStatus = (id) => {
    setListTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, exposureStatus: !row.exposureStatus } : row)),
    );
  };

  // FormTable (예: 배너 그룹 정보)
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
      rows: 4,
    },
  ];

  const [form, setForm] = useState({
    bannerGroupName: "",
    bannerGroupDesc: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <StyledComponents className="flex-box col">
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
      <CardSection title="Table 컴포넌트 예시 - FormTable">
        <FormTable fields={formFields} values={form} onChange={onChange} />
      </CardSection>
    </StyledComponents>
  );
};

export default Components;
