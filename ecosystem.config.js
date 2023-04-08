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
      name: "fetch email service",
      script: "./dist/src/shells/fetch_email.js",
      autorestart: true,
    }
  ],
};
