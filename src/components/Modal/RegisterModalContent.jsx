import React, { useState, useEffect } from "react";
import Select from "react-select";

const RegisterModalContent = ({ data, onFormDataChange }) => {
  const [bannerName, setBannerName] = useState(data?.groupName || "");
  const [effect, setEffect] = useState(
    data?.effect ? { value: data.effect, label: data.effect === "slide" ? "슬라이드" : "페이드" } : null
  );
  const [memo, setMemo] = useState(data?.bannerCode ? `${data.bannerCode}` : "");

  // 폼 데이터 변경 시 부모에 전달
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        bannerName,
        effect: effect?.value || null,
        memo,
      });
    }
  }, [bannerName, effect, memo, onFormDataChange]);

  return (
    <div className="flex-box col gap-12">
      <label className="flex-box col gap-6">
        <span>배너명</span>
        <input
          type="text"
          value={bannerName}
          onChange={(e) => setBannerName(e.target.value)}
          placeholder="배너명을 입력하세요"
        />
      </label>
      <label className="flex-box col gap-6">
        <span>배너 효과</span>
        <Select
          className="custom-select"
          classNamePrefix="react-select"
          options={[
            { value: "slide", label: "슬라이드" },
            { value: "fade", label: "페이드" },
          ]}
          value={effect}
          onChange={setEffect}
        />
      </label>
      <label className="flex-box col gap-6">
        <span>메모</span>
        <textarea rows={3} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모를 입력하세요" />
      </label>
    </div>
  );
};

export default RegisterModalContent;
