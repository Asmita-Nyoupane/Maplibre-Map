import React, { useState } from "react";
import { Command } from "cmdk";
import nepalData from "../data/nepal.json";
import "../styles/command-menu.css";

const MultiRegionSelector = ({ onRegionSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({
    province: null,
    district: null,
    municipalities: [], // Array for multiple municipalities
  });
  const [level, setLevel] = useState("province");

  const getDisplayValue = () => {
    if (selected.municipalities.length > 0) {
      return `${selected.province.name} → ${
        selected.district.name
      } → ${selected.municipalities.map((m) => m.name).join(", ")}`;
    }
    if (selected.district) {
      return `${selected.province.name} → ${selected.district.name}`;
    }
    if (selected.province) {
      return selected.province.name;
    }
    return "Select region...";
  };

  const getCurrentOptions = () => {
    switch (level) {
      case "province":
        return nepalData.provinces;
      case "district":
        return selected.province ? selected.province.districts : [];
      case "municipality":
        const municipalities = selected.district?.municipalities || [];
        return municipalities.map((mun) =>
          typeof mun === "string" ? { name: mun } : mun
        );
      default:
        return [];
    }
  };

  const handleSelect = (item) => {
    switch (level) {
      case "province":
        setSelected({
          province: item,
          district: null,
          municipalities: [],
        });
        setLevel("district");
        break;
      case "district":
        setSelected((prev) => ({
          ...prev,
          district: item,
          municipalities: [],
        }));
        setLevel("municipality");
        break;
      case "municipality":
        setSelected((prev) => {
          const isSelected = prev.municipalities.some(
            (m) => m.name === item.name
          );
          const newMunicipalities = isSelected
            ? prev.municipalities.filter((m) => m.name !== item.name)
            : [...prev.municipalities, item];
          return {
            ...prev,
            municipalities: newMunicipalities,
          };
        });
        onRegionSelect && onRegionSelect(selected);
        break;
    }
  };

  const goBack = () => {
    if (level === "municipality") {
      setLevel("district");
      setSelected((prev) => ({ ...prev, municipalities: [] }));
    } else if (level === "district") {
      setLevel("province");
      setSelected({ province: null, district: null, municipalities: [] });
    }
  };

  const handleDone = () => {
    setOpen(false);
    onRegionSelect && onRegionSelect(selected);
  };

  return (
    <div className="command-menu">
      <button className="command-trigger" onClick={() => setOpen(true)}>
        {getDisplayValue()}
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Select regions"
        className="command-dialog"
      >
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search regions..."
          className="command-input"
        />

        <Command.List className="command-list">
          <Command.Empty>No results found.</Command.Empty>

          {level !== "province" && (
            <Command.Item
              onSelect={goBack}
              className="command-item back-button"
            >
              ← Back to {level === "municipality" ? "districts" : "provinces"}
            </Command.Item>
          )}

          <Command.Group heading={`Select ${level}`}>
            {getCurrentOptions()
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, index) => (
                <Command.Item
                  key={index}
                  onSelect={() => handleSelect(item)}
                  className="command-item"
                >
                  <div className="command-item-content">
                    <span>{item.name}</span>
                    {level === "municipality" &&
                      selected.municipalities.some(
                        (m) => m.name === item.name
                      ) && <span className="checkmark">✓</span>}
                  </div>
                </Command.Item>
              ))}
          </Command.Group>

          {level === "municipality" && selected.municipalities.length > 0 && (
            <Command.Item
              onSelect={handleDone}
              className="command-item done-button"
            >
              Done ({selected.municipalities.length} selected)
            </Command.Item>
          )}
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default MultiRegionSelector;
