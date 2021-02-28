export default () => ({
  nodeEnv: process.env.NODE_ENV,
  serverPort: process.env.SERVER_PORT,
  frontendHostUrl: process.env.FRONTEND_HOST_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
  redisUrl: process.env.REDIS_URL,
  pgUrl: process.env.DATABASE_URL,
  testPgUrl: process.env.TEST_DATABASE_URL,
  aws: {
    s3BucketUrl: process.env.S3_BUCKET_URL,
    s3BucketName: process.env.S3_BUCKET_NAME,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    apiKey: process.env.MAILER_API_KEY,
  }
});
 