const { verifyJwt, getTokenFromHeaders } = require("../helpers/jwt");

const checkJwt = (req, res, next) => {
  const { url: path } = req;

  const excludedPaths = ["/login", "/usuario"];
  const isExcluded = !!excludedPaths.find((p) => p.startsWith(path));

  if (isExcluded) return next();

  const token = getTokenFromHeaders(req.headers);

  if (!token) {
    return res.jsonError({ status: 401, metadata: "Invalid token" });
  }

  try {
    const decoded = verifyJwt(token);
    req.accountId = decoded.id;
    next();
  } catch (err) {
    return res.jsonError({ status: 401, metadata: "Invalid token" });
  }
};

module.exports = checkJwt;
