const BASE_MODAL_PROPS = {
  width: 600,
  title: "가이드 모달",
  maxHeight: "50vh",
};

const BASE_CONFIRM_PROPS = {
  title: "확인 모달",
};

export const MODAL_PAYLOAD = {
  GUIDE_MODAL: ({ component: ContentComponent, data = {}, successToastMessage = "", ...modalProps } = {}) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      data,
      successToastMessage,
      ...modalProps,
    },
    component: ContentComponent,
  }),

  REGISTER_MODAL: ({
    component: ContentComponent,
    data = {},
    successToastMessage = "등록 되었습니다",
    ...modalProps
  } = {}) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      width: 400,
      title: "등록 모달",
      cancelText: "취소",
      data,
      successToastMessage,
      ...modalProps,
    },
    component: ContentComponent,
  }),

  ALERT_MODAL: ({
    component: ContentComponent,
    data = {},
    message = "",
    successToastMessage = "",
    ...modalProps
  } = {}) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      title: "알림 모달",
      contentProps: { message },
      data,
      successToastMessage,
      ...modalProps,
    },
    component: ContentComponent,
  }),
};

export const CONFIRM_PAYLOAD = {
  DELETE_CONFIRM: ({
    component: ContentComponent,
    data = {},
    message = "선택한 항목을 삭제하시겠습니까?",
    successToastMessage = "삭제했습니다.",
    ...confirmProps
  } = {}) => ({
    confirmProps: {
      ...BASE_CONFIRM_PROPS,
      title: "삭제 모달",
      message,
      successToastMessage,
      data,
      ...confirmProps,
    },
    component: ContentComponent,
  }),

  INPUT_CONFIRM: ({
    component: ContentComponent,
    data = {},
    message = "입력 내용을 확인해주세요.",
    successToastMessage = "저장되었습니다.",
    ...confirmProps
  } = {}) => ({
    confirmProps: {
      ...BASE_CONFIRM_PROPS,
      title: "입력 모달",
      message,
      successToastMessage,
      data,
      ...confirmProps,
    },
    component: ContentComponent,
  }),
};
