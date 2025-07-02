import jwt from "jsonwebtoken"

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split("")[1]

    if (!token) {
        return res.status(401).json({ message: "not authorized" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded?.id
    next()
  } catch (error) {
    res.status(401).json({ message: "invalid token" })
  }
}

export default protect