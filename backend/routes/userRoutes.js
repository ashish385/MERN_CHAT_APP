const expres = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = expres.Router();

router.route('/').post(registerUser).get(protect, allUsers)
// router.post('/', registerUser);
router.post("/login", authUser);

module.exports = router;