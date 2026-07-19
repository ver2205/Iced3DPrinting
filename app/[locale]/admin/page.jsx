'use client';

import { useEffect, useState } from 'react';

const Admin = () => {
  const [quotes, setQuotes] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [filter, setFilter] = useState('custom'); // 'all' | 'custom' | 'existing'

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleLogin = async () => {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
    });

    if (res.ok) {
      setPasswordInput('');
      fetchQuotes();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchQuotes = async () => {
    const res = await fetch('/api/admin-quotes');

    if (res.status === 401) {
      setAuthorized(false);
      setCheckingAuth(false);
      return;
    }

    const { data, error } = await res.json();
    if (error) {
      console.error('Error fetching quotes:', error);
    } else {
      setAuthorized(true);
      setQuotes(data.map(q => ({ ...q, status: q.status || 'Received' })));
    }
    setCheckingAuth(false);
  };

  const filteredQuotes = quotes.filter(q => {
    if (filter === 'custom') return q.selected_ship === 'Custom Design';
    if (filter === 'existing') return q.selected_ship !== 'Custom Design';
    return true;
  });

  const handleStatusChange = async (quoteId, newStatus) => {
    const res = await fetch('/api/admin-quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quoteId, status: newStatus }),
    });

    if (!res.ok) {
      console.error('Failed to update status');
      alert('Failed to update status');
    } else {
      setQuotes(prev =>
        prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q)
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };


  
  if (checkingAuth) {
    return <div className="min-h-screen bg-gray-900" />;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter admin password"
          className="p-3 rounded bg-gray-700 border border-gray-600 mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Quote Requests Admin</h1>

      <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">All Quote Requests</h2>
          <div className="text-gray-400">Total: {quotes.length} requests</div>
        </div>
      <div className="mb-4 flex gap-4">
          {/* <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            All
          </button> */}
          <button
            onClick={() => setFilter('custom')}
            className={`px-4 py-2 rounded ${filter === 'custom' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Custom Designs
          </button>
          <button
            onClick={() => setFilter('existing')}
            className={`px-4 py-2 rounded ${filter === 'existing' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Existing Ships
          </button>
    </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700">
            
          {filter === 'custom' ? (
  <>
    {/* Custom Design Table Head */}
    <thead>
      <tr className="border-b border-gray-700">
        <th className="p-2 text-left">ID</th>
        <th className="p-2 text-left">Ship Model</th>
        <th className="p-2 text-left">Customer</th>
        <th className="p-2 text-left">Email</th>
        <th className="p-2 text-left">Phone</th>
        <th className="p-2 text-left">Scale</th>
        <th className="p-2 text-left">Date</th>
        <th className="p-2 text-left">Status</th>
        <th className="p-2 text-left">Note</th>
        <th className="p-2 text-left">Custom Details</th>
      </tr>
    </thead>
    <tbody>
      {filteredQuotes.map((quote) => (
        <tr key={quote.id} className="border-b border-gray-700 hover:bg-gray-800/30">
          <td className="p-2">#{quote.id.slice(0, 8)}</td>
          <td className="p-2">{quote.selected_ship}</td>
          <td className="p-2">{quote.name}</td>
          <td className="p-2">{quote.email}</td>
          <td className="p-2">{quote.phone || 'N/A'}</td>
          <td className="p-2">{quote.scale || 'N/A'}</td>
          <td className="p-2">{formatDate(quote.created_at)}</td>
          <td className="p-2">
            <select
              value={quote.status || 'Received'}
              onChange={(e) => handleStatusChange(quote.id, e.target.value)}
              className={`rounded p-2 ${
                quote.status === 'Received'
                  ? 'bg-yellow-600/30 text-yellow-300'
                  : 'bg-green-600/30 text-green-300'
              }`}
            >
              <option value="Received">Received</option>
              <option value="Replied">Replied</option>
            </select>
          </td>
          <td className="p-2">{quote.notes || 'N/A'}</td>

          <td className="p-2 text-sm text-gray-300 space-y-1">
            <p><strong>Ship Name:</strong> {quote.custom_ship_name || 'N/A'}</p>
            <p><strong>Technical Drawings:</strong> {quote.has_technical_draws ? 'Yes' : 'No'}</p>
            <p><strong>Still Sailing:</strong> {quote.is_still_sailing ? 'Yes' : 'No'}</p>
            <p><strong>Photos:</strong> {quote.has_photos ? 'Yes' : 'No'}</p>
            <p><strong>RC:</strong> {quote.rc_model ? 'Yes' : 'No'}</p>
            <p><strong>Build-Off:</strong> {quote.build_ready ? 'Yes' : 'No'}</p>
            <p><strong>Case Cover:</strong> {quote.case_cover ? 'Yes' : 'No'}</p>
          </td>
        </tr>
      ))}
    </tbody>
  </>
) : (
  <>
    {/* Existing Ship Table Head */}
    <thead>
      <tr className="border-b border-gray-700">
        <th className="p-2 text-left">ID</th>
        <th className="p-2 text-left">Ship Model</th>
        <th className="p-2 text-left">Customer</th>
        <th className="p-2 text-left">Email</th>
        <th className="p-2 text-left">Phone</th>
        <th className="p-2 text-left">Scale</th>
        <th className="p-2 text-left">Date</th>
        <th className="p-2 text-left">Note</th>
        <th className="p-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {filteredQuotes.map((quote) => (
        <tr key={quote.id} className="border-b border-gray-700 hover:bg-gray-800/30">
          <td className="p-2">#{quote.id.slice(0, 8)}</td>
          <td className="p-2">{quote.selected_ship}</td>
          <td className="p-2">{quote.name}</td>
          <td className="p-2">{quote.email}</td>
          <td className="p-2">{quote.phone || 'N/A'}</td>
          <td className="p-2">{quote.scale || 'N/A'}</td>
          <td className="p-2">{formatDate(quote.created_at)}</td>
          <td className="p-2">{quote.notes || 'N/A'}</td>
          <td className="p-2">
            <select
              value={quote.status || 'Received'}
              onChange={(e) => handleStatusChange(quote.id, e.target.value)}
              className={`rounded p-2 ${
                quote.status === 'Received'
                  ? 'bg-yellow-600/30 text-yellow-300'
                  : 'bg-green-600/30 text-green-300'
              }`}
            >
              <option value="Received">Received</option>
              <option value="Replied">Replied</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </>
)}

          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-yellow-400 font-semibold mb-2">Received Requests</h3>
          <div className="text-3xl font-bold">
            {quotes.filter(q => q.status === 'Received').length}
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-green-400 font-semibold mb-2">Replied</h3>
          <div className="text-3xl font-bold">
            {quotes.filter(q => q.status === 'Replied').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
