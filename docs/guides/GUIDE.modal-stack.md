# 모달 스택(n중 모달) 가이드

## 위치

`src/store/modal/modalStore.js`
`src/components/Modal/ModalManager.jsx`
`src/components/Modal/ModalItem.jsx`
`src/components/Modal/Modal.jsx`
`src/constants/modal.js`

## 목적

2중 모달, 3중 모달, n중 모달까지 일관되게 처리하기 위해 모달 상태를 배열(스택)로 관리합니다.

## 핵심 아이디어

- `modals` 배열의 마지막 요소를 최상위(Top) 모달로 간주합니다.
- `open`은 새 모달을 배열 끝에 추가합니다.
- `close`는 마지막 모달을 닫습니다.
- 필요 시 `id` 기반으로 특정 모달만 닫거나 전체를 닫을 수 있습니다.

## 현재 상태 구조

```js
{
  modals: [
    {
      id: "modal-1",
      type: "modal",
      component: GuideContent,
      props: {
        title: "가이드 모달",
        width: 600,
        maxHeight: "50vh",
        data: {},
        onConfirm: () => {},
        onCancel: () => {},
      },
    },
  ],
}
```

## store 구조

```js
import { makeAutoObservable } from "mobx";

export class ModalStore {
  modals = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open(payload = {}) {
    const { id, component, props = {} } = payload;
    if (!component) return null;

    const { type, ...modalProps } = props;
    const modalData = {
      id: id ?? `modal-${crypto.randomUUID()}`,
      type,
      component,
      props: modalProps,
    };

    this.modals.push(modalData);
    return modalData.id;
  }

  closeById(id) {
    this.modals = this.modals.filter((modal) => modal.id !== id);
  }

  close() {
    this.modals.pop();
  }

  closeAll() {
    this.modals = [];
  }
}
```

## 렌더링 흐름

```jsx
<TransitionGroup component={null}>
  {modalStore.modals.map((modal, index) => (
    <ModalItem
      key={modal.id}
      modal={modal}
      zIndex={MODAL_BASE_Z_INDEX + index * MODAL_Z_INDEX_STEP}
      closeModal={() => modalStore.closeById(modal.id)}
    />
  ))}
</TransitionGroup>
```

- `ModalManager`는 전역 ESC를 감시합니다.
- `ModalItem`은 `CSSTransition`과 실제 닫기 래퍼를 담당합니다.
- `Modal`은 순수 UI 렌더링을 담당합니다.

## 2중/3중/n중 호출 패턴

```jsx
// 1차 모달
modalStore.open(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: FirstContent,
    props: {
      data: { step: 1 },
    },
  }),
);

// 2차 모달
modalStore.open(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: SecondContent,
    props: {
      data: { step: 2 },
      title: "2차 모달",
    },
  }),
);

// 3차 이상도 동일하게 반복
modalStore.open(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: ThirdContent,
    props: {
      data: { step: 3 },
      title: "3차 모달",
    },
  }),
);
```

## 현재 구현 상태

- `modalStore`는 `modals[]` 스택으로 동작하며 `open`, `close`, `closeById`, `closeAll`을 지원합니다.
- `type`은 `props`에서 분리되어 `modal.type`으로 저장됩니다.
- 클릭 기반 확인/취소는 `ModalItem`이 `onConfirm`, `onCancel`을 호출한 뒤 `closeModal()`을 실행합니다.
- ESC는 `ModalManager`가 최상단 모달을 바로 닫습니다.

## 참고

- 특정 모달만 닫아야 하는 흐름이 있다면 `open` 반환값(`id`)을 화면 단에서 보관해 `closeById(id)`를 호출합니다.
- 현재 프로젝트의 기본 패턴은 `component + props` 조합입니다.
