import React from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
interface Props {
  children: JSX.Element;
  isOpen: boolean;
  close: () => void;
}
const Modal = ({ children, isOpen, close }: Props) => {
  return (
    <div
      className={`relative z-10 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop, show/hide based on modal state.
    
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0" */}

      <div
        className={`${
          isOpen
            ? "ease-out duration-300 opacity-100 "
            : "ease-in duration-200 opacity-0 "
        }fixed inset-0 bg-[#6b7280] bg-opacity-40 transition-opacity`}
      ></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full h-full xsm:h-auto p-0 xsm:p-4 text-center sm:p-0">
          {/* Modal panel, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" */}
          <div
            className={`${
              isOpen
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100 "
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 "
            }relative bg-[#fff] rounded-lg text-left overflow-hidden shadow-xl transform transition-all xsm:my-8 xsm:max-w-lg w-full h-full xsm:h-auto`}
          >
            <div className="px-4 pt-4 pb-5">
              <CloseIcon
                className="text-4xl p-2 cursor-pointer hover:bg-[#eaeaea] rounded-full"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={close}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
