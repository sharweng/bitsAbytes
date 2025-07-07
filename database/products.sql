-- BITS & BYTES Video Game Store - Product Seeding Script
USE bitsAndBytesDB;

-- Insert sample products
INSERT INTO products (title, description, plat_id, price, ptype_id, release_date, developer, publisher) VALUES
-- PC Games (Digital)
('Cyberpunk 2077', 'An open-world, action-adventure RPG set in the dark future of Night City.', 2, 59.99, 1, '2020-12-10', 'CD Projekt RED', 'CD Projekt'),
('The Witcher 3: Wild Hunt', 'A story-driven open world RPG set in a visually stunning fantasy universe.', 2, 39.99, 1, '2015-05-19', 'CD Projekt RED', 'CD Projekt'),
('Baldurs Gate 3', 'An epic RPG based on the legendary Dungeons & Dragons tabletop RPG.', 2, 59.99, 1, '2023-08-03', 'Larian Studios', 'Larian Studios'),
('Hades', 'A rogue-like dungeon crawler from the creators of Bastion and Transistor.', 2, 24.99, 1, '2020-09-17', 'Supergiant Games', 'Supergiant Games'),

-- Console Games (Physical)
('The Legend of Zelda: Breath of the Wild', 'An open-air adventure that breaks boundaries.', 3, 49.99, 2, '2017-03-03', 'Nintendo EPD', 'Nintendo'),
('God of War', 'Kratos returns in this Norse mythology-inspired action adventure.', 3, 39.99, 2, '2018-04-20', 'Santa Monica Studio', 'Sony Interactive Entertainment'),
('Red Dead Redemption 2', 'An epic tale of life in Americas unforgiving heartland.', 3, 59.99, 2, '2018-10-26', 'Rockstar Games', 'Rockstar Games'),
('Spider-Man: Miles Morales', 'Experience the rise of Miles Morales as he masters new powers.', 3, 49.99, 2, '2020-11-12', 'Insomniac Games', 'Sony Interactive Entertainment'),

-- Mobile Games (Digital)
('Genshin Impact', 'An open-world action RPG with gacha mechanics.', 1, 0.00, 1, '2020-09-28', 'miHoYo', 'miHoYo'),
('Call of Duty: Mobile', 'The iconic multiplayer maps and modes from Call of Duty.', 1, 0.00, 1, '2019-10-01', 'TiMi Studio Group', 'Activision'),
('PUBG Mobile', 'The original battle royale experience on mobile.', 1, 0.00, 1, '2018-03-19', 'PUBG Corporation', 'Tencent Games'),
('Clash Royale', 'Real-time strategy game with collectible card elements.', 1, 0.00, 1, '2016-03-02', 'Supercell', 'Supercell'),

