BEGIN;

INSERT INTO rotation_users (username, email, password)
VALUES
    ('user', 'user@test.com', '1234'),
    ('rajDawg', 'sleepyLife@gmail.com', 'Bones4Days'),
    ('sunnyD', 'daniellekryce@gmail.com', 'violin4268');

INSERT INTO rotation_exchanges (created_by, title, description)
VALUES
    ( 1, 'The Roots', 'The quintessential hip-hop band'),
    ( 1, 'Kiwi/Aussie Rock', 
    'As if there wasn''t enough to make us like New Zealand and Australia already, I find their music especially attractive. I want to go live there for a little bit and see what the scene is like.'),
    ( 1, 'Bark bark woof', ''),
    ( 1, 'My influences', ''),
    ( 1, 'Wedding songs', '');

INSERT INTO rotation_songs (exchange_id, title, artist, album)
VALUES
    ( 1, 'Do you want more?!?!', 'The Roots', 'Do you want more?!?!'),
    ( 1, 'Lazy Afternoon', 'The Roots', 'Do you want more?!?!'),
    ( 1, 'Understand', 'The Roots', ''),
    ( 2, 'Future Me Hates Me', 'The Beths', 'Future Me Hates Me'),
    ( 2, 'Pedestrian At Best', 'Courtney Barnett', ''),
    ( 2, 'Elevator Operator', 'Courtney Barnett', ''),
    ( 3, 'Gin N Juice', 'Snoop Dogg', 'Doggystyle'),
    ( 3, 'Dog Days Are Over', 'Florence + The Machine', 'Lungs'),
    ( 3, 'Where''d all the time go?', 'Dr. Dog', 'Shame, Shame'),
    ( 4, 'Kick It To Me', 'Sammy Rae', 'The Good Life'),
    ( 4, 'Sisyphus', 'Andrew Bird', 'My Finest Work Yet'),
    ( 4, 'Distance', 'Emily King', 'The Switch'),
    ( 5, 'Sittin'' On The Dock Of The Bay', 'Otis Redding', ''),
    ( 5, 'I Will Survive', 'Gloria Gaynor', ''),
    ( 5, 'L-O-V-E', 'Nat King Cole', 'L-O-V-E');

INSERT INTO rotation_comments (song_id, created_by, message)
VALUES
    ( 2, 1, 'I love this song'),
    ( 5, 1, 'I kinda like this song'),
    ( 6, 1, 'This song is pretty cool'),
    ( 3, 1, 'I can''t stop listening to this'),
    ( 10, 3, 'Do you know any other songs like this?'),
    ( 14, 3, 'Let''s learn this one for Friday'),
    ( 8, 2, 'Woof woof woof grrrrr woof');

COMMIT;