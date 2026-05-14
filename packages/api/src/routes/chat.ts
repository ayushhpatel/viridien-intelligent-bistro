import { Router } from 'express';

const router = Router();

// Placeholder for chatting with AI
router.post('/', (req, res) => {
  const { message, currentCart } = req.body;
  res.json({
    reply: "This is a placeholder reply.",
    actions: []
  });
});

export default router;
