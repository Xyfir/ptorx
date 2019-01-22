import { Ptorx } from 'typings/ptorx';
import { MySQL } from 'lib/MySQL';

export async function listMessages(userId: number): Promise<Ptorx.MessageList> {
  const db = new MySQL();
  try {
    const messages = await db.query(
      `
        SELECT m.id, m.proxyEmailId, m.created, m.subject, m.from
        FROM messages m WHERE m.proxyEmailId IN (
          SELECT id FROM proxy_emails WHERE userId = ?
        )
        ORDER BY created DESC
      `,
      [userId]
    );
    db.release();
    return messages;
  } catch (err) {
    db.release();
    throw err;
  }
}