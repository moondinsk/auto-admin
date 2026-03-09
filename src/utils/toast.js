import { toast } from "react-toastify";

export const TOAST_DEFAULT_OPTIONS = {
  autoClose: 2000,
  position: "bottom-center",
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
};

export const showToast = (message, options = {}) => {
  if (!message) {
    return;
  }

  toast(message, {
    ...TOAST_DEFAULT_OPTIONS,
    ...options,
  });
};
