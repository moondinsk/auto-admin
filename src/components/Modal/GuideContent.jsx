import React from "react";

const GuideContent = ({ data }) => {
  const title = data?.title || "가이드 제목";
  const description = data?.description || "가이드 설명";

  return (
    <div className="flex-box col" style={{ gap: 10 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <p style={{ margin: 0 }}>{description}</p>
    </div>
  );
};

export default GuideContent;
