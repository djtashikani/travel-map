# Japan Travel Map - プロジェクト構造

## ディレクトリ構成

```
travel-map/
├── public/
│   └── index.html          # メインSPA（HTML/CSS/JS一体型）
├── server.js               # Express サーバー（開発用・インメモリ）
├── server-sqlite.js        # Express サーバー（本番用・SQLite）
├── ecosystem.config.js     # PM2 設定ファイル
├── package.json            # Node.js パッケージ設定
├── .gitignore
├── docs/
│   ├── PROJECT_STRUCTURE.md  # 本ファイル
│   └── VULTR_DEPLOYMENT.md   # Vultrデプロイ手順
└── PROJECT_HISTORY.md      # 開発履歴
```

## 技術スタック

- **Frontend**: HTML/CSS/JavaScript (SPA、index.html一体型)
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Map**: Leaflet.js 1.9.4 + OpenStreetMap
- **Search**: Nominatim API
- **Process Manager**: PM2
- **Server**: Vultr VPS + Nginx + SSL

## API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/sync/:userId` | ユーザーデータ取得 |
| POST | `/api/sync/:userId` | ユーザーデータ保存 |
| GET | `/api/debug/:userId` | デバッグ用データ確認 |
| GET | `/api/admin/stats` | ユーザー数統計 |

## データベース

### テーブル: users
```sql
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    data TEXT,          -- JSON: 全都市データ
    updated_at TEXT
)
```

### データ形式
```json
{
  "kagawa": {
    "selectedSpots": [1, 2, 3],
    "customSpots": [...],
    "hiddenSpots": [4, 5],
    "spotOrder": [1, 15, 3],
    "startLocation": { "name": "...", "lat": 34.33, "lng": 134.05 },
    "endLocation": null
  },
  "custom_12345": { ... },
  "_customCities": [
    { "key": "custom_12345", "name": "東京", "center": [35.6762, 139.6503] }
  ]
}
```

## 主要機能

1. **地図表示**: Leaflet.js + OpenStreetMap
2. **プリセット都市**: 香川（20スポット）
3. **都市自由追加**: ユーザーがUIから都市を検索・追加
4. **スポット管理**: 選択/解除/並べ替え/非表示/削除/復元
5. **カスタムスポット**: 検索またはマップクリックで追加
6. **ルート計画**: Google Maps連携
7. **クラウド同期**: ユーザーID制 + SQLite
8. **URL共有 + LINE共有**
9. **レスポンシブデザイン**: PC/タブレット/スマートフォン対応
