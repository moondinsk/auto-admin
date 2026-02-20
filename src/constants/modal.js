import AlertModalContent from "@/components/Modal/AlertModalContent";
import ReturnGuideModal from "@/components/Modal/ReturnGuideModal";
import RegisterModalContent from "@/components/Modal/RegisterModalContent";
import ReturnDeleteConfirmContent from "@/components/Modal/ReturnDeleteConfirmContent";

// 모달/컨펌 공통 기본값(중복 줄이기용)
const BASE_MODAL_PROPS = { type: "MODAL" };
const BASE_CONFIRM_PROPS = { confirmText: "확인", cancelText: "취소" };

export const MODAL_PAYLOAD = {
  GUIDE_MODAL: (payload = {}) => {
    // payload가 {data, component} 형태인지(커스텀 설정) 판별
    const hasCustomConfig =
      payload &&
      typeof payload === "object" &&
      (Object.prototype.hasOwnProperty.call(payload, "data") ||
        Object.prototype.hasOwnProperty.call(payload, "component"));

    // 커스텀이면 payload.data를, 아니면 payload 자체를 data로 사용
    const data = hasCustomConfig ? payload.data : payload;

    // 커스텀이면 payload.component 우선, 없으면 기본(ReturnGuideModal)
    const component = hasCustomConfig ? payload.component || ReturnGuideModal : ReturnGuideModal;

    return {
      modalProps: {
        ...BASE_MODAL_PROPS,
        // 여기서는 가이드 모달에 필요한 옵션만 세팅
        width: 600,
        title: "가이드 모달",
        height: "50vh",
        data,
        confirmText: "확인",
      },
      component,
    };
  },

  // 등록 모달: 등록/취소 버튼 + 성공 토스트 메시지까지 포함
  REGISTER_MODAL: (data) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      width: 400,
      title: "등록 모달",
      height: "50vh",
      data,
      confirmText: "등록",
      cancelText: "취소",
      successToastMessage: "등록 되었습니다",
    },
    component: RegisterModalContent,
  }),

  // 알림 모달: 메시지만 보여주는 단순 모달(컨텐츠 props로 message 전달)
  ALERT_MODAL: ({ message } = {}) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      title: "알림",
      confirmText: "확인",
      contentProps: { message },
    },
    component: AlertModalContent,
  }),
};

export const CONFIRM_PAYLOAD = {
  // 삭제 컨펌: 문구(message)는 기본값 제공(필요하면 호출 시 덮어쓰기 가능)
  DELETE_CONFIRM: (data, message = "선택한 항목을 삭제하시겠습니까?") => ({
    confirmProps: {
      ...BASE_CONFIRM_PROPS,
      title: "삭제 확인",
      message,
      successToastMessage: "삭제했습니다.",
      data,
    },
    component: ReturnDeleteConfirmContent,
  }),
};
