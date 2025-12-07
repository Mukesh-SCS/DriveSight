# Gemini API Integration Guide

Quick setup for using Google Gemini API for traffic sign recognition.

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" 
3. Create a new API key in your Google Cloud project
4. Copy the API key

## Step 2: Add to Environment Variables

### Backend Setup

**File:** `backend/.env`

```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
```

**Replace `your_gemini_api_key_here` with your actual Gemini API key**

### Verify the file exists

```bash
cd backend
cat .env
# Should show: GEMINI_API_KEY=sk-...
```

## Step 3: Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

Or with yarn:
```bash
yarn add @google/generative-ai
```

## Step 4: Test Gemini Integration

### Option A: Test via API Endpoint

```bash
# Start backend server
cd backend
npm run dev

# In another terminal, test the sign identification
curl -X POST http://localhost:3000/api/sign/identify \
  -F "file=@path/to/your/sign/image.jpg"
```

### Option B: Test with Node Script

Create `test-gemini.js`:

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  // Read image file
  const imageBuffer = fs.readFileSync('path/to/test-sign.jpg');
  const base64Image = imageBuffer.toString('base64');

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    },
    'What traffic sign is in this image?',
  ]);

  console.log(result.response.text());
}

testGemini().catch(console.error);
```

Run it:
```bash
export GEMINI_API_KEY=your_key_here
node test-gemini.js
```

## Step 5: Frontend Integration

The frontend automatically uses the backend API. Just upload an image:

```bash
cd drivesight-app
npm run start
```

Then in the app:
1. Click "Scan" tab
2. Click "Pick from Gallery"
3. Select a traffic sign image
4. View results!

## API Endpoints Using Gemini

### Identify a Sign

```bash
POST /api/sign/identify
Content-Type: multipart/form-data

{
  file: <image_file>,
  state: "CA" (optional)
}

Response:
{
  "success": true,
  "sign": {
    "name": "Stop Sign",
    "category": "Regulatory",
    "mutcdCode": "R1-1",
    "confidence": 95,
    "explanation": "Stop signs require a complete stop..."
  },
  "timestamp": "2025-12-07T..."
}
```

## Gemini Models Available

```typescript
// Latest & best quality
'gemini-1.5-flash'        // Fast, good for most cases

// Alternative options
'gemini-pro-vision'       // Vision-only model
'gemini-1.5-pro'          // More powerful, higher cost
```

## Cost Estimation

### Gemini Pricing (as of Dec 2025)
- **Input**: $0.075 per 1M tokens
- **Output**: $0.3 per 1M tokens
- **Images**: Included in token count

### Estimated costs for DriveSight
- 100 sign scans/day: ~$0.10/day = $3/month
- 1,000 sign scans/day: ~$1/day = $30/month

## Troubleshooting

### Error: "Cannot find module '@google/generative-ai'"
```bash
cd backend
npm install @google/generative-ai
npm run build
```

### Error: "API Key not valid"
- Verify API key is correct
- Check it's in `backend/.env`
- Restart the backend server
- Ensure quotes are not included: `GEMINI_API_KEY=key` not `GEMINI_API_KEY="key"`

### Error: "Image format not supported"
Supported formats:
- JPEG
- PNG
- WebP
- HEIC

Make sure your image is one of these formats.

### Rate Limiting
- Gemini has rate limits: ~60 requests/minute
- Implement caching to avoid duplicate requests
- See caching implementation in `AI_INTEGRATION.md`

## Alternative Models

If Gemini doesn't work, switch to:

### OpenAI Vision (in `backend/src/services/aiService.ts`)
```bash
npm install openai
export OPENAI_API_KEY=sk-...
```

### Google Cloud Vision (in `backend/src/services/googleVisionService.ts`)
```bash
npm install @google-cloud/vision
```

## Next Steps

1. ✅ Add API key to `.env`
2. ✅ Install Gemini SDK
3. ✅ Test with sample images
4. ✅ Deploy backend
5. Start using in your app!

## Code Examples

### Using in Your Backend

```typescript
// src/services/geminiService.ts is already set up
// Just import and use:

import { identifySignWithGemini } from '../services/geminiService';

const result = await identifySignWithGemini(
  imageBuffer,
  'image/jpeg',
  'CA'  // optional state
);

console.log(result.sign.name);        // "Stop Sign"
console.log(result.sign.confidence);  // 95
console.log(result.sign.explanation); // "..."
```

### Using in Your Frontend

```typescript
// drivesight-app/src/screens/SignScanScreen.tsx
const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'sign.jpg',
  } as any);

  // Optional: pass state for state-specific info
  const response = await fetch(
    `http://localhost:3000/api/sign/identify?state=CA`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const result = await response.json();
  // result.sign has: name, category, mutcdCode, confidence, explanation
};
```

## Support

For Gemini API help:
- [Google AI Documentation](https://ai.google.dev)
- [Gemini API Docs](https://ai.google.dev/tutorials/rest_quickstart)
- [Models List](https://ai.google.dev/models)

---

**You're all set to use Gemini!** 🚀
