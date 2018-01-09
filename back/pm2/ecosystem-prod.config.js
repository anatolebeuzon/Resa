module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "Resa-back",
      script: "/var/www/resa/back/bin/www",
      instances: "max",
      exec_mode: "cluster",
      env: {
        CONFIG_ENV: "prod",
        NODE_ENV: "production",
      },
    },
  ],
};
