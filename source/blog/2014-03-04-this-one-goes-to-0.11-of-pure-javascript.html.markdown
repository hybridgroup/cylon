---
page_title_show: true
title: This One Goes To 0.11 Of Pure JavaScript
page_title: Blog
date: 2014-03-04
tags: robots
author: Ron Evans
---

Immediately after our SCaLE 12x talk, Team Cylon.js made a big push forward, and we've released version 0.11 of our JavaScript framework for open source robotics and the Internet of Things. The major focus of this release has been refactoring the core into pure JavaScript, away from the CoffeeScript that we had previously been using. 

There are a number of key reasons why we've gone to a pure JavaScript code base:

- Performance is better when the toolchain is simpler. Not only are we now using just JavaScript, we've also removed Grunt. So how are we running our builds? We're using `make` now, and we can run our tests in around 40ms.
- When spelunking the code, there is less code to look thru and search thru to find what you need. Many programmers use search tools like awk or grep as a key part of their workflow.
- Debugging easier, especially when looking for problems in broken tests.
- We do not really need any compiled language features of CoffeeScript. By writing better and more modular JavaScript, we can get many of the same benefits. Even when ES6 comes out, many lower-powered SoC devices might take a while to support all the new language features.
- We want to make it even easier for people to use Cylon.js and contribute back to it. Not as many people know CoffeeScript compared to plain JavaScript people. The open source project Discourse has blogged about this recently.

We had already done the needed work to create a test suite to support such a serious refactor. Even with that prep, it took some dedicated effort, and a lot of coffee to remove all the CoffeeScript from core. But by keeping things green and clean, we made remarkable progress. We even refactored all of our adaptors and drivers into pure JavaScript too.

For those who adore CoffeeScript, you can still continue to develop your robotic applications that way. And we will continue to provide examples for both JavaScript and CoffeeScript. But for the purists among us, Cylon.js is now leaner and tighter than ever.

Make sure to follow us on Twitter at [@cylonjs](http://twitter.com/cylonjs) for the latest updates. We think that release 0.11 was a big step forward for the code and the project. We hope you agree. Please let us know what you think!
