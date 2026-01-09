-- Ajout de la colonne 'username' (Pseudo) si elle n'existe pas déjà
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT;

-- On s'assure aussi que 'full_name' existe
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Optionnel : Ajouter une contrainte d'unicité sur le pseudo si vous le souhaitez
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
