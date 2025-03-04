import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './App.css';

function Model({ url }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

function App() {
  const [models, setModels] = useState([]);
  const [selectedModelUrl, setSelectedModelUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);

  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/models')
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setFilteredModels(data);
        if (data.length > 0) {
          setSelectedModelUrl(data[0].url);
        }
      });
  }, []);

  useEffect(() => {
    const results = models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModels(results);
  }, [searchTerm, models]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModelSelect = (url) => {
    setSelectedModelUrl(url);
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    setUploadStatus('Uploading...');

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: uploadName,
          description: uploadDescription,
          url: uploadUrl,
        }),
      });

      if (response.status === 201) {
        setUploadStatus('Upload successful!');
        setUploadName('');
        setUploadDescription('');
        setUploadUrl('');
        fetch('http://localhost:5000/models')
          .then(res => res.json())
          .then(data => {
            setModels(data);
            setFilteredModels(data);
          });
      } else {
        setUploadStatus(`Upload failed. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading model:', error);
      setUploadStatus('Upload failed. Please check console.');
    }
  };

  return (
    <div className="app-container">
      <h1>3D Model Viewer</h1>

      <div className="upload-form-container">
        <h2>Upload New Model</h2>
        <form onSubmit={handleUploadSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="uploadName">Name:</label>
            <input
              type="text"
              id="uploadName"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uploadDescription">Description:</label>
            <textarea
              id="uploadDescription"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uploadUrl">Model URL:</label>
            <input
              type="text"
              id="uploadUrl"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="upload-button">Upload Model</button> 
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>} 
        </form>
      </div>


      <div className="model-section">
        <div className="model-list-container">
          <h2>Models</h2>
          <input
            type="text"
            placeholder="Search models by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <ul className="model-list">
            {filteredModels.map(model => (
              <li
                key={model.id}
                onClick={() => handleModelSelect(model.url)}
                className="model-list-item"
              >
                {model.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="viewer-container">
          {selectedModelUrl && (
            <Canvas camera={{ position: [0, 0, 0.5] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[-2, 5, 2]} intensity={1} />
              <Suspense fallback={null}>
                <Model url={selectedModelUrl} />
                <OrbitControls />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;