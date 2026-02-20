const GuideExampleContent = ({ data }) => {
  const title = data?.title || "가이드 제목";
  const description = data?.description || "가이드 설명";
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="flex-box col" style={{ gap: 10 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <p style={{ margin: 0 }}>{description}</p>
      {items.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuideExampleContent;
