module.exports = {
  apps: [{
    name: 'canchaya',
    script: 'index.js', // o el nombre de tu archivo principal
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001 // o el puerto que uses
    }
  }]
};