// seeders/seedCategories.js
const { sequelize } = require('../database/db');
const Category = require('../models/Category');

const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'income', createdBy: null },
  { name: 'Freelance', type: 'income', createdBy: null },
  { name: 'Investment', type: 'income', createdBy: null },
  { name: 'Business', type: 'income', createdBy: null },
  { name: 'Gift', type: 'income', createdBy: null },
  { name: 'Bonus', type: 'income', createdBy: null },
  { name: 'Other Income', type: 'income', createdBy: null },
  
  // Expense categories
  { name: 'Groceries', type: 'expense', createdBy: null },
  { name: 'Shopping', type: 'expense', createdBy: null },
  { name: 'Bills', type: 'expense', createdBy: null },
  { name: 'Healthcare', type: 'expense', createdBy: null },
  { name: 'Transportation', type: 'expense', createdBy: null },
  { name: 'Entertainment', type: 'expense', createdBy: null },
  { name: 'Education', type: 'expense', createdBy: null },
  { name: 'Food & Dining', type: 'expense', createdBy: null },
  { name: 'Utilities', type: 'expense', createdBy: null },
  { name: 'Rent', type: 'expense', createdBy: null },
  { name: 'Insurance', type: 'expense', createdBy: null },
  { name: 'Clothing', type: 'expense', createdBy: null },
  { name: 'Personal Care', type: 'expense', createdBy: null },
  { name: 'Other Expense', type: 'expense', createdBy: null }
];

const seedCategories = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync the Category model
    await Category.sync({ force: false });

    // Check if categories already exist
    const existingCount = await Category.count();
    
    if (existingCount > 0) {
      console.log('Categories already exist. Skipping seed.');
      process.exit(0);
    }

    // Bulk create categories
    await Category.bulkCreate(defaultCategories);
    console.log('Default categories seeded successfully!');
    
    // Display created categories
    const categories = await Category.findAll();
    console.log(`Total categories created: ${categories.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seeder
seedCategories();