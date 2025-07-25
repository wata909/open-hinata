# open-hinata（改）
ol5+vueで作成したオープン版の「ひなたGIS」である[open-hinata](https://kenzkenz.xsrv.jp/open-hinata/)を、wata909が改造したものです。

# Demo
[メイン画面](https://wata909.github.io/read-the-land/dist/#sgCAXTM)
[・５万分の１旧版地形図](https://wata909.github.io/read-the-land/dist/#sWkeJLs)

# Dependencies
地図ライブラリはol5を使用。フレームワークにvue+vuexを使用しています。vue CLI 3で開発、ビルドしています。

# Usage
ダウンロードしたファイル群を保存したディレクトリで下記のコマンドを実行して必要モジュールをインストールしてください。
```
npm i
```
必要モジュールがインストールされたら次のコマンドで開発サーバーが立ち上がります。立ち上がったらブラウザで[http://localhost:8080](http://localhost:8080)を表示してください。
```
npm run serve
```
次のコマンドでビルドします。なお、js/layers.jsに追記することによりレイヤーを追加することができます。
```
npm run build
```
# Authors
original ken ochiai  
改造 wata909

# 説明
## 変数
vuexを使用しています。
複数のコンポーネントから参照する可能性のある変数はstore(vuex)に設置しています。
自コンポーネントだけで済む変数は極力コンポーネントに置いています。
## 起動時の処理
App.vueのmountedに一連の処理を置いています。
## レイヤー追加の処理
レイヤーリスト下段をクリックするとstoreにあるlayerListsにレイヤーの情報を追加します。追加されるとLayer.vueのmountedに仕掛けているwatchが動作してOLのレイヤーを操作します。

