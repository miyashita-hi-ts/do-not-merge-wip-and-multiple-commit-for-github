# do-not-merge-wip-and-multiple-commit-for-github

Apolloリポジトリで、以下の2つのどちらかを満たしているとマージボタンが押せない様になります。

* PRのタイトルに"WIP"がある
* マージ先が"develop"、且つコミットが1つにまとまっていない

## 拡張機能追加手順
1. 本ブランチをclone or zipでダウンロード

2. chrome://extensions/ にアクセス

3. 右上のデベロッパーモードをクリック

4. 「パッケージ化」されていない拡張機能を読み込むを選択

5. このリポジトリにあるappフォルダを選択 

