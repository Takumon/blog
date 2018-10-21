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
    "url": "webpack-runtime-4a939d69a4fb148caad8.js"
  },
  {
    "url": "app.32e5e9a04cb9b3726787.css"
  },
  {
    "url": "app-8477e4d0ce0c495c67e5.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-573209a1599196afacaa.js"
  },
  {
    "url": "index.html",
    "revision": "47333c2e4e1499a83eef2d114a4f816a"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "0f744923a21b1d067b6ef40d789027c8"
  },
  {
    "url": "0.c6fa608cc83d80151d58.css"
  },
  {
    "url": "1.131c12c085b126f179eb.css"
  },
  {
    "url": "component---src-pages-index-js.6cb0d84404354d807025.css"
  },
  {
    "url": "1-e5d4fafb6c2f9100722f.js"
  },
  {
    "url": "component---src-pages-index-js-d15212369a78a7991fd5.js"
  },
  {
    "url": "2-ef39867a691b31c2bd2d.js"
  },
  {
    "url": "0-c74f65641e0687301690.js"
  },
  {
    "url": "static/d/16/path---index-6a9-qmzTdKuPerzLUARRB0WDiEg5WyU.json",
    "revision": "33292fc3d30761f49438af3f7d3b2807"
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