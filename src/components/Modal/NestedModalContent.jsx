import React from "react";
import Button from "@/components/Button/Button";
import GuideContent from "@/components/Modal/GuideContent";
import { CONFIRM_PAYLOAD, MODAL_PAYLOAD } from "@/constants/modal";
import { useStore } from "@/store";

const NestedModalContent = ({ data }) => {
  const { modalStore } = useStore();
  const handleOpenSecondModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "2차 안내 모달",
          description: "이 모달은 삭제가 아닌 안내/입력 확인 예시입니다.",
        },
        message: "2차 모달 내용을 확인해주세요.",
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

export default NestedModalContent;
