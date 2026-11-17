# TechStore Pro — Third-Party Notices

**REVIEW BUNDLE — NOT YET COMPLETE / NOT LEGAL CLEARANCE.** This commit adds the exact-version production dependency register and an automated notice collector. The copyright headers and full upstream license texts for all packages have not yet been independently collected. Do not distribute a buyer archive until the collector reports complete, the results are reviewed, and the commercial license is finalized.

## Scope and source

The table below covers 296 production dependency lockfile entries: 166 root entries and 130 backend entries. Versions and SPDX expressions are read from the committed `package-lock.json` and `server/package-lock.json`; they are not inferred from semver ranges. Nested copies are listed separately because they can have distinct versions.

The `Copyright / notice header` column is deliberately marked pending rather than guessed. Run `npm ci` at the repository root and `npm ci` in `server/`, then run `npm run notices:generate`. The collector verifies installed package versions against both lockfiles, extracts package metadata and full license/notice files, and writes a detailed package-by-package notice bundle. It exits non-zero if any production package lacks verifiable license text or an exact installed version.

## Production package register

| Scope | Package | Locked version | Lockfile SPDX expression | Copyright / notice header |
|---|---|---:|---|---|
| backend | `@mongodb-js/saslprep` | `1.4.13` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `@types/webidl-conversions` | `7.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `@types/whatwg-url` | `11.0.5` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `accepts` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `append-field` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `basic-auth` | `2.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `bcryptjs` | `3.0.3` | `BSD-3-Clause` | Not yet extracted from exact upstream license file |
| backend | `body-parser` | `2.4.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `bson` | `6.10.4` | `Apache-2.0` | Not yet extracted from exact upstream license file |
| backend | `buffer-equal-constant-time` | `1.0.1` | `BSD-3-Clause` | Not yet extracted from exact upstream license file |
| backend | `busboy` | `1.6.0` | `UNKNOWN` | Not yet extracted from exact upstream license file |
| backend | `bytes` | `3.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `call-bind-apply-helpers` | `1.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `call-bound` | `1.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cloudinary` | `2.11.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `compressible` | `2.0.18` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `compression` | `1.8.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `content-disposition` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `content-type` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `content-type` | `1.0.5` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `content-type` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cookie` | `0.7.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cookie-parser` | `1.4.7` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cookie-signature` | `1.0.6` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cookie-signature` | `1.2.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `cors` | `2.8.6` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `debug` | `2.6.9` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `debug` | `4.4.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `debug` | `2.6.9` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `depd` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `destroy` | `1.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `dotenv` | `17.4.2` | `BSD-2-Clause` | Not yet extracted from exact upstream license file |
| backend | `dunder-proto` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `ecdsa-sig-formatter` | `1.0.11` | `Apache-2.0` | Not yet extracted from exact upstream license file |
| backend | `ee-first` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `encodeurl` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `es-define-property` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `es-errors` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `es-object-atoms` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `escape-html` | `1.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `etag` | `1.8.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `express` | `5.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `express-rate-limit` | `8.6.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `finalhandler` | `2.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `forwarded` | `0.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `fresh` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `function-bind` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `get-intrinsic` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `get-proto` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `gopd` | `1.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `has-symbols` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `hasown` | `2.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `helmet` | `8.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `http-errors` | `2.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `iconv-lite` | `0.7.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `inherits` | `2.0.4` | `ISC` | Not yet extracted from exact upstream license file |
| backend | `ip-address` | `10.7.6` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `ipaddr.js` | `1.9.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `is-promise` | `4.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `jsonwebtoken` | `9.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `jwa` | `2.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `jws` | `4.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `kareem` | `2.6.3` | `Apache-2.0` | Not yet extracted from exact upstream license file |
| backend | `lodash` | `4.18.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.includes` | `4.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.isboolean` | `3.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.isinteger` | `4.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.isnumber` | `3.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.isplainobject` | `4.0.6` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.isstring` | `4.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `lodash.once` | `4.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `math-intrinsics` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `media-typer` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `media-typer` | `0.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `memory-pager` | `1.5.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `merge-descriptors` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mime-db` | `1.54.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mime-db` | `1.52.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mime-types` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mime-types` | `2.1.35` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mongodb` | `6.20.0` | `Apache-2.0` | Not yet extracted from exact upstream license file |
| backend | `mongodb-connection-string-url` | `3.0.2` | `Apache-2.0` | Not yet extracted from exact upstream license file |
| backend | `mongoose` | `8.24.9` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `morgan` | `1.12.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mpath` | `0.9.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `mquery` | `5.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `ms` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `ms` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `ms` | `2.1.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `multer` | `2.5.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `negotiator` | `0.6.4` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `negotiator` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `object-assign` | `4.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `object-inspect` | `1.13.4` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `on-finished` | `2.4.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `on-headers` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `once` | `1.4.0` | `ISC` | Not yet extracted from exact upstream license file |
| backend | `parseurl` | `1.3.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `path-to-regexp` | `8.4.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `proxy-addr` | `2.0.8` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `punycode` | `2.3.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `qs` | `6.17.1` | `BSD-3-Clause` | Not yet extracted from exact upstream license file |
| backend | `range-parser` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `raw-body` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `router` | `2.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `safe-buffer` | `5.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `safe-buffer` | `5.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `safer-buffer` | `2.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `semver` | `7.8.5` | `ISC` | Not yet extracted from exact upstream license file |
| backend | `send` | `1.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `serve-static` | `2.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `setprototypeof` | `1.2.0` | `ISC` | Not yet extracted from exact upstream license file |
| backend | `side-channel` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `side-channel-list` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `side-channel-map` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `side-channel-weakmap` | `1.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `sift` | `17.1.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `sparse-bitfield` | `3.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `statuses` | `2.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `streamsearch` | `1.1.0` | `UNKNOWN` | Not yet extracted from exact upstream license file |
| backend | `toidentifier` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `tr46` | `5.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `type-is` | `1.6.18` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `type-is` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `unpipe` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `validator` | `13.15.35` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `vary` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `webidl-conversions` | `7.0.0` | `BSD-2-Clause` | Not yet extracted from exact upstream license file |
| backend | `whatwg-url` | `14.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| backend | `wrappy` | `1.0.2` | `ISC` | Not yet extracted from exact upstream license file |
| root | `@capacitor/core` | `8.6.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@kurkle/color` | `0.3.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@reduxjs/toolkit` | `2.12.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@standard-schema/spec` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@standard-schema/utils` | `0.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-array` | `3.2.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-color` | `3.1.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-ease` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-interpolate` | `3.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-path` | `3.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-scale` | `4.0.9` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-shape` | `3.1.8` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-time` | `3.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/d3-timer` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/react` | `19.2.17` | `MIT` | Not yet extracted from exact upstream license file |
| root | `@types/use-sync-external-store` | `0.0.6` | `MIT` | Not yet extracted from exact upstream license file |
| root | `accepts` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `agent-base` | `6.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `asynckit` | `0.4.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `axios` | `1.21.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `body-parser` | `2.4.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `bytes` | `3.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `call-bind-apply-helpers` | `1.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `call-bound` | `1.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `chart.js` | `4.5.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `clsx` | `2.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `combined-stream` | `1.0.8` | `MIT` | Not yet extracted from exact upstream license file |
| root | `compressible` | `2.0.18` | `MIT` | Not yet extracted from exact upstream license file |
| root | `compression` | `1.8.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `content-disposition` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `content-type` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `content-type` | `1.0.5` | `MIT` | Not yet extracted from exact upstream license file |
| root | `content-type` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `cookie` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `cookie` | `0.7.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `cookie-signature` | `1.2.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `countup.js` | `2.10.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `csstype` | `3.2.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `d3-array` | `3.2.4` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-color` | `3.1.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-ease` | `3.0.1` | `BSD-3-Clause` | Not yet extracted from exact upstream license file |
| root | `d3-format` | `3.1.2` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-interpolate` | `3.0.1` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-path` | `3.1.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-scale` | `4.0.2` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-shape` | `3.2.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-time` | `3.1.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-time-format` | `4.1.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `d3-timer` | `3.0.1` | `ISC` | Not yet extracted from exact upstream license file |
| root | `debug` | `2.6.9` | `MIT` | Not yet extracted from exact upstream license file |
| root | `debug` | `4.4.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `decimal.js-light` | `2.5.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `delayed-stream` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `depd` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `destroy` | `1.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `dunder-proto` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `ee-first` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `encodeurl` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `es-define-property` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `es-errors` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `es-object-atoms` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `es-set-tostringtag` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `es-toolkit` | `1.50.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `escape-html` | `1.0.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `etag` | `1.8.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `eventemitter3` | `5.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `express` | `5.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `express-rate-limit` | `8.6.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `finalhandler` | `2.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `follow-redirects` | `1.16.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `form-data` | `4.0.6` | `MIT` | Not yet extracted from exact upstream license file |
| root | `forwarded` | `0.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `framer-motion` | `12.42.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `fresh` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `function-bind` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `get-intrinsic` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `get-proto` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `goober` | `2.1.19` | `MIT` | Not yet extracted from exact upstream license file |
| root | `gopd` | `1.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `has-symbols` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `has-tostringtag` | `1.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `hasown` | `2.0.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `http-errors` | `2.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `https-proxy-agent` | `5.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `iconv-lite` | `0.7.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `immer` | `11.1.15` | `MIT` | Not yet extracted from exact upstream license file |
| root | `inherits` | `2.0.4` | `ISC` | Not yet extracted from exact upstream license file |
| root | `internmap` | `2.0.3` | `ISC` | Not yet extracted from exact upstream license file |
| root | `ip-address` | `10.7.6` | `MIT` | Not yet extracted from exact upstream license file |
| root | `ipaddr.js` | `1.9.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `is-promise` | `4.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `js-tokens` | `4.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `lodash.debounce` | `4.0.8` | `MIT` | Not yet extracted from exact upstream license file |
| root | `loose-envify` | `1.4.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `lucide-react` | `1.25.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `math-intrinsics` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `media-typer` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `merge-descriptors` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-db` | `1.54.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-db` | `1.54.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-db` | `1.52.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-db` | `1.54.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-db` | `1.54.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-types` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-types` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-types` | `2.1.35` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-types` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `mime-types` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `motion-dom` | `12.42.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `motion-utils` | `12.39.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `ms` | `2.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `ms` | `2.1.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `negotiator` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `negotiator` | `0.6.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `object-assign` | `4.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `object-inspect` | `1.13.4` | `MIT` | Not yet extracted from exact upstream license file |
| root | `on-finished` | `2.4.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `on-headers` | `1.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `once` | `1.4.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `parseurl` | `1.3.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `path-to-regexp` | `8.4.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `prop-types` | `15.8.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `proxy-addr` | `2.0.8` | `MIT` | Not yet extracted from exact upstream license file |
| root | `proxy-from-env` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `qs` | `6.17.1` | `BSD-3-Clause` | Not yet extracted from exact upstream license file |
| root | `range-parser` | `1.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `raw-body` | `3.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react` | `19.2.7` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-chartjs-2` | `5.3.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-countup` | `6.5.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-dom` | `19.2.7` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-error-boundary` | `6.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-hot-toast` | `2.6.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-icons` | `5.7.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-is` | `16.13.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-redux` | `9.3.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-router` | `7.18.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-router-dom` | `7.18.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `react-toastify` | `11.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `recharts` | `3.10.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `redux` | `5.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `redux-thunk` | `3.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `reselect` | `5.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `router` | `2.2.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `safe-buffer` | `5.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `safer-buffer` | `2.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `scheduler` | `0.27.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `send` | `1.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `serve-static` | `2.2.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `set-cookie-parser` | `2.7.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `setprototypeof` | `1.2.0` | `ISC` | Not yet extracted from exact upstream license file |
| root | `side-channel` | `1.1.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `side-channel-list` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `side-channel-map` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `side-channel-weakmap` | `1.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `statuses` | `2.0.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `swiper` | `14.0.6` | `MIT` | Not yet extracted from exact upstream license file |
| root | `tiny-invariant` | `1.3.3` | `MIT` | Not yet extracted from exact upstream license file |
| root | `toidentifier` | `1.0.1` | `MIT` | Not yet extracted from exact upstream license file |
| root | `tslib` | `2.8.1` | `0BSD` | Not yet extracted from exact upstream license file |
| root | `type-is` | `2.1.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `unpipe` | `1.0.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `use-sync-external-store` | `1.6.0` | `MIT` | Not yet extracted from exact upstream license file |
| root | `vary` | `1.1.2` | `MIT` | Not yet extracted from exact upstream license file |
| root | `victory-vendor` | `37.3.6` | `MIT AND ISC` | Not yet extracted from exact upstream license file |
| root | `wrappy` | `1.0.2` | `ISC` | Not yet extracted from exact upstream license file |

## Known exact-version license texts already retained

The following upstream license texts were previously verified against the exact tagged versions and are retained in the repository. The lockfile currently records their license field as `UNKNOWN`; the text is not silently substituted into the lockfile inventory.

### busboy@1.6.0 — MIT

Source file: `licenses/busboy-1.6.0-LICENSE.txt`

```text
Copyright Brian White. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
```

### streamsearch@1.1.0 — MIT

Source file: `licenses/streamsearch-1.1.0-LICENSE.txt`

```text
Copyright Brian White. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
```

## Special review items

- `victory-vendor@37.3.6` is a production dependency with the compound expression `MIT AND ISC`. The collector retains every discovered LICENSE/COPYING/NOTICE file; review vendored component attributions as well.
- `busboy@1.6.0` and `streamsearch@1.1.0` are production backend dependencies whose lockfile license field is `UNKNOWN`. Their retained exact-version upstream texts are MIT; keep both texts in every applicable distribution.
- Development-only MPL-2.0, BlueOak-1.0.0 and CC-BY-4.0 entries are not included in this production-only table. They remain recorded in `LICENSE_INVENTORY.json` and should be assessed if build tooling or its output is distributed.
- A package SPDX expression alone does not establish copyright ownership, notice sufficiency, or the legal effect of bundling. Review the actual files and applicable terms.

## Distribution gate

The release packager requires a completion sentinel emitted only by a successful full collection, plus a reviewed `COMMERCIAL_LICENSE.md`. Neither gate is satisfied in this review bundle, so archive creation must fail closed.
