import React from "react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep It",
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#17130f]/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#d6b46a]/40 bg-gradient-to-br from-[#fffaf2] via-[#f4efe6] to-[#ded6c5] shadow-[0_30px_80px_rgba(23,19,15,0.38)]">
        <div className="p-7 sm:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#2f281f] text-xl text-[#d6b46a]">
            !
          </div>
          <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#6f7758]">
            PLEASE CONFIRM
          </p>
          <h2 className="prata-regular mt-2 text-3xl text-[#2f281f]">{title}</h2>
          <p className="mt-3 leading-7 text-[#74695c]">{message}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#d6b46a]/25 bg-white/40 p-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="secondary-action px-6 py-3 text-sm">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="danger-action px-6 py-3 text-sm font-semibold">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
