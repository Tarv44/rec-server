const path = require('path')
const express = require('express')
const xss = require('xss')
const ExchagesService = require('./exchanges-service')
const SongsService = require('../songs/songs-service')
const CommentsService = require('../comments/comments-service')

const exchangesRouter = express.Router()
const jsonParser = express.json()

exchangesRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { title, description, created_by, songs } = req.body
        const newExchange = { title, created_by}
        const db = req.app.get('db')

        for (const [key, value] of Object.entries(newExchange)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` }
                })
            }
        }

        newExchange.description = description

        const response = {}
        
        

        ExchagesService.insertExchange(
            db,
            newExchange
        )
            .then(exchange => {
                response.id = exchange.id
                response.title = exchange.title
                response.created_by = exchange.created_by
                response.date_created = exchange.date_created
                response.description = exchange.description

                const newSongs = []

                const songInserts = songs.map(song => {
                    const {title, artist, album, comment} = song
                    const newSong = {
                        title,
                        artist,
                        album,
                        exchange_id: response.id
                    }

                    return SongsService.insertSong(db, newSong)
                        .then(songRes => {
                            const newComment = { 
                                message: comment,
                                created_by: response.created_by,
                                song_id: songRes.id 
                            }
                            if (comment.length > 0) {
                                return CommentsService.insertComment(db, newComment)
                                    .then(commentRes => {
                                        songRes.comments = [commentRes]
                                        newSongs.push(songRes)
                                    })
                                    .catch(next)
                            } else {
                                return newSongs.push(songRes)
                            }
                            
                        })
                        .catch(next)
                })

                Promise
                    .all(songInserts)
                    .then(() => {
                        response.songs = newSongs
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${response.id}`))
                            .json(response)
                    })
            })
            .catch(next)
    })

exchangesRouter
    .route('/:exchange_id')
    .get((req, res, next) => {
        const db = req.app.get('db')
        const exchangeData = {}
        ExchagesService.getById(
            db,
            req.params.exchange_id
        )
            .then(ex => {
                if (!ex) {
                    return res.status(404).json({
                        error: { message: `Exchange doesn't exist.` }
                    })
                }
                const { id, date_created, created_by, title, description } = ex
                exchangeData.id = id
                exchangeData.date_created = date_created
                exchangeData.created_by = created_by
                exchangeData.title = title
                exchangeData.description = description

                SongsService.getByExchangeId(db, id)
                    .then(songs => {
                        const songComments = songs.map(song => {
                            return CommentsService.getBySongId(db, song.id)
                                .then(comments => {
                                    song.comments = comments
                                })
                                .catch(next)
                        })
                        Promise.all(songComments).then(() => {
                            exchangeData.songs = songs
                            res.status(200).json(exchangeData)
                        })  
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = exchangesRouter