# Contributing to Cylon.js

This document is based on the [Node.js contribution guidelines](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md) thank you!

## Code of Conduct

The Code of Conduct explains the *bare minimum* behavior
expectations the Cylon.js project requires of its contributors.
[Please read it before participating.](./CODE_OF_CONDUCT.md)

## Issue Contributions

When opening new issues or commenting on existing issues on this repository
please make sure discussions are related to concrete technical issues with the
Cylon.js software.

## Code Contributions

The Cylon.js project welcomes new contributors.

This document will guide you through the contribution process.

What do you want to contribute?

- I want to otherwise correct or improve the docs or examples
- I want to report a bug
- I want to add some feature or functionality to an existing hardware platform
- I want to add support for a new hardware platform

Descriptions for each of these will be provided below.

## General Guidelines

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use `git rebase -i <new_head_branch>`
  * If you have local changes you may need to use `git stash`
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Developer's Certificate of Origin 1.0

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license indicated
  in the file; or
* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source license
  and I have the right under that license to submit that work with
  modifications, whether created in whole or in part by me, under the
  same open source license (unless I am permitted to submit under a
  different license), as indicated in the file; or
* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified it.
