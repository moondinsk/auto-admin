import { toast } from "react-toastify";
import { AiOutlineSafety } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiError } from "react-icons/bi";
import React from "react";

export const TOAST_DEFAULT_OPTIONS = {
  autoClose: 2000, // 토스트가 자동으로 닫히는 시간 (ms)
  position: "top-center", // 토스트 위치 (bottom-center, top-right 등)
  hideProgressBar: true, // 하단 진행 상태(progress bar) 숨김 여부
  closeOnClick: false, // 토스트를 클릭하면 닫히도록 설정
  pauseOnHover: true, // 마우스를 올리면 autoClose 타이머 일시정지
  draggable: false, // 드래그로 토스트를 이동하거나 닫는 기능 비활성화
  closeButton: false,
};

export const setToast = (type, text, options = {}) => {
  if (!text) return;

  const toastMap = {
    success: toast.success,
    warning: toast.warning,
    error: toast.error,
  };

  const iconMap = {
    success: React.createElement(AiOutlineSafety),
    warning: React.createElement(RiErrorWarningLine),
    error: React.createElement(BiError),
  };

  const toastFn = toastMap[type] || toast;

  toastFn(text, {
    ...TOAST_DEFAULT_OPTIONS,
    className: `custom-toast toast-${type}`,
    icon: iconMap[type] || false,
    ...options,
  });
};
