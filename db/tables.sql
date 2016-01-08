CREATE TABLE players
(
  id serial NOT NULL,
  user_id character varying(255) NOT NULL,
  team char(1),
  captain boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT "IdKey" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX user_id_players_index ON players (user_id);

CREATE TABLE users
(
  id serial NOT NULL,
  user_id character varying(255) NOT NULL,
  telegram_id character varying(255) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT id_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX user_id_users_index ON users (user_id);
CREATE UNIQUE INDEX telegram_id_users_index ON users (telegram_id);
