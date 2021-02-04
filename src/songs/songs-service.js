const SongsService = {
    getAllSongs(knex) {
      return knex.select('*').from('rotation_songs')
    },
  
    insertSong(knex, newSong) {
      return knex
        .insert(newSong)
        .into('rotation_songs')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('rotation_songs')
        .select('*')
        .where('id', id)
        .first()
    },

    getByExchangeId(knex, ex_id) {
        return knex
            .from('rotation_songs')
            .select('*')
            .where('exchange_id', ex_id)
    },
  
    deleteSong(knex, id) {
      return knex('rotation_songs')
        .where({ id })
        .delete()
    },
  
    updateSong(knex, id, newSongFields) {
      return knex('rotation_songs')
        .where({ id })
        .update(newSongFields)
    },
  }
  
  module.exports = SongsService