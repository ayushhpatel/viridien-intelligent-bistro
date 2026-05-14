import { Router, Request, Response } from 'express';
import { parseChatRequest } from '../services/ai/parser';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, currentCart } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        reply: "Invalid message format.",
        actions: []
      });
    }

    const cartState = Array.isArray(currentCart) ? currentCart : [];

    // Call the AI Service
    const aiResponse = await parseChatRequest(message, cartState);

    return res.json(aiResponse);
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({
      reply: "An internal server error occurred while processing your request.",
      actions: []
    });
  }
});

export default router;
