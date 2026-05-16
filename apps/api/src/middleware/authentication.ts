import { fromNodeHeaders } from 'better-auth/node';
import HttpStatus from 'http-status-codes';
import { Logger } from 'tslog';
import type { Auth } from '../config/auth';

const log = new Logger({});

let _auth: Auth | null = null;

export const setAuthInstance = (auth: Auth) => {
  _auth = auth;
};

export const auth = async (req: any, res: any, next: any) => {
  if (!_auth) {
    log.error('Auth instance not initialized');
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      data: 'Auth not configured',
    });
  }

  try {
    const session = await _auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        data: 'Unauthorized: No valid session',
      });
    }

    req.user = session.user;
    req.session_data = session.session;
    next();
  } catch (err) {
    log.error(`Authentication error: ${err}`);
    return res.status(HttpStatus.UNAUTHORIZED).send({
      success: false,
      data: 'Unauthorized',
    });
  }
};
