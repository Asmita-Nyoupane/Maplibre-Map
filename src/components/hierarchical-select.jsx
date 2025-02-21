import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import nepalData from "../data/nepal.json";
import { createDriver, tours } from "./driver-container";
import "../styles/hierarchical-select.css";
import { useDriverTour } from "../hooks/useDriverTour";

const HierarchicalSelect = ({ onSelectionChange }) => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);

  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openMunicipality, setOpenMunicipality] = useState(false);
  const [search, setSearch] = useState("");

  useDriverTour(tours.regionSelector, "hasSeenRegionTour");

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedMunicipalities([]);
    setOpenProvince(false);
    onSelectionChange &&
      onSelectionChange({ province, district: null, municipalities: [] });
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedMunicipalities([]);
    setOpenDistrict(false);
    onSelectionChange &&
      onSelectionChange({
        province: selectedProvince,
        district,
        municipalities: [],
      });
  };

  const handleMunicipalitySelect = (municipality) => {
    setSelectedMunicipalities((prev) => {
      const isSelected = prev.some((m) => m.name === municipality.name);
      const newMunicipalities = isSelected
        ? prev.filter((m) => m.name !== municipality.name)
        : [...prev, municipality];

      onSelectionChange &&
        onSelectionChange({
          province: selectedProvince,
          district: selectedDistrict,
          municipalities: newMunicipalities,
        });

      return newMunicipalities;
    });
  };

  // Helper function to format selected municipalities
  const getSelectedPalikasDisplay = () => {
    if (selectedMunicipalities.length === 0) return "Select Palika";
    if (selectedMunicipalities.length === 1)
      return selectedMunicipalities[0].name;
    return `${selectedMunicipalities[0].name} +${
      selectedMunicipalities.length - 1
    } more`;
  };

  return (
    <div className="select-container">
      {/* Province Selector */}
      <div className="select-box">
        {/* <label>Province :</label> */}
        <button
          id="province-select"
          className={`select-trigger ${selectedProvince ? "selected" : ""}`}
          onClick={() => setOpenProvince(true)}
        >
          {selectedProvince?.name || "Select Province"}
        </button>
        <Command.Dialog
          open={openProvince}
          onOpenChange={setOpenProvince}
          label="Select Province"
          className="command-dialog"
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search provinces..."
            className="command-input"
          />
          <Command.List className="command-list">
            <Command.Empty>No results found.</Command.Empty>
            {nepalData.provinces
              .filter((province) =>
                province.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((province) => (
                <Command.Item
                  key={province.name}
                  onSelect={() => handleProvinceSelect(province)}
                  className="command-item"
                  data-selected={selectedProvince?.name === province.name}
                >
                  {province.name}
                </Command.Item>
              ))}
          </Command.List>
        </Command.Dialog>
      </div>

      {/* District Selector */}
      <div className="select-box">
        <button
          id="district-select"
          className={`select-trigger ${selectedDistrict ? "selected" : ""}`}
          onClick={() => setOpenDistrict(true)}
          disabled={!selectedProvince}
        >
          {selectedDistrict?.name || "Select District"}
        </button>
        <Command.Dialog
          open={openDistrict}
          onOpenChange={setOpenDistrict}
          label="Select District"
          className="command-dialog"
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search districts..."
            className="command-input"
          />
          <Command.List className="command-list">
            <Command.Empty>No results found.</Command.Empty>
            {selectedProvince?.districts
              .filter((district) =>
                district.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((district) => (
                <Command.Item
                  key={district.name}
                  onSelect={() => handleDistrictSelect(district)}
                  className="command-item"
                  data-selected={selectedDistrict?.name === district.name}
                >
                  {district.name}
                </Command.Item>
              ))}
          </Command.List>
        </Command.Dialog>
      </div>

      {/* Municipality Multi-selector */}
      <div className="select-box">
        {/* <label>Palika :</label> */}
        <button
          id="palika-select"
          className={`select-trigger ${
            selectedMunicipalities.length > 0 ? "selected" : ""
          }`}
          onClick={() => setOpenMunicipality(true)}
          disabled={!selectedDistrict}
        >
          {getSelectedPalikasDisplay()}
        </button>
        <Command.Dialog
          open={openMunicipality}
          onOpenChange={setOpenMunicipality}
          label="Select Palika"
          className="command-dialog"
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search palikas..."
            className="command-input"
          />
          <Command.List className="command-list">
            <Command.Empty>No results found.</Command.Empty>

            {/* Show selected municipalities at the top */}
            {selectedMunicipalities.length > 0 && (
              <Command.Group heading="Selected Palikas">
                {selectedMunicipalities.map((mun) => (
                  <Command.Item
                    key={mun.name}
                    onSelect={() => handleMunicipalitySelect(mun)}
                    className={`command-item ${
                      selectedMunicipalities.some((m) => m.name === mun.name)
                        ? "selected-item"
                        : ""
                    }`}
                  >
                    <div className="command-item-content">
                      <span>{mun.name}</span>
                      {selectedMunicipalities.some(
                        (m) => m.name === mun.name
                      ) && <span className="checkmark">✓</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="All Palikas">
              {selectedDistrict?.municipalities
                .filter((municipality) => {
                  const mun =
                    typeof municipality === "string"
                      ? { name: municipality }
                      : municipality;

                  // Filter out already selected municipalities
                  const isNotSelected = !selectedMunicipalities.some(
                    (selected) => selected.name === mun.name
                  );

                  // Also apply search filter
                  const matchesSearch = mun.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                  return isNotSelected && matchesSearch;
                })
                .map((municipality, index) => {
                  const mun =
                    typeof municipality === "string"
                      ? { name: municipality }
                      : municipality;
                  return (
                    <Command.Item
                      key={index}
                      onSelect={() => handleMunicipalitySelect(mun)}
                      className={`command-item ${
                        selectedMunicipalities.some((m) => m.name === mun.name)
                          ? "selected-item"
                          : ""
                      }`}
                    >
                      <div className="command-item-content">
                        <span>{mun.name}</span>
                      </div>
                    </Command.Item>
                  );
                })}
            </Command.Group>
          </Command.List>
        </Command.Dialog>
      </div>
    </div>
  );
};

export default HierarchicalSelect;
