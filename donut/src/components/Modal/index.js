import React, { useRef, useEffect } from "react";
import { Portal } from "reakit/Portal";
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
} from "reakit/Dialog";

import { AnimatePresence } from "framer-motion";
import {
  StyledWindow,
  StyledBackdrop,
  StyledModalLoading,
  StyledModalCloseButton,
  StyledModalWindowContainer,
} from "./styles";
import Icon from "../Icon";
import useBreakpoint from "../../hooks/useBreakpoint";
export { default as useRoutedModal } from "./useRoutedModal";

export const useModal = useDialogState;

const Modal = ({
  modal,
  label,
  children,
  backdrop,
  loading,
  width,
  showCloseButton = true,
  ...props
}) => {
  const ref = useRef(null);
  const mediumAndUp = useBreakpoint("mUp");
  const isMobile = !mediumAndUp;

  const handleContainerClick = (e) => {
    if (e.target === ref.current) {
      modal.hide();
    }
  };

  const backdropVariants = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <>
      {backdrop && (
        <Portal>
          <DialogBackdrop
            {...modal}
            initial="hidden"
            as={StyledBackdrop}
            variants={backdropVariants}
            animate={modal.visible ? "visible" : "hidden"}
            transition={{ ease: "easeOut" }}
          />
        </Portal>
      )}
      <Dialog
        ref={ref}
        {...modal}
        aria-label={label}
        isMobile={isMobile}
        hideOnClickOutside={false}
        tabIndex={loading ? 0 : null}
        onClick={handleContainerClick}
        as={StyledModalWindowContainer}
        preventBodyScroll={false}
      >
        <AnimatePresence>
          {modal.visible && loading && (
            <StyledModalLoading>
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M31 16c0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15C1 7.716 7.716 1 16 1"
                ></path>
              </svg>
            </StyledModalLoading>
          )}
          {modal.visible && !loading && (
            <StyledWindow
              {...props}
              width={width}
              isMobile={isMobile}
              transition={{ type: "spring", damping: 35, stiffness: 100 }}
              initial={{
                y: 80,
                opacity: 0,
                rotateX: isMobile ? 0 : -15,
                scale: isMobile ? 1 : 0.9,
              }}
              animate={{
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
              }}
              exit={{
                y: 80,
                scale: 1,
                opacity: 0,
                rotateX: 0,
              }}
            >
              {children}
              {showCloseButton ? (
                <StyledModalCloseButton
                  type="button"
                  onClick={modal.hide}
                  aria-label="Close modal"
                >
                  <Icon width={20} height={20} icon="x" />
                </StyledModalCloseButton>
              ) : null}
            </StyledWindow>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
};

Modal.defaultProps = {
  backdrop: true,
  loading: false,
};

Modal.Disclosure = DialogDisclosure;

export default Modal;
