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
