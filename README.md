# ゆきみ高原スキー場 LINE体験提案デモ（LIFF版）

架空のスキー場「ゆきみ高原スキー場」を舞台に、来場者がLINE上で4つの質問に答えると
自分たちに合う過ごし方（プラン）が提案されるデモです。LINEミニアプリ（LIFF）として
動作します。バックエンドAPIはなく、フロントエンドのみの構成です。

事業性の検証や実在施設への提案根拠ではなく、対話フロー・提案ロジック・画面表示の
確認を目的としたデモです。実際の予約・決済・在庫確保は行われません。

## ファイル構成

```
index.html      画面構造とスタイル（フルスクリーンのチャットUI）
js/config.js    LIFF ID設定
js/app.js       施設データ・質問フロー・提案ロジック・画面描画
```

## 1. LIFF IDの設定

`js/config.js` に、LINE Developersコンソールで作成済みのLIFF IDを設定します。

```js
window.LIFF_ID = "2011673352-vafFvo3Q"; // 開発用
```

このチャネルには 開発用 / 審査用 / 本番用 の3つのLIFF IDが発行されています。
用途に応じて `js/config.js` の値を差し替えてください（LINE Developers > 対象チャネル
> LIFFタブに一覧があります）。

**チャネルシークレットはこの構成では使用しません。** フロントエンドのみのLIFF PoC
のため設定不要です。誤ってコードや公開リポジトリに含めないよう注意してください。

## 2. ホスティング（GitHub Pages）

LIFFはHTTPS環境でのホスティングが必須です。GitHub Pagesで公開します。

```bash
git init
git add .
git commit -m "Initial commit: ゆきみ高原スキー場 LIFFデモ"
```

その後、GitHub上に新しいリポジトリ（public/privateどちらでも可。privateの場合は
GitHub Pagesの利用にPro等のプランが必要な場合があります）を作成してpushします。

```bash
git remote add origin https://github.com/<your-account>/<repo-name>.git
git branch -M main
git push -u origin main
```

pushしたら、リポジトリの **Settings → Pages** を開き、Source を「Deploy from a branch」、
Branch を「main」（フォルダは「/ (root)」）に設定して保存します。数分後に

```
https://<your-account>.github.io/<repo-name>/
```

でページが公開されます。このURLを次の手順でLINE Developersコンソールに設定します。
コードを更新したら `git add` / `git commit` / `git push` するだけで、同じURLに反映されます。

## 3. LINE Developersコンソール側の設定

1. 対象チャネルの「LIFF」タブを開く
2. 更新したい環境（開発用/審査用/本番用）の「エンドポイントURL」の「編集」を押す
3. 手順2で取得したGitHub PagesのURL（例: `https://<your-account>.github.io/<repo-name>/`）を
   貼り付けて保存（現在は LINE のデフォルトプレースホルダー
   `https://developers.line.biz/assets/liff-default-dev.html` が入っています）

## 4. 動作確認

- 開発用のLIFF URL（例: `https://miniapp.line.me/2011673352-vafFvo3Q`）をLINEアプリ内で開くと、
  このミニアプリが起動します。
- **注意:** 開発用・審査用の環境は、そのチャネルに「開発者」または「テスター」として
  登録されているLINEアカウントでしか開けません。友人に見せたい場合は、
  - チャネルの「権限設定」等からその友人のLINEアカウントをテスターとして追加するか、
  - LINE Developersコンソールの「審査申請」から審査を通し、本番用のLIFF URLを使う
  のいずれかが必要です（審査申請の要否・要件はLINE Developersコンソールの案内に従ってください）。
- LINEアプリ以外の通常のブラウザで開いた場合も、LIFF初期化に失敗すると自動的に
  通常のWebページとして動作します（引き続きPCでの動作確認に使えます）。

## 補足

- 質問項目・提案ロジック・料金/時間表示のルールは、要件定義書
  「スキー場LINE体験提案デモ_要件定義書_v1」に準拠しています。
- 表示先は「ミニアプリのみ」で実装しています（トーク画面のクイックリプライは使用しません）。
- 体験データ（雪遊び・乗り物・景色・ものづくり食体験・温泉休息の計10体験）はすべて
  架空のものです。実在施設の情報と混同しないでください。
