const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, async function(req, username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, req.flash('message', 'Usuario no encontrado.'));
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, req.flash('message', 'Contraseña inválida.'));
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, async function(req, username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (user) {
                return done(null, false, req.flash('message', 'El usuario ya existe.'));
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                username: username,
                password: passwordHash,
                email: req.body.email,
                name: req.body.name || req.body.firstName + ' ' + req.body.lastName
            });

            const savedUser = await newUser.save();
            return done(null, savedUser);
        } catch (err) {
            console.log('Error en registro: ' + err);
            return done(err);
        }
    }));
};
