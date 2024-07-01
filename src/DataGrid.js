import React, { useState, useEffect } from 'react';
import './DataGrid.css';
import data from './data.json';

const DataGrid = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    setRecords(data);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = React.useMemo(() => {
    let sortableRecords = [...records];
    if (sortConfig.key !== null) {
      sortableRecords.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [records, sortConfig]);

  const filteredRecords = sortedRecords.filter((record) => {
    if (searchTerm.trim() === '') {
      return true; // No search term, show all records
    }

    const searchTerms = searchTerm.split(/[\s,]+/).filter(term => term.trim() !== '');
    return searchTerms.every(term =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="datagrid-container">
      <h2>DataGrid</h2>
      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('customer')}>
              Customer
              {sortConfig.key === 'customer' && (
                sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
              )}
            </th>
            <th onClick={() => handleSort('lastSeen')}>
              Last Seen
              {sortConfig.key === 'lastSeen' && (
                sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
              )}
            </th>
            <th>Orders</th>
            <th>Total Spent (INR)</th>
            <th>Latest Purchase</th>
            <th>News</th>
            <th>Segments</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td><input type="checkbox" /></td>
              <td>{record.customer}</td>
              <td>{record.lastSeen}</td>
              <td>{record.orders}</td>
              <td>{record.totalSpent}</td>
              <td>{record.latestPurchase}</td>
              <td>{record.news ? 'Yes' : 'No'}</td>
              <td>{record.segments.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
