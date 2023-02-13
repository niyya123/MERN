import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
      err && res.status(403).json("Token is invalid!");
      req.user = userInfo;
      next();
    });
  } else return res.status(401).json("You are not authenticated");
};

export const verifyTokenAuth = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.user_id === req.params.id || req.user.isAdmin) {
      next();
    } else
      return res
        .status(403)
        .json("You do not have enough rights to access this!");
  });
};

export const verifyTokenAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else
      return res
        .status(403)
        .json("You do not have enough rights to access this!");
  });
};
