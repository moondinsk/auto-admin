# SearchResultFormContent 가이드

## 위치
`src/components/Modal/SearchResultFormContent.jsx`

## 목적
`SearchStepModalContent`와 함께 사용하는 2단계 입력 수정용 콘텐츠 컴포넌트입니다.

## 기본 사용법
```jsx
import SearchResultFormContent from "@/components/Modal/SearchResultFormContent";

<SearchResultFormContent
  message="항목명을 수정하세요."
  data={{
    itemName: "수정 전 값",
    onSync: (nextValues) => {
      console.log(nextValues);
    },
  }}
/>;
```

## 주요 Props
- `message`: 입력 위에 표시할 안내 문구.
- `data.itemName`: 입력 초기값.
- `data.onSync`: 값 변경 시마다 `{ itemName }` 형태로 호출되는 콜백.

## 동작
- 제어 컴포넌트 방식으로 로컬 `name` 상태를 유지합니다.
- 입력값이 바뀔 때마다 `onSync`를 호출합니다.

## 참고
- 확인 모달 바디에 삽입해 사용하는 용도로 설계되었습니다.
- 전체 2단계 플로우는 `CONFIRM_PAYLOAD.INPUT_CONFIRM`와 함께 사용하세요.
