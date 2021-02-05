const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray, makeUsersResArray } = require('./users.fixtures')
const { makeExchangesArray } = require('./exchanges.fixtures')

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

    describe('GET /api/users', () => {
        context('Given no users', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })

        context('Given there are users in the database', () => {
            const testUsers = makeUsersArray()
            const testUsersResponse = makeUsersResArray()

            beforeEach('insert users', () => {
                return db
                    .into('rotation_users')
                    .insert(testUsers)
            })

            it('responds with 200 and all users', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsersResponse)
            })
        })
    })

    describe('POST /api/users', () => {
        it('creates a user, responding with 201 and the new user', () => {
            const newUser = {
                username: 'newUser',
                email: 'newuser@test.com',
                password: 'secret1234'
            }

            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body).to.have.property('id')
                })
        })
    })

    describe('POST /api/users/login', () => {
        const testUsers = makeUsersArray()
        beforeEach('insert users', () => {
            return db
                .into('rotation_users')
                .insert(testUsers)
        })
        it('sends correct login info, responding with 201 and user', () => {
            const login = {
                email: testUsers[0].email,
                password: testUsers[0].password
            }
            return supertest(app)
                .post('/api/users/login')
                .send(login)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(testUsers[0].username)
                    expect(res.body.id).to.eql(testUsers[0].id)
                })
        })
    })

    describe('GET /api/users/:user_id/exchanges', () => {
        const testUsers = makeUsersArray()
        const testExchanges = makeExchangesArray()
        
        beforeEach('insert users and exchanges', () => {
            return db
                .into('rotation_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('rotation_exchanges')
                        .insert(testExchanges)
                })
        })

        it('responds with 200 and user exchanges', () => {
            const user_id = 1
            return supertest(app)
                .get(`/api/users/${user_id}/exchanges`)
                .expect(200)
                .expect(res => {
                    const exchanges = testExchanges.filter(ex => ex.created_by === user_id)
                    expect(res.body.length).to.eql(exchanges.length)
                    expect(res.body[0].id).to.eql(exchanges[0].id)
                    expect(res.body[0].title).to.eql(exchanges[0].title)
                    expect(res.body[0].created_by).to.eql(exchanges[0].created_by)
                    expect(res.body[0].description).to.eql(exchanges[0].description)
                })
        })
    })
})