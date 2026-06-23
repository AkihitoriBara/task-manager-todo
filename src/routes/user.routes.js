const router = require("express").Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  getUsers,
  getUserById,
  updateUser,
  verifyUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/", authenticate, getUsers);

router.get("/:id", authenticate, getUserById);

router.put("/:id", authenticate, authorize("admin", "super_admin"), updateUser);

router.patch(
  "/:id/verify",
  authenticate,
  authorize("admin", "super_admin"),
  verifyUser,
);

router.delete("/:id", authenticate, authorize("super_admin"), deleteUser);

module.exports = router;
