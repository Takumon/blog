---
title: 'AppSync + serverlessによるソースコードの構成管理'
date: '2019-03-04T07:50:00.000+09:00'
tags:
  - AppSync
  - serverless
  - AWS
  - GraphQL
keywords:
  - AppSync
slug: /aws-appsync-and-serverless-framework
thumbnail: /thumbnail/2019/03/aws-appsync-and-serverless-framework.png
---

![aws-appsync-and-serverless-framework](/thumbnail/2019/03/aws-appsync-and-serverless-framework.png)

## なにこれ

AWSのGraphQLマネージドサービス「[AppSync](https://aws.amazon.com/jp/appsync/)」はGUIで簡単に定義ができて非常に便利ですが、
本格的に開発を進めていくとGUIポチポチでソースコードを管理するのはつらくなってきます。
**[Serverless](https://serverless.com/)というツールと[serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin)（serverlessのプラグイン）を使うと、AppSyncの設定をymlファイルで管理し、CLIでAWS上にアップできるので、GitHub等で構成管理が可能になります。**
AppSyncからDynamoDBのユーザー情報を1件取得する場合を例にしてご紹介します。

1. [🔰 serverlessの設定](#1-serverlessの設定)
2. [💪 プロジェクトのひな型作成](#2-プロジェクトのひな型作成)
3. [📝 設定ファイル作成](#3-設定ファイル作成)
4. [💖 リゾルバー作成](#4-リゾルバー作成)
5. [💎 スキーマ作成](#5-スキーマ作成)
6. [🎊 AWSにデプロイ](#6-awsにデプロイ)

## 1. serverlessの設定

* serverlessはnpmで提供されるCLIツールです。まずはnpmでインストールします。

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
[serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin)は[aws-sdk](https://github.com/aws/aws-sdk-js)とあわせてインストールします。
```
mkdir appsync-sample-with-serverless
cd appsync-sample-with-serverless
npm init -y
npm i serverless-appsync-plugin aws-sdk
```
<br/>

## 3. 設定ファイル作成

プロジェクト直下にserverlessの設定ファイル`servserless.yml`を作ります。
まずは全量を示します。
  
```yaml:title=servserless.yml
# サービス名
service: appsync-serverless-sample
provider:
  name: aws
  # ステージ、デプロイ先を開発、運用などで分けたい場合はココを切り替えます
  stage: production
  # デプロイ先のリージョンです
  region: ap-northeast-1
# AppSyncのプラグインを指定します
plugins:
  - serverless-appsync-plugin
# serverlessではプラグイン関連の設定はcustomで行います
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
      # スキーマ定義で認証設定が記述されていない場合の挙動を指定します
      # DENYを指定すると、認証されたいかなるユーザーも認可エラーに倒します
      defaultAction: DENY
      # CognitoのユーザープールのIDを指定します
      userPoolId: ap-northeast-1_U0e7zFRLQ
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


以下で、ブロックごとにGUIとの紐づけを説明します。

### AppSyncの基本設定

```yaml
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
      # スキーマ定義で認証設定が記述されていない場合の挙動を指定します
      # DENYを指定すると、認証されたいかなるユーザーも認可エラーに倒します
      defaultAction: DENY
      # CognitoのユーザープールのIDを指定します
      userPoolId: ap-northeast-1_U0e7zFRLQ
    # AppSyncのスキーマ定義ファイルのパスを指定します
    # デフォルトだとschema.graphqlです
```

![](appsync-gui-main.png)

<br/>



### データソース定義

```yaml
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

![](appsync-gui-datasource.png)

<br/>


### リゾルバー定義

```yaml
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

![](appsync-gui-resolver.png)
![](appsync-gui-resolver-2.png)
<br/>

### 関数定義

```yaml
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

![](appsync-gui-function.png)

<br/>
<br/>

設定ファイルの説明は以上です。以下では設定ファイルで指定した、リゾルバーとスキーマの定義について説明します。


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

以下コマンドを実行します。

```
serverless deploy -v
```
<br/>


## まとめ

今回はAppSync + serverlessによるAppSync資産の構成管理方法についてご紹介しました。
複数人で開発する場合は、GUIだと意図せず変更が加えられてデグレするリスクがあるので、serverlessを使って構成管理するのが得策です🍅

## 参考
* [Building an AppSync + Serverless Framework Backend | FooBar](https://foobar123.com/building-an-appsync-serverless-framework-backend-foobar-c383a840de0d)
