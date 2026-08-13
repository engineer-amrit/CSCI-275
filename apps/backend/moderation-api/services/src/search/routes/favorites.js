require('dotenv').config();
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET all favorites for a user
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: { restaurant: true }
    });
    res.json(favorites);
  } catch (error) {
    res.sendStatus(500);
  }
});

// POST a new favorite
router.post('/', async (req, res) => {
  const { userId, restaurantId } = req.body;
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        restaurantId: parseInt(restaurantId)
      }
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.sendStatus(500);
  }
});

// DELETE a favorite
router.delete('/:id', async (req, res) => {
  try {
    await prisma.favorite.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;