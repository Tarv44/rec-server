const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('rotation_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('rotation_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('rotation_users')
        .select('*')
        .where('id', id)
        .first()
    },

    getByEmail(knex, email) {
        return knex
          .from('rotation_users')
          .select('*')
          .where('email', email)
          .first()
    },

    getByUsername(knex, username) {
        return knex
            .from('rotation_users')
            .select('*')
            .where('username', username)
            .first()
    },
  
    deleteUser(knex, id) {
      return knex('rotation_users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('rotation_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = UsersService