function makeExchangesArray() {
    return [
        {
            id: 1,
            date_created: new Date(),
            created_by: 1,
            title: 'The Roots',
            description: '',
        },
        {
            id: 2,
            date_created: new Date(),
            created_by: 1,
            title: 'Kiwi/Aussie Rock',
            description: "As if there wasn't enough to make us like New Zealand and Australia already, I find their music especially attractive. I want to go live there for a little bit and see what the scene is like."
        },
        {
            id: 3,
            date_created: new Date(),
            created_by: 1,
            title: 'Bark bark woof',
            description: ''
        },
        {
            id: 4,
            date_created: new Date(),
            created_by: 1,
            title: "My influences",
            description: ''
        },
        {
            id: 5,
            date_created: new Date(),
            created_by: 1,
            title: 'Wedding songs',
            description: ''
        }
    ]
}

module.exports = {
    makeExchangesArray
}