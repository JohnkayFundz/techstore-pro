# Admin order lifecycle integration tests

These tests use Node's built-in test runner and a temporary, single-node MongoDB
replica set created by `mongodb-memory-server`. A replica set is important:
a standalone in-memory MongoDB instance does not provide multi-document
transaction support.

## Run locally (from this isolated branch)

From the repository root:

```powershell
Set-Location .\server
npm install --no-save mongodb-memory-server
node --test .\tests\adminOrderLifecycle.integration.test.js
```

The first run may download a MongoDB binary into the local cache, so an internet
connection and sufficient disk space are required. Test data lives only in the
temporary in-memory database. Do not set a production `MONGODB_URI` for this
test; the script creates and connects to its own temporary replica set.

The test file intentionally does not add a dependency to `server/package.json`
or change either lockfile yet. After the tests are run and reviewed, decide
whether to formalize the dependency and add a dedicated npm script.

## Covered behaviours

- Reject an invalid pending-to-delivered transition without changing state.
- Prevent deleting a pending order and allow deleting a cancelled order.
- Race two cash-payment confirmations and verify only one changes pending to paid.
- Verify cancellation restores inventory.
- Race two cancellation requests and verify stock is restored no more than once.
- Verify a missing product causes the transaction to roll back earlier stock
  changes and preserve the order's original status.

These are integration-test assertions, not a claim that the suite has passed.