-- More PC Games
('Elden Ring', 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.', 2, 59.99, 1, '2022-02-25', 'FromSoftware', 'Bandai Namco Entertainment'),
('Valorant', 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.', 2, 0.00, 1, '2020-06-02', 'Riot Games', 'Riot Games'),
('Minecraft', 'A sandbox game where you can build anything you can imagine.', 2, 26.95, 1, '2011-11-18', 'Mojang Studios', 'Microsoft Studios'),

-- Console exclusives
('Horizon Zero Dawn', 'Experience Aloys entire legendary quest to unravel the mysteries of a world ruled by deadly Machines.', 3, 39.99, 2, '2017-02-28', 'Guerrilla Games', 'Sony Interactive Entertainment'),
('Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure.', 3, 49.99, 2, '2017-10-27', 'Nintendo EPD', 'Nintendo'),
('Halo Infinite', 'Master Chief returns in the most expansive Master Chief story yet.', 3, 59.99, 2, '2021-12-08', '343 Industries', 'Microsoft Studios');

-- Insert product images (multiple images per product)
INSERT INTO product_images (product_id, image_url) VALUES
-- Cyberpunk 2077 (product_id: 1)
(1, '/images/products/cyberpunk2077/main.jpg'),
(1, '/images/products/cyberpunk2077/gameplay1.jpg'),
(1, '/images/products/cyberpunk2077/gameplay2.jpg'),
(1, '/images/products/cyberpunk2077/character.jpg'),

-- The Witcher 3 (product_id: 2)
(2, '/images/products/witcher3/main.jpg'),
(2, '/images/products/witcher3/geralt.jpg'),
(2, '/images/products/witcher3/world.jpg'),
(2, '/images/products/witcher3/combat.jpg'),

-- Baldurs Gate 3 (product_id: 3)
(3, '/images/products/baldursgate3/main.jpg'),
(3, '/images/products/baldursgate3/party.jpg'),
(3, '/images/products/baldursgate3/combat.jpg'),

-- Hades (product_id: 4)
(4, '/images/products/hades/main.jpg'),
(4, '/images/products/hades/zagreus.jpg'),
(4, '/images/products/hades/underworld.jpg'),

-- Zelda BOTW (product_id: 5)
(5, '/images/products/zelda_botw/main.jpg'),
(5, '/images/products/zelda_botw/link.jpg'),
(5, '/images/products/zelda_botw/hyrule.jpg'),
(5, '/images/products/zelda_botw/gameplay.jpg'),

-- God of War (product_id: 6)
(6, '/images/products/god_of_war/main.jpg'),
(6, '/images/products/god_of_war/kratos_atreus.jpg'),
(6, '/images/products/god_of_war/combat.jpg'),

-- Red Dead Redemption 2 (product_id: 7)
(7, '/images/products/rdr2/main.jpg'),
(7, '/images/products/rdr2/arthur.jpg'),
(7, '/images/products/rdr2/world.jpg'),
(7, '/images/products/rdr2/gang.jpg'),

-- Spider-Man Miles Morales (product_id: 8)
(8, '/images/products/spiderman_miles/main.jpg'),
(8, '/images/products/spiderman_miles/miles.jpg'),
(8, '/images/products/spiderman_miles/swinging.jpg'),

-- Genshin Impact (product_id: 9)
(9, '/images/products/genshin/main.jpg'),
(9, '/images/products/genshin/characters.jpg'),
(9, '/images/products/genshin/world.jpg'),

-- Call of Duty Mobile (product_id: 10)
(10, '/images/products/cod_mobile/main.jpg'),
(10, '/images/products/cod_mobile/multiplayer.jpg'),
(10, '/images/products/cod_mobile/battle_royale.jpg'),

-- PUBG Mobile (product_id: 11)
(11, '/images/products/pubg_mobile/main.jpg'),
(11, '/images/products/pubg_mobile/gameplay.jpg'),

-- Clash Royale (product_id: 12)
(12, '/images/products/clash_royale/main.jpg'),
(12, '/images/products/clash_royale/cards.jpg'),

-- Elden Ring (product_id: 13)
(13, '/images/products/elden_ring/main.jpg'),
(13, '/images/products/elden_ring/tarnished.jpg'),
(13, '/images/products/elden_ring/world.jpg'),
(13, '/images/products/elden_ring/boss.jpg'),

-- Valorant (product_id: 14)
(14, '/images/products/valorant/main.jpg'),
(14, '/images/products/valorant/agents.jpg'),
(14, '/images/products/valorant/gameplay.jpg'),

-- Minecraft (product_id: 15)
(15, '/images/products/minecraft/main.jpg'),
(15, '/images/products/minecraft/building.jpg'),
(15, '/images/products/minecraft/world.jpg'),

-- Horizon Zero Dawn (product_id: 16)
(16, '/images/products/horizon/main.jpg'),
(16, '/images/products/horizon/aloy.jpg'),
(16, '/images/products/horizon/machines.jpg'),

-- Super Mario Odyssey (product_id: 17)
(17, '/images/products/mario_odyssey/main.jpg'),
(17, '/images/products/mario_odyssey/mario_cappy.jpg'),
(17, '/images/products/mario_odyssey/kingdoms.jpg'),

-- Halo Infinite (product_id: 18)
(18, '/images/products/halo_infinite/main.jpg'),
(18, '/images/products/halo_infinite/master_chief.jpg'),
(18, '/images/products/halo_infinite/multiplayer.jpg');

-- Insert stock for all products
INSERT INTO stock (product_id, quantity) VALUES
(1, 150),   -- Cyberpunk 2077
(2, 200),   -- The Witcher 3
(3, 100),   -- Baldurs Gate 3
(4, 75),    -- Hades
(5, 120),   -- Zelda BOTW
(6, 90),    -- God of War
(7, 110),   -- Red Dead Redemption 2
(8, 85),    -- Spider-Man Miles Morales
(9, 999),   -- Genshin Impact (digital, unlimited)
(10, 999),  -- Call of Duty Mobile (digital, unlimited)
(11, 999),  -- PUBG Mobile (digital, unlimited)
(12, 999),  -- Clash Royale (digital, unlimited)
(13, 130),  -- Elden Ring
(14, 999),  -- Valorant (digital, unlimited)
(15, 300),  -- Minecraft
(16, 95),   -- Horizon Zero Dawn
(17, 140),  -- Super Mario Odyssey
(18, 160);  -- Halo Infinite

-- Insert some product categories relationships
INSERT INTO product_categories (product_id, category_id) VALUES
-- Cyberpunk 2077 - Action, RPG
(1, 1), (1, 2),
-- The Witcher 3 - RPG
(2, 2),
-- Baldurs Gate 3 - RPG
(3, 2),
-- Hades - Action, Indie
(4, 1), (4, 9),
-- Zelda BOTW - Action, Adventure
(5, 1),
-- God of War - Action
(6, 1),
-- Red Dead Redemption 2 - Action
(7, 1),
-- Spider-Man Miles Morales - Action
(8, 1),
-- Genshin Impact - RPG, Multiplayer
(9, 2), (9, 10),
-- Call of Duty Mobile - Action, Multiplayer
(10, 1), (10, 10),
-- PUBG Mobile - Action, Multiplayer
(11, 1), (11, 10),
-- Clash Royale - Strategy, Multiplayer
(12, 3), (12, 10),
-- Elden Ring - Action, RPG
(13, 1), (13, 2),
-- Valorant - Action, Multiplayer
(14, 1), (14, 10),
-- Minecraft - Simulation, Indie
(15, 7), (15, 9),
-- Horizon Zero Dawn - Action, RPG
(16, 1), (16, 2),
-- Super Mario Odyssey - Action
(17, 1),
-- Halo Infinite - Action, Multiplayer
(18, 1), (18, 10);

-- Display summary
SELECT 'Products seeded successfully!' as message;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_images FROM product_images;
SELECT COUNT(*) as total_stock_entries FROM stock;
SELECT COUNT(*) as total_category_relationships FROM product_categories;
