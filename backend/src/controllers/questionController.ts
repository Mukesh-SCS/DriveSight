import { Request, Response } from 'express';

export const getQuestionsByState = async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    // TODO: Fetch from database
    res.json({
      state,
      questions: [],
      total: 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    // TODO: Fetch from database
    res.json({
      state,
      categories: [
        { id: 1, name: 'Warning Signs' },
        { id: 2, name: 'Regulatory Signs' },
        { id: 3, name: 'Guide Signs' },
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { state, category } = req.params;
    // TODO: Fetch from database
    res.json({
      state,
      category,
      questions: [],
      total: 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    // TODO: Create question logic
    res.status(201).json({ message: 'Question created' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
