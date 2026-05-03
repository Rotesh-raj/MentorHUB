#!/usr/bin/env node

/**
 * update-superadmin.js  (v2)
 *
 * Safely updates the existing SuperAdmin account.
 * Handles the case where the target email already exists in the DB
 * (removes the duplicate first, then updates).
 *
 * Run from /backend: node update-superadmin.js
 */

import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import bcrypt   from 'bcryptjs';
import User     from './models/User.js';

dotenv.config({ path: './.env' });

const NEW_EMAIL    = 'dsiconnection.project@gmail.com';
const NEW_PASSWORD = 'Riteshraj800@';

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected\n');

    /* ── 1. Find existing superadmin ── */
    const superadmin = await User.findOne({ role: 'superadmin' });
    if (!superadmin) {
      console.error('❌ No superadmin found. Run node seed-superadmin.js first.');
      process.exit(1);
    }

    console.log('🔍 Existing SuperAdmin:');
    console.log('   _id   :', superadmin._id.toString());
    console.log('   email :', superadmin.email);
    console.log('   role  :', superadmin.role);
    console.log('');

    /* ── 2. Check if NEW_EMAIL already belongs to a DIFFERENT document ── */
    const emailConflict = await User.findOne({
      email: NEW_EMAIL,
      _id: { $ne: superadmin._id }  // not the superadmin itself
    });

    if (emailConflict) {
      console.log('⚠️  Conflict: email already used by another account.');
      console.log('   _id  :', emailConflict._id.toString());
      console.log('   role :', emailConflict.role);
      console.log('   email:', emailConflict.email);
      console.log('');
      console.log('🗑️  Removing conflicting account...');
      await User.deleteOne({ _id: emailConflict._id });
      console.log('✅ Conflicting account removed.\n');
    }

    /* ── 3. Hash new password ── */
    // Use updateOne (bypasses pre-save hook) + manual bcrypt hash
    // to guarantee exactly ONE hash round.
    const salt       = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(NEW_PASSWORD, salt);

    /* ── 4. Update the superadmin document ── */
    await User.updateOne(
      { _id: superadmin._id },
      {
        $set: {
          email:      NEW_EMAIL,
          password:   hashedPass,
          isApproved: true,
          role:       'superadmin'   // ensure lowercase stays intact
        }
      }
    );

    /* ── 5. Verify ── */
    const updated = await User.findById(superadmin._id).select('+password');

    const passwordOk = await bcrypt.compare(NEW_PASSWORD, updated.password);

    console.log('✅ SuperAdmin updated!');
    console.log('   Name      :', updated.name);
    console.log('   Email     :', updated.email);
    console.log('   Role      :', updated.role);
    console.log('   isApproved:', updated.isApproved);
    console.log('');

    if (passwordOk) {
      console.log('🔐 Password hash check: ✅ PASS');
    } else {
      console.error('🔐 Password hash check: ❌ FAIL');
      process.exit(1);
    }

    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Email   :', NEW_EMAIL);
    console.log('   Password:', NEW_PASSWORD);
    console.log('');
    console.log('🌐 Test: POST http://localhost:5000/api/auth/login');

  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
};

run();
