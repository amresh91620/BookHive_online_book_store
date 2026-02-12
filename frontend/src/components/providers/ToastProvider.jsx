import React from "react";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "../../config/toastConfig";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={toastOptions}
    />
  );
};

export default ToastProvider;
