---
title: Gatsbyでブログ始めました。
date: "2018-09-09T22:00:00.000Z"
---

TODO 序章は後で記載

## ブログ開設手順
Git、Node、npmは事前にインストールしておいてください。

### 1. ブログのスターターキットを起動
Gatsbyはブログをすぐ始められるようにスターターキット(スキャフォールド)を用意しています。
まずはそれを使ってローカルでブログを起動してみます。

#### 1-1. Gatsbyインストール

```
npm install -g gatsby
```

#### 1-2. プロジェクト生成
```
gatsby new blog https://github.com/gatsbyjs/gatsby-starter-blog
```

#### 1-3. ローカルで起動
```
cd blog
npm run dev
```

[http://localhost:8000](http://localhost:8000/)にアクセスするとブログが表示されます。

![ブログ初期イメージ](./blog_image_1_main.png)

### 2. ブログの記事などを自分仕様にカスタマイズ
現状だと、ブロガーがKyle Mathews氏(Gatsbyの作者)になっていたり、仮の記事が3つある状態なので、
自分仕様にカスタマイズします。
<small>ここでは僕の例を示します。</small>


#### 2-1. ブラウザタブのタイトル修正
`gatsby-config.js`の`siteMetadata`を下記のように修正します。
なお`siteUrl`はGitHub Pagesでの公開を想定したものです。

```
module.exports = {
  siteMetadata: {
    title: 'Takumon Blog',
    author: 'Takuto Inoue',
    description: '日々の作業をつづっていきます。',
    siteUrl: 'https://takumon.github.io/blog/',
  },
```

#### 2-2. 画面タイトル修正
`src/layouts/index.js`を修正します。
`Gatsby Starter Blog`となっている部分が2カ所あるので、自分のブログ名に修正します。
僕は`Takumon Blog`にしました。


#### 2-3. プロフィール修正
`src/components/Bio.js`のアバター(imgタグ)と自己紹介文(pタグ)を修正します。

```
<img
  src="https://s.gravatar.com/avatar/37d27f624f8c9c8db6fe6b6581b256f1?s=80"
  alt={`Takuto Inoue`}
  style={{
    marginRight: rhythm(1 / 2),
    marginBottom: 0,
    width: rhythm(2),
    height: rhythm(2),
    borderRadius: rhythm(1),
  }}
/>
<p>
  Written by <strong>Takuto Inoue</strong> who lives and works in Tokyo building useful things.
</p>
```

#### 2-4. 余計な記事を削除
記事は`src/page`配下にフォルダ分けされて存在します。
1つ目以外の記事は不要なのでフォルダごと削除します。
あと1つ目の記事て使っている画像も削除します。

```
src/
├── pages
│   ├── hello-world
│   │   ├── index.md
│   │   └── salty_egg.jpg ・・・削除対象
│   ├── hi-folks          ・・・削除対象
│   │   └── index.md
│   └── my-second-post    ・・・削除対象
│       └── index.md
```

#### 2-5. 記事を編集
1つめの記事`src/pages/hello-world/index.md`を編集します。
マークダウンファイル上部にメタ情報としてタイトルと作成日時を、その下に本文を記載しましょう。

```
---
title: Hello World
date: "2018-09-10T12:00:00.000Z"
---

Gatsbyでブログ始めました！
```

#### 2-6. ローカルで起動

この状態で`npm run dev`して[http://localhost:8000](http://localhost:8000)を見てみると下記のようになっています。

記事一覧
![ブログ修正後イメージ_記事一覧](./blog_image_2_main.png)

記事詳細
![ブログ修正後イメージ_記事詳細](./blog_image_2_detail.png)


ここまでで一通り自分のブログをローカルで作ることができました。

### 3. GitHub Pagesにブログを公開
Gatsbyを使うとnpmスクリプト一発でGitHub Pageに公開ができます。
ここではGitHubでのリポジトリ作成などの事前準備も含めて手順を示します。


#### 3-1. GitHubにリポジトリ作成
GitHubにリポジトリを作り、手順2で作成した資産をプッシュしてください。

#### 3-2. GitHub Pagesの設定
GitHubのリポジトリ > settings > GitHub Pages > Source で`gh-pages branch`を選択します。

#### 3-3. メタ情報の修正
手順2によりローカルでブログを起動できるようになりましたが、GitHub Pagesに公開するには、まだ少し修正が必要です。

#####  gatsby-config.jsの`pathPrefix`の修正
ブログのコンテキストURLは、現状だとスターターキットの値なので修正します。
これを指定するとブログのURLが`https://[オーナー名].github.io/[pathPrefixの値]/`のようになります。
僕の場合は`https://takumon.github.io/blog`のようになります。


```
module.exports = {
  ・・・
  pathPrefix: '/blog',
  ・・・
}
```

##### package.json、pacakge-lock.json、README.mdのメタ情報修正
上記3ファイルにおいて、プロジェクト名や、管理者、ブログのURLなどが、すべてスターターキットの状態になっているので
自分仕様に修正します。


#### 3-4. 資産をgh-pagesブランチにプッシュ
`git push origin master`でマスターに最新資産をプッシュします。

`npm run deploy`を実行します。実態は`gatsby build && gh-pages -d public`というコマンドです。これを実行するとgatbyコマンドによりビルド資産をgh-pagesブランチにプッシュしてくれます。


#### 3-5. 公開できたことを確認
GitHub Pagesの公開URLをブラウザでたたき、自分のブログが公開されていることを確認します。


以上でブログの公開手順は終了です。





### 参考記事
- [React.js製の静的サイトジェネレーターGatsbyに移行した](https://qiita.com/jaxx2104/items/5f28915355a85d36e38a)
  - Gatsbyを始めるきっかけとなった記事です。この記事のおかげで簡単にGatsby製ブログを開設できました。
- [公式サイト](https://www.gatsbyjs.org/)
  - 英語ですが、、、結構充実しています。
- Gatsby製ブログ(ググるといくつかヒットします。どれも見た目が格好いいので参考にしたいです。)
  - [写真やWeb制作についてのブログ](https://blog.mismithportfolio.com/)
  - [dvg.179](https://dvg.179.jp/)
  - [tmnm.tech](https://tmnm.tech/)

