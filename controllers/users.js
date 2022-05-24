const User = require('../models/users.js');

module.exports.viewForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to my demo site Rated People');
            return res.redirect('/');
        }) 
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register')
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'You have successfully logged in!')
    const redirectUrl = req.session.returnTo || req.session.url || '/services/all';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}