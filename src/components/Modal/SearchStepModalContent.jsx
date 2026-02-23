import React, { useState } from "react";
import Button from "@/components/Button/Button";
import { CONFIRM_PAYLOAD } from "@/constants/modal";
import { confirmStore } from "@/store";
import SearchResultFormContent from "@/components/Modal/SearchResultFormContent";

/**
 * 1차 모달 컴포넌트
 * - 내부 상태(searchedItem) 관리
 * - 버튼 클릭 시 2차 입력 모달을 열어 값 수정
 * - 수정된 값을 다시 현재 모달 상태에 반영
 */
const SearchStepModalContent = ({ data }) => {
  // 초기값: 전달받은 data.itemName 또는 빈 문자열
  const [searchedItem, setSearchedItem] = useState({
    itemName: data?.itemName || "",
  });

  // 2차 입력 모달 오픈
  const handleOpenFormModal = () => {
    confirmStore.openByPayload(
      CONFIRM_PAYLOAD.INPUT_CONFIRM({
        component: SearchResultFormContent,

        // 현재 값 전달 + 수정 시 부모 상태 업데이트 콜백 전달
        data: {
          ...searchedItem,
          onSync: (nextValues) => {
            setSearchedItem((prev) => ({
              ...prev,
              ...nextValues,
            }));
          },
        },

        message: "입력값을 수정해주세요.",
      }),
    );
  };

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <p>1차 모달 → 버튼 클릭 시 2차 입력 모달 오픈</p>

      <div className="flex-box col" style={{ gap: 6 }}>
        <span>변경된 모달 값: {searchedItem.itemName || "(비어있음)"}</span>
        <Button outlined onClick={handleOpenFormModal}>
          2차 입력 모달 열기
        </Button>
      </div>
    </div>
  );
};

export default SearchStepModalContent;
