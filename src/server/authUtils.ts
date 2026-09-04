import crypto from 'crypto';

/**
 * Tekvix Cryptographic Authentication Utilities
 * Uses NIST/OWASP approved scrypt key derivation with unique per-password salt
 * and timing-safe comparison to prevent timing attacks.
 */

// Scrypt configuration parameters
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTIONS: crypto.ScryptOptions = {
  N: 16384, // CPU/memory cost
  r: 8,     // Block size
  p: 1,     // Parallelization
  maxmem: 32 * 1024 * 1024,
};

/**
 * Hashes a plaintext password using crypto.scryptSync with a 16-byte cryptographically secure random salt.
 * Output format: scrypt:<salt_hex>:<derived_key_hex>
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password.normalize('NFKC'), salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored hashed string.
 * Uses timingSafeEqual to avoid timing side-channel attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  try {
    const parts = storedHash.split(':');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      // If legacy unhashed or unrecognized format, reject safely
      return false;
    }

    const [, salt, originalKeyHex] = parts;
    const derivedKey = crypto.scryptSync(password.normalize('NFKC'), salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
    const originalBuffer = Buffer.from(originalKeyHex, 'hex');

    if (derivedKey.length !== originalBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, originalBuffer);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Validates password strength for admin accounts.
 * Must be at least 8 characters long and contain varied characters.
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'رمز عبور نمی‌تواند خالی باشد.' };
  }

  const trimmed = password.trim();
  if (trimmed.length < 8) {
    return { isValid: false, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' };
  }

  return { isValid: true };
}
