const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL} = require('./config')

const db = knex({
  client: 'pg',
  ssl: true,
  connection: DATABASE_URL
})

app.set('db', db)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));