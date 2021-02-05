function makeCommentsArray() {
    return [
        {
            id: 1,
            song_id: 2,
            created_by: 1,
            message: 'I love this song'
        },
        {
            id: 2,
            song_id: 5,
            created_by: 1,
            message: 'I kinda like this song'
        },
        {
            id: 3,
            song_id: 6,
            created_by: 1,
            message: 'This song is pretty cool'
        },
        {
            id: 4,
            song_id: 3,
            created_by: 1,
            message: "I can't stop listening to this"
        },
        {
            id: 5,
            song_id: 10,
            created_by: 3,
            message: 'Do you know any other songs like this?'
        },
        {
            id: 6,
            song_id: 14,
            created_by: 3,
            message: "Let's learn this one for Friday"
        },
        {
            id: 7,
            song_id: 8,
            created_by: 2,
            message: 'Woof woof woof grrrrr woof'
        }
    ]
}

module.exports = {makeCommentsArray}