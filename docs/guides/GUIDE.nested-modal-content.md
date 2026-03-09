# NestedModalContent 가이드

## 위치

`src/components/Modal/NestedModalContent.jsx`

## 목적

1차 모달 내부에서 2차 모달을 여는 중첩 모달 흐름을 보여주는 콘텐츠 컴포넌트입니다.

## 기본 사용법

```jsx
import NestedModalContent from "@/components/Modal/NestedModalContent";
import { useStore } from "@/store";
import { MODAL_PAYLOAD } from "@/constants/modal";

function Example() {
  const { modalStore } = useStore();

  const openNested = () => {
    modalStore.openByPayload(
      MODAL_PAYLOAD.GUIDE_MODAL({
        component: NestedModalContent,
        data: { description: "이 1차 모달에서 2차 모달을 열 수 있습니다." },
      }),
    );
  };

  return <button onClick={openNested}>열기</button>;
}
```

## 주요 Props

- `data.description`: 1차 모달 바디에 표시할 텍스트.

## 동작

- "2차 모달 열기" 버튼 클릭 시 추가 가이드 모달이 열립니다.
- 2차 모달은 내부적으로 `GuideContent`와 `MODAL_PAYLOAD.GUIDE_MODAL`을 사용합니다.

## 참고

- 중첩 모달 플로우 구현 시 참고용 예제로 활용할 수 있습니다.
- `modalStore.modals` 스택과 모달 페이로드 헬퍼에 의존합니다.
