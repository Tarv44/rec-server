const path = require('path')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UsersService = require('./users-service')
const ExchagesService = require('../exchanges/exchanges-service')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db')
        UsersService.getAllUsers(db)
            .then(users => {
                const response = users.map(user => {
                    return {
                        id: user.id,
                        username: user.username
                    }
                })
                res.json(response)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { username, email, password } = req.body
        const newUser = { username, email: email.toLowerCase()}
        
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
                                bcrypt.hash(password, saltRounds)
                                    .then(hash => {
                                        newUser.password = hash
                                        UsersService.insertUser(
                                            req.app.get('db'),
                                            newUser
                                          )
                                            .then(user => {
                                                const {id, username} = user
                                                const response = {id, username}
                                                res
                                                    .status(201)
                                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                                    .json(response)
                                            })
                                            .catch(next)
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
    .post(jsonParser, (req, res, next) => {
        UsersService.getByEmail(
            req.app.get('db'),
            req.body.email.toLowerCase()
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `Account with email doesn't exist.` }
                    })
                } else if ( !bcrypt.compare(req.body.password, user.password) || req.body.password !== user.password) {
                    return res.status(401).json({
                        error: { message: 'Incorrect password.' }
                    })
                }
                const userInfo = {
                    id: user.id,
                    username: user.username
                }
                res.status(201).json(userInfo)
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