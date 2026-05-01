import jwt from "jsonwebtoken";
import HttpStatus from 'http-status-codes';
import { Logger } from "tslog";

const log = new Logger({});

export const auth = (req: any, res: any, next: any) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(HttpStatus.FORBIDDEN).send({ 
      success: false, 
      data: "A token is required for authentication"
    });
  }

  try {
    // Validate token format
    const tokenParts = String(token).split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      log.warn(`Invalid token format received: ${tokenParts.length === 1 ? 'Missing Bearer prefix' : 'Invalid format'}`);
      return res.status(HttpStatus.UNAUTHORIZED).send({ 
        success: false, 
        data: "Unauthorized: Invalid token format. Expected 'Bearer <token>'"
      });
    }

    const jwtToken = tokenParts[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const decoded = jwt.verify(jwtToken, jwtSecret);
    
    log.info(`User authenticated: ${JSON.stringify(decoded)}`);
    req.user = decoded;
  } catch (err) {
    let errorMessage = "Unauthorized: Invalid token!";
    
    if (err.name === 'TokenExpiredError') {
      errorMessage = "Unauthorized: Token has expired!";
      log.warn(`Token expired: ${err.message}`);
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = "Unauthorized: Invalid token signature!";
      log.warn(`Invalid token signature: ${err.message}`);
    } else {
      log.error(`Authentication failed: ${err.message}`);
    }
    
    return res.status(HttpStatus.UNAUTHORIZED).send({ 
      success: false, 
      data: errorMessage
    });
  }
  
  return next();
};