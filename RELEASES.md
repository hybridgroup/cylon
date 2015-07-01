## Release History

Version | Notes
------- | -----
1.1.0   | Clean ups, refactorings, misc. bug fixes.
1.0.0   | Remove deprecated Device and Connection syntax, add Basestar#respond method
0.22.2  | Bug-fix for Registry loader
0.22.1  | Remove lodash, misc. bug fixes
0.22.0  | API extraction, new devices syntax.
0.21.2  | Update Robeaux version
0.21.1  | Add back debug logging for starting/connecting devices/connections
0.21.0  | Remove Connection/Device objects, update Robot connection/device syntax, fluent syntax updates
0.20.2  | Correct API issues, possible issue with test setups
0.20.1  | Revert accidental scrict handling of param in driver initializer
0.20.0  | Browser support, new module loading, log level support, misc. development changes
0.19.1  | Correct issue with dynamic method proxying
0.19.0  | Fluent syntax, improved start/halt, various other updates
0.18.0  | Updates Robot and Driver commands structure
0.17.0  | Updates to API to match CPPP-IO spec
0.16.0  | New IO Utils, removal of Utils#bind, add Adaptor#_noop method.
0.15.1  | Fixed issue with the API on Tessel
0.15.0  | Better halting, cleaner startup, removed 'connect' and 'start' events, and misc other cleanups/refactors.
0.14.0  | Removal of node-namespace and misc. cleanup
0.13.3  | Fixes bug with disconnect functions not being called.
0.13.2  | Use pure Express, adds server-sent-events, upd API.
0.13.1  | Add API authentication and HTTPS support
0.13.0  | Set minimum Node version to 0.10.20, add utils to global namespace and improve initialization routines
0.12.0  | Extraction of CLI tooling
0.11.2  | bugfixes
0.11.0  | Refactor into pure JavaScript
0.10.4  | Add JS helper functions
0.10.3  | Fix dependency issue
0.10.2  | Create connections convenience vars, refactor config loading
0.10.1  | Updates required for test driven robotics, update Robeaux version, bugfixes
0.10.0  | Use Robeaux UX, add CLI commands for helping connect to devices, bugfixes
0.9.0   | Add AngularJS web interface to API, extensible commands for CLI
0.8.0   | Refactored Adaptor and Driver into proper base classes for easier authoring of new modules
0.7.0   | cylon command for generating new adaptors, support code for better GPIO support, literate examples
0.6.0   | API exposes robot commands, fixes issues in driver/adaptor init
0.5.0   | Improve API, add GPIO support for reuse in adaptors
0.4.0   | Refactor proxy in Cylon.Basestar, improve API
0.3.0   | Improved Cylon.Basestar, and added API
0.2.0   | Cylon.Basestar to help develop external adaptors/drivers
0.1.0   | Initial release for ongoing development
