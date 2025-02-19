import React, { useState } from "react";
import { Command } from "cmdk";
import nepalData from "../data/nepal.json";
import "../styles/command-menu.css";

const RegionSelector = ({ onRegionSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({
    province: null,
    district: null,
    municipality: null,
  });
  const [level, setLevel] = useState("province");

  const getDisplayValue = () => {
    if (selected.municipality) {
      return `${selected.province.name} → ${selected.district.name} → ${
        typeof selected.municipality === "string"
          ? selected.municipality
          : selected.municipality.name
      }`;
    }
    if (selected.district) {
      return `${selected.province.name} → ${selected.district.name}`;
    }
    if (selected.province) {
      return selected.province.name;
    }
    return "Select a region...";
  };

  const getCurrentOptions = () => {
    switch (level) {
      case "province":
        return nepalData.provinces;
      case "district":
        return selected.province ? selected.province.districts : [];
      case "municipality":
        const municipalities = selected.district?.municipalities || [];
        // Handle both string arrays and object arrays
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
          municipality: null,
        });
        setLevel("district");
        onRegionSelect && onRegionSelect(item);
        break;
      case "district":
        setSelected((prev) => ({
          ...prev,
          district: item,
          municipality: null,
        }));
        setLevel("municipality");
        onRegionSelect && onRegionSelect(item);
        break;
      case "municipality":
        setSelected((prev) => ({
          ...prev,
          municipality: item,
        }));
        setOpen(false);
        onRegionSelect && onRegionSelect(item);
        break;
    }
  };

  const goBack = () => {
    if (level === "municipality") {
      setLevel("district");
      setSelected((prev) => ({ ...prev, municipality: null }));
    } else if (level === "district") {
      setLevel("province");
      setSelected({ province: null, district: null, municipality: null });
    }
  };

  return (
    <div className="command-menu">
      <button className="command-trigger" onClick={() => setOpen(true)}>
        {getDisplayValue()}
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Select region"
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
            <Command.Item onSelect={goBack} className="command-item">
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
                  {item.name}
                </Command.Item>
              ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default RegionSelector;
