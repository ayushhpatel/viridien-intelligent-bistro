import { Router } from 'express';

const router = Router();

// Placeholder for getting the menu
router.get('/', (req, res) => {
  res.json({
    categories: [],
    items: []
  });
});

export default router;
