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
    "url": "webpack-runtime-c629b18e8d00454b97b7.js"
  },
  {
    "url": "app-30c203bab7d189ed2c62.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-2d2526907e24b48cb36b.js"
  },
  {
    "url": "index.html",
    "revision": "d1e568dacc1f716e3c8bd1505847d0f8"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "817ad7b8859c8e1bc4b0ee4a29bab658"
  },
  {
    "url": "1.663c073932e6503df3bb.css"
  },
  {
    "url": "0.30d807ae38483c3b640f.css"
  },
  {
    "url": "component---src-pages-index-js.0e364a58a62502ed1b90.css"
  },
  {
    "url": "component---src-pages-index-js-7f3f0c3a4b095c988ec0.js"
  },
  {
    "url": "1-306f21068a26fdd7cf5d.js"
  },
  {
    "url": "0-bcd622fd9771f4bc8964.js"
  },
  {
    "url": "static/d/268/path---index-6a9-si2C6DKbYjcaFSJVAlJ7rsve6Cc.json",
    "revision": "e79d9573936987a907ed79afd4a843ab"
  },
  {
    "url": "component---src-pages-404-js-684b089e971ce662fd9c.js"
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
    "revision": "241f9b601ea78312bf1e7211139d6682"
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