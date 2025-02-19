import React, { useState } from "react";
import { Command } from "cmdk";
import GeoRegions from "../data/region-data.json";
import "../styles/command-menu.css";

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPath, setSelectedPath] = useState({
    province: null,
    district: null,
    municipality: null,
  });
  const [pages, setPages] = useState(["root"]);
  const activePage = pages[pages.length - 1];

  // Organize regions hierarchically
  const hierarchy = React.useMemo(() => {
    const provinces = Object.values(GeoRegions).filter(
      (r) => r.type === "Province"
    );

    return provinces.map((province) => {
      const districts = Object.values(GeoRegions).filter(
        (r) => r.type === "District" && r.province === province.code
      );

      const districtMap = districts.map((district) => {
        const municipalities = Object.values(GeoRegions).filter(
          (r) =>
            (r.type === "Municipality" || r.type === "Rural Municipality") &&
            r.district === district.code
        );

        return {
          ...district,
          municipalities,
        };
      });

      return {
        ...province,
        districts: districtMap,
      };
    });
  }, []);

  console.log("🚀 ~ hierarchy ~ hierarchy:", hierarchy);

  const getCurrentOptions = () => {
    switch (activePage) {
      case "root":
        return hierarchy;
      case "districts":
        return selectedPath.province?.districts || [];
      case "municipalities":
        return selectedPath.district?.municipalities || [];
      default:
        return [];
    }
  };

  const handleSelect = (item) => {
    switch (activePage) {
      case "root":
        setSelectedPath({ province: item, district: null, municipality: null });
        navigateTo("districts");
        break;
      case "districts":
        setSelectedPath((prev) => ({
          ...prev,
          district: item,
          municipality: null,
        }));
        navigateTo("municipalities");
        break;
      case "municipalities":
        setSelectedPath((prev) => ({ ...prev, municipality: item }));
        setOpen(false);
        break;
    }
  };

  const navigateTo = (page) => {
    setPages([...pages, page]);
  };

  const goBack = () => {
    setPages((prev) => prev.slice(0, -1));
    if (activePage === "municipalities") {
      setSelectedPath((prev) => ({
        ...prev,
        district: null,
        municipality: null,
      }));
    } else if (activePage === "districts") {
      setSelectedPath({ province: null, district: null, municipality: null });
    }
  };

  const getDisplayValue = () => {
    if (selectedPath.municipality) return selectedPath.municipality.name;
    if (selectedPath.district) return selectedPath.district.name;
    if (selectedPath.province) return selectedPath.province.name;
    return "Select a region...";
  };

  return (
    <div className="command-menu">
      <button className="command-trigger" onClick={() => setOpen(true)}>
        {getDisplayValue()}
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search regions"
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

          {activePage !== "root" && (
            <Command.Item onSelect={goBack} className="command-item">
              ← Back
            </Command.Item>
          )}

          <Command.Group
            heading={
              activePage === "root"
                ? "Select Province"
                : activePage === "districts"
                ? `Districts in ${selectedPath.province.name}`
                : `Municipalities in ${selectedPath.district.name}`
            }
          >
            {getCurrentOptions()
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <Command.Item
                  key={item.code}
                  onSelect={() => handleSelect(item)}
                  className="command-item"
                >
                  {item.name} ({item.name_ne})
                </Command.Item>
              ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default CommandMenu;
