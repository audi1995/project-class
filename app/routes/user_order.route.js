const router = require("express").Router();
const {create, show, update, destroy, login} = require('../controllers/user_order.controller')
const{verifyWebToken} = require('../middlewares/jwt')

router.post('/', verifyWebToken, create)
// router.get('/',verifyWebToken, index)
router.get('/:id',verifyWebToken, show)
router.patch('/:id', verifyWebToken,update)
router.delete('/:id',verifyWebToken, destroy)

module.exports = router;