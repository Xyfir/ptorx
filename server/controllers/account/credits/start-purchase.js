const request = require('superagent');
const CONFIG = require('config');
const MySQL = require('lib/mysql');

/**
 * `POST /api/account/credits/purchase`
 * @param {object} req
 * @param {object} req.body
 * @param {string} req.body.type - `"normal|iap"`
 * @param {number} req.body.package - `1|2|3`
 */
/**
 * @typedef {object} ResponseBody
 * @prop {string} [message]
 * @prop {string} [url]
 */
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    await db.getConnection();
    const [user] = await db.query(
      'SELECT email, referral FROM users WHERE user_id = ?',
      [req.session.uid]
    );
    if (!user) throw 'No user';
    db.release();

    const referral = JSON.parse(user.referral);
    referral.hasMadePurchase = true;

    const methods = (() => {
      switch (req.body.type) {
        case 'iap':
          return ['iap'];
        case 'normal':
          return ['card', 'crypto' /*, 'swiftdemand'*/];
      }
    })();

    const payment = await request
      .post(`${CONFIG.addresses.xyPayments}/api/payments`)
      .send({
        seller_id: CONFIG.ids.xyPayments,
        seller_key: CONFIG.keys.xyPayments,
        product_id: CONFIG.ids.products[req.body.package],
        methods,
        description: 'Ptorx Premium',
        info: {
          credits: { 1: 8333, 2: 18181, 3: 50000 }[req.body.package],
          user_id: req.session.uid,
          referral
        },
        email: user.email,
        redirect_url:
          `${CONFIG.addresses.ptorx.root}api/account/credits/purchase` +
          `?payment_id=PAYMENT_ID`
      });

    res.status(200).json({ url: payment.body.url });
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};