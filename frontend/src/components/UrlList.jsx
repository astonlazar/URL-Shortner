import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useClipboard } from '../hooks/useClipboard';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/urls');
        setUrls(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch URLs');
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleCopy = async (id, url) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="my-4">Recent URLs</h2>
      <div className="url-list">
        {urls.length === 0 ? (
          <p className="p-4">No URLs have been shortened yet.</p>
        ) : (
          urls.map((url) => (
            <div key={url._id} className="url-item">
              <h3 title={url.originalUrl}>{url.originalUrl}</h3>
              <div className="d-flex align-items-center">
                <p className="url-short">
                  <a href={`http://localhost:5000/${url.shortCode}`} target="_blank" rel="noopener noreferrer">
                    http://localhost:5000/{url.shortCode}
                  </a>
                </p>
                <button 
                  className="btn copy-btn"
                  onClick={() => handleCopy(url._id, `http://localhost:5000/${url.shortCode}`)}
                >
                  {copiedId === url._id ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="stats">
                <p>Clicks: {url.clicks}</p>
                <p>Created: {new Date(url.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UrlList;