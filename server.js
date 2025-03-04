const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
  
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/models', async (req, res) => {
    try {
      const modelsRef = db.collection('models');
      const snapshot = await modelsRef.get();
      const modelsData = [];
      snapshot.forEach(doc => {
        modelsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      res.json(modelsData);
    } catch (error) {
      console.error("Error fetching models from Firestore:", error);
      res.status(500).send("Error fetching models");
    }
  });

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/upload', async (req, res) => {
  const { name, description, url } = req.body;

  if (!name || !description || !url) {
    return res.status(400).send("Name, description, and URL are required.");
  }

  try {
    const modelData = {
      name,
      description,
      url,
      uploadDate: admin.firestore.FieldValue.serverTimestamp()
    };
    const modelsRef = db.collection('models');
    await modelsRef.add(modelData);
    res.status(201).send("Model metadata uploaded successfully!");
  } catch (error) {
    console.error("Error uploading model metadata to Firestore:", error);
    res.status(500).send("Error uploading model metadata");
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});