---
title: 'VuetifyのDataTableとPaginationの状態をVuexで管理する'
date: '2019-04-28T20:30:00.000+09:00'
tags:
  - Vue.js
  - Vuetify
  - Vuex
keywords:
  - Vue.js
slug: /vuetify-datatable-and-pagination-with-vuex
thumbnail: thumbnail/2019/04/vuetify-datatable-and-pagination-with-vuex.png
---

## なにこれ

VuetifyのDataTableとPaginationを使った検索一覧画面でページングの状態を、ルーティングをまたいで保存しておきたい。という要望を満たすため、ページングの状態をVuexで管理する方法をメモします。
DataTableだけだとすんなりできますが、Paginationもあわせて使う場合は少し雑な実装になってしまいます。

## やり方

まずはストアに以下のように定義します。
アクションには「ページングオブジェクト保存」と「ページングオブジェクトのページのみ保存」の2種類を用意します。

```javascript:title=サンプル実装（Vuex側）
export default new Vuex.Store({
  state: {
    pagination: {
      page: 1,
      rowsPerPage: 20,
      sortBy: 'id',
      descending: false,
    },
  },

  getter: {
    getPagination: state => state.pagination,
  },

  actions: {
    SAVE_PAGINATION({ commit }, payload) {
      const {
        page,
        rowsPerPage,
        sortBy,
        descending,
      } = payload;

      commit('savePagination', {
        page,
        rowsPerPage,
        sortBy,
        descending,
      });
    },

    SAVE_PAGINATION_PAGE({ commit }, payload) {
      const { page } = payload;
      commit('savePaginationPage', page);
    },
  },

  mutations: {
    savePagination(state, pagination) {
      state.pagination = pagination;
    },
    savePaginationPage(state, page) {
      state.pagination.page = page;
    },
  },
});
```
<br/>


次にコンポーネント側です。
`v-data-table`,`v-pagination`ともにVuexのページングオブジェクトを参照し、UIで変更があればVuexのアクションを呼び出します。それぞれのタグで微妙にやり方が違います。
もう少しスマートにしたかったのですが、実際動かしてみた感じだとどうしてもスマートにはできませんでした。

```javascript{9,24-25,48-57,60-63,77-78}:title=サンプル実装（コンポーネント側）
<template>
  <div>

    <!--
      ページングはpaginationに任せるのでhide-actionsを指定している
      pagination.syncにはgetterとsetterを持たせたpaginationを指定
    -->
    <v-data-table
      :pagination.sync="pagination"
      :items="items"
      hide-actions
    >
    <!-- テーブルの中身 -->
    </v-data-table>

    <!--
      valueでVuexのページングオブジェクトを参照して
      UI側からの変更は@inputでVuexのアクションを呼び出す
    -->
    <v-pagination
      :length="pages"
      v-if="pages >= 2"
      :total-visible="7"
      :value="paginationPage"
      @input="savePaginationPageInStore({ page: $event })"
    />

  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {


  date() {
    return {
      items: []
    }
  },


  computed: {
    ...mapGetters({
      paginationInStore: 'getPagination',
    }),

    pagination: {
      // Vuexのページングオブジェクトを参照
      get() {
        return this.paginationInStore;
      },
      // UI側から変更があった場合はSetter経由でVuexのアクションを呼び出す
      set(pagination) {
        this.savePaginationInStore(pagination);
      },
    },

    // ページネーション参照用
    paginationPage() {
      return this.paginationInStore.page;
    },

    // ページネーション用ページ数算出メソッド
    pages() {
      if (this.pagination.rowsPerPage == null || this.items == null || this.items.length === 0) {
        return 0;
      }

      return Math.ceil(this.items.length / this.pagination.rowsPerPage);
    },
  },


  methods: {
    ...mapActions({
      savePaginationInStore: 'SAVE_PAGINATION',
      savePaginationPageInStore: 'SAVE_PAGINATION_PAGE',
    }),
  },
}
</script>
```
<br/>

これでルーティングをまたいでページングオブジェクトを保持できるようになりました。
実用の場面では、検索条件もVuexに持たせて、ページングオブジェクトと連動させて使います。<br/>
以上です🍅