const MySQL = require('lib/mysql');

/*
  PUT /api/account/email/template
  OPTIONAL
    id: number
  RETURN
    { message?: string }
*/
module.exports = async function(req, res) {
  const db = new MySQL();

  try {
    await db.getConnection();
    const result = await db.query(
      `UPDATE users SET email_template = ? WHERE user_id = ?`,
      [req.body.id, req.session.uid]
    );
    if (!result.affectedRows) throw 'Could not set template';

    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ message: err });
  }

  db.release();
};