const BASE_MODAL_PROPS = {
  width: 600,
  title: "가이드 모달",
  height: "50vh",
};

const BASE_CONFIRM_PROPS = {
  title: "확인 모달",
};

export const MODAL_PAYLOAD = {
  GUIDE_MODAL: ({ component: ContentComponent, data = {}, successToastMessage = "", ...modalProps } = {}) => ({
    modalProps: {
      ...BASE_MODAL_PROPS,
      ...modalProps,
      data,
      successToastMessage,
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
      ...modalProps,
      width: 400,
      title: "등록 모달",
      data,
      cancelText: "취소",
      successToastMessage,
    },
    component: ContentComponent,
  }),

  ALERT_MODAL: ({ component: ContentComponent, data = {}, message, successToastMessage = "", ...modalProps } = {}) => ({
    modalProps: {
      ...modalProps,
      title: "알림 모달",
      contentProps: { message },
      data,
      successToastMessage,
    },
    component: ContentComponent,
  }),
};

export const CONFIRM_PAYLOAD = {
  DELETE_CONFIRM: ({
    component: ContentComponent,
    data,
    message = "선택한 항목을 삭제하시겠습니까?",
    successToastMessage = "삭제했습니다.",
  }) => ({
    confirmProps: {
      ...BASE_CONFIRM_PROPS,
      title: "삭제 모달",
      message,
      successToastMessage,
      data,
    },
    component: ContentComponent,
  }),

  INPUT_CONFIRM: ({
    component: ContentComponent,
    data,
    message = "입력 내용을 확인해주세요.",
    successToastMessage = "저장되었습니다.",
  }) => ({
    confirmProps: {
      ...BASE_CONFIRM_PROPS,
      title: "입력 모달",
      message,
      successToastMessage,
      data,
    },
    component: ContentComponent,
  }),
};
