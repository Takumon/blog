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
    "url": "webpack-runtime-ed0b60d3106e61a82d99.js"
  },
  {
    "url": "app.32e5e9a04cb9b3726787.css"
  },
  {
    "url": "app-fe5afe749cdae71d101a.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-573209a1599196afacaa.js"
  },
  {
    "url": "index.html",
    "revision": "2fc55b0996ec1dc4043cb64b4ddd96af"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "860d8b54adfa5418c5ff52a637c564c4"
  },
  {
    "url": "0.35054c3977b82a5d30c9.css"
  },
  {
    "url": "1.3152bf7681fb0b9183b0.css"
  },
  {
    "url": "component---src-pages-index-js.bf449a4dfbdb36279199.css"
  },
  {
    "url": "1-7ae04efd62a23aaee21b.js"
  },
  {
    "url": "component---src-pages-index-js-0a6ec3e3eddf03622de2.js"
  },
  {
    "url": "2-804d37872976e269bf59.js"
  },
  {
    "url": "0-7ad87667b7f9f6d4d627.js"
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