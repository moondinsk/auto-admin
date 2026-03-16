import { observer } from "mobx-react-lite";
import { TransitionGroup } from "react-transition-group";
import { useStore } from "@/store";
import ModalItem from "./ModalItem";

const MODAL_BASE_Z_INDEX = 1000;
const MODAL_Z_INDEX_STEP = 10;

const ModalManager = () => {
  const { modalStore } = useStore();

  return (
    <TransitionGroup component={null}>
      {modalStore.modals.map((modal, index) => {
        const isTop = index === modalStore.modals.length - 1;
        const isConfirm = modal.type === "confirm";
        return (
          <ModalItem
            key={modal.id}
            modal={modal}
            isTop={isTop}
            zIndex={MODAL_BASE_Z_INDEX + index * MODAL_Z_INDEX_STEP}
            onClose={() => modalStore.closeById(modal.id)}
            onConfirm={isConfirm ? () => modalStore.confirm() : () => modalStore.closeById(modal.id)}
            onCancel={isConfirm ? () => modalStore.cancel() : () => modalStore.closeById(modal.id)}
          />
        );
      })}
    </TransitionGroup>
  );
};

const ObservedModalManager = observer(ModalManager);

export default ObservedModalManager;
