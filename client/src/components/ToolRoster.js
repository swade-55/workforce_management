import React, { useState } from "react";
import ToolForm from "./ToolForm";
import CategoryForm from "./CategoryForm";
import { useDispatch, useSelector } from 'react-redux';
import { deleteTool, exportTools, importTools } from '../slices/toolSlice';
import ToolCard from "./ToolCard";
import SidebarLayout from "./SidebarLayout";

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
      const formData = new FormData();
      formData.append('file', file);
      dispatch(importTools(formData));
    }
  };

  const filteredTools = tools.filter(tool => {
    const {
      serialNumber,
      productName,
      productId,
      description,
      siteId,
      storageLocation,
      status,
      itemOwner,
      nokiaSto,
      notes,
      category
    } = tool;

    return (
      (serialNumber && serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (productName && productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (productId && productId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (description && description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (siteId && siteId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (storageLocation && storageLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (status && status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (itemOwner && itemOwner.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (nokiaSto && nokiaSto.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notes && notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category && category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    const categoryKey = tool.category ? tool.category.id : 'Uncategorized';
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        tools: [],
        categoryName: tool.category ? tool.category.name : 'Uncategorized'
      };
    }
    acc[categoryKey].tools.push(tool);
    return acc;
  }, {});

  return (
    // <SidebarLayout>
      <div className="w-full p-4">
        <div className="mb-4 flex justify-between items-center">
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
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Serial Number</th>
                <th className="py-2 px-4 border-b border-gray-200">Product Name</th>
                <th className="py-2 px-4 border-b border-gray-200">Product ID</th>
                <th className="py-2 px-4 border-b border-gray-200">Description</th>
                <th className="py-2 px-4 border-b border-gray-200">Site ID</th>
                <th className="py-2 px-4 border-b border-gray-200">Storage Location</th>
                <th className="py-2 px-4 border-b border-gray-200">Status</th>
                <th className="py-2 px-4 border-b border-gray-200">Item Owner</th>
                <th className="py-2 px-4 border-b border-gray-200">Nokia STO</th>
                <th className="py-2 px-4 border-b border-gray-200">Notes</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
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
    // </SidebarLayout>
  );
}

export default ToolRoster;
