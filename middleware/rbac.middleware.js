

export const rbac = (roles) => (req, res, next) => {
    const userRole = req.workspace.members.find(
        member => member.userId.toString() === req.user.id
    ).role;

    if(!roles.includes(userRole)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
}