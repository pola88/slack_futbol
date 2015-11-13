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
