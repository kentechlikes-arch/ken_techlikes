import dotenv from 'dotenv';
dotenv.config({ override: true });
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DEFAULT_TILL = process.env.MPESA_TILL_NUMBER || '1856074';

interface StkTransactionState {
  checkoutRequestId: string;
  merchantRequestId: string;
  phoneNumber: string;
  amount: number;
  tillNumber: string;
  userId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  mpesaReceiptNumber?: string;
  resultCode?: string;
  resultDesc?: string;
  transactionDate?: string;
  createdAt: string;
  updatedAt: string;
}

const stkTransactions = new Map<string, StkTransactionState>();

let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

function cleanEnv(raw: string | undefined): string {
  const trimmed = (raw || '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

const SANDBOX_DEFAULT_SHORTCODE = '174379';
const SANDBOX_PUBLIC_TEST_PASSKEY =
  'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

function getMpesaConfig() {
  const envRaw = cleanEnv(process.env.MPESA_ENV || process.env.MPESA_ENVIRONMENT || 'production').toLowerCase();
  const env = envRaw === 'sandbox' ? 'sandbox' : 'production';
  const consumerKey = cleanEnv(process.env.MPESA_CONSUMER_KEY);
  const consumerSecret = cleanEnv(process.env.MPESA_CONSUMER_SECRET);
  const explicitPasskey = cleanEnv(process.env.MPESA_PASSKEY);
  const tillNumber = cleanEnv(process.env.MPESA_TILL_NUMBER) || DEFAULT_TILL;
  const explicitShortcode = cleanEnv(process.env.MPESA_SHORTCODE);

  // In Sandbox mode, Safaricom's STK simulator requires shortcode 174379 (1856074 is a live production Till)
  const shortcode =
    env === 'sandbox'
      ? !explicitShortcode || explicitShortcode === DEFAULT_TILL || explicitShortcode === tillNumber
        ? SANDBOX_DEFAULT_SHORTCODE
        : explicitShortcode
      : explicitShortcode || tillNumber;

  const passkey =
    env === 'sandbox' && shortcode === SANDBOX_DEFAULT_SHORTCODE
      ? explicitPasskey || SANDBOX_PUBLIC_TEST_PASSKEY
      : explicitPasskey;

  const missingVars: string[] = [];
  if (!consumerKey) missingVars.push('MPESA_CONSUMER_KEY');
  if (!consumerSecret) missingVars.push('MPESA_CONSUMER_SECRET');
  if (!passkey) missingVars.push('MPESA_PASSKEY');

  const baseUrl =
    env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';

  return {
    env,
    baseUrl,
    consumerKey,
    consumerSecret,
    passkey,
    tillNumber,
    shortcode,
    hasExplicitShortcode: Boolean(explicitShortcode),
    configured: missingVars.length === 0,
    missingVars,
  };
}

function normalizeKenyanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && (digits.startsWith('07') || digits.startsWith('01'))) {
    return `254${digits.slice(1)}`;
  }
  if (digits.length === 12 && (digits.startsWith('2547') || digits.startsWith('2541'))) {
    return digits;
  }
  if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
    return `254${digits}`;
  }
  return null;
}

