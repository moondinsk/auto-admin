import React, { useState } from "react";

/**
 * 2차 입력 모달 컴포넌트
 * - input 값을 로컬 상태로 관리
 * - 값 변경 시 onSync를 통해 부모(1차 모달) 상태 업데이트
 */
const SearchResultFormContent = ({ data, message }) => {
  // 부모에서 전달받은 동기화 함수
  const onSync = data?.onSync;

  // 초기값: 부모에서 전달된 itemName 또는 빈 문자열
  const [name, setName] = useState(data?.itemName || "");

  // input 변경 시
  const handleChange = (e) => {
    const nextName = e.target.value;

    setName(nextName);
    onSync?.({ itemName: nextName });
  };

  return (
    <div className="flex-box col" style={{ gap: 10 }}>
      <p>{message}</p>
      <input value={name} onChange={handleChange} placeholder="항목명" type="text" />
    </div>
  );
};

export default SearchResultFormContent;
