


export function checkRole(allowedRoles) {
    return (req, res, next) => {
        const userRole = res.locals.jwt.role
        if (allowedRoles.includes(userRole)) {
            next()
        } else {
            res.status(403).json({ message: 'Forbidden' })
        }
    }
}
