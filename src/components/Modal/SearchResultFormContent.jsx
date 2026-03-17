import { useEffect, useState } from "react";

const SearchResultFormContent = ({ itemName, onSync, message }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(itemName || "");
  }, [itemName]);

  const handleChange = (e) => {
    const nextName = e.target.value;
    setName(nextName);

    onSync?.({
      itemName: nextName,
    });
  };

  return (
    <div className="flex-box col gap-10">
      <p>{message}</p>

      <input value={name} onChange={handleChange} placeholder="항목명" type="text" />
    </div>
  );
};

export default SearchResultFormContent;
