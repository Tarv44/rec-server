const CommentsService = {
    getAllComments(knex) {
      return knex.select('*').from('rotation_comments')
    },
  
    insertComment(knex, newComment) {
      return knex
        .insert(newComment)
        .into('rotation_comments')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('rotation_comments')
        .select('*')
        .where('id', id)
        .first()
    },

    getBySongId(knex, song_id) {
        return knex
            .from('rotation_comments')
            .select('*')
            .where('song_id', song_id)
    },
  
    deleteComment(knex, id) {
      return knex('rotation_comments')
        .where({ id })
        .delete()
    },
  
    updateComment(knex, id, newCommentFields) {
      return knex('rotation_comments')
        .where({ id })
        .update(newCommentFields)
    },
  }
  
  module.exports = CommentsService