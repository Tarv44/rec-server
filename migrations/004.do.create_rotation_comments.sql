CREATE TABLE rotation_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    song_id INTEGER REFERENCES rotation_songs(id) NOT NULL,
    created_by INTEGER REFERENCES rotation_users(id) NOT NULL,
    message VARCHAR(200) NOT NULL
);