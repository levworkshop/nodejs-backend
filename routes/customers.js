const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const customers = require('../controllers/customers');

/* authentication */
router.post('/login', auth.login);

router.get ('/:id', customers.getDetails);
router.post('/', customers.addNew);

module.exports = router;
