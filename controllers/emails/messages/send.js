const MailGun = require('mailgun-js');
const config = require('config');
const mysql = require('lib/mysql');

/*
  POST api/emails/:email/messages
  REQUIRED
    to: string, subject: string, content: string
  RETURN
    { error: boolean, message: string }
  DESCRIPTION
    Sends an email from a REDIRECT email
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    await db.getConnection();
    const [row] = await db.query(`
      SELECT
        re.address, d.domain, u.trial
      FROM
        domains AS d, redirect_emails AS re, users AS u, main_emails AS me
      WHERE
        re.email_id = ? AND u.user_id = ? AND
        re.user_id = u.user_id AND me.email_id = re.to_email AND
        d.id = re.domain_id
    `, [
      req.params.email, req.session.uid
    ]);
    db.release();

    if (!row)
      throw 'Email does not exist';
    if (row.trial)
      throw 'Trial users cannot send mail';

    const mailgun = MailGun({
      apiKey: config.keys.mailgun, domain: row.domain
    });

    await mailgun.messages().send({
      to: req.body.to,
      from: row.address + '@' + row.domain,
      text: req.body.content,
      subject: req.body.subject
    });

    res.json({ error: false });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}