const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const ExchagesService = require('../exchanges/exchanges-service')

const usersRouter = express.Router()
const jsonParser = express.json()

// const serializeUser = user => ({
//     id: user.id,
//     username: xss(user.username),
//     email: xss(user.email),
//     password: xss(user.password),
//     date_created: user.date_created,
//   })

usersRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db')
        UsersService.getAllUsers(db)
            .then(users => {
                res.json(users)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { username, email, password } = req.body
        const newUser = { username, password, email: email.toLowerCase()}

        for (const [key, value] of Object.entries(newUser)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body.` }
                })
            }
        }

        const db = req.app.get('db')

        UsersService.getByEmail(db, email.toLowerCase())
            .then(user => {
                if (user) {
                    return res.status(404).json({
                        error: { message: 'Account with email already exists.' }
                    })
                } else {
                    UsersService.getByUsername(db, username)
                        .then(user => {
                            if (user) {
                                return res.status(404).json({
                                    error: { message: 'Username unavailble.' }
                                })
                            } else {
                                UsersService.insertUser(
                                    req.app.get('db'),
                                    newUser
                                  )
                                    .then(user => {
                                      res
                                        .status(201)
                                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                        .json(user)
                                    })
                                    .catch(next)
                            }
                        })
                        .catch(next)
                }
            })
            .catch(next)
  
    })

usersRouter
    .route('/login')
    .get(jsonParser, (req, res, next) => {
        UsersService.getByEmail(
            req.app.get('db'),
            req.body.email.toLowerCase()
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User doesn't exist` }
                    })
                } else if (user.password !== req.body.password) {
                    return res.status(401).json({
                        error: { message: 'Incorrect Password' }
                    })
                }
                const userInfo = {
                    id: user.id,
                    username: user.username
                }
                res.json(userInfo)
            })
            .catch(next)
    })

usersRouter
    .route('/:user_id/exchanges')
    .get((req, res, next) => {
        ExchagesService.getByCreateBy(
            req.app.get('db'),
            req.params.user_id
        )
            .then(ex => res.json(ex))
            .catch(next)
    })

module.exports = usersRouter