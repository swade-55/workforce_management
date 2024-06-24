import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTools, fetchCategories } from '../slices/toolSlice'; // Adjust the import path as needed

function ExecutiveSummary() {
  const dispatch = useDispatch();
  const tools = useSelector(state => state.tools.tools);
  console.log('tools', tools)
  const categories = useSelector(state=>state.tools.categories)
  console.log('categories', categories)


  // Group tools by category and then by status
  const toolsByCategoryAndStatus = tools.reduce((acc, tool) => {
    const categoryName = categories.find(category => category.id === tool.category_id)?.name || 'Unknown Category';
    const status = tool.status || 'Unknown Status';

    if (!acc[categoryName]) {
      acc[categoryName] = {};
    }
    if (!acc[categoryName][status]) {
      acc[categoryName][status] = [];
    }

    acc[categoryName][status].push(tool);
    return acc;
  }, {});

  const getSummaryData = () => {
    return Object.entries(toolsByCategoryAndStatus).map(([category, statuses]) => ({
      category,
      statuses: Object.entries(statuses).map(([status, tools]) => ({
        status,
        count: tools.length
      }))
    }));
  };

  const summaryData = getSummaryData();

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Tools Summary</h1>

      <h2 className="text-2xl font-semibold mb-4">Count of Tools by Category and Status</h2>
      {summaryData.map(({ category, statuses }) => (
        <div key={category} className="mb-5">
          <h3 className="text-xl font-semibold mb-3">{category}</h3>
          {/* DaisyUI Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map(({ status, count }) => (
                  <tr key={status}>
                    <td>{status}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExecutiveSummary;
