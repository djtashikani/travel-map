# Vultr デプロイ手順

## サーバー情報

- **IP**: 198.13.36.101
- **OS**: Ubuntu 22.04.3 LTS
- **ドメイン**: travel.tashikani.jp
- **ポート**: 3003
- **PM2プロセス名**: travel-map

## SSH接続

```bash
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101
```

## 初回セットアップ

### 1. プロジェクトをクローン

```bash
cd /var/www
git clone https://github.com/djtashikani/travel-map.git
cd travel-map
npm install
```

### 2. PM2で起動

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 3. Nginx設定

```bash
nano /etc/nginx/sites-available/travel.tashikani.jp
```

```nginx
server {
    listen 80;
    server_name travel.tashikani.jp;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/travel.tashikani.jp /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. SSL証明書取得

```bash
certbot --nginx -d travel.tashikani.jp
```

## 更新デプロイ

```bash
cd /var/www/travel-map
git pull origin main
npm install
pm2 restart travel-map
```

## 管理コマンド

```bash
pm2 list                    # プロセス一覧
pm2 logs travel-map         # ログ確認
pm2 restart travel-map      # 再起動
pm2 stop travel-map         # 停止
pm2 delete travel-map       # 削除
```

## DNS設定

travel.tashikani.jp のAレコードを 198.13.36.101 に向ける。

## 既存アプリとの共存

| アプリ | ドメイン | ポート |
|--------|---------|--------|
| sydney-travel-map | map.tashikani.jp | 3000 |
| video-chopper | - | 3001 |
| mind-circuit | basic.mind-circuit.jp | 3002 |
| **travel-map** | **travel.tashikani.jp** | **3003** |
