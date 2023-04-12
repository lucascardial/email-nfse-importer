module.exports = {
  apps: [
    {
      name: "api service",
      script: "./dist/src/api/application.js",
      autorestart: true,
    },
    {
      name: "job worker",
      script: "./dist/src/jobs/application.js",
      autorestart: true,
    },
    {
      name: "mail service",
      script: "./dist/src/mailer/server.js",
      autorestart: true,
    }
  ],
};
