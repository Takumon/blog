---
title: 'AWS AppSyncで入力チェックエラーを複数返す方法'
date: '2019-02-26T07:30:00.000+09:00'
tags:
  - AppSync
  - AWS
  - GraphQL
keywords:
  - AppSync
slug: /mutliple-validation-errors-in-aws-appsync
thumbnail: thumbnail/2019/02/mutliple-validation-errors-in-aws-appsync.png
---

## なにこれ
AppSyncのリゾルバーでDynamoDBのデータを更新する場合、更新処理の前に入力チェックは必ず実施すると思います。
この時、入力チェックエラーを見つけた時点で1つのエラーメッセージを返すより、
すべてのチェック実施後にまとめてエラーメッセージを返してあげたほうが、AppSyncの呼び出し側としては助かります。
ただ、このやり方は調べてもあまり出てきませんでした。そのため本記事で紹介します。

## 結論

たとえば、人(ID、名前、組織名)を更新する場合

```graphql:title=人(ID、名前、組織名)を更新するmutation
mutation {
  updatePerson (input: {
    id
    name
    organizationName
  }){
    person {
      id
      name
      organizationName
    }
  }
}
```
<br/>

以下のようにリクエストマッピングテンプレートのVTLを記述します。

```velocity{2,5,9,12,16-18}:title=複数エラーメッセージを返すVTL
#if($util.isNullOrBlank($ctx.args.input.name))
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end 
#if($ctx.args.input.name.length() > 30))
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end

#if($util.isNullOrBlank($ctx.args.input.organizationName))
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end 
#if($ctx.args.input.organizationName.length() > 30))
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end


#if($ctx.outErrors.size() > 0)
  #return($ctx.outErrors)
#end

{
  "operation" : "PutItem",
  "key" : {
    "id" : { "S" : "${ctx.args.input.id}" }
  },
  "condition" : {
    "expression" : "attribute_exists(id)"
  },
  "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args.input)
}
```

<br/>


## 実際どのようなレスポンスが返ってくるか

以下のmutationを発行してみると...


```graphql:title=複数の入力チェックエラーになるようなmutation
mutation {
  updatePerson(input: {
    id: "1234"
    name: "あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前"
    organizationName: "あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名"
  }) {
    person {
      id
      name
      organizationName
    }
  }  
}
```
<br/>

複数エラーメッセージを含むレスポンスが返ってきます！


```graphql{9-22,25-38}:title=複数エラーメッセージを含むレスポンス
{
  "data": {
    "updatePerson": {
      "person": null
    }
  },
  "errors": [
    {
      "path": [
        "updatePerson"
      ],
      "data": null,
      "errorType": "name",
      "errorInfo": "あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前あきらかに文字数オーバーの名前",
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": null
        }
      ],
      "message": "名前は30文字以下で入力してください。"
    },
    {
      "path": [
        "updatePerson"
      ],
      "data": null,
      "errorType": "organizationName",
      "errorInfo": "あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名あきらかに文字数オーバーの組織名",
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": null
        }
      ],
      "message": "組織名は30文字以下で入力してください。"
    }
  ]
}
```
<br/>


## 結論に至るまでの試行錯誤

[AppSyncの公式ドキュメント](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-util-reference.html)を見ると、`$util.appendError`が使えそうだと思ったのですが、いざ書こうとすると、以下2点につまづきました。

1. 「1つ以上入力チェックエラーがある」ことをどうやって判定するのか
2. 複数エラー情報をどうやってレスポンスとして返すのか

### 1. 「1つ以上入力チェックエラーがある」ことをどうやって判定するのか

最初に考えたのは、`#set($valid=true)`のようにフラグで判断する方法です。

```velocity{1-2,5-6,10,15,19,24-27}:title=validフラグで判定する方法
## 事前にフラグを定義しておく
#set($valid = true)

#if($util.isNullOrBlank($ctx.args.input.name))
  ## チェックNGの場合はフラグを更新
  #set($valid=false)
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end 
#if($ctx.args.input.name.length() > 30))
  #set($valid=false)
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end

#if($util.isNullOrBlank($ctx.args.input.organizationName))
  #set($valid=false)
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end 
#if($ctx.args.input.organizationName.length() > 30))
  #set($valid=false)
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end


#if($valid == false)
  ## 異常時の処理
#end
```
<br/>


ただこれだと記述が冗長です。<br/>
appendErrorしたエラーはどこに格納されているのか？<br/>
`$util.error($util.toJson($context))`をして`$context`の中身を確認してみると、
どうやら`$context.outErrors`に格納されているということがわかりました。<br/>
それを踏まえて処理を以下のようにリファクタリングしました。

```velocity{16-18}:title=validフラグを使わずに判定する方法
#if($util.isNullOrBlank($ctx.args.input.name))
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end 
#if($ctx.args.input.name.length() > 30))
  $util.appendError("名前は30文字以下で入力してください。", "name", null, $ctx.args.input.name)
#end

#if($util.isNullOrBlank($ctx.args.input.organizationName))
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end 
#if($ctx.args.input.organizationName.length() > 30))
  $util.appendError("組織名は30文字以下で入力してください。", "organizationName", null, $ctx.args.input.organizationName)
#end


#if($ctx.outErrors.size() > 0)
  ## 異常時の処理
#end
```
<br/>

### 2. 複数エラー情報をどうやってレスポンスとして返すのか
`$util.appendError`はエラーを追加してくれるだけです。`$util.error`は1つのエラー情報しか返してくれません。<br/>
試行錯誤した結果、`#return`で返せそうだということがわかりました。<br/>
1の調査結果により`$util.appendError`で詰めたエラー情報は`$ctx.outErrors`に格納されていることがわかっていたので、
それら踏まえて以下のようにしました。

```velocity:title=エラー時に複数エラーメッセージを返すにはreturnを使う
  #return($ctx.outErrors)
```
<br/>


## まとめ
VLTは結構めんどくさいですが、ちょっとずつ慣れてきました。
ググってもAppSyncのVTL系の情報は、まだあまり見かけません。そのため今後もノウハウがたまったら記事を書きます🍅