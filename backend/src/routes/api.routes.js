/**
 * API Proxy Routes
 * Handles FatSecret and Clarifai API proxying
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { oauth } = require('../config/oauth');
const { FATSECRET_API_URL, CLARIFAI_API_URL } = require('../config/constants');

/**
 * POST /api/fatsecret
 * Proxy requests to FatSecret API with OAuth 1.0a
 */
router.post('/fatsecret', async (req, res) => {
  if (!process.env.FATSECRET_KEY || !process.env.FATSECRET_SECRET) {
    return res.status(500).json({ 
      error: 'FatSecret API keys are not configured on the server. Please check your .env file.' 
    });
  }

  const { fatsecret_method, ...params } = req.body;

  if (!fatsecret_method) {
    return res.status(400).json({ error: '`fatsecret_method` is required in the request body' });
  }

  const requestData = {
    url: FATSECRET_API_URL,
    method: 'POST',
    data: {
      method: fatsecret_method,
      format: 'json',
      ...params
    },
  };

  console.log('[FatSecret] Proxying request:', requestData.data);

  try {
    const headers = {
      ...oauth.toHeader(oauth.authorize(requestData)),
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = new URLSearchParams(requestData.data).toString();

    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: headers,
      body: body,
    });

    const responseBodyText = await response.text();

    if (!response.ok) {
      console.error('[FatSecret] API Error Status:', response.status);
      console.error('[FatSecret] API Error Response:', responseBodyText);
      try {
        const errorJson = JSON.parse(responseBodyText);
        return res.status(response.status).json(errorJson);
      } catch (e) {
        return res.status(response.status).send(responseBodyText);
      }
    }
    
    const data = JSON.parse(responseBodyText);
    
    if (data.error) {
      console.error('[FatSecret] API Logic Error:', data.error.message);
      return res.status(400).json({ error: data.error.message });
    }
    
    res.status(200).json(data);

  } catch (error) {
    console.error('[FatSecret] Proxy Server Error:', error);
    return res.status(500).json({ error: 'An internal server error occurred while contacting the FatSecret API.' });
  }
});

/**
 * POST /api/clarifai
 * Proxy requests to Clarifai food recognition API
 */
router.post('/clarifai', async (req, res) => {
  if (!process.env.CLARIFAI_PAT) {
    return res.status(500).json({ 
      error: 'Clarifai PAT is not configured on the server. Please check your .env file.' 
    });
  }

  const { base64Image } = req.body;
  if (!base64Image) {
    return res.status(400).json({ error: 'base64Image is required' });
  }

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
      console.error('[Clarifai] API Error:', errorData);
      throw new Error(`Clarifai API request failed: ${errorData.status.description}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('[Clarifai] Proxy Server Error:', error);
    res.status(500).json({ error: 'An internal server error occurred while contacting the Clarifai API.' });
  }
});

module.exports = router;

