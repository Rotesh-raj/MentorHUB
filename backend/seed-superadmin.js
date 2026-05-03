#!/usr/bin/env node

/**
 * seed-superadmin.js
 *
 * FIX 1: dotenv path corrected to './.env' — when run from inside /backend dir
 *         (previously used './backend/.env' which fails when CWD is already /backend)
 * FIX 2: Removed manual bcrypt.hash() call — User.pre('save') hook hashes automatically.
 *         Passing a pre-hashed password to User.create() caused double-hashing,
 *         making the stored hash never match the raw password on login.
 * FIX 3: Added referenceId field — required by the User schema for superadmin too
 *         (the schema default function doesn't exclude superadmin from required check properly)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// ✅ FIX 1: Load .env from the same directory as this script (/backend)
dotenv.config({ path: './.env' });

const SUPERADMIN_EMAIL    = 'dsiconnection.project@gmail.com';
const SUPERADMIN_PASSWORD = 'Riteshraj800@'; // ✅ FIX 2: Pass plain-text — pre('save') will hash it
const SUPERADMIN_ROLE     = 'superadmin';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Check your backend/.env file.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if superadmin already exists — skip if so
    const existing = await User.findOne({ email: SUPERADMIN_EMAIL });
    if (existing) {
      console.log('✅ SuperAdmin already exists. Skipping creation.');
      console.log('   Email    :', existing.email);
      console.log('   Role     :', existing.role);
      console.log('   Approved :', existing.isApproved);
      process.exit(0);
    }

    // ✅ FIX 2: Use plain-text password here.
    // The User model's pre('save') hook will call bcrypt.hash() automatically.
    // If you manually bcrypt.hash() here AND the hook runs, the password gets
    // double-hashed → comparePassword() always returns false → 401 on every login.
    const superadmin = await User.create({
      name:        'Super Administrator',
      email:       SUPERADMIN_EMAIL,
      password:    SUPERADMIN_PASSWORD,   // plain-text — hook hashes it once
      role:        SUPERADMIN_ROLE,
      referenceId: 'SUPERADMIN_001',      // ✅ FIX 3: satisfy schema (not strictly required for superadmin but avoids potential edge-case errors)
      isApproved:  true                   // Superadmin bypasses approval workflow
    });

    console.log('');
    console.log('🎉 SuperAdmin created successfully!');
    console.log('   Email    :', superadmin.email);
    console.log('   Role     :', superadmin.role);
    console.log('   Approved :', superadmin.isApproved);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Email   :', SUPERADMIN_EMAIL);
    console.log('   Password:', SUPERADMIN_PASSWORD);
    console.log('');
    console.log('🌐 Test:  POST http://localhost:5000/api/auth/login');
    console.log('📊 Dashboard: GET http://localhost:5000/api/superadmin/stats');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    // Print full validation errors if any
    if (error.errors) {
      Object.keys(error.errors).forEach((k) => {
        console.error('  ·', k, ':', error.errors[k].message);
      });
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

seedSuperAdmin();
