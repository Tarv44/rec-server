const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeExchangesArray } = require('./exchanges.fixtures')
const { makeSongsArray } = require('./songs.fixtures')
const { makeCommentsArray } = require('./comments.fixtures')

describe('Users Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE rotation_users, rotation_exchanges, rotation_songs, rotation_comments RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE rotation_users, rotation_exchanges, rotation_songs, rotation_comments RESTART IDENTITY CASCADE'))

    describe('POST /api/exchanges', () => {
        beforeEach('insert users', () => {
            const testUsers = makeUsersArray()
            return db
                .into('rotation_users')
                .insert(testUsers)
        })
        it('creates new exchange, song, and comments, responding with 201 and exchange', () => {
            const newExchange = {
                title: 'New Exchange',
                description: 'this is a new exchange',
                created_by: 1,
                songs: [
                    {
                        title: 'Song title',
                        artist: 'Artist name',
                        album: 'Album name',
                        comment: 'thoughtful comment'
                    }
                ]
            }
            return supertest(app)
                .post('/api/exchanges')
                .send(newExchange)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newExchange.title)
                    expect(res.body.created_by).to.eql(newExchange.created_by)
                    expect(res.body.description).to.eql(newExchange.description)
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('date_created')
                    expect(res.body.songs[0].title).to.eql(newExchange.songs[0].title)
                    expect(res.body.songs[0].artist).to.eql(newExchange.songs[0].artist)
                    expect(res.body.songs[0].album).to.eql(newExchange.songs[0].album)
                    expect(res.body.songs[0]).to.have.property('id')
                })
        })
    })

    describe('GET /api/exchanges/:exchange_id', () => {
        const testUsers = makeUsersArray()
        const testExchanges = makeExchangesArray()
        const testSongs = makeSongsArray()
        const testComments = makeCommentsArray()
        beforeEach('insert users, exchanges, songs, comments', () => {
            return db
                .into('rotation_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('rotation_exchanges')
                        .insert(testExchanges)
                        .then(() => {
                            return db
                                .into('rotation_songs')
                                .insert(testSongs)
                                .then(() => {
                                    return db
                                        .into('rotation_comments')
                                        .insert(testComments)
                                })
                        })
                })
        })

        it('responds with 200 and exchange data', () => {
            const exId = 1
            const expected = testExchanges.find(ex => ex.id === exId)
            const songs = testSongs.filter(song => song.exchange_id === exId)
            expected.songs = songs.map(song => {
                song.comments = testComments.filter(comm => comm.song_id === song.id)
                return song
            })
            return supertest(app)
                .get(`/api/exchanges/${exId}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.title).to.eql(expected.title)
                    expect(res.body.description).to.eql(expected.description)
                    expect(res.body.created_by).to.eql(expected.created_by)
                    expect(res.body.id).to.eql(expected.id)
                    expect(res.body.songs.length).to.eql(expected.songs.length)
                })
        })
    })
})