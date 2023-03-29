---
title: 'AppSync + Serverless Frameworkによるソースコードの構成管理'
date: '2019-03-04T07:50:00.000+09:00'
tags:
  - AppSync
  - serverless
  - AWS
  - GraphQL
keywords:
  - AppSync
slug: /aws-appsync-and-serverless-framework
thumbnail: thumbnail/2019/03/aws-appsync-and-serverless-framework.png
---

## なにこれ

AWSのGraphQLマネージドサービス「[AppSync](https://aws.amazon.com/jp/appsync/)」はGUIで簡単に設定ができて便利ですが、
本格的に開発を進めていくとGUIポチポチでソースコードを管理するのはつらくなってきます。
**[Serverless Framework](https://serverless.com/)というツールと[serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin)（Serverless Frameworkのプラグイン）を使うと、AppSyncの設定をymlファイルで管理し、CLIでAWS上にデプロイできるので、GitHub等で構成管理が可能になります。**
今回はAppSyncからDynamoDBのユーザー情報を1件取得する場合を例にしてAppSync + Serverless Frameworkの使い方をご紹介します。

![](image.png)

1. [🔰 Serverless Frameworkの設定](#1-serverless-frameworkの設定)
2. [💪 プロジェクトのひな型作成](#2-プロジェクトのひな型作成)
3. [📝 設定ファイル作成](#3-設定ファイル作成)
4. [💖 リゾルバー作成](#4-リゾルバー作成)
5. [💎 スキーマ作成](#5-スキーマ作成)
6. [🎊 AWSにデプロイ](#6-awsにデプロイ)



## 1. Serverless Frameworkの設定

* Serverless Frameworkはnpmで提供されるCLIツールです。まずはnpmでインストールします。

```
npm i -g serverless
```

* クレデンシャルを設定します（事前にIAMでユーザを作成しておいてください）

```
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

<small>※詳細：[Serverless Framework - AWS Lambda Guide - Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles)</small>



## 2. プロジェクトのひな型作成

プロジェクトのひな型を作ります。
Serverless FrameworkでAppSync資産を扱えるように、[serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin)と[aws-sdk](https://github.com/aws/aws-sdk-js)をインストールします。
```
mkdir appsync-sample-with-serverless
cd appsync-sample-with-serverless
npm init -y
npm i serverless-appsync-plugin aws-sdk
```
<br/>

## 3. 設定ファイル作成

プロジェクト直下にServerless Frameworkの設定ファイル`serverless.yml`を作ります。<br/>
<small>※ここではserverless.ymlの全量を示して、次のセクションでブロックごとに詳細を説明します。</small>

```yaml:title=serverless.yml
# サービス名
service: appsync-sample-with-serverless
provider:
  name: aws
  # ステージ、デプロイ先を開発、運用などで分けたい場合はココを切り替えます
  stage: production
  # デプロイ先のリージョンです
  region: ap-northeast-1
# AppSyncのプラグインを指定します
plugins:
  - serverless-appsync-plugin
# プラグイン関連の設定はcustomで行います
custom:
  # ここでAppSyncの設定を行います
  appSync:
    # エンドポイントの名前を指定します
    name: appsync-serverless-sample
    # AppSyncの認証方法を指定します
    # ここではCognitoによる認証方法を指定しています
    authenticationType: AMAZON_COGNITO_USER_POOLS
    # Cogtnitoによる認証方法の場合、Cognito側の情報を指定する必要があります
    userPoolConfig:
      # Cognitoが存在するリージョンを指定します
      # デフォルトだとproviderのregionで指定した値になります
      awsRegion: ap-northeast-1
      # CognitoのユーザープールのIDを指定します
      userPoolId: ap-northeast-1_U0e7zFRLQ
      # スキーマ定義で認証設定が記述されていない場合の挙動を指定します
      # DENYを指定すると、認証されたいかなるユーザーも認可エラーに倒します
      defaultAction: DENY
    # AppSyncのスキーマ定義ファイルのパスを指定します
    # デフォルトだとschema.graphqlです
    schema: schema.graphql
    # データソースを指定します(複数指定可能)
    dataSources:
      # データソースの型を指定します
      # 以下が指定できます
      # AMAZON_DYNAMODB ・・・DynamoDB
      # AMAZON_ELASTICSEARCH ・・・Elasticsearch
      # AWS_LAMBDA ・・・Lambda関数
      - type: AMAZON_DYNAMODB
        # データソース名を指定します
        name: dynamo_user
        # DynamoDBのテーブルの説明を指定します
        description: 'ユーザー情報テーブル'
        config:
          # 参照するテーブル名を指定します
          tableName: dynamo_user
          # データソースのロールARNを指定します
          serviceRoleArn: arn:aws:iam::999999999999:role/sample_role_arn
          # データソースのリージョンを指定します
          # デフォルトだとproviderのregionで指定した値になります
          region: ap-northeast-1
    # マッピングテンプレートのVTLファイルの格納先を指定します
    # デフォルトはmapping-templatesです
    mappingTemplatesLocation: mapping-templates
    # リゾルバー定義を指定します
    # ※ここではPipeline Resolverの例を示します
    mappingTemplates:
        # リゾルバーの方を指定します
      - type: Query
        # リゾルバーを紐づけるスキーマ中のフィールド名を指定します
        field: user
        # Pipeline Resolverを使い場合、以下を指定します
        kind: PIPELINE
        # リクエストマッピングテンプレートのファイルパスを指定します
        # ファイルパスはmappingTemplatesLocationで指定したパスからの相対パスになります
        request: 'start.vtl'
        # レスポンスマッピングテンプレートのファイルパスを指定します
        response: 'end.vtl'
        # リゾルバーで使う関数を実行順に指定します
        functions:
          - GetUser
    # 関数定義を指定します
    functionConfigurations:
        # ユーザー一覧取得
        # 関数で扱うデータソース名を指定します
      - dataSource: dynamo_user
        # 関数名を指定します
        name: 'GetUser'
        # 関数のリクエストマッピングテンプレートのファイルパスを指定します
        # ファイルパスはmappingTemplatesLocationで指定したパスからの相対パスになります
        request: 'GetUser.req.vtl'
        # 関数のレスポンスマッピングテンプレートのファイルパスを指定します
        response: 'GetUser.res.vtl'
```
<br/>


以下で、`serverless.yml`に定義したプロパティがAWSコンソール上のどの項目に紐づくかを説明します。


### AppSyncの基本設定

```yaml:title=serverless.ymlからAppSyncの基本設定を抜粋
  # ここでAppSyncの設定を行います
  appSync:
    # エンドポイントの名前を指定します
    name: appsync-serverless-sample
    # AppSyncの認証方法を指定します
    # ここではCognitoによる認証方法を指定しています
    authenticationType: AMAZON_COGNITO_USER_POOLS
    # Cogtnitoによる認証方法の場合、Cognito側の情報を指定する必要があります
    userPoolConfig:
      # Cognitoが存在するリージョンを指定します
      # デフォルトだとproviderのregionで指定した値になります
      awsRegion: ap-northeast-1
      # CognitoのユーザープールのIDを指定します
      userPoolId: ap-northeast-1_U0e7zFRLQ
      # スキーマ定義で認証設定が記述されていない場合の挙動を指定します
      # DENYを指定すると、認証されたいかなるユーザーも認可エラーに倒します
      defaultAction: DENY
```
<br/>

AWSコンソールのAppSyncの画面で、エンドポイント一覧が表示されます。
`serverless.yml`で定義したエンドポイント名はココで確認できます。
![](appsync-gui-main-1.png)


エンドポイントの画面を開き`Settings`を確認するとuserPoolConfigなどの詳細が確認できます。
ほぼ`serverless.yml`のプロパティ名と一致しているので、なんとなく紐づけがわかると思います。

![](appsync-gui-main-2.png)
<br/>



### データソース定義

```yaml:title=serverless.ymlからデータソース定義を抜粋
    # データソースを指定します(複数指定可能)
    dataSources:
      # データソースの型を指定します
      # 以下が指定できます
      # AMAZON_DYNAMODB ・・・DynamoDB
      # AMAZON_ELASTICSEARCH ・・・Elasticsearch
      # AWS_LAMBDA ・・・Lambda関数
      - type: AMAZON_DYNAMODB
        # データソース名を指定します
        name: dynamo_user
        # DynamoDBのテーブルの説明を指定します
        description: 'ユーザー情報テーブル'
        config:
          # 参照するテーブル名を指定します
          tableName: dynamo_user
          # データソースのロールARNを指定します
          serviceRoleArn: arn:aws:iam::999999999999:role/sample_role_arn
          # データソースのリージョンを指定します
          # デフォルトだとproviderのregionで指定した値になります
          region: ap-northeast-1
```
<br/>

エンドポイントの画面を開き`Data Sources`を確認すると
データソースが一覧表示されるので、一覧から今回`serverless.yml`に定義したデータソースを選択すると、以下のように詳細が確認できます。

![](appsync-gui-datasource.png)
<br/>


### リゾルバー定義

```yaml:title=serverless.ymlからリゾルバー定義を抜粋
    # リゾルバー定義を指定します
    # ※ここではPipeline Resolverの例を示します
    mappingTemplates:
        # リゾルバーの方を指定します
      - type: Query
        # リゾルバーを紐づけるスキーマ中のフィールド名を指定します
        field: user
        # Pipeline Resolverを使い場合、以下を指定します
        kind: PIPELINE
        # リクエストマッピングテンプレートのファイルパスを指定します
        # ファイルパスはmappingTemplatesLocationで指定したパスからの相対パスになります
        request: 'start.vtl'
        # レスポンスマッピングテンプレートのファイルパスを指定します
        response: 'end.vtl'
        # リゾルバーで使う関数を実行順に指定します
        functions:
          - GetUser
```
<br/>

リゾルバー定義は、エンドポイントの画面を開き`Schema`を確認します。
今回は`user`というフィールド名のクエリに対してリゾルバーを割り当てているので、右側のペインで以下のように確認できます。

![](appsync-gui-resolver.png)

上記画面の`Pipeline`のリンクを開くとリゾルバーの詳細が確認できます。

![](appsync-gui-resolver-2.png)
<br/>

### 関数定義

```yaml:title=serverless.ymlから関数定義を抜粋
    # 関数定義を指定します
    functionConfigurations:
        # ユーザー一覧取得
        # 関数で扱うデータソース名を指定します
      - dataSource: dynamo_user
        # 関数名を指定します
        name: 'GetUser'
        # 関数のリクエストマッピングテンプレートのファイルパスを指定します
        # ファイルパスはmappingTemplatesLocationで指定したパスからの相対パスになります
        request: 'GetUser.req.vtl'
        # 関数のレスポンスマッピングテンプレートのファイルパスを指定します
        response: 'GetUser.res.vtl'
```
<br/>

関数定義は、エンドポイントの画面を開き`Functions`を確認します。
関数が一覧表示されるので、一覧から今回`serverless.yml`に定義した関数を選択すると、以下のように詳細が確認できます。
![](appsync-gui-function.png)

<br/>

設定ファイルの説明は以上です。次にリゾルバーとスキーマの定義について説明します。


## 4. リゾルバー作成

`mapping-templates`フォルダを作成し、その中にリクエストマッピングテンプレートとレスポンスマッピングテンプレートを作成します。


PipelineResolver用のマッピングテンプレート
```velocity:title=mapping-templates/start.vtl
{}
```
<br/>

PipelineResolver用のマッピングテンプレート
```velocity:title=mapping-templates/end.vtl
$util.toJson($ctx.result)
```
<br/>

ユーザー1件取得用の関数ではDynamoDBのGetItemを呼び出します。
```velocity:title=mapping-templates/GetUser.req.vtl
{
    "version": "2018-05-29",
    "operation": "GetItem",
    "key": {
        "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
    }
}
```
<br/>

取得情報をレスポンスにて返却します。
```velocity:title=mapping-templates/GetUser.res.vtl
#if($ctx.error)
  $util.error($ctx.error.message, $ctx.error.type)
#end

#set($res = { "user": $ctx.result })
$util.toJson($res)
```
<br/>

## 5. スキーマ作成


ユーザー情報（ID、名前）を1件検索するだけのシンプルなスキーマ定義です。
`serverless.yml`の`schema`で指定した通り、プロジェクトルートに`schema.graphql`ファイルを作成します。

```graphql{14-20}:title=schema.graphql
type User {
    id: ID!
    name: String
}

type UserResponse {
  user: User
}

input GetUserInput {
  id: ID!
}

# ユーザー1件取得
type Query {
    user(id: ID!): UserResponse
}
```



## 6. AWSにデプロイ

以下コマンドを実行します。とても簡単にデプロイできます。

```
serverless deploy -v
```
<br/>


## まとめ

今回はAppSync + Serverless FrameworkによるAppSync資産の構成管理についてご紹介しました。
複数人開発においてGUI操作の場合、意図せず変更が加えられてデグレするリスクがあるので、Serverless Frameworkを使って構成管理するのが得策です。
またServerless Frameworkの利点はなんといっても1コマンドでAWSにデプロイという手軽さです。
AppSync資産だけでなく、Lambdaや他資産もServerless Frameworkで管理できるので、AWSでサーバーレスなアプリを開発するときは是非使ってみてください🍅

## 参考
* [Building an AppSync + Serverless Framework Backend | FooBar](https://foobar123.com/building-an-appsync-serverless-framework-backend-foobar-c383a840de0d)
