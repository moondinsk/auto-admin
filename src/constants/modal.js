export const MODAL_PAYLOAD = {
  GUIDE_MODAL: ({ component: ContentComponent, data = {}, ...modalProps } = {}) => {
    return {
      modalProps: {
        width: 600,
        title: "가이드 모달",
        height: "50vh",
        data,
        confirmText: "확인",
        ...modalProps,
      },
      component: ContentComponent,
    };
  },

  REGISTER_MODAL: ({ component: ContentComponent, data = {}, ...modalProps } = {}) => ({
    modalProps: {
      width: 400,
      title: "등록 모달",
      height: "50vh",
      data,
      confirmText: "등록",
      cancelText: "취소",
      successToastMessage: "등록 되었습니다",
      ...modalProps,
    },
    component: ContentComponent,
  }),

  ALERT_MODAL: ({ component: ContentComponent, message } = {}) => ({
    modalProps: {
      title: "알림",
      contentProps: { message },
    },
    component: ContentComponent,
  }),
};

export const CONFIRM_PAYLOAD = {
  DELETE_CONFIRM: ({ component: ContentComponent, data, message = "선택한 항목을 삭제하시겠습니까?" }) => ({
    confirmProps: {
      title: "삭제 확인",
      message,
      successToastMessage: "삭제했습니다.",
      data,
    },
    component: ContentComponent,
  }),
};
