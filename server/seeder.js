const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Package = require('./models/Package');
require('dotenv').config();

const connectDB = require('./config/db');

const samplePackages = [
  {
    title: 'Bali Paradise Adventure',
    location: 'Bali, Indonesia',
    price: 1299,
    description: 'Experience the perfect blend of culture, adventure, and relaxation in beautiful Bali. Visit ancient temples, explore rice terraces, and unwind on pristine beaches.',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
  },
  {
    title: 'Swiss Alps Explorer',
    location: 'Swiss Alps, Switzerland',
    price: 2499,
    description: 'Discover the majestic Swiss Alps with breathtaking mountain views, charming villages, and world-class hiking trails. Perfect for nature lovers and adventure seekers.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    title: 'Tokyo Urban Experience',
    location: 'Tokyo, Japan',
    price: 1899,
    description: 'Immerse yourself in the vibrant culture of Tokyo. From traditional temples to modern skyscrapers, experience the perfect blend of old and new Japan.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
  },
  {
    title: 'Santorini Sunset Getaway',
    location: 'Santorini, Greece',
    price: 1699,
    description: 'Experience the magic of Santorini with its iconic white buildings, stunning sunsets, and crystal-clear waters. A romantic paradise in the Mediterranean.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    title: 'Machu Picchu Discovery',
    location: 'Machu Picchu, Peru',
    price: 2199,
    description: 'Explore the ancient Incan citadel of Machu Picchu, one of the most impressive archaeological sites in the world. A journey through history and culture.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    title: 'New York City Adventure',
    location: 'New York City, USA',
    price: 1599,
    description: 'Experience the city that never sleeps! From Times Square to Central Park, discover the energy and excitement of the Big Apple.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Package.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@travelagency.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();
    console.log('Created regular user');

    // Create packages
    const packagesWithCreator = samplePackages.map(pkg => ({
      ...pkg,
      createdBy: adminUser._id
    }));

    await Package.insertMany(packagesWithCreator);
    console.log('Created sample packages');

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin - Email: admin@travelagency.com, Password: admin123');
    console.log('User - Email: user@example.com, Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
