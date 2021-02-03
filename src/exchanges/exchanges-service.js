const ExchangesService = {
    getAllExchanges(knex) {
      return knex.select('*').from('rotation_exchanges')
    },
  
    insertExchange(knex, newExchange) {
      return knex
        .insert(newExchange)
        .into('rotation_exchanges')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('rotation_exchanges')
        .select('*')
        .where('id', id)
        .first()
    },

    getByCreateBy(knex, user_id) {
        return knex
            .from('rotation_exchanges')
            .select('*')
            .where('created_by', user_id)
    },
  
    deleteExchange(knex, id) {
      return knex('rotation_exchanges')
        .where({ id })
        .delete()
    },
  
    updateExchange(knex, id, newExchangeFields) {
      return knex('rotation_exchanges')
        .where({ id })
        .update(newExchangeFields)
    },
  }
  
  module.exports = ExchangesService