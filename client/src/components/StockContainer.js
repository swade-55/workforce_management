import React, { useState, useEffect } from 'react';
import ToolForm from './ToolForm';
import CategoryForm from './CategoryForm';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTool, exportTools, importTools, clearError } from '../slices/toolSlice';
import ToolCard from './ToolCard';
import './styles.css'; // Import the CSS file

function StockContainer() {
  const dispatch = useDispatch();
  const tools = useSelector((state) => state.tools.tools);
  const error = useSelector((state) => state.tools.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importError, setImportError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (error) {
      setImportError(error);
    }
  }, [error]);

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
      dispatch(importTools(formData))
        .unwrap()
        .catch((error) => {
          setImportError(error);
        });
    }
  };

  const handleCloseError = () => {
    setImportError('');
    dispatch(clearError());
  };

  const filteredTools = tools.filter((tool) => {
    const {
      productName,
      productId,
      description,
      siteId,
      storageLocation,
      itemOwner,
      nokiaSto,
      category,
    } = tool;

    return (
      (productName && productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (productId && productId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (description && description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (siteId && siteId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (storageLocation && storageLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (itemOwner && itemOwner.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (nokiaSto && nokiaSto.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category && category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="container">
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
          <label htmlFor="import-file" className="btn btn-primary ml-2">Import Data</label>
          <button onClick={handleExport} className="btn btn-secondary ml-2">Export Data</button>
        </div>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mb-4">Add New Asset</button>
      <div className="table-responsive">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">Product Name</th>
              <th className="py-2 px-4 border-b border-gray-200">Product ID</th>
              <th className="py-2 px-4 border-b border-gray-200">Description</th>
              <th className="py-2 px-4 border-b border-gray-200">Site ID</th>
              <th className="py-2 px-4 border-b border-gray-200">Storage Location</th>
              <th className="py-2 px-4 border-b border-gray-200">Item Owner</th>
              <th className="py-2 px-4 border-b border-gray-200">Nokia STO</th>
              <th className="py-2 px-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr key={tool.id}>
                <td className="border px-4 py-2">{tool.productName}</td>
                <td className="border px-4 py-2">{tool.productId}</td>
                <td className="border px-4 py-2">{tool.description}</td>
                <td className="border px-4 py-2">{tool.siteId}</td>
                <td className="border px-4 py-2">{tool.storageLocation}</td>
                <td className="border px-4 py-2">{tool.itemOwner}</td>
                <td className="border px-4 py-2">{tool.nokiaSto}</td>
                <td className="border px-4 py-2">
                  <button className="btn btn-primary mr-2">Show</button>
                  <button className="btn btn-secondary mr-2">Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(tool.id)}>Delete</button>
                </td>
              </tr>
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
            width: '90%',
            maxWidth: '800px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
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
      {importError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Import Error</h2>
            <p>{importError}</p>
            <button
              className="btn btn-primary mt-4"
              onClick={handleCloseError}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockContainer;
