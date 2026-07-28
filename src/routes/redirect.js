const { Router } = require('express');
const urlService = require('../services/urlService');
const { NotFoundError } = require('../errors');

const router = Router();

router.get('/:shortCode', async (req, res) => {
  try {
    const originalUrl = await urlService.redirect(req.params.shortCode);
    res.redirect(301, originalUrl);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'URL not found' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
