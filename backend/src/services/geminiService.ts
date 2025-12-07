import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SignIdentificationResult {
  sign: {
    name: string;
    category: string;
    mutcdCode?: string;
    confidence: number;
    explanation: string;
  };
  alternatives?: Array<{
    name: string;
    confidence: number;
  }>;
}

export const identifySignWithGemini = async (
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg',
  state?: string
): Promise<SignIdentificationResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const base64Image = imageBuffer.toString('base64');

    const prompt = `You are a traffic sign identification expert. Analyze this traffic sign image and provide:
1. The exact name of the sign (e.g., "Stop Sign", "Yield Sign", "Speed Limit 25")
2. The category (Warning, Regulatory, Guide, Temporary, School, Bicycle, or Informational)
3. The MUTCD code if applicable (e.g., R1-1, W1-1)
4. A brief explanation of what it means and the driver action required
5. Your confidence level (0-100)

${state ? `Focus on variations specific to ${state}.` : ''}

Respond in JSON format only:
{
  "name": "Sign Name",
  "category": "Category",
  "mutcdCode": "Code",
  "explanation": "What does it mean and what action to take",
  "confidence": 95,
  "alternatives": [
    {"name": "Alternative Sign", "confidence": 20}
  ]
}`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      sign: {
        name: parsed.name || 'Unknown Sign',
        category: parsed.category || 'Regulatory',
        mutcdCode: parsed.mutcdCode,
        confidence: parsed.confidence || 75,
        explanation: parsed.explanation || 'Sign identified via Gemini API',
      },
      alternatives: parsed.alternatives || [],
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini identification failed: ${error.message}`);
  }
};

// Alternative using vision-only endpoint
export const identifySignWithGeminiVision = async (
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg',
  state?: string
): Promise<SignIdentificationResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this traffic sign image and identify:
1. Sign name
2. Sign category (Warning/Regulatory/Guide/Temporary/School)
3. MUTCD code (if applicable)
4. Meaning and driver action
5. Confidence (0-100)

${state ? `Consider ${state} specific rules.` : ''}

Format: {"name": "...", "category": "...", "mutcdCode": "...", "explanation": "...", "confidence": ...}`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      sign: {
        name: parsed.name || 'Unknown Sign',
        category: parsed.category || 'Regulatory',
        mutcdCode: parsed.mutcdCode,
        confidence: parsed.confidence || 70,
        explanation: parsed.explanation || 'Sign identified',
      },
    };
  } catch (error: any) {
    console.error('Gemini Vision Error:', error);
    throw new Error(`Vision identification failed: ${error.message}`);
  }
};
