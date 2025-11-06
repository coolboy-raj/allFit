require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001; // We'll run this on a separate port from the frontend

app.use(cors()); // Allow requests from your frontend (running on a different port)
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// --- OAuth 1.0a Setup for FatSecret ---
// This uses the same logic as the Vercel function
const oauth = OAuth({
    consumer: {
        key: process.env.FATSECRET_KEY,
        secret: process.env.FATSECRET_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
    },
});

// --- FatSecret Proxy Endpoint ---
app.post('/api/fatsecret', async (req, res) => {
    if (!process.env.FATSECRET_KEY || !process.env.FATSECRET_SECRET) {
        return res.status(500).json({ error: 'FatSecret API keys are not configured on the server. Please check your .env file.' });
    }

    const { fatsecret_method, ...params } = req.body;

    if (!fatsecret_method) {
        return res.status(400).json({ error: '`fatsecret_method` is required in the request body' });
    }

    const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

    const requestData = {
        url: FATSECRET_API_URL,
        method: 'POST',
        data: {
            method: fatsecret_method,
            format: 'json',
            ...params
        },
    };

    console.log('Proxying request to FatSecret:', requestData.data);

    try {
        const headers = {
            ...oauth.toHeader(oauth.authorize(requestData)),
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const body = new URLSearchParams(requestData.data).toString();

        console.log('Final URL-encoded body sent to FatSecret:', body);

        const response = await fetch(requestData.url, {
            method: requestData.method,
            headers: headers,
            body: body,
        });

        const responseBodyText = await response.text();

        if (!response.ok) {
            console.error('FatSecret API Error Status:', response.status);
            console.error('FatSecret API Error Response:', responseBodyText);
            // Try to parse as JSON for a structured error, but fall back to text
            try {
                const errorJson = JSON.parse(responseBodyText);
                return res.status(response.status).json(errorJson);
            } catch (e) {
                return res.status(response.status).send(responseBodyText);
            }
        }
        
        const data = JSON.parse(responseBodyText);
        
        if (data.error) {
            console.error('FatSecret API Logic Error:', data.error.message);
            return res.status(400).json({ error: data.error.message });
        }
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Server Error (FatSecret):', error);
        return res.status(500).json({ error: 'An internal server error occurred while contacting the FatSecret API.' });
    }
});


// --- Clarifai Proxy Endpoint ---
app.post('/api/clarifai', async (req, res) => {
    if (!process.env.CLARIFAI_PAT) {
        return res.status(500).json({ error: 'Clarifai PAT is not configured on the server. Please check your .env file.' });
    }

    const { base64Image } = req.body;
    if (!base64Image) {
        return res.status(400).json({ error: 'base64Image is required' });
    }

    const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/outputs';

    const requestBody = {
        "inputs": [
            { "data": { "image": { "base64": base64Image } } }
        ]
    };

    try {
        const response = await fetch(CLARIFAI_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Key ${process.env.CLARIFAI_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Clarifai API Error:', errorData);
            throw new Error(`Clarifai API request failed: ${errorData.status.description}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Server Error (Clarifai):', error);
        res.status(500).json({ error: 'An internal server error occurred while contacting the Clarifai API.' });
    }
});


app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
    console.log('Ensure your API keys are set in backend/.env');
});
