# do-not-merge-wip-and-multiple-commit-for-github

Apolloリポジトリで、以下の2つのどちらかを満たしているとマージボタンが押せない様になります。

* PRのタイトルに"WIP"がある
* マージ先が"develop"、且つコミットが1つにまとまっていない

## 拡張機能追加手順
1. 本ブランチをclone or zipでダウンロード

2. chrome://extensions/ にアクセス

3. 右上のデベロッパーモードをクリック
<img width="1437" alt="スクリーンショット 2022-04-05 19 56 47" src="https://user-images.githubusercontent.com/42674859/161739347-b410e52a-9aa7-4baf-a4cb-c91ab6171520.png">


4. 「パッケージ化」されていない拡張機能を読み込むを選択

5. このリポジトリにあるappフォルダを選択 
<img width="631" alt="スクリーンショット 2022-04-05 19 58 08" src="https://user-images.githubusercontent.com/42674859/161739536-7b3364af-8457-4a4d-86b7-26d14aaf2579.png">

6. アポロチョコが表示されたら成功
<img width="448" alt="スクリーンショット 2022-04-05 19 58 49" src="https://user-images.githubusercontent.com/42674859/161739648-09a80651-807c-4454-b1c0-33ad8035d03a.png">
