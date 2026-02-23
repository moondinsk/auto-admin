import React from "react";

const GuideModal = ({ data }) => {
  const guideType = data?.guideType || "";
  const description = data?.description || "";

  return (
    <div className="flex-box col" style={{ gap: 12 }}>
      <div className="flex-box col" style={{ gap: 4 }}>
        <p>
          <strong>{guideType}</strong>
        </p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default GuideModal;
