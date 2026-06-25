const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('login', { message: req.flash('message') });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('register', { message: req.flash('message') });
});

router.post('/register', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;
