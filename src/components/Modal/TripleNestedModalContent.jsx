import React from "react";
import Button from "@/components/Button/Button";
import GuideContent from "@/components/Modal/GuideContent";
import { MODAL_PAYLOAD } from "@/constants/modal";
import { useStore } from "@/store";

const TripleNestedSecondModalContent = ({ data }) => {
  const { modalStore } = useStore();

  const handleOpenThirdModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "3차 안내 모달",
          description: "3중 모달의 마지막 단계입니다.",
        },
      }),
    );
  };

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <p>{data?.description || "2차 모달입니다."}</p>
      <div>
        <Button outlined onClick={handleOpenThirdModal}>
          3차 모달 열기
        </Button>
      </div>
    </div>
  );
};

const TripleNestedModalContent = ({ data }) => {
  const { modalStore } = useStore();

  const handleOpenSecondModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: TripleNestedSecondModalContent,
        data: {
          description: "2차 모달에서 3차 모달을 열 수 있습니다.",
        },
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

export default TripleNestedModalContent;
