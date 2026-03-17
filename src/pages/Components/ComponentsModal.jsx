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
import { setToast } from "@/utils/toast";
import { StyledComponents } from "./Components.styles";

const ComponentsModal = () => {
  const { modalStore } = useStore();
  const [selectedIds, setSelectedIds] = useState([]);

  const candidates = ["b1", "b2", "b3"];

  const toggleSelectedId = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id]));
  };

  const openRegisterModal = () => {
    let formData = null;

    modalStore.open(
      CONFIRM_PAYLOAD.REGISTER_MODAL({
        component: RegisterModalContent,
        props: {
          title: "등록 모달",
          description: "새 항목을 등록하세요.",
          confirmText: "등록",
          onFormDataChange: (data) => {
            formData = data;
          },
          confirmFunc: () => {
            // 유효성 검사
            if (!formData?.bannerName?.trim()) {
              setToast("error", "배너명은 필수입니다.");
              throw new Error("배너명 필수");
            }
            if (!formData?.effect) {
              setToast("error", "배너효과는 필수입니다.");
              throw new Error("배너효과 필수");
            }

            console.log("등록되었습니다.", formData);
            setToast("success", "항목이 등록되었습니다.");
          },
          cancelFunc: () => {
            setToast("warning", "등록이 취소되었습니다.");
          },
        },
      }),
    );
  };

  const openGuideModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: GuideContent,
        props: {
          title: "배너 운영 가이드",
          confirmText: "닫기",
          data: {
            title: "배너 운영 가이드",
            description: "data값 인자로 넘기기 가능한 테스트 모달입니다.",
          },
          confirmFunc: async () => {
            setToast("success", "완료 되었을때 해당 영역에서 함수 실행 가능");
          },
        },
      }),
    );
  };

  const openAlertModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.ALERT_MODAL({
        component: AlertModalContent,
        props: {
          title: "알림 모달",
          message: "요청하신 작업이 정상적으로 처리되었습니다.",
          confirmText: "확인",
        },
      }),
    );
  };

  const openNestedModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: NestedModalContent,
        props: {
          description: "1차 모달에서 버튼을 눌러 2차 모달을 열 수 있습니다.",
          confirmText: "닫기",
        },
      }),
    );
  };

  const openNestedInputModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: SearchStepModalContent,
        props: {
          confirmText: "닫기",
        },
      }),
    );
  };

  const openTripleNestedModal = () => {
    modalStore.open(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: TripleNestedModalContent,
        props: {
          description: "1차 모달에서 2차, 3차까지 순차적으로 열 수 있습니다.",
          confirmText: "닫기",
        },
      }),
    );
  };

  const openDeleteModal = () => {
    if (selectedIds.length === 0) {
      setToast("warning", "삭제할 항목을 먼저 선택해주세요.");
      return;
    }

    const targetIds = [...selectedIds];

    modalStore.open(
      CONFIRM_PAYLOAD.DELETE_CONFIRM({
        component: DeleteConfirmContent,
        props: {
          selectedIds: targetIds,
          message: "선택한 항목을 삭제하시겠습니까?",
          confirmText: "커스텀 삭제",
          cancelText: "커스텀 취소",
          confirmFunc: () => {
            setToast("success", `선택한 ${targetIds.length}건이 삭제되었습니다.`);
          },
          cancelFunc: () => {
            setToast("warning", "삭제가 취소되었습니다.");
          },
        },
      }),
    );
  };

  return (
    <StyledComponents className="flex-box col">
      <CardSection title="모달 예시">
        <div className="flex-box gap-10">
          <Button outlined onClick={openRegisterModal}>
            등록 모달 열기
          </Button>
          <Button outlined onClick={openGuideModal}>
            가이드 모달 열기
          </Button>
        </div>
      </CardSection>

      <CardSection title="삭제 모달 예시">
        <div className="flex-box col gap-10" >
          <div className="flex-box gap-12" >
            {candidates.map((id) => (
              <label key={id} className="flex-box gap-6">
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
        <div className="flex-box gap-10" >
          <Button outlined onClick={openNestedModal}>
            기본 2중 모달 열기
          </Button>
          <Button outlined onClick={openNestedInputModal}>
            입력형 2중 모달 열기
          </Button>
        </div>
      </CardSection>

      <CardSection title="3중 모달 예시">
        <div className="flex-box gap-10" >
          <Button outlined onClick={openTripleNestedModal}>
            기본 3중 모달 열기
          </Button>
        </div>
      </CardSection>
    </StyledComponents>
  );
};

const ObservedComponentsModal = observer(ComponentsModal);

export default ObservedComponentsModal;
