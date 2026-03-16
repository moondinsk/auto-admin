import React, { useState } from "react";
import Button from "@/components/Button/Button";
import { CONFIRM_PAYLOAD } from "@/constants/modal";

import SearchResultFormContent from "@/components/Modal/SearchResultFormContent";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";

// 1차 입력 모달
const SearchStepModalContent = ({ data }) => {
  const { modalStore } = useStore();

  const [searchedItem, setSearchedItem] = useState({
    itemName: data?.itemName || "",
  });

  const handleOpenFormModal = () => {
    modalStore.openByPayload(
      CONFIRM_PAYLOAD.INPUT_CONFIRM({
        component: SearchResultFormContent,
        props: {
          message: "입력값을 수정해주세요.",
          itemName: searchedItem.itemName,
          // 2차 모달에서 값 변경 시 실행
          onSync: (nextValues) => {
            console.log("값 전달:", nextValues);
            setSearchedItem((prev) => ({
              ...prev,
              ...nextValues,
            }));
          },
        },
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

const ObservedSearchStepModalContent = observer(SearchStepModalContent);

export default ObservedSearchStepModalContent;
