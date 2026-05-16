import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { magicLink, twoFactor } from 'better-auth/plugins';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { Logger } from 'tslog';
import { User } from '@schemas';
import { SystemRole } from '@p-frog/data';

const log = new Logger({ name: 'BetterAuth' });

const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const createAuth = () => {
  const db = mongoose.connection.getClient().db();

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3333',
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          try {
            const transporter = createTransport();
            await transporter.sendMail({
              from: process.env.SMTP_FROM || 'noreply@p-frog.com',
              to: email,
              subject: 'P-Frog Magic Link',
              html: `<p>Click <a href="${url}">here</a> to sign in to P-Frog.</p><p>This link expires in 5 minutes.</p>`,
            });
            log.info(`Magic link sent to ${email}`);
          } catch (err) {
            log.error(`Failed to send magic link to ${email}: ${err}`);
            throw err;
          }
        },
      }),
      twoFactor(),
    ],

    user: {
      additionalFields: {
        firstName: { type: 'string', required: false },
        lastName: { type: 'string', required: false },
        role: {
          type: 'string',
          defaultValue: SystemRole.MEMBER,
          input: false,
        },
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },

    trustedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:4200',
    ],

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            try {
              const existing = await User.findById(user.id).exec();
              if (!existing) {
                const nameParts = (user.name || '').split(' ');
                const firstName = (user as any).firstName || nameParts[0] || '';
                const lastName = (user as any).lastName || nameParts.slice(1).join(' ') || '';
                await User.create({
                  _id: user.id,
                  email: user.email,
                  firstName,
                  lastName,
                  userName: user.email,
                  password: 'managed-by-better-auth',
                  role: (user as any).role || SystemRole.MEMBER,
                });
                log.info(`Synced better-auth user ${user.id} to User model`);
              }
            } catch (err) {
              log.error(`Failed to sync user to User model: ${err}`);
            }
          },
        },
      },
    },
  });
};

export type Auth = ReturnType<typeof createAuth>;
