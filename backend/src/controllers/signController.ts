import { Request, Response } from 'express';
import { identifySignWithGemini } from '../services/geminiService';

export const identifySign = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const state = req.query.state as string;
    const mimeType = req.file.mimetype || 'image/jpeg';
    
    // Call Gemini AI service
    const aiResult = await identifySignWithGemini(
      req.file.buffer,
      mimeType,
      state
    );

    // TODO: Lookup additional info from database
    // const signDetails = await Sign.findOne({
    //   where: {
    //     name: aiResult.sign.name,
    //   },
    // });

    res.json({
      success: true,
      sign: aiResult.sign,
      // Include database details if found
      // stateSpecificInfo: signDetails?.state_variations?.[state] || {},
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error('Sign identification error:', error);
    res.status(500).json({ 
      error: 'Failed to identify sign',
      message: error.message 
    });
  }
};

export const getAllSigns = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database
    res.json({
      signs: [],
      total: 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSignById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Fetch from database
    res.json({
      sign: {
        id,
        name: 'Stop Sign',
        category: 'Regulatory',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    // TODO: Fetch from database
    res.json({
      category,
      signs: [],
      total: 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSign = async (req: Request, res: Response) => {
  try {
    // TODO: Create sign logic
    res.status(201).json({ message: 'Sign created' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
