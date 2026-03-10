export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenExpiresIn: '30d',
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
} as const;