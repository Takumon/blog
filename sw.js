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
    "url": "webpack-runtime-a2610d747f4a9429115c.js"
  },
  {
    "url": "app-30c203bab7d189ed2c62.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-2d2526907e24b48cb36b.js"
  },
  {
    "url": "index.html",
    "revision": "3420048510abdaa51403fab47d5b89d4"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "24bab0afbb2b69ec4c2f869bdf075b33"
  },
  {
    "url": "1.9979601f78a049a46f71.css"
  },
  {
    "url": "0.596ebbdd4feb98463d7e.css"
  },
  {
    "url": "component---src-pages-index-js.fb1a73f5cb47e7013b66.css"
  },
  {
    "url": "component---src-pages-index-js-76ff9440ae8c9bc7a9d8.js"
  },
  {
    "url": "1-8fee990ab30c064857f0.js"
  },
  {
    "url": "0-1584b25acd853e2ffb7e.js"
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