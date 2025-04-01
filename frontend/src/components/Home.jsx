import React, { useState } from 'react';
import axios from 'axios';
import { useClipboard } from '../hooks/useClipboard';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { originalUrl: url });
      const baseUrl = 'http://localhost:5000/';
      setShortUrl(baseUrl + res.data.shortCode);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center my-4">Shorten Your URL</h2>
      <div className="url-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Enter Long URL</label>
            <input
              type="text"
              className="form-control"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/long-url-to-shorten"
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && <div className="url-result" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>{error}</div>}

        {shortUrl && (
          <div className="url-result">
            <h3>Shortened URL:</h3>
            <p className="url-short">{shortUrl}</p>
            <button 
              className="btn copy-btn" 
              onClick={() => copyToClipboard(shortUrl)}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;