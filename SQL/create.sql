CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    usernmae VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE players(
    id SERIAL PRIMARY KEY,
    line_id VARCHAR(255),
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    shuttle_no INTEGER NOT NULL,
    date DATE NOT NULL,
    player1 SERIAL,
    player2 SERIAL,
    player3 SERIAL,
    player4 SERIAL,
    FOREIGN KEY (player1) REFERENCES players(id),
    FOREIGN KEY (player2) REFERENCES players(id),
    FOREIGN KEY (player3) REFERENCES players(id),
    FOREIGN KEY (player4) REFERENCES players(id)
);