const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const Car = require('../models/car')

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
        res.status(400).send(e)
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
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

// All cars
router.get('/user/car/all', auth, async (req, res) => {
    const cars = await Car.find()
    res.send(cars)
})

// All available cars
router.get('/user/car/available', auth, async (req, res) => {
    const cars = await Car.find({
        "available": true
    })
    res.send(cars)
})

// Book a Car
router.post('/user/car/book/:_id', auth, async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params._id, {
            "available": false,
            "owner": req.user._id,
            "bookingHours": req.body.hours
        })
        await car.save()
        res.send("Booking is confirmed")
    } catch (e) {
        console.log(e)
        res.status(401).send()
    }
})

// Get a particular Car
router.get('/user/car/:_id', auth, async (req, res) => {
    const car = await Car.findById(req.params._id)
    res.send(car)
})

// Update the booking
router.patch('/user/car/update/:_id/:hours', auth, async (req, res) => {
    const car = await Car.findByIdAndUpdate(req.params._id, {
        'bookingHours': req.params.hours
    })
    await car.save()
    res.send("Booking is updated")
})

// Delete A booking
router.patch('/user/car/delete/:_id', auth, async (req, res) => {
    const car = await Car.findByIdAndUpdate(req.params._id, {
        "available": true,
        "owner": null,
        "bookingHours": null,
        "bookedAt": null
    })
    await car.save()
    res.send('Booking Deleted')
})

module.exports = router;