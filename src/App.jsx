import * as React from "react";
import "./App.css";

import HierarchicalRichSelect from "./components/hierarchical-rich-select";

function App() {
  const handleSelectionChange = (selection) => {
    console.log("Selected:", selection);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nepal Region Selector</h1>
      <HierarchicalRichSelect onSelectionChange={handleSelectionChange} />
    </div>
  );
}

export default App;
