import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { TransitionGroup } from "react-transition-group";
import { useStore } from "@/store";
import ModalItem from "./ModalItem";

const MODAL_BASE_Z_INDEX = 1000;
const MODAL_Z_INDEX_STEP = 10;

const ModalManager = () => {
  const { modalStore } = useStore();

  useEffect(() => {
    const onKeyDown = async ({ key }) => {
      if (key !== "Escape") return;

      const topModal = modalStore.modals[modalStore.modals.length - 1];
      if (!topModal) return;

      try {
        if ((await topModal.props?.onCancel?.()) === false) {
          return;
        }
      } catch {
        return;
      }

      modalStore.closeById(topModal.id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalStore]);

  return (
    <TransitionGroup component={null}>
      {modalStore.modals.map((modal, index) => {
        return (
          <ModalItem
            key={modal.id}
            modal={modal}
            zIndex={MODAL_BASE_Z_INDEX + index * MODAL_Z_INDEX_STEP}
            closeModal={() => modalStore.closeById(modal.id)}
          />
        );
      })}
    </TransitionGroup>
  );
};

const ObservedModalManager = observer(ModalManager);

export default ObservedModalManager;
