import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import AlertModalContent from "@/components/Modal/AlertModalContent";
import DeleteConfirmContent from "@/components/Modal/DeleteConfirmContent";
import GuideContent from "@/components/Modal/GuideContent";
import NestedModalContent from "@/components/Modal/NestedModalContent";
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import SearchStepModalContent from "@/components/Modal/SearchStepModalContent";
import TripleNestedModalContent from "@/components/Modal/TripleNestedModalContent";
import { CONFIRM_PAYLOAD, MODAL_PAYLOAD } from "@/constants/modal";
import { useStore } from "@/store";
import { StyledComponents } from "./Components.styles";

const ComponentsModal = observer(() => {
  const { modalStore, confirmStore } = useStore();
  const [selectedIds, setSelectedIds] = useState(["b1", "b2"]);

  const candidates = ["b1", "b2", "b3"];

  const toggleSelectedId = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id]));
  };

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

  const openGuideModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        data: {
          title: "배너 운영 가이드",
          description: "배너 등록 전 노출 효과와 기간을 먼저 확인하세요.",
        },
      }),
    );
  };

  const openAlertModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.ALERT_MODAL({
        component: AlertModalContent,
        message: "요청하신 작업이 정상적으로 처리되었습니다.",
      }),
    );
  };

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

  const openNestedInputModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: SearchStepModalContent,
        data: {},
      }),
    );
  };

  const openTripleNestedModal = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: TripleNestedModalContent,
        data: {
          description: "1차 모달에서 2차, 3차까지 순차적으로 열 수 있습니다.",
        },
      }),
    );
  };

  const openDeleteModal = () => {
    confirmStore.openByPayload(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        data: {
          selectedIds,
        },
        message: "선택한 항목을 삭제하시겠습니까?",
      }),
    );
  };

  return (
    <StyledComponents className="flex-box col">
      <CardSection title="모달 예시">
        <div className="flex-box" style={{ gap: 10 }}>
          <Button outlined onClick={openRegisterModal}>
            등록 모달 열기
          </Button>
          <Button outlined onClick={openGuideModal}>
            가이드 모달 열기
          </Button>
        </div>
      </CardSection>

      <CardSection title="삭제 모달 예시">
        <div className="flex-box col" style={{ gap: 10 }}>
          <div className="flex-box" style={{ gap: 12 }}>
            {candidates.map((id) => (
              <label key={id} className="flex-box" style={{ gap: 6 }}>
                <input type="checkbox" checked={selectedIds.includes(id)} onChange={() => toggleSelectedId(id)} />
                {id}
              </label>
            ))}
          </div>
          <Button outlined onClick={openDeleteModal}>
            삭제 모달 열기
          </Button>
        </div>
      </CardSection>

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
          <Button outlined onClick={openNestedInputModal}>
            입력형 2중 모달 열기
          </Button>
        </div>
      </CardSection>

      <CardSection title="3중 모달 예시">
        <div className="flex-box" style={{ gap: 10 }}>
          <Button outlined onClick={openTripleNestedModal}>
            기본 3중 모달 열기
          </Button>
        </div>
      </CardSection>
    </StyledComponents>
  );
});

export default ComponentsModal;
