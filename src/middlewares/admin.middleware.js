// check admin roles

module.exports = (req, res, next) => {
    const currentUser = res.locals.user;
  
    if (currentUser.role === "ADMIN") {
      return next();
    }
    next({ status: 401, message: "Only access for admin user" });
  };