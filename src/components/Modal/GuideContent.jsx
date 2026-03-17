import React from "react";

const GuideContent = ({ data }) => {
  const title = data?.title || "가이드 제목";
  const description = data?.description || "가이드 설명";

  return (
    <div className="flex-box col gap-10">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default GuideContent;
