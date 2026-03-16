import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Modal from "./Modal";

const TRANSITION_TIMEOUT = 500;

const ModalItem = ({ modal, isTop, zIndex, onClose, onConfirm, onCancel, ...transitionProps }) => {
  const nodeRef = useRef(null);

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
          isTop={isTop}
          zIndex={zIndex}
          onClose={onClose}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </div>
    </CSSTransition>
  );
};

export default ModalItem;
