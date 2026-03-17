import React, { useEffect, useState } from "react";
import Select from "react-select";

const RegisterModalContent = ({ data, onFormDataChange }) => {
  const effectOptions = [
    { value: "slide", label: "슬라이드" },
    { value: "fade", label: "페이드" },
  ];

  const [formData, setFormData] = useState({
    bannerName: data?.groupName || "",
    effect: data?.effect || null,
    memo: data?.bannerCode ? `${data.bannerCode}` : "",
  });

  // 폼 데이터 변경 시 부모에 전달
  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  return (
    <div className="flex-box col gap-12">
      <label className="flex-box col gap-6">
        <span>배너명</span>
        <input
          type="text"
          value={formData.bannerName}
          onChange={(e) => setFormData((prev) => ({ ...prev, bannerName: e.target.value }))}
          placeholder="배너명을 입력하세요"
        />
      </label>
      <label className="flex-box col gap-6">
        <span>배너 효과</span>
        <Select
          className="custom-select"
          classNamePrefix="react-select"
          options={effectOptions}
          value={effectOptions.find((option) => option.value === formData.effect) || null}
          onChange={(selected) => setFormData((prev) => ({ ...prev, effect: selected?.value || null }))}
        />
      </label>
      <label className="flex-box col gap-6">
        <span>메모</span>
        <textarea
          rows={3}
          value={formData.memo}
          onChange={(e) => setFormData((prev) => ({ ...prev, memo: e.target.value }))}
          placeholder="메모를 입력하세요"
        />
      </label>
    </div>
  );
};

export default RegisterModalContent;
