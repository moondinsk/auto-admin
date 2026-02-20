import React from "react";
import Select from "react-select";

const RegisterModalContent = ({ data }) => {
  const fallbackName = data?.groupName || "";
  const fallbackType = data?.effect;
  const fallbackMemo = data?.bannerCode ? `${data.bannerCode}` : "";

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <label className="flex-box col" style={{ gap: 6 }}>
        <span>배너명</span>
        <input type="text" defaultValue={fallbackName} placeholder="배너명을 입력하세요" />
      </label>
      <label className="flex-box col" style={{ gap: 6 }}>
        <span>배너 효과</span>
        <Select
          className="custom-select"
          classNamePrefix="react-select"
          options={[
            { value: "slide", label: "슬라이드" },
            { value: "fade", label: "페이드" },
          ]}
          defaultValue={{
            value: fallbackType,
            label: fallbackType === "slide" ? "슬라이드" : fallbackType === "fade" ? "페이드" : "",
          }}
        />
      </label>
      <label className="flex-box col" style={{ gap: 6 }}>
        <span>메모</span>
        <textarea rows={3} defaultValue={fallbackMemo} placeholder="메모를 입력하세요" />
      </label>
    </div>
  );
};

export default RegisterModalContent;
