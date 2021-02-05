function makeUsersLogin() {
    return {
        email: 'user@test.com',
        password: '1234'
    }
}

function makeUsersSignup() {
    return {
        username: 'newUser',
        email: 'newuser@test.com',
        password: 'secret1234'
    }
}

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'user',
            email: 'jonahdevine@gmail.com',
            password: '1234'
        },
        {
            id: 2,
            username: 'rajDawg',
            email: 'sleepyLife@gmail.com',
            password: 'Bones4Days'
        },
        {
            id: 3,
            username: 'sunnyD',
            email: 'daniellekryce@gmail.com',
            password: 'violin4268'
        }
    ]
}

function makeUsersResArray() {
    return [
        {
            id: 1,
            username: 'user',
        },
        {
            id: 2,
            username: 'rajDawg',
        },
        {
            id: 3,
            username: 'sunnyD',
        }
    ]
}

module.exports = {
    makeUsersLogin,
    makeUsersSignup,
    makeUsersArray,
    makeUsersResArray
}