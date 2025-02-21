import React, { useState } from "react";
import RichSelect from "./RichSelect";
import nepalData from "../data/nepal.json";

const HierarchicalRichSelect = ({ onSelectionChange }) => {
  const [selected, setSelected] = useState([]);

  // Data transformation
  const hierarchicalData = nepalData.provinces.map((province) => ({
    label: province.name,
    value: province,
    options: province.districts.map((district) => ({
      label: district.name,
      value: district,
      options: district.municipalities.map((municipality) => ({
        label:
          typeof municipality === "string" ? municipality : municipality.name,
        value: municipality,
      })),
    })),
  }));

  const handleSelect = (selections) => {
    setSelected(selections);
    onSelectionChange?.(selections);
  };

  return (
    <div className="flex gap-4 p-4">
      <RichSelect
        options={hierarchicalData}
        selected={selected}
        onSelect={handleSelect}
        trigger={(selected) => (
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:border-blue-500">
            {selected.length === 0
              ? "Select Municipalities"
              : selected.length === 1
              ? selected[0].label
              : `${selected[0].label} +${selected.length - 1} more`}
          </button>
        )}
      />
    </div>
  );
};

export default HierarchicalRichSelect;
