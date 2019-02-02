import { NextFunction, Response, Request } from 'express';
import * as CONFIG from 'constants/config';
import { MySQL } from 'lib/MySQL';
import axios from 'axios';

export async function api_finishCreditsPurchase(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const db = new MySQL();

  try {
    const payment = await axios.get(
      `${CONFIG.XYPAYMENTS_URL}/api/payments/${req.query.payment_id}`,
      {
        params: {
          seller_id: CONFIG.XYPAYMENTS_ID,
          seller_key: CONFIG.XYPAYMENTS_KEY
        }
      }
    );

    if (payment.data.fulfilled) throw 'Payment was already fulfilled';
    if (payment.data.paid === null) throw 'Payment was not paid';
    if (payment.data.info.userId != req.jwt.userId) throw 'Wrong user';

    // Update user's account

    await db.query('UPDATE users SET credits = ? WHERE userId = ?', [
      payment.data.info.credits,
      req.jwt.userId
    ]);

    // Mark payment fulfilled
    await axios.post(
      `${CONFIG.XYPAYMENTS_URL}/api/payments/` +
        `${req.query.payment_id}/fulfill`,
      {
        seller_id: CONFIG.XYPAYMENTS_ID,
        seller_key: CONFIG.XYPAYMENTS_KEY
      }
    );
  } catch (err) {}

  db.release();
  res.redirect('/app/');
}
