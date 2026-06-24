const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const AuthController = {
    register: async (req, res) => {
        try {
            const { username, password, email, name } = req.body;
            
            if (!username || !password || !email || !name) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const user = new User({
                username,
                password: passwordHash,
                email,
                name
            });

            const savedUser = await user.save();
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar el usuario' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(password, user.password);

            if (!(user && passwordCorrect)) {
                return res.status(401).json({ error: 'Usuario o contraseña inválidos' });
            }

            const userForToken = {
                username: user.username,
                id: user._id
            };
            const token = jwt.sign(
                userForToken, 
                process.env.SECRET || 'esteesunsecretkey', 
                { expiresIn: 3600 }
            );

            res.status(200).send({ token, username: user.username, name: user.name });
        } catch (error) {
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }
};

module.exports = AuthController;
