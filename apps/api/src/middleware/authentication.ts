import jwt from "jsonwebtoken";
import HttpStatus from 'http-status-codes'

export const auth = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(HttpStatus.FORBIDDEN).send({ success: false, data: "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'g2r0e1e3n_t2o5p8s5_e0n5e2r5g8y30119');
    console.log(decoded);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(HttpStatus.UNAUTHORIZED).send({ success: false, data: "Unauthorized: Invalid token!"});
  }
  return next();
};