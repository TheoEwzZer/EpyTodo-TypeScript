import { Request, Response, NextFunction } from "express";
import { verify, VerifyErrors, JwtPayload } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(498).json({ msg: "No token, authorization denied" });
    return;
  }

  const token: string = authorization.split(" ")[1];

  if (!token) {
    res.status(498).json({ msg: "No token, authorization denied" });
    return;
  }

  if (process.env.SECRET === undefined) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  verify(
    token,
    process.env.SECRET,
    (err: VerifyErrors | null, user: string | JwtPayload | undefined): void => {
      if (err || !user) {
        res.status(498).json({ msg: "Token is not valid" });
        return;
      }
      next();
    }
  );
};
