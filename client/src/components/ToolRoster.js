import React, { useState } from "react";
import ToolForm from "./ToolForm";
import CategoryForm from "./CategoryForm"; // Import the CategoryForm
import { useDispatch, useSelector } from 'react-redux';
import { deleteTool, exportTools, importTools } from '../slices/toolSlice'; // Import the importTools action
import ToolCard from "./ToolCard"; // Ensure this import remains for handling tool operations

function ToolRoster() {
  const dispatch = useDispatch();
  const tools = useSelector((state) => state.tools.tools);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (toolId) => {
    dispatch(deleteTool(toolId));
  };

  const handleExport = () => {
    dispatch(exportTools());
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(importTools(file));
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.serial.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    const categoryKey = tool.category.id;
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        tools: [],
        categoryName: tool.category.name
      };
    }
    acc[categoryKey].tools.push(tool);
    return acc;
  }, {});

  return (
    <div className="w-full p-4">
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <input
            type="file"
            className="hidden"
            id="import-file"
            onChange={handleImport}
          />
          <label htmlFor="import-file" className="btn btn-secondary ml-2">Import Data</label>
          <button onClick={handleExport} className="btn btn-secondary ml-2">Export Data</button>
        </div>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mb-4">Add New Asset</button>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 w-1/6">Name</th>
              <th className="px-4 py-2 w-1/3">Description</th>
              <th className="px-4 py-2 w-1/6">Category</th>
              <th className="px-4 py-2 w-1/6">Status</th>
              <th className="px-4 py-2 w-1/6">Serial</th>
              <th className="px-4 py-2 text-center w-1/6">Actions</th> {/* Center-aligned */}
            </tr>
          </thead>
          <tbody>
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} handleDelete={() => handleDelete(tool.id)} />
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative',
            width: '90%', // Increased width to make both forms fit better
            maxWidth: '800px', // Increased max-width
            display: 'flex', // Use flex display
            justifyContent: 'space-between', // Space between the forms
            gap: '20px', // Adding some gap between forms
          }}>
            <div style={{ width: '45%' }}>
              <ToolForm onClose={() => setIsModalOpen(false)} />
            </div>
            <div style={{ width: '45%' }}>
              <CategoryForm onClose={() => setIsModalOpen(false)} />
            </div>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolRoster;
