CREATE TABLE players
  id serial NOT NULL,
  user_id character varying(255) NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT "IdKey" PRIMARY KEY (id);
