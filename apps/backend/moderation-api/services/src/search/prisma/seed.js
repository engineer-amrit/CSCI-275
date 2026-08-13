require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.restaurant.createMany({
    data: [
      { name: "Sakura Japanese", cuisine: "Japanese", price: "$$", rating: 4.5, location: "Vancouver, BC", description: "Authentic Japanese cuisine with fresh sushi and ramen." },
      { name: "Luigi's Trattoria", cuisine: "Italian", price: "$$$", rating: 4.2, location: "Burnaby, BC", description: "Family-owned Italian restaurant with homemade pasta." },
      { name: "Spice Garden", cuisine: "Indian", price: "$", rating: 4.7, location: "Surrey, BC", description: "Vibrant Indian street food and curries." },
      { name: "The Burger Joint", cuisine: "American", price: "$", rating: 3.9, location: "Vancouver, BC", description: "Classic smash burgers and hand-cut fries." },
      { name: "La Maison", cuisine: "French", price: "$$$$", rating: 4.8, location: "Vancouver, BC", description: "Upscale French dining with seasonal tasting menus." },
      { name: "Green Bowl", cuisine: "Vegan", price: "$$", rating: 4.3, location: "Burnaby, BC", description: "Plant-based bowls and smoothies." },
      { name: "Taco Loco", cuisine: "Mexican", price: "$", rating: 4.1, location: "Richmond, BC", description: "Authentic street tacos and margaritas." },
      { name: "Golden Dragon", cuisine: "Chinese", price: "$$", rating: 4.4, location: "Vancouver, BC", description: "Traditional dim sum and Cantonese dishes." },
    ]
  });
  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());