import React, { useEffect, useState } from "react";
import Select from "react-select";

const RegisterModalContent = ({ data, onActionDataChange }) => {
  const effectOptions = [
    { value: "slide", label: "슬라이드" },
    { value: "fade", label: "페이드" },
  ];

  const [formData, setFormData] = useState({
    bannerName: data?.groupName || "",
    effect: data?.effect || null,
    memo: data?.bannerCode ? `${data.bannerCode}` : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onActionDataChange?.(formData);
  };

  return (
    <div className="flex-box col gap-12">
      <label className="flex-box col gap-6">
        <span>배너명</span>
        <input
          type="text"
          name="bannerName"
          value={formData.bannerName}
          onChange={(e) => handleChange(e)}
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
          onChange={(selected) => handleChange({ target: { name: "effect", value: selected?.value || null } })}
        />
      </label>
      <label className="flex-box col gap-6">
        <span>메모</span>
        <textarea
          name="memo"
          rows={3}
          value={formData.memo}
          onChange={(e) => handleChange(e)}
          placeholder="메모를 입력하세요"
        />
      </label>
    </div>
  );
};

export default RegisterModalContent;
