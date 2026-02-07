// PM2 設定ファイル（プロセス管理用）
module.exports = {
  apps: [{
    name: 'travel-map',
    script: 'server-sqlite.js',  // SQLite版を使用（データ永続化）
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    }
  }]
};
