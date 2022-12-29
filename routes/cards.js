const express = require('express');
const router = express.Router();
const cards = require('../controllers/cards');

router.get ('/customer/:id', cards.getListByCustomer);
router.get ('/:id', cards.getDetails);
router.post('/', cards.addNew);
router.put ('/:id', cards.updateDetails);
router.delete('/:id', cards.deleteCard);

module.exports = router;