function getEatTimestamp(): string {
  // Safaricom Daraja expects East Africa Time (UTC+3) formatted as YYYYMMDDHHmmss
  const nowEat = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const yyyy = nowEat.getUTCFullYear();
  const mm = String(nowEat.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(nowEat.getUTCDate()).padStart(2, '0');
  const hh = String(nowEat.getUTCHours()).padStart(2, '0');
  const min = String(nowEat.getUTCMinutes()).padStart(2, '0');
  const ss = String(nowEat.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}

async function getDarajaAccessToken(): Promise<string> {
  const cfg = getMpesaConfig();
  if (!cfg.configured) {
    throw new Error(`Safaricom Daraja credentials missing: ${cfg.missingVars.join(', ')}`);
  }

  if (cachedOAuthToken && Date.now() < cachedOAuthToken.expiresAt) {
    return cachedOAuthToken.token;
  }

  const credentials = Buffer.from(`${cfg.consumerKey}:${cfg.consumerSecret}`).toString('base64');
  const response = await fetch(
    `${cfg.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    let diagnosticHint = '';

    // Diagnose common Sandbox vs Production credential mismatch without exposing any secret
    if (response.status === 400) {
      const altEnv = cfg.env === 'production' ? 'sandbox' : 'production';
      const altUrl =
        altEnv === 'sandbox'
          ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
          : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
      try {
        const altRes = await fetch(altUrl, {
          method: 'GET',
          headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (altRes.ok) {
          diagnosticHint = ` Your Consumer Key & Secret belong to Daraja ${altEnv.toUpperCase()}, but MPESA_ENV is set to "${cfg.env}". Update MPESA_ENV="${altEnv}" or supply valid ${cfg.env} credentials.`;
        } else {
          diagnosticHint = ` Safaricom rejected MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET on ${cfg.env} (and ${altEnv}). Verify the Consumer Key and Consumer Secret from developer.safaricom.co.ke have no extra spaces or missing characters and that your app is approved.`;
        }
      } catch {
        diagnosticHint = ` Verify MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, and MPESA_ENV ("${cfg.env}") match your Safaricom Daraja app.`;
      }
    }

    throw new Error(
      `Safaricom OAuth failed (HTTP ${response.status})${errBody ? `: ${errBody}` : '.'}${diagnosticHint}`
    );
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: string };
  if (!data.access_token) {
    throw new Error('Safaricom OAuth response did not contain an access_token.');
  }

  const expiresSec = Number(data.expires_in || 3599);
  cachedOAuthToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(60, expiresSec - 120) * 1000,
  };

  return data.access_token;
}

function resolveCallbackUrl(req: Request): string {
  const override = cleanEnv(process.env.MPESA_CALLBACK_URL);
  if (override && override.startsWith('https://')) return override;

  const appUrl = cleanEnv(process.env.APP_URL).replace(/\/$/, '');
  if (appUrl && !appUrl.includes('MY_APP_URL') && appUrl.startsWith('https://')) {
    return `${appUrl}/api/mpesa/callback`;
  }

  const host = req.get('x-forwarded-host') || req.get('host') || '';
  if (host && !host.includes('localhost') && !host.startsWith('127.0.0.1') && !host.startsWith('0.0.0.0')) {
    return `https://${host}/api/mpesa/callback`;
  }

  // Fallback valid HTTPS URL format when tested from localhost without APP_URL set
  return 'https://kentechlikes.co.ke/api/mpesa/callback';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. M-Pesa Till Integration Readiness Endpoint (never returns secrets)
  app.get('/api/mpesa/status', async (req: Request, res: Response) => {
    const cfg = getMpesaConfig();
    const shouldVerify = req.query.verify === '1' || req.query.verify === 'true';

    let oauthOk: boolean | undefined;
    let oauthError: string | undefined;

    if (shouldVerify && cfg.configured) {
      try {
        await getDarajaAccessToken();
        oauthOk = true;
      } catch (err) {
        oauthOk = false;
        oauthError = err instanceof Error ? err.message : 'OAuth verification failed';
      }
    }

    res.json({
      configured: cfg.configured,
      env: cfg.env,
      tillNumber: cfg.tillNumber,
      shortcodeConfigured: cfg.hasExplicitShortcode,
      missingVars: cfg.missingVars,
      ...(shouldVerify ? { oauthOk, oauthError } : {}),
    });
  });

  // 2. Initiate Safaricom Lipa Na M-Pesa Buy Goods Till STK Push Prompt
  app.post('/api/mpesa/stk-push', async (req: Request, res: Response) => {
    const cfg = getMpesaConfig();
    if (!cfg.configured) {
      res.status(503).json({
        success: false,
        configured: false,
        missingVars: cfg.missingVars,
        error: `Live Till ${cfg.tillNumber} STK Push requires Safaricom Daraja API credentials in environment secrets (${cfg.missingVars.join(', ')}). Add your Daraja secrets or use SMS verification below.`,
      });
      return;
    }

    const { phoneNumber, amount, tillNumber, userId } = req.body || {};

    const normalizedPhone = normalizeKenyanPhone(String(phoneNumber || ''));
    if (!normalizedPhone) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid Safaricom M-Pesa phone number (e.g. 07XXXXXXXX or 01XXXXXXXX).',
      });
      return;
    }

    const numericAmount = Math.round(Number(amount));
    if (!Number.isFinite(numericAmount) || numericAmount < 1 || numericAmount > 150000) {
      res.status(400).json({
        success: false,
        error: 'M-Pesa prompt amount must be between KES 1 and KES 150,000.',
      });
      return;
    }

    const activeTill = String(tillNumber || cfg.tillNumber).trim() || DEFAULT_TILL;
    const businessShortCode = cfg.shortcode || activeTill;
    const isSandboxPaybillTest = cfg.env === 'sandbox' && businessShortCode === SANDBOX_DEFAULT_SHORTCODE;
    const transactionType =
      cleanEnv(process.env.MPESA_TRANSACTION_TYPE) ||
      (isSandboxPaybillTest ? 'CustomerPayBillOnline' : 'CustomerBuyGoodsOnline');
    const partyBValue = isSandboxPaybillTest ? 174379 : Number(activeTill) || activeTill;
    const timestamp = getEatTimestamp();
    const password = Buffer.from(`${businessShortCode}${cfg.passkey}${timestamp}`).toString('base64');
    const callbackUrl = resolveCallbackUrl(req);

    try {
      const accessToken = await getDarajaAccessToken();

      // Exact schema from Safaricom Daraja Postman Collection ("Initiate a Lipa na M-Pesa Online Payment")
      const stkPayload = {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transactionType,
        Amount: numericAmount,
        PartyA: Number(normalizedPhone),
        PartyB: partyBValue,
        PhoneNumber: Number(normalizedPhone),
        CallBackURL: callbackUrl,
        AccountReference: 'KENTECHLIKES',
        TransactionDesc: `Till${activeTill}`.slice(0, 13),
      };

      const darajaRes = await fetch(`${cfg.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(stkPayload),
        signal: AbortSignal.timeout(15000),
      });

      const darajaData = (await darajaRes.json()) as {
        MerchantRequestID?: string;
        CheckoutRequestID?: string;
        ResponseCode?: string;
        ResponseDescription?: string;
        CustomerMessage?: string;
        errorCode?: string;
        errorMessage?: string;
      };

      if (!darajaRes.ok || darajaData.ResponseCode !== '0' || !darajaData.CheckoutRequestID) {
        const errMsg =
          darajaData.errorMessage ||
          darajaData.ResponseDescription ||
          'Safaricom Daraja rejected the STK prompt request.';
        res.status(400).json({
          success: false,
          error: errMsg,
          darajaCode: darajaData.errorCode || darajaData.ResponseCode,
        });
        return;
      }

      const nowIso = new Date().toISOString();
      stkTransactions.set(darajaData.CheckoutRequestID, {
        checkoutRequestId: darajaData.CheckoutRequestID,
        merchantRequestId: darajaData.MerchantRequestID || '',
        phoneNumber: normalizedPhone,
        amount: numericAmount,
        tillNumber: activeTill,
        userId: String(userId || 'guest'),
        status: 'pending',
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      res.json({
        success: true,
        checkoutRequestId: darajaData.CheckoutRequestID,
        merchantRequestId: darajaData.MerchantRequestID,
        customerMessage:
          darajaData.CustomerMessage ||
          `M-Pesa prompt sent to ${normalizedPhone} for Till ${activeTill} (KEN_TECH LIKES).`,
        responseDescription: darajaData.ResponseDescription,
        tillNumber: activeTill,
        normalizedPhone,
        amount: numericAmount,
      });
    } catch (err) {
      console.error('M-Pesa STK Push initiation error:', err);
      res.status(502).json({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : 'Unable to reach Safaricom M-Pesa Daraja gateway. Please try again.',
      });
    }
  });

  // 3. Official Safaricom Daraja Callback Webhook Receiver
  app.post('/api/mpesa/callback', (req: Request, res: Response) => {
    try {
      const stkCallback = req.body?.Body?.stkCallback;
      if (stkCallback?.CheckoutRequestID) {
        const checkoutId = String(stkCallback.CheckoutRequestID);
        const resultCode = String(stkCallback.ResultCode ?? '');
        const resultDesc = String(stkCallback.ResultDesc || '');
        const existing = stkTransactions.get(checkoutId);

        let mpesaReceiptNumber: string | undefined;
        let verifiedAmount = existing?.amount || 0;
        let transactionDate: string | undefined;

        const items: Array<{ Name?: string; Value?: string | number }> =
          stkCallback.CallbackMetadata?.Item || [];
        for (const item of items) {
          if (item.Name === 'MpesaReceiptNumber' && item.Value) {
            mpesaReceiptNumber = String(item.Value).toUpperCase();
          } else if (item.Name === 'Amount' && item.Value !== undefined) {
            verifiedAmount = Number(item.Value) || verifiedAmount;
          } else if (item.Name === 'TransactionDate' && item.Value !== undefined) {
            transactionDate = String(item.Value);
          }
        }

        const nextStatus: StkTransactionState['status'] =
          resultCode === '0'
            ? 'completed'
            : resultCode === '1032'
              ? 'cancelled'
              : 'failed';

        stkTransactions.set(checkoutId, {
          checkoutRequestId: checkoutId,
          merchantRequestId: String(stkCallback.MerchantRequestID || existing?.merchantRequestId || ''),
          phoneNumber: existing?.phoneNumber || '',
          amount: verifiedAmount,
          tillNumber: existing?.tillNumber || DEFAULT_TILL,
          userId: existing?.userId || 'guest',
          status: nextStatus,
          mpesaReceiptNumber,
          resultCode,
          resultDesc,
          transactionDate,
          createdAt: existing?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('M-Pesa callback processing error:', err);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  });

  // 4. Live STK Push Status Query (checks callback cache first, then polls Daraja STK Query)
  app.get('/api/mpesa/stk-status/:checkoutRequestId', async (req: Request, res: Response) => {
    const checkoutRequestId = String(req.params.checkoutRequestId || '').trim();
    if (!checkoutRequestId) {
      res.status(400).json({ error: 'Missing CheckoutRequestID' });
      return;
    }

    const existing = stkTransactions.get(checkoutRequestId);
    if (existing && existing.status !== 'pending') {
      res.json(existing);
      return;
    }

    const cfg = getMpesaConfig();
    if (!cfg.configured) {
      res.status(503).json({
        status: 'failed',
        error: 'Safaricom Daraja credentials are not configured.',
      });
      return;
    }

    try {
      const accessToken = await getDarajaAccessToken();
      const timestamp = getEatTimestamp();
      const businessShortCode = cfg.shortcode || existing?.tillNumber || cfg.tillNumber;
      const password = Buffer.from(`${businessShortCode}${cfg.passkey}${timestamp}`).toString('base64');

      const queryRes = await fetch(`${cfg.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: businessShortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
        signal: AbortSignal.timeout(15000),
      });

      const queryData = (await queryRes.json()) as {
        ResponseCode?: string;
        ResultCode?: string | number;
        ResultDesc?: string;
        MerchantRequestID?: string;
        CheckoutRequestID?: string;
        errorCode?: string;
        errorMessage?: string;
      };

      // Daraja returns 500.001.1001 while customer has not yet entered PIN on SIM toolkit
      if (queryData.errorCode === '500.001.1001' || queryData.ResultCode === undefined) {
        res.json({
          checkoutRequestId,
          status: 'pending',
          amount: existing?.amount || 0,
          tillNumber: existing?.tillNumber || cfg.tillNumber,
          resultDesc: queryData.errorMessage || 'Awaiting M-Pesa PIN confirmation on phone...',
        });
        return;
      }

      const resultCode = String(queryData.ResultCode);
      const nextStatus: StkTransactionState['status'] =
        resultCode === '0'
          ? 'completed'
          : resultCode === '1032'
            ? 'cancelled'
            : 'failed';

      const updatedRecord: StkTransactionState = {
        checkoutRequestId,
        merchantRequestId: queryData.MerchantRequestID || existing?.merchantRequestId || '',
        phoneNumber: existing?.phoneNumber || '',
        amount: existing?.amount || 0,
        tillNumber: existing?.tillNumber || cfg.tillNumber,
        userId: existing?.userId || 'guest',
        status: nextStatus,
        mpesaReceiptNumber:
          existing?.mpesaReceiptNumber ||
          (nextStatus === 'completed' ? `STK-${checkoutRequestId.slice(-8).toUpperCase()}` : undefined),
        resultCode,
        resultDesc: queryData.ResultDesc || 'Processed',
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      stkTransactions.set(checkoutRequestId, updatedRecord);
      res.json(updatedRecord);
    } catch (err) {
      res.json({
        checkoutRequestId,
        status: 'pending',
        amount: existing?.amount || 0,
        tillNumber: existing?.tillNumber || cfg.tillNumber,
        resultDesc: err instanceof Error ? err.message : 'Polling Safaricom gateway...',
      });
    }
  });

  // 5. Vite Dev Middleware / Production Static Asset Serving
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KEN_TECH LIKES server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
