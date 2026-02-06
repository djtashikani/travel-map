const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3003;

// JSONボディを解析
app.use(express.json({ limit: '5mb' }));

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// SQLiteデータベース初期化
const dbPath = path.join(__dirname, 'data', 'travel-map.db');
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// テーブル作成（都市自由追加対応: 全都市データを1カラムに格納）
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        data TEXT,
        updated_at TEXT
    )
`);

// ユーザーデータを取得
app.get('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const row = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

        if (row) {
            const data = row.data ? JSON.parse(row.data) : null;
            res.json({ success: true, data, updatedAt: row.updated_at });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (e) {
        console.error('Database read error:', e);
        res.status(500).json({ error: 'Database error' });
    }
});

// ユーザーデータを保存
app.post('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const updatedAt = new Date().toISOString();
    const data = JSON.stringify(req.body);

    try {
        const stmt = db.prepare(`
            INSERT INTO users (user_id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                data = excluded.data,
                updated_at = excluded.updated_at
        `);

        stmt.run(userId, data, updatedAt);
        console.log(`Data saved for user: ${userId}`);

        res.json({ success: true, updatedAt });
    } catch (e) {
        console.error('Database write error:', e);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// デバッグ用：保存されているデータを確認
app.get('/api/debug/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    try {
        const row = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
        res.json({ userId, hasData: !!row, data: row });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 全ユーザー数を確認（管理用）
app.get('/api/admin/stats', (req, res) => {
    try {
        const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
        res.json({ userCount: count.count });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// メインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 終了時にデータベースを閉じる
process.on('SIGINT', () => {
    db.close();
    process.exit();
});

process.on('SIGTERM', () => {
    db.close();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Japan Travel Map is running on port ${PORT}`);
    console.log(`Database: ${dbPath}`);
});
