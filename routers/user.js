const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router()

// User Endpoints
// Create User
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})


// User login
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send()
    }
})

// User Logout
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Get user profile
router.get('/user/me', auth, (req, res) => {
    res.send(req.user)
})

// Update user
router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpatdes = ['name', 'age', 'password', 'email']
    const isAllowed = updates.every((update) => allowedUpatdes.includes(update))

    if (!isAllowed) {
        return res.status(404).send({
            error: "Inavlid property update!!"
        })
    }
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete a user
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.name, req.user.email)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;