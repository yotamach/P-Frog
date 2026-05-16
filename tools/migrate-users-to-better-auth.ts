/**
 * One-time migration: copies existing Mongoose users into better-auth's
 * `user` and `account` collections, preserving bcrypt password hashes
 * so existing users can still log in with their current passwords.
 *
 * Run with:
 *   npx tsx -r tsconfig-paths/register --tsconfig apps/api/tsconfig.app.json tools/migrate-users-to-better-auth.ts
 *
 * Requires: apps/api/.env.development to be populated.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

config({ path: path.resolve(__dirname, '../apps/api/.env.development') });

const {
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'pfrogpswrd',
  DB_SCHEMA = 'pfrog',
} = process.env;

const MONGO_URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_SCHEMA}?authSource=admin`;

async function migrate() {
  console.log('Connecting to MongoDB…');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_SCHEMA);

  const usersCollection = db.collection('users');
  const baUserCollection = db.collection('user');
  const baAccountCollection = db.collection('account');

  const existingUsers = await usersCollection.find({}).toArray();
  console.log(`Found ${existingUsers.length} users to migrate.`);

  let migrated = 0;
  let skipped = 0;

  for (const user of existingUsers) {
    const userId = String(user._id);

    const alreadyExists = await baUserCollection.findOne({ id: userId });
    if (alreadyExists) {
      console.log(`  SKIP  ${user.email} — already in better-auth`);
      skipped++;
      continue;
    }

    const now = new Date();
    const nameParts = [user.firstName, user.lastName].filter(Boolean);
    const name = nameParts.join(' ') || user.email;

    await baUserCollection.insertOne({
      id: userId,
      email: user.email,
      emailVerified: true,
      name,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'member',
      createdAt: user.createdAt || now,
      updatedAt: now,
    });

    await baAccountCollection.insertOne({
      id: `${userId}-credential`,
      userId,
      accountId: user.email,
      providerId: 'credential',
      password: user.password,
      createdAt: user.createdAt || now,
      updatedAt: now,
    });

    console.log(`  OK    ${user.email}`);
    migrated++;
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}`);
  await client.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
