const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt')

const checkJwt = (req, res, next) => {
  const { url: path } = req
  const excludedPaths = ['/auth/signin', '/auth/signup', '/auth/refresh']
  const isExcluded = !!excludedPaths.find(p => p.startsWith(path))

  if (isExcluded)
    return next()

  const token = getTokenFromHeaders(req.headers)
  if (!token)
    return res.jsonUnauthorized(null, 'Invalid token')

  try {
    const decoded = verifyJwt(token)
    req.accountId = decoded.id
    next()
  } catch {
    return res.jsonUnauthorized(null, 'Invalid token')
  }
  //console.log(new Date(decoded.exp * 1000))
}

module.exports = checkJwt