import React, { useRef, useState } from "react";
import Button from "@/components/Button/Button";
import { CONFIRM_PAYLOAD } from "@/constants/modal";

import SearchResultFormContent from "@/components/Modal/SearchResultFormContent";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { setToast } from "@/utils/toast";

// 1차 입력 모달
const SearchStepModalContent = ({ data }) => {
  const { modalStore } = useStore();
  const emptyDraft = {
    itemName: "",
  };

  const [searchedItem, setSearchedItem] = useState({
    itemName: data?.itemName || "",
  });
  const draftItemRef = useRef(emptyDraft);

  const handleOpenFormModal = async () => {
    try {
      draftItemRef.current = emptyDraft;

      const confirmed = await modalStore.openConfirmByPayload(
        CONFIRM_PAYLOAD.INPUT_CONFIRM({
          component: SearchResultFormContent,
          props: {
            message: "입력값을 수정해주세요.",
            itemName: "",
            onSync: (nextValues) => {
              draftItemRef.current = {
                ...draftItemRef.current,
                ...nextValues,
              };
            },
          },
        }),
      );

      if (!confirmed) {
        draftItemRef.current = emptyDraft;
        setToast("warning", "입력값 저장이 취소되었습니다.");
        return;
      }

      setSearchedItem((prev) => ({
        ...prev,
        ...draftItemRef.current,
      }));
      setToast("success", `저장되었습니다: ${draftItemRef.current.itemName || "(비어있음)"}`);
      draftItemRef.current = emptyDraft;
    } catch (error) {
      draftItemRef.current = emptyDraft;
      console.error("입력값 저장 실패", error);
      setToast("error", "입력값 저장 중 오류가 발생했습니다.");
    }
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
