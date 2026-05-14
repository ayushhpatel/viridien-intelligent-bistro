import { Router, Request, Response } from 'express';
import { menuData } from '../data/menu';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    // Return the full menu dataset in a structured JSON response
    res.json({
      success: true,
      data: menuData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve menu data.'
    });
  }
});

export default router;
