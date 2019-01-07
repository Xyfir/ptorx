import axios from 'axios';
import { MySQL } from 'lib/MySQL';

export async function addDomainUser(req, res) {
  const db = new MySQL();

  try {
    const result = await db.query(
      `
        UPDATE domain_users SET
          label = ?, added = NOW(), authorized = 1
        WHERE
          domain_id = ? AND request_key = ? AND
          (SELECT user_id FROM domains WHERE id = ?) = ?
      `,
      [
        req.body.label,
        req.params.domain,
        req.body.key,
        req.params.domain,
        req.session.uid
      ]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not add user to domain';

    res.status(200).json({});
  } catch (err) {
    db.release();
    res.status(400).json({ error: err });
  }
}