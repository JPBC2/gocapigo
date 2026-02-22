-- ============================================
-- Go Capi Go — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================

INSERT INTO products (name, slug, price, stock, category, artist, description, is_new) VALUES
  ('Army Bomb', 'army-bomb', 1200, 1, 'lightsticks', 'BTS', 'Lightstick oficial de BTS (Army Bomb). Conéctalo con la app Weverse para sincronizarlo en conciertos.', false),
  ('Pulsera PTD DIY', 'pulsera-ptd-diy', 350, 1, 'accesorios', 'BTS', 'Kit DIY para crear tu propia pulsera del tour Permission to Dance.', false),
  ('Llavero ballena', 'llavero-ballena', 300, 2, 'accesorios', 'BTS', 'Llavero con diseño de ballena del universo BTS.', false),
  ('Llavero Jin FESTA 2020', 'llavero-jin-festa-2020', 180, 3, 'accesorios', 'BTS - Jin', 'Llavero exclusivo de Jin del FESTA 2020.', false),
  ('Llavero JK FESTA 2020', 'llavero-jk-festa-2020', 180, 3, 'accesorios', 'BTS - Jungkook', 'Llavero exclusivo de Jungkook del FESTA 2020.', false),
  ('Pasaporte MANG', 'pasaporte-mang', 200, 5, 'accesorios', 'BTS - J-Hope', 'Funda de pasaporte con diseño del personaje MANG de BT21.', false),
  ('Termo PTD Pop-Up', 'termo-ptd-pop-up', 250, 3, 'accesorios', 'BTS', 'Termo oficial del Pop-Up Store Permission to Dance.', false),
  ('SET Hobi-OTS', 'set-hobi-ots', 1000, 1, 'merchandise', 'BTS - J-Hope', 'Set exclusivo de J-Hope del On The Street pop-up. Coleccionable limitado.', true),
  ('Card holder TinyTAN ToyStory JK', 'card-holder-tinytan-toystory-jk', 345, 2, 'accesorios', 'BTS - Jungkook', 'Porta tarjetas TinyTAN x Toy Story edición Jungkook.', false),
  ('Card holder TinyTAN ToyStory Jin', 'card-holder-tinytan-toystory-jin', 345, 2, 'accesorios', 'BTS - Jin', 'Porta tarjetas TinyTAN x Toy Story edición Jin.', false),
  ('Card holder TinyTAN ToyStory RM', 'card-holder-tinytan-toystory-rm', 345, 2, 'accesorios', 'BTS - RM', 'Porta tarjetas TinyTAN x Toy Story edición RM.', false),
  ('Sleeve Holográfica diamante', 'sleeve-holografica-diamante', 60, 5, 'sleeves', 'General', 'Sleeve holográfica con patrón de diamantes para proteger tus photocards.', false),
  ('Sleeve Holográfica estrella', 'sleeve-holografica-estrella', 60, 5, 'sleeves', 'General', 'Sleeve holográfica con patrón de estrellas para proteger tus photocards.', false),
  ('Sleeve popcorn morada', 'sleeve-popcorn-morada', 75, 20, 'sleeves', 'General', 'Sleeve decorativa con diseño de palomitas en color morado.', false),
  ('Sleeve popcorn verde', 'sleeve-popcorn-verde', 80, 10, 'sleeves', 'General', 'Sleeve decorativa con diseño de palomitas en color verde.', false),
  ('Pluma TinyTAN ToyStory RM', 'pluma-tinytan-toystory-rm', 300, 2, 'papeleria', 'BTS - RM', 'Pluma coleccionable TinyTAN x Toy Story edición RM.', false),
  ('Pluma TinyTAN ToyStory Jin', 'pluma-tinytan-toystory-jin', 300, 2, 'papeleria', 'BTS - Jin', 'Pluma coleccionable TinyTAN x Toy Story edición Jin.', false),
  ('Pluma TinyTAN ToyStory Suga', 'pluma-tinytan-toystory-suga', 300, 2, 'papeleria', 'BTS - Suga', 'Pluma coleccionable TinyTAN x Toy Story edición Suga.', false),
  ('Pluma TinyTAN ToyStory Hobi', 'pluma-tinytan-toystory-hobi', 300, 2, 'papeleria', 'BTS - J-Hope', 'Pluma coleccionable TinyTAN x Toy Story edición J-Hope.', false),
  ('Pluma TinyTAN ToyStory Jimin', 'pluma-tinytan-toystory-jimin', 300, 1, 'papeleria', 'BTS - Jimin', 'Pluma coleccionable TinyTAN x Toy Story edición Jimin.', false),
  ('Pluma TinyTAN ToyStory V', 'pluma-tinytan-toystory-v', 300, 2, 'papeleria', 'BTS - V', 'Pluma coleccionable TinyTAN x Toy Story edición V.', false),
  ('Pluma TinyTAN ToyStory JK', 'pluma-tinytan-toystory-jk', 300, 1, 'papeleria', 'BTS - Jungkook', 'Pluma coleccionable TinyTAN x Toy Story edición Jungkook.', false),
  ('Binder corazón', 'binder-corazon', 150, 3, 'accesorios', 'General', 'Binder con diseño de corazón para organizar tus photocards.', false),
  ('Hojas para binder', 'hojas-para-binder', 60, 10, 'accesorios', 'General', 'Hojas transparentes compatibles con binder, 9 bolsillos por hoja.', false);
