import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const seedDatabase = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount === 0) {
      console.log('No admin found. Seeding default admin...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        username: 'admin',
        email: 'admin@cyoa.com',
        password: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Default Admin created: admin@cyoa.com / admin123');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

export default seedDatabase;
