const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeExchangesArray } = require('./exchanges.fixtures')
const { makeSongsArray } = require('./songs.fixtures')
const { expect } = require('chai')

describe('Comments Endpoints', function() {
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

    describe('POST /api/comments', () => {
        beforeEach('insert users, exchanges, songs', () => {
            const testUsers = makeUsersArray()
            const testExchanges = makeExchangesArray()
            const testSongs = makeSongsArray()
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
                        })
                })
        })

        it('creates a new comment, responding with 201 and the new comment', () => {
            const newComment ={
                message: 'New comment',
                created_by: 1,
                song_id: 1
            }

            return supertest(app)
                .post('/api/comments')
                .send(newComment)
                .expect(201)
                .expect(res => {
                    expect(res.body.message).to.eql(newComment.message)
                    expect(res.body.created_by).to.eql(newComment.created_by)
                    expect(res.body.song_id).to.eql(newComment.song_id)
                    expect(res.body).to.have.property('id')
                })
        })
    })
})