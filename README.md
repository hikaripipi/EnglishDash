# EnglishDash

EnglishDash is a fast-paced English practice app designed to improve your speaking and writing skills, especially for TOEFL iBT preparation.

英語ダッシュは、英語のスピーキングとライティングスキルを素早く向上させるためのアプリで、特にTOEFL iBT対策として設計されています。

## Features / 機能

- Two practice modes: Speaking and Writing / 2つの練習モード：スピーキングとライティング
- Difficulty settings based on TOEFL scores / TOEFLスコアに基づく難易度設定
- Customizable number of questions (5, 10, or 15) / カスタマイズ可能な問題数（5問、10問、15問）
- Timed challenges with auto-submission / 自動提出機能付きの時間制限チャレンジ
- AI-powered question generation and scoring / AI駆動の問題生成と採点
- Instant feedback on your performance / 即時パフォーマンスフィードバック

## Setup / セットアップ

### Prerequisites / 前提条件

- Python 3.8+
- Node.js 14+
- Poetry
- npm
- SQLite

### Backend Setup / バックエンドセットアップ

1. Install dependencies / 依存関係のインストール:
   ```
   make backend
   ```

2. Initialize the database / データベースの初期化:
   ```
   make init-db
   ```

3. Run the backend server / バックエンドサーバーの起動:
   ```
   make backend
   ```

### Frontend Setup / フロントエンドセットアップ

1. Generate OpenAPI schema / OpenAPIスキーマの生成:
   ```
   make openapi
   ```

2. Install dependencies and start the development server / 依存関係のインストールと開発サーバーの起動:
   ```
   make frontend
   ```

## Usage / 使用方法

1. Select a practice mode (Speaking or Writing) / 練習モードを選択（スピーキングまたはライティング）
2. Choose your TOEFL score range for appropriate difficulty / 適切な難易度のためにTOEFLスコア範囲を選択
3. Select the number of questions and time limit / 問題数と制限時間を選択
4. Start the challenge and answer the questions before time runs out / チャレンジを開始し、制限時間内に問題に回答
5. Review your AI-generated score and feedback / AIが生成したスコアとフィードバックを確認

## Development / 開発

### Database Operations / データベース操作

- Create a new migration / 新しいマイグレーションの作成:
  ```
  make migrate
  ```

- Drop the database / データベースの削除:
  ```
  make drop-db
  ```

### Accessing SQLite Database / SQLiteデータベースへのアクセス

```
make sqlite
```

## About / このプロジェクトについて

EnglishDash was developed by @hikaripipi and @lilpacy, motivated by their upcoming TOEFL iBT test and the need to improve English writing skills in an AI-dominated world. The initial version was impressively developed in just 6 hours!

英語ダッシュは、@hikaripipiと@lilpacyによって開発されました。upcoming TOEFL iBTテストと、AI主導の世界で英語ライティングスキルを向上させる必要性に動機づけられています。初期バージョンはなんと6時間で開発されました！

## Contributing / コントリビューション

We welcome contributions to EnglishDash! Please feel free to submit issues and pull requests.

EnglishDashへの貢献を歓迎します！イシューやプルリクエストをお気軽に提出してください。

## License / ライセンス

[MIT License](LICENSE)
