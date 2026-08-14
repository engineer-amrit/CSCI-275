const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo data for the Restaurant Moderation System...');

  await prisma.reviewResponse.deleteMany({});
  await prisma.reviewFlag.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.businessVerification.deleteMany({});
  await prisma.restaurantTag.deleteMany({});
  await prisma.restaurantHours.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.vendorNotification.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🗑️  Cleared existing data.');

  const customers = [
    { id: 'demo-customer-01', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    { id: 'demo-customer-02', name: 'Mike Chen', email: 'mike.chen@example.com' },
    { id: 'demo-customer-03', name: 'Emily Davis', email: 'emily.d@example.com' },
    { id: 'demo-customer-04', name: 'James Wilson', email: 'james.w@example.com' },
    { id: 'demo-customer-05', name: 'Lisa Park', email: 'lisa.p@example.com' },
    { id: 'demo-customer-06', name: 'David Brown', email: 'david.b@example.com' },
    { id: 'demo-customer-07', name: 'Anna Nguyen', email: 'anna.n@example.com' },
    { id: 'demo-customer-08', name: 'Tom Reyes', email: 'tom.r@example.com' },
  ];

  for (const cust of customers) {
    await prisma.user.create({
      data: {
        id: cust.id,
        email: cust.email,
        password: 'hashedpassword123',
        name: cust.name,
        role: 'CUSTOMER',
      },
    });
  }

  const vendorUser = await prisma.user.create({
    data: {
      id: 'demo-vendor-01',
      email: 'vendor@example.com',
      password: 'hashedpassword123',
      name: 'Demo Vendor',
      role: 'VENDOR',
    },
  });

  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: 'Demo Vendor Co.',
      verificationStatus: 'VERIFIED',
      businessEmail: 'vendor@example.com',
      businessPhone: '604-555-0100',
    },
  });

  const restaurants = [
    {
      id: 'demo-rest-01',
      name: 'The Old Spaghetti Factory',
      cuisine: 'Italian',
      description: 'Classic Italian-American pasta, generous portions and warm service.',
      street: '53 Water St',
      city: 'Vancouver',
      zipcode: 'V6B 1A1',
      priceLevel: 2,
      verified: true,
    },
    {
      id: 'demo-rest-02',
      name: 'Japadog Yaletown',
      cuisine: 'Japanese',
      description: 'Japanese hot dogs with a creative twist, right downtown.',
      street: '530 Robson St',
      city: 'Vancouver',
      zipcode: 'V6B 2B7',
      priceLevel: 1,
      verified: false,
    },
    {
      id: 'demo-rest-03',
      name: 'Cardero Brewing Co.',
      cuisine: 'Pub Food',
      description: 'Waterfront brewpub with fresh beer and pub classics.',
      street: '1583 Coal Harbour Quay',
      city: 'Vancouver',
      zipcode: 'V6G 3E7',
      priceLevel: 3,
      verified: false,
    },
    {
      id: 'demo-rest-04',
      name: 'Buddha-Full Vegan Kitchen',
      cuisine: 'Vegan',
      description: 'Plant-based comfort food. The service was an absolute trash, and the menu is stupid.',
      street: '4173 Main St',
      city: 'Vancouver',
      zipcode: 'V5V 3P8',
      priceLevel: 2,
      verified: false,
    },
    {
      id: 'demo-rest-05',
      name: 'Maple & Sea Chophouse',
      cuisine: 'Steakhouse',
      description: 'Premium steaks and seafood with an elegant waterfront view.',
      street: '750 Hornby St',
      city: 'Vancouver',
      zipcode: 'V6Z 2H7',
      priceLevel: 3,
      verified: true,
    },
    {
      id: 'demo-rest-06',
      name: 'Taco Time Metrotown',
      cuisine: 'Mexican',
      description: 'Fast, fresh tacos and burritos in a casual setting.',
      street: '4700 Kingsway',
      city: 'Burnaby',
      zipcode: 'V5H 4M1',
      priceLevel: 1,
      verified: true,
    },
  ];

  for (const rest of restaurants) {
    const { verified, ...data } = rest;
    const created = await prisma.restaurant.create({
      data: {
        ...data,
        isClaimed: true,
        vendorId: vendor.id,
        phone: '604-555-0100',
        email: `hello@${rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example`,
      },
    });

    if (verified) {
      await prisma.businessVerification.create({
        data: {
          restaurantId: created.id,
          documentUrl: 'demo/business-license.pdf',
          status: 'VERIFIED',
        },
      });
    }
  }

  const comments = [
    'Absolutely loved the atmosphere and the food was incredible!',
    'Great service, but the wait time was a bit long.',
    'Best meal I have had in Vancouver. Highly recommend!',
    'The staff was so friendly and accommodating.',
    'Will definitely be coming back here with my family.',
    'Amazing flavors! You can tell they use fresh ingredients.',
    'Good value for money. Perfect for a quick lunch.',
    'The view from the table was stunning, and the food matched it.',
    'Solid choice for a casual dinner with friends.',
    'Fresh ingredients and consistent quality every time.',
  ];

  const reviewPlan = {
    'demo-rest-01': [4, 5, 3, 5, 4, 4],
    'demo-rest-02': [4, 5, 4, 5, 4, 5],
    'demo-rest-03': [2, 3, 2],
    'demo-rest-04': [3, 4],
    'demo-rest-05': [5, 4, 5, 4, 5, 4],
    'demo-rest-06': [4, 5, 4],
  };

  let customerCursor = 0;
  let totalReviews = 0;
  for (const [restaurantId, ratings] of Object.entries(reviewPlan)) {
    for (const rating of ratings) {
      const customer = customers[customerCursor % customers.length];
      customerCursor++;
      await prisma.review.create({
        data: {
          restaurantId,
          userId: customer.id,
          rating,
          comment: comments[customerCursor % comments.length],
        },
      });
      totalReviews++;
    }
  }

  console.log(`✅ Seeding complete!`);
  console.log(`   - ${restaurants.length} restaurants`);
  console.log(`   - ${totalReviews} reviews`);
  console.log(`   - Verified: The Old Spaghetti Factory, Maple & Sea Chophouse, Taco Time Metrotown`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
