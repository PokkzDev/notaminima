import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { prisma } from './prisma';
import { normalizeEmail } from './validation';

export async function hashPassword(password) {
  return hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return compare(password, hashedPassword);
}

export async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return prisma.user.findFirst({
    where: { 
      email: normalizedEmail,
      deletedAt: null,
    },
  });
}

export async function getUserByUsernameOrEmail(identifier) {
  const trimmedIdentifier = identifier.trim();
  // Check if it looks like an email (contains @)
  const isEmail = trimmedIdentifier.includes('@');
  
  if (isEmail) {
    const normalizedEmail = normalizeEmail(trimmedIdentifier);
    return prisma.user.findFirst({
      where: { 
        email: normalizedEmail,
        deletedAt: null,
      },
    });
  } else {
    // Search by username - try exact match first, then case-insensitive
    // MySQL default collation is usually case-insensitive, but we'll handle both
    const user = await prisma.user.findFirst({
      where: { 
        username: trimmedIdentifier,
        deletedAt: null,
      },
    });
    
    // If exact match not found, try case-insensitive search using raw query
    if (!user) {
      const users = await prisma.$queryRaw`
        SELECT * FROM users 
        WHERE LOWER(username) = LOWER(${trimmedIdentifier}) 
        AND deletedAt IS NULL
        LIMIT 1
      `;
      return users.length > 0 ? users[0] : null;
    }
    
    return user;
  }
}

export async function createUser(email, password, username) {
  const normalizedEmail = normalizeEmail(email);
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      username,
      emailVerified: new Date(), // Email was verified during registration flow
    },
  });
}

export async function updateUserEmail(userId, newEmail) {
  const normalizedEmail = normalizeEmail(newEmail);
  return prisma.user.update({
    where: { id: userId },
    data: { 
      email: normalizedEmail,
      emailVerified: new Date(), // Update verification timestamp for new email
    },
  });
}

export async function updateUserPassword(userId, newPassword) {
  const hashedPassword = await hashPassword(newPassword);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function softDeleteUser(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });
}

/**
 * Creates a verification token for email verification
 * @param {string} email - Email to create token for
 * @returns {Promise<string>} - The generated token
 */
export async function createVerificationToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verifies a token and returns the associated email
 * @param {string} token - Token to verify
 * @returns {Promise<string|null>} - Email if token is valid, null otherwise
 */
export async function verifyToken(token) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return null;
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    });
    return null;
  }

  return verificationToken.identifier; // This is the email
}

/**
 * Deletes a verification token
 * @param {string} token - Token to delete
 */
export async function deleteVerificationToken(token) {
  try {
    await prisma.verificationToken.delete({
      where: { token },
    });
  } catch (error) {
    // Token might not exist, ignore error
    console.log('Token deletion error (ignored):', error.message);
  }
}

/**
 * Gets a pending verification token for an email
 * @param {string} email - Email to check
 * @returns {Promise<object|null>} - Token object if exists and not expired, null otherwise
 */
export async function getPendingVerificationToken(email) {
  const normalizedEmail = normalizeEmail(email);
  
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: normalizedEmail,
      expires: {
        gt: new Date(), // Not expired
      },
    },
  });

  return verificationToken;
}

/**
 * Deletes all verification tokens for an email (used when resending verification)
 * @param {string} email - Email to delete tokens for
 */
export async function deleteVerificationTokensByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: normalizedEmail,
    },
  });
}

/**
 * Creates a verification token for email change
 * @param {string} userId - User ID requesting the change
 * @param {string} newEmail - New email address to verify
 * @returns {Promise<string>} - The generated token
 */
export async function createEmailChangeToken(userId, newEmail) {
  const normalizedEmail = normalizeEmail(newEmail);
  const identifier = `${userId}|${normalizedEmail}`;
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verifies an email change token and returns userId and newEmail
 * @param {string} token - Token to verify
 * @returns {Promise<{userId: string, newEmail: string}|null>} - User ID and new email if token is valid, null otherwise
 */
export async function verifyEmailChangeToken(token) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return null;
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    });
    return null;
  }

  // Check if this is an email change token (format: userId|email)
  if (!verificationToken.identifier.includes('|')) {
    return null; // Not an email change token
  }

  const [userId, newEmail] = verificationToken.identifier.split('|');
  
  if (!userId || !newEmail) {
    return null;
  }

  return { userId, newEmail };
}

/**
 * Gets a pending email change verification token
 * @param {string} userId - User ID to check
 * @param {string} newEmail - New email to check
 * @returns {Promise<object|null>} - Token object if exists and not expired, null otherwise
 */
export async function getPendingEmailChangeToken(userId, newEmail) {
  const normalizedEmail = normalizeEmail(newEmail);
  const identifier = `${userId}|${normalizedEmail}`;
  
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      expires: {
        gt: new Date(), // Not expired
      },
    },
  });

  return verificationToken;
}

/**
 * Creates a password reset token
 * @param {string} email - Email of the user requesting password reset
 * @returns {Promise<string>} - The generated token
 */
export async function createPasswordResetToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const identifier = `passwordReset|${normalizedEmail}`;
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Delete any existing password reset tokens for this email
  await prisma.verificationToken.deleteMany({
    where: {
      identifier,
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verifies a password reset token and returns the email
 * @param {string} token - Token to verify
 * @returns {Promise<string|null>} - Email if token is valid, null otherwise
 */
export async function verifyPasswordResetToken(token) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return null;
  }

  // Check if this is a password reset token
  if (!verificationToken.identifier.startsWith('passwordReset|')) {
    return null;
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    });
    return null;
  }

  // Extract email from identifier
  const email = verificationToken.identifier.replace('passwordReset|', '');
  return email;
}

/**
 * Gets a pending password reset token for an email
 * @param {string} email - Email to check
 * @returns {Promise<object|null>} - Token object if exists and not expired, null otherwise
 */
export async function getPendingPasswordResetToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const identifier = `passwordReset|${normalizedEmail}`;
  
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      expires: {
        gt: new Date(), // Not expired
      },
    },
  });

  return verificationToken;
}

/**
 * Deletes a password reset token
 * @param {string} token - Token to delete
 */
export async function deletePasswordResetToken(token) {
  try {
    await prisma.verificationToken.delete({
      where: { token },
    });
  } catch (error) {
    // Token might not exist, ignore error
    console.log('Password reset token deletion error (ignored):', error.message);
  }
}
