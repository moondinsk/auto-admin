import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Modal from "./Modal";

const TRANSITION_TIMEOUT = 500;

const ModalItem = ({ modal, zIndex, closeModal, ...transitionProps }) => {
  const nodeRef = useRef(null);

  const runAndClose = (action) => {
    console.log(action());
    if (action?.() === false) return;
    closeModal?.();
  };

  const handleCancel = () => runAndClose(modal.props?.onCancel);
  const handleConfirm = () => runAndClose(modal.props?.onConfirm);

  return (
    <CSSTransition
      {...transitionProps}
      timeout={TRANSITION_TIMEOUT}
      classNames="modal-transition"
      nodeRef={nodeRef}
      unmountOnExit>
      <div ref={nodeRef}>
        <Modal
          type={modal.type}
          component={modal.component}
          {...modal.props}
          zIndex={zIndex}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    </CSSTransition>
  );
};

export default ModalItem;
