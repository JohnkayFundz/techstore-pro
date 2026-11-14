# Third-Party Notices — Partial Inventory

**Status: PARTIAL — NOT A COMPLETE DISTRIBUTION NOTICE.**  
This file records two exact backend dependency versions whose lockfile entries omit the modern SPDX `license` field but whose upstream release packages contain an MIT declaration and license text. Do not treat this file as complete legal clearance or distribute the archive until notices for every included dependency and asset have been checked.

## busboy 1.6.0

Upstream: https://github.com/mscdex/busboy/tree/v1.6.0  
License declaration: legacy package metadata `licenses: [{ "type": "MIT" }]`.  
The upstream `v1.6.0/LICENSE` file contains the following notice:

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

## streamsearch 1.1.0

Upstream: https://github.com/mscdex/streamsearch/tree/v1.1.0  
License declaration: legacy package metadata `licenses: [{ "type": "MIT" }]`.  
The upstream `v1.1.0/LICENSE` file contains the same Brian White MIT notice reproduced above. Preserve it for this package as well.

## Still required before customer delivery

- Generate a complete notice inventory for every dependency in both root and `server/` lockfiles.
- Inspect package license texts and any MPL-2.0 source-distribution obligations for the exact packages included.
- Decide whether the archive contains source only or any installed dependencies; this partial notice does not authorize bundling `node_modules`.
- Clear all image, font, icon, and trademark assets separately.
- Review the final archive after it is built.

This document is a compliance workpaper, not legal advice.
