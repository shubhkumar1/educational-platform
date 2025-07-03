import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Proper client initialization
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate a response from the AI model
// @route   POST /api/ai/chat
export const generateChatResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'A prompt is required.' });
    }

    // Use generateContent directly with model name
    const result = await genAI.models.generateContent({
    //   model: 'models/gemini-2.0-flash-lite',
      model: 'models/gemini-2.0-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Fix: The result object structure may differ; check for candidates
    let text = '';
    if (result && result.candidates && result.candidates.length > 0) {
      text = result.candidates[0].content.parts[0].text;
    } else {
      text = 'No response from AI model.';
    }
    
    res.json({ response: text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Failed to get response from AI model.' });
  }
};