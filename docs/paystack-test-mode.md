# Paystack Test Mode

This integration uses Paystack's hosted checkout redirect, so the backend secret key is the only Paystack key required by the current flow. Never place the secret key in frontend variables, commit it, or paste it into chat.

## Backend environment

Set these values in the backend deployment's environment-variable settings (or a local, untracked `.env` file):

```dotenv
PAYSTACK_MODE=test
PAYSTACK_SECRET_KEY=sk_test_replace_with_your_test_secret
CLIENT_URL=http://localhost:5173
```

Use a real test secret from your Paystack dashboard; the placeholder above will not authenticate. Keep the test key in development until all tests and lifecycle checks pass. Do not set `PAYSTACK_MODE=live` during this implementation.

## Flow

1. Checkout creates an order using server-loaded product prices.
2. The authenticated backend initializes Paystack using the stored order total converted to kobo.
3. The browser is redirected to Paystack-hosted checkout.
4. On return, the browser's reference is sent to the authenticated server verification endpoint. The backend checks Paystack's transaction status, reference, NGN currency, and exact amount.
5. The signed `charge.success` webhook independently performs the same order checks. Duplicate success events are safe to replay.
6. Card orders have a 30-minute expiry timestamp. The background expiry worker verifies provider state before marking a failed/abandoned payment failed and releasing reserved stock. If Paystack is unreachable or still reports an uncertain status, expiry is deferred.

## Webhook configuration

Configure this backend URL in the Paystack dashboard:

```
https://YOUR_API_HOST/api/payments/webhook
```

The Express JSON parser captures the exact raw bytes for this path. The webhook is excluded from browser-origin CSRF checks only because the handler requires a valid HMAC-SHA512 signature. Keep API rate limiting and other security middleware enabled.

## Local checks

From the `server` directory:

```powershell
npm test
```

Then exercise a complete test-mode checkout, an unsuccessful/abandoned payment, a duplicate `charge.success` delivery, an invalid webhook signature, and mismatched amount/currency/reference. Confirm the order only shows Paid after backend verification or a valid webhook. Check that expired unpaid card orders release stock only after provider state is confirmed failed or abandoned.

## Important deployment note

The expiry worker runs inside the long-lived `server/server.js` process. If the API is deployed on a serverless platform, move this worker to a scheduled job/cron before enabling card checkout. Do not consider the payment integration production-ready until the test suite and deployed end-to-end checks pass.
