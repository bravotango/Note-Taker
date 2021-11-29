const router = require('express').Router();

// Import all the routes
const notesRoutes = require('./notesRoutes.js');

router.use(notesRoutes);

module.exports = router;
