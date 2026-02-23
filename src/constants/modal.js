export const MODAL_PAYLOAD = {
  GUIDE_MODAL: ({ component: ContentComponent, data = {}, ...modalProps } = {}) => {
    return {
      modalProps: {
        ...modalProps,
        width: 600,
        title: "가이드 모달",
        height: "50vh",
        data,
      },
      component: ContentComponent,
    };
  },

  REGISTER_MODAL: ({ component: ContentComponent, data = {}, ...modalProps } = {}) => ({
    modalProps: {
      ...modalProps,
      width: 400,
      title: "등록 모달",
      height: "50vh",
      data,
      cancelText: "취소",
      successToastMessage: "등록 되었습니다",
    },
    component: ContentComponent,
  }),

  ALERT_MODAL: ({ component: ContentComponent, data = {}, message, ...modalProps } = {}) => ({
    modalProps: {
      ...modalProps,
      title: "알림 모달",
      contentProps: { message },
      data,
    },
    component: ContentComponent,
  }),
};

export const CONFIRM_PAYLOAD = {
  DELETE_CONFIRM: ({ component: ContentComponent, data, message = "선택한 항목을 삭제하시겠습니까?" }) => ({
    confirmProps: {
      title: "삭제 모달",
      message,
      successToastMessage: "삭제했습니다.",
      data,
    },
    component: ContentComponent,
  }),

  INPUT_CONFIRM: ({ component: ContentComponent, data, message = "입력 내용을 확인해주세요." }) => ({
    confirmProps: {
      title: "입력 모달",
      message,
      successToastMessage: "저장되었습니다.",
      data,
    },
    component: ContentComponent,
  }),
};
