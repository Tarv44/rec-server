const path = require('path')
const express = require('express')
const xss = require('xss')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const jsonParser = express.json()

commentsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { message, song_id, created_by } = req.body
        const newComment = { message, song_id, created_by }

        for (const [key, value] of Object.entries(newComment)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body.` }
                })
            }
        }

        CommentsService.insertComment(
            req.app.get('db'),
            newComment
        )
            .then(comment => {
                res
                    .status(201)
                    .json(comment)
            })
    })

module.exports = commentsRouter