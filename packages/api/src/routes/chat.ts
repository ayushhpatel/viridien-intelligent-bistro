import { Router, Request, Response } from 'express';
import { parseChatRequest } from '../services/ai/parser';
import { ChatRequestSchema } from '../validators/ai';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsedRequest = ChatRequestSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      return res.status(400).json({
        reply: "I couldn't understand that request. Please try again with a short message.",
        actions: []
      });
    }

    const aiResponse = await parseChatRequest(
      parsedRequest.data.message,
      parsedRequest.data.currentCart
    );

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
