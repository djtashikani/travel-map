# PROJECT_HISTORY - Japan Travel Map

## 2026-02-06: プロジェクト初期作成

### 概要
sydney-travel-appをベースに、日本国内版の旅行マップアプリを新規プロジェクトとして作成。

### 作成内容
- **プロジェクト構成**: travel-map/ 以下にフルスタック構成を構築
- **技術スタック**: Node.js + Express + SQLite + Leaflet.js（sydney-travel-appと同等）
- **初期都市**: 香川（観光地・自然・文化・グルメ 20スポットプリセット）

### 香川プリセットスポット（20箇所）
- **名所(5)**: 栗林公園、金刀比羅宮、丸亀城、高松城跡、屋島
- **自然(5)**: 直島、小豆島、父母ヶ浜、寒霞渓、エンジェルロード
- **文化(5)**: 地中美術館、四国村ミウゼアム、豊島美術館、イサム・ノグチ庭園美術館、善通寺
- **グルメ(5)**: 山越うどん、がもううどん、長田 in 香の香、骨付鳥 一鶴、うどんバカ一代

### sydney-travel-appからの変更点
1. **都市自由追加機能**: ユーザーがUIから日本国内の都市を検索・追加できる機能を新規実装
2. **日本国内フィルタ**: Nominatim検索を日本国内（緯度24-46, 経度122-146）に限定
3. **DB設計変更**: 都市名をキーにしたJSONで柔軟に複数都市管理（旧: sydney_data/melbourne_data → 新: data一括）
4. **デザインテーマ**: オレンジ系グラデーション（旧: ブルー/パープル）
5. **ポート**: 3003（旧: 3000）
6. **ドメイン**: travel.tashikani.jp（旧: map.tashikani.jp）

### 主要機能（sydney-travel-appと同等）
- Leaflet.js + OpenStreetMap の地図表示
- スポット選択/解除/ドラッグ並べ替え/非表示/削除/復元
- カスタムスポット追加（検索 or マップクリック）
- ルート計画（出発/到着地点 → Google Maps連携）
- クラウド同期（ユーザーID制 + SQLite）
- URL共有 + LINEシェア
- レスポンシブデザイン（モバイル最適化）
- 地図最小化/復元機能

### ファイル構成
```
travel-map/
├── public/index.html        # メインSPA
├── server.js                # 開発用サーバー（インメモリ）
├── server-sqlite.js         # 本番用サーバー（SQLite）
├── ecosystem.config.js      # PM2設定
├── package.json
├── .gitignore
├── docs/
│   ├── PROJECT_STRUCTURE.md
│   └── VULTR_DEPLOYMENT.md
└── PROJECT_HISTORY.md
```

### デプロイ予定
- Vultr VPS (198.13.36.101)
- travel.tashikani.jp
- ポート 3003
- PM2 + Nginx + SSL

---

## 2026-02-06: Vultrデプロイ完了

### デプロイ作業

**実施内容**:
1. **GitHubリポジトリ作成**: https://github.com/djtashikani/travel-map にプッシュ
2. **サーバーにクローン**: `/var/www/travel-map` に `git clone`
3. **npm install**: 依存パッケージのインストール
4. **PM2起動**: `travel-map` プロセスをPM2で起動
5. **Nginx設定**: `travel.tashikani.jp` → `localhost:3003` のリバースプロキシ設定
6. **SSL証明書取得**: Let's Encrypt（certbot）で取得（有効期限: 2026-05-07）

### 技術的な問題と対応

#### better-sqlite3コンパイル失敗
- `better-sqlite3` がVultr環境（Ubuntu 24.04）でネイティブコンパイルに失敗
- **対応**: `server.js`（インメモリ版）にフォールバックして運用
- **ecosystem.config.js** を `server-sqlite.js` → `server.js` に変更
- **今後の対応**: Node.jsのビルドツール（build-essential, python3）をインストールして `better-sqlite3` を再インストール予定

```bash
# better-sqlite3を再インストールする場合
apt-get install -y build-essential python3
cd /var/www/travel-map
npm install better-sqlite3
# ecosystem.config.jsのscriptをserver-sqlite.jsに戻す
pm2 restart travel-map
```

#### SSH接続不安定
- 複数回のSSH試行でIPがブロックされる問題が頻発
- **原因**: UFWのSSHレート制限 + sshdのMaxStartupsデフォルト設定
- **対応**:
  - `MaxStartups 100:30:200` に設定
  - UFWのSSHルールを `LIMIT` → `ALLOW` に変更
  - fail2banを無効化
  - Vultr APIリブートでIPブロックをリセット

#### video-chopper Dockerコンテナ停止
- デプロイ作業中にDockerコンテナが停止していたことを発見
- **対応**: `docker start video-chopper` で復旧

### DNS設定 ✅ 完了
- `travel.tashikani.jp` のAレコードを `198.13.36.101` に設定済み
- HTTPS接続・ページ表示・API動作すべて確認済み

### 現在の本番環境サマリー（2026-02-06時点）

| 項目 | 値 |
|------|-----|
| サーバー | Vultr VPS (198.13.36.101) |
| OS | Ubuntu 24.04 LTS |
| Node.js | v22.22.0 |
| PM2 | v6.0.14 |
| Nginx | 1.24.0 |
| SSL | Let's Encrypt（有効期限: 2026-05-07） |

**同居アプリケーション**:

| アプリ | URL | ポート | 管理方法 | 状態 |
|--------|-----|--------|----------|------|
| sydney-travel-map | https://map.tashikani.jp | 3000 | PM2 | ✅ 稼働中 |
| video-chopper | https://video-chopper.tashikani.jp | 3001 | Docker | ✅ 稼働中 |
| mind-circuit | https://basic.mind-circuit.jp | 3002 | PM2 | ✅ 稼働中 |
| **travel-map** | **https://travel.tashikani.jp** | **3003** | **PM2** | **✅ 稼働中** |

---

*最終更新: 2026-02-06*
