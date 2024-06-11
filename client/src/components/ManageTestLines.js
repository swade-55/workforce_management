import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { reserveTestLine, returnTestLine, fetchTestLines } from '../slices/toolSlice'; // Adjust import path as necessary
import TestLineForm from './TestLineForm'; // Import the TestLineForm

function ManageTestLines() {
  const dispatch = useDispatch();
  const testlines = useSelector((state) => state.tools.testlines); // Ensure you access the correct slice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTestLines());
  }, [dispatch]);

  const handleReserve = (user_id, testline_id) => {
    dispatch(reserveTestLine({ user_id, testline_id }));
  };

  const handleReturn = (user_id, testline_id) => {
    dispatch(returnTestLine({ user_id, testline_id }));
  };

  const filteredTestLines = testlines.filter(testline => 
    testline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testline.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
        <button onClick={openModal} className="btn btn-primary ml-2">Add Test Line</button>
      </div>
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Test Lines</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 w-1/4">Name</th>
              <th className="px-4 py-2 w-1/4">Status</th>
              <th className="px-4 py-2 w-1/4">Reserve</th>
              <th className="px-4 py-2 w-1/4">Return</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestLines.map(testline => (
              <tr key={testline.id}>
                <td className="border px-4 py-2">{testline.name}</td>
                <td className="border px-4 py-2">{testline.status}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleReserve(1, testline.id)} // Replace 1 with dynamic user_id
                    className="btn btn-primary"
                    disabled={testline.status !== 'available'}
                  >
                    Reserve
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleReturn(1, testline.id)} // Replace 1 with dynamic user_id
                    className="btn btn-secondary"
                    disabled={testline.status !== 'checked out'}
                  >
                    Return
                  </button>
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
          }}>
            <TestLineForm onClose={closeModal} />
            <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTestLines;
