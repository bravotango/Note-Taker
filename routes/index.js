const router = require('express').Router();

// Import all the routes
//const htmlRoutes = require('./html.js');
const notesRoutes = require('./notesRoutes.js');

//router.use(htmlRoutes);
router.use(notesRoutes);

module.exports = router;
