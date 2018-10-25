/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.2/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.2"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-46ff817ea76a01f4e96f.js"
  },
  {
    "url": "app.32e5e9a04cb9b3726787.css"
  },
  {
    "url": "app-dd2214b38469e16d6e45.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-573209a1599196afacaa.js"
  },
  {
    "url": "index.html",
    "revision": "51a9f7642209b5553f7aef39f85cb6c6"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "79fde07befcec5ac17a3175ad0cdf583"
  },
  {
    "url": "0.bfee538056bf9ededf7e.css"
  },
  {
    "url": "1.ef3f366bef251e48a795.css"
  },
  {
    "url": "component---src-pages-index-js.9e0cf4c5eb8fd9848064.css"
  },
  {
    "url": "1-df0d1301e1bc9234275a.js"
  },
  {
    "url": "component---src-pages-index-js-e74aa26451e1c0bb7602.js"
  },
  {
    "url": "2-ee841b0ed6eb3869d82b.js"
  },
  {
    "url": "0-57c1344c79857afe96cb.js"
  },
  {
    "url": "static/d/104/path---index-6a9-Se9spiEfHCPxgwR1fbZznG8NhI.json",
    "revision": "ef6f2a90987f3dc34177baf94071ed72"
  },
  {
    "url": "component---src-pages-404-js-1cb8b3e4728723c88d23.js"
  },
  {
    "url": "static/d/164/path---404-html-516-62a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "static/d/520/path---offline-plugin-app-shell-fallback-a-30-c5a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "8c30a982939b0e6bcd32989568875461"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/offline-plugin-app-shell-fallback/index.html", {
  whitelist: [/^[^?]*([^.?]{5}|\.html)(\?.*)?$/],
  blacklist: [/\?(.+&)?no-cache=1$/],
});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, workbox.strategies.staleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https:/, workbox.strategies.networkFirst(), 'GET');
"use strict";

/* global workbox */
self.addEventListener("message", function (event) {
  var api = event.data.api;

  if (api === "gatsby-runtime-cache") {
    var resources = event.data.resources;
    var cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then(function (cache) {
      return Promise.all(resources.map(function (resource) {
        return cache.add(resource).catch(function (e) {
          // ignore TypeErrors - these are usually due to
          // external resources which don't allow CORS
          if (!(e instanceof TypeError)) throw e;
        });
      }));
    }));
  }
});