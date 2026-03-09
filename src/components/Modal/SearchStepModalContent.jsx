import React, { useState } from "react";
import Button from "@/components/Button/Button";
import { CONFIRM_PAYLOAD } from "@/constants/modal";

import SearchResultFormContent from "@/components/Modal/SearchResultFormContent";
import { useStore } from "@/store";

// 1차 입력 모달: 2차 입력 모달에서 수정된 값을 반영
const SearchStepModalContent = ({ data }) => {
  const { confirmStore } = useStore();

  const [searchedItem, setSearchedItem] = useState({
    itemName: data?.itemName || "",
  });

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
        successToastMessage: "값이 수정되었습니다.",
      }),
    );
  };

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <p>1차 입력 모달입니다. 버튼을 눌러 2차 입력 모달을 열어주세요.</p>

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
