import React from "react";
import { ToastContainer } from "react-toastify";
import { TOAST_DEFAULT_OPTIONS } from "@/utils/toast";
import "react-toastify/dist/ReactToastify.css";

function Toast() {
  return <ToastContainer {...TOAST_DEFAULT_OPTIONS} />;
}

export default Toast;
