const express = require('express');
const esController = require('../controllers/es.controller');

const router = express.Router();

router.get('/search', esController.search);
router.post('/index', esController.index);
router.get('/searchss/:index', esController.searchByIndex);
router.get('/index/:index', esController.getIndex);
router.delete('/index/:index/:id', esController.deleteDocument);
router.delete('/index/:index', esController.deleteIndex);
router.post('/index/:index', esController.addDocument);
router.post('/index', esController.createIndex);
router.put('/index/:index/:id', esController.updateDocument);

module.exports = router;