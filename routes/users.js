const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/users.js');
const passport = require('passport');

router.get('/register', userController.viewForm);
router.post('/register', catchAsync(userController.createUser));
router.get('/login', userController.loginForm);
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/login'}), userController.loginUser);
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    const redirectUrl = req.session.returnTo || req.session.url || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

module.exports = router