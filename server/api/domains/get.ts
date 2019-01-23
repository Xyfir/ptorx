import { NextFunction, Response, Request } from 'express';
import { listDomains } from 'lib/domains/list';
import { getDomain } from 'lib/domains/get';

export function api_getDomains(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const domainId = +req.query.domain;
  domainId
    ? getDomain(domainId, req.session.uid)
        .then(domain => res.status(200).json(domain))
        .catch(next)
    : listDomains(req.session.uid)
        .then(domains => res.status(200).json(domains))
        .catch(next);
}
