require('dotenv').config();
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET all restaurants (with search, filter, sort)
router.get('/', async (req, res) => {
  const { search, cuisine, price, rating, sort } = req.query;

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { cuisine: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
          cuisine ? { cuisine: { contains: cuisine, mode: 'insensitive' } } : {},
          price ? { price: price } : {},
          rating ? { rating: { gte: parseFloat(rating) } } : {},
        ]
      },
      orderBy: sort === 'newest' ? { createdAt: 'desc' } : { rating: 'desc' },
    });

    res.json(restaurants);
  } catch (error) {
    res.sendStatus(500);
  }
});

// GET a single restaurant by id
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!restaurant) return res.sendStatus(404);
    res.json(restaurant);
  } catch (error) {
    res.sendStatus(500);
  }
});

// POST a new restaurant
router.post('/', async (req, res) => {
  const { name, cuisine, price, rating, location, description } = req.body;
  try {
    const restaurant = await prisma.restaurant.create({
      data: { name, cuisine, price, rating, location, description }
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;