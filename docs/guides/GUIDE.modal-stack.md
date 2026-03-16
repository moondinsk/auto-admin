# 모달 스택(n중 모달) 가이드

## 위치

`src/store/modal/modalStore.js`
`src/layouts/Root.jsx`
`src/components/Modal/Modal.jsx`
`src/constants/modal.js`

## 목적

2중 모달, 3중 모달, n중 모달까지 일관되게 처리하기 위해 모달 상태를 단일 객체가 아닌 배열(스택)로 관리합니다.

## 핵심 아이디어

- `modals` 배열의 마지막 요소를 최상위(Top) 모달로 간주합니다.
- `open` 계열 액션은 `push` 방식으로 모달을 추가합니다.
- `close` 계열 액션은 기본적으로 Top 모달만 닫습니다.
- 필요 시 `id` 기반으로 특정 모달만 닫거나 전체를 닫을 수 있습니다.

## 권장 상태 구조

```js
{
  modals: [
    {
      id: "modal-1",
      props: {
        title: "가이드 모달",
        width: 600,
        maxHeight: "50vh",
        contentComponent: GuideContent,
        contentProps: { data: {} },
      },
    },
  ],
}
```

## store 설계 예시

```js
import { makeAutoObservable } from "mobx";

export class ModalStore {
  modals = [];

  constructor(store) {
    this.store = store;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return this.modals.length > 0;
  }

  get topModal() {
    return this.modals[this.modals.length - 1] ?? null;
  }

  open(props = {}) {
    const id = props.id ?? `modal-${crypto.randomUUID()}`;

    this.modals.push({
      id,
      props,
    });

    this.debugStack("open", { id, title: props?.title || "(no-title)" });
    return id;
  }

  openByPayload(payload) {
    if (!payload?.component) return null;

    const { component: ContentComponent, modalProps = {} } = payload;
    const { contentProps = {}, data, ...restModalProps } = modalProps;

    return this.open({
      ...restModalProps,
      contentComponent: ContentComponent,
      contentProps: {
        ...contentProps,
        data,
      },
    });
  }

  closeTop() {
    const removedId = this.topModal?.id;
    this.modals.pop();
    this.debugStack("closeTop", { removedId });
  }

  closeById(id) {
    const beforeLength = this.modals.length;
    this.modals = this.modals.filter((modal) => modal.id !== id);
    this.debugStack("closeById", { targetId: id, removedCount: beforeLength - this.modals.length });
  }

  closeAll() {
    const beforeLength = this.modals.length;
    this.modals = [];
    this.debugStack("closeAll", { beforeLength });
  }
}
```

## Root 렌더링 규칙

```jsx
{
  modalStore.modals.map((modal, index) => {
    const isTop = index === modalStore.modals.length - 1;

    return (
      <ModalTransitionItem
        key={modal.id}
        modal={modal}
        isTop={isTop}
        zIndex={MODAL_BASE_Z_INDEX + index * MODAL_Z_INDEX_STEP}
        onClose={() => modalStore.closeById(modal.id)}
      />
    );
  });
}
```

- `ModalTransitionItem` 내부에서 `CSSTransition`으로 `Modal`을 감싸 애니메이션을 적용합니다.
- 현재 payload 기반 흐름에서는 `contentComponent/contentProps`를 사용하므로 `modal.content`(`children`) 슬롯은 일반적으로 비어 있습니다.

## 개발 디버깅 로그

- `modalStore`는 개발 환경에서 `debugStack` 로그를 출력합니다.
- `open`, `closeTop`, `closeById`, `closeAll` 시점에 배열 길이와 스냅샷(`id`, `title`, `component`)을 확인할 수 있습니다.
- 입력형 2중 모달(`modal -> confirm`) 흐름은 `confirmStore.debugConfirm` 로그와 함께 보면 순차 동작을 추적하기 쉽습니다.

## 2중/3중/n중 호출 패턴

```jsx
// 1차 모달
modalStore.openByPayload(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: FirstContent,
    data: { step: 1 },
  }),
);

// 2차 모달
modalStore.openByPayload(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: SecondContent,
    data: { step: 2 },
    title: "2차 모달",
  }),
);

// 3차 이상도 동일하게 반복
modalStore.openByPayload(
  MODAL_PAYLOAD.GUIDE_MODAL({
    component: ThirdContent,
    data: { step: 3 },
    title: "3차 모달",
  }),
);
```

## 동작 규칙 권장안

- 배경 클릭/ESC는 Top 모달에만 적용합니다.
- Top이 아닌 모달의 Dim 클릭 이벤트는 비활성화합니다.
- z-index는 스택 인덱스 기반으로 증가시킵니다.
- body scroll lock은 `modals.length > 0`일 때만 적용하고, 모두 닫히면 해제합니다.
- 포커스 트랩은 Top 모달에만 적용합니다.

## 현재 구현 상태

- `modalStore`는 `modals[]` 스택으로 동작하며 `closeById`, `closeTop`, `closeAll`을 지원합니다.
- `Root.jsx`는 `TransitionGroup` + `CSSTransition`으로 모달 스택을 렌더링합니다.
- `Modal.jsx`는 `isTop`과 `zIndex`를 받아 Top 모달만 닫힘 이벤트(배경 클릭/ESC)를 처리합니다.
- 확인 토스트는 `src/utils/toast.js`의 `showToast`를 사용합니다.

## 참고

- Confirm 모달도 동일한 스택 전략이 필요하면 `confirmStore`에 같은 패턴을 적용할 수 있습니다.
- 특정 모달만 닫아야 하는 흐름이 있다면 `open` 반환값(`id`)을 화면 단에서 보관해 `closeById(id)`를 호출합니다.
- 현재 프로젝트의 기본 패턴은 `contentComponent/contentProps`이며, `modal.content`(`children`)는 일반적으로 사용하지 않습니다.
