/**
 * Migration: Add Roles and Permissions
 * 
 * This migration:
 * 1. Sets isSuperuser to false for all existing users (except for the first user who becomes superuser)
 * 2. Creates ProjectMember records for existing projects (creator becomes admin)
 * 
 * Run with: npx ts-node -r tsconfig-paths/register apps/api/src/migrations/001-add-project-members.ts
 * 
 * Make sure to set environment variables or have .env.development file
 */

import { connect, set } from 'mongoose';
import { Logger } from 'tslog';

// Import schemas
import { User, Project, ProjectMember, ProjectRole } from '../schemas';

const log: Logger = new Logger();

async function runMigration() {
  const { DB_HOST, DB_PORT, DB_SCHEMA, DB_USERNAME, DB_PASSWORD } = process.env;
  
  // Use defaults if not set
  const host = DB_HOST || 'localhost';
  const port = DB_PORT || '27017';
  const schema = DB_SCHEMA || 'pfrog';
  const userName = DB_USERNAME || 'admin';
  const password = DB_PASSWORD || 'pfrogpswrd';
  
  log.info('Starting migration: Add Project Members');
  log.info(`Connecting to MongoDB at ${host}:${port}/${schema}`);
  
  try {
    // Connect to MongoDB
    set('strictQuery', false);
    await connect(`mongodb://${userName}:${password}@${host}:${port}/${schema}?authSource=admin`);
    log.info('Connected to MongoDB');
    
    // Step 1: Update all users to have isSuperuser = false by default
    log.info('Step 1: Setting isSuperuser = false for all users');
    const userUpdateResult = await User.updateMany(
      { isSuperuser: { $exists: false } },
      { $set: { isSuperuser: false } }
    );
    log.info(`Updated ${userUpdateResult.modifiedCount} users with isSuperuser = false`);
    
    // Make the first user (by creation date) a superuser
    const firstUser = await User.findOne().sort({ _id: 1 });
    if (firstUser) {
      await User.updateOne({ _id: firstUser._id }, { isSuperuser: true });
      log.info(`Made first user (${firstUser.userName}) a superuser`);
    }
    
    // Step 2: Create ProjectMember records for existing projects
    log.info('Step 2: Creating ProjectMember records for existing projects');
    
    const projects = await Project.find({});
    log.info(`Found ${projects.length} projects to process`);
    
    let membershipsCreated = 0;
    let membershipsSkipped = 0;
    
    for (const project of projects) {
      const creatorId = project.created_by;
      
      if (!creatorId) {
        log.warn(`Project ${project._id} has no created_by, skipping`);
        membershipsSkipped++;
        continue;
      }
      
      // Check if membership already exists
      const existingMembership = await ProjectMember.findOne({
        project: project._id,
        user: creatorId
      });
      
      if (existingMembership) {
        log.debug(`Membership already exists for project ${project._id}, user ${creatorId}`);
        membershipsSkipped++;
        continue;
      }
      
      // Create admin membership for the creator
      await ProjectMember.create({
        project: project._id,
        user: creatorId,
        role: ProjectRole.ADMIN
      });
      
      membershipsCreated++;
      log.info(`Created admin membership for project ${project._id}, user ${creatorId}`);
    }
    
    log.info(`Migration complete!`);
    log.info(`- Memberships created: ${membershipsCreated}`);
    log.info(`- Memberships skipped (already exist): ${membershipsSkipped}`);
    
    // Disconnect
    process.exit(0);
  } catch (error) {
    log.error(`Migration failed: ${error}`);
    process.exit(1);
  }
}

// Run the migration
runMigration();
