-- BITS & BYTES Video Game Store - Corrected Product Seeding Script
USE bitsAndBytesDB;

-- Clear existing data to ensure clean insert
DELETE FROM stock;
DELETE FROM product_images;
DELETE FROM products;

-- Reset auto-increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- Insert sample products
INSERT INTO products (title, description, plat_id, price, ptype_id, release_date, developer, publisher) VALUES
-- PC Games (Digital) - ptype_id = 1
('Cyberpunk 2077', 'An open-world, action-adventure RPG set in the dark future of Night City.', 2, 2599.00, 1, '2020-12-10', 'CD Projekt RED', 'CD Projekt'),
('The Witcher 3: Wild Hunt', 'A story-driven open world RPG set in a visually stunning fantasy universe.', 2, 1699.00, 1, '2015-05-19', 'CD Projekt RED', 'CD Projekt'),
('Baldurs Gate 3', 'An epic RPG based on the legendary Dungeons & Dragons tabletop RPG.', 2, 2599.00, 1, '2023-08-03', 'Larian Studios', 'Larian Studios'),
('Hades', 'A rogue-like dungeon crawler from the creators of Bastion and Transistor.', 2, 765.00, 1, '2020-09-17', 'Supergiant Games', 'Supergiant Games'),
('Disco Elysium', 'A groundbreaking detective RPG.', 2, 829.95, 1, '2019-10-15', 'ZA/UM', 'ZA/UM'),
('Among Us', 'Multiplayer party game of teamwork and betrayal.', 2, 95.40, 1, '2018-11-16', 'Innersloth', 'Innersloth'),
('The Stanley Parable', 'A narrative-driven walking simulator.', 2, 549.95, 1, '2013-10-17', 'Galactic Cafe', 'Galactic Cafe'),
('Factorio', 'Factory-building automation game.', 2, 1000.00, 1, '2020-08-14', 'Wube Software', 'Wube Software'),
('Subnautica', 'Underwater survival and exploration.', 2, 1375.00, 1, '2018-01-23', 'Unknown Worlds', 'Unknown Worlds'),
('Dota 2', 'A complex competitive MOBA.', 2, 0.00, 1, '2013-07-09', 'Valve', 'Valve'),
('Team Fortress 2', 'Fast-paced class-based shooter.', 2, 0.00, 1, '2007-10-10', 'Valve', 'Valve'),
('Slay the Spire', 'Card-battler roguelike deck-builder.', 2, 780.00, 1, '2019-01-23', 'MegaCrit', 'Humble Games'),
('Cuphead', 'Run-and-gun platformer with 1930s animation.', 2, 499.95, 1, '2017-09-29', 'Studio MDHR', 'Studio MDHR'),
('Star Wars Jedi: Survivor', 'Third-person action-adventure in the Star Wars universe.', 2, 2999.00, 1, '2023-04-28', 'Respawn Entertainment', 'EA'),
('Elden Ring', 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.', 2, 2399.00, 1, '2022-02-25', 'FromSoftware', 'Bandai Namco Entertainment'),
('Valorant', 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.', 2, 0.00, 1, '2020-06-02', 'Riot Games', 'Riot Games'),
('Minecraft', 'A sandbox game where you can build anything you can imagine.', 2, 2283.82, 1, '2011-11-18', 'Mojang Studios', 'Microsoft Studios'),
('Left 4 Dead 2', 'Co-op zombie survival shooter.', 2, 335.00, 1, '2009-11-17', 'Valve', 'Valve'),
('Ori and the Blind Forest', 'Visually stunning platformer.', 2, 990.00, 1, '2015-03-11', 'Moon Studios', 'Xbox Game Studios'),
('Metro Exodus', 'Post-apocalyptic shooter with story focus.', 2, 1192.00, 1, '2019-02-15', '4A Games', 'Deep Silver'),
('The Forest', 'Open world survival horror game.', 2, 449.95, 1, '2018-04-30', 'Endnight Games', 'Endnight Games'),
('Satisfactory', 'Factory-building sim in 3D.', 2, 770.00, 1, '2019-03-19', 'Coffee Stain Studios', 'Coffee Stain Studios'),
('No Man''s Sky', 'Space exploration survival game.', 2, 668.00, 1, '2016-08-12', 'Hello Games', 'Hello Games'),
('RimWorld', 'Sci-fi colony sim driven by AI storytelling.', 2, 840.00, 1, '2018-10-17', 'Ludeon Studios', 'Ludeon Studios'),
('Project Zomboid', 'Isometric zombie survival RPG.', 2, 615.00, 1, '2013-11-08', 'The Indie Stone', 'The Indie Stone'),
('Hollow Knight', 'Action-adventure metroidvania.', 2, 485.00, 1, '2017-02-24', 'Team Cherry', 'Team Cherry'),
('Tunic', 'Isometric adventure game starring a fox.', 2, 910.00, 1, '2022-03-16', 'Andrew Shouldice', 'Finji'),

-- Console Games (Physical) - ptype_id = 2
('The Legend of Zelda: Breath of the Wild', 'An open-air adventure that breaks boundaries.', 3, 2450.00, 2, '2017-03-03', 'Nintendo EPD', 'Nintendo'),
('God of War', 'Kratos returns in this Norse mythology-inspired action adventure.', 3, 2490.00, 2, '2018-04-20', 'Santa Monica Studio', 'Sony Interactive Entertainment'),
('Red Dead Redemption 2', 'An epic tale of life in Americas unforgiving heartland.', 3, 849.75, 2, '2018-10-26', 'Rockstar Games', 'Rockstar Games'),
('Spider-Man: Miles Morales', 'Experience the rise of Miles Morales as he masters new powers.', 3, 2490.00, 2, '2020-11-12', 'Insomniac Games', 'Sony Interactive Entertainment'),
('Assassin''s Creed Valhalla', 'Viking-era open world action game.', 3, 2200.00, 2, '2020-11-10', 'Ubisoft Montreal', 'Ubisoft'),
('Resident Evil Village', 'Survival horror with intense atmosphere.', 3, 1790.00, 2, '2021-05-07', 'Capcom', 'Capcom'),
('FIFA 23', 'Latest edition of the football franchise.', 3, 1395.00, 2, '2022-09-30', 'EA Vancouver', 'EA Sports'),
('NBA 2K24', 'Basketball sim with advanced features.', 3, 2199.00, 2, '2023-09-08', 'Visual Concepts', '2K Sports'),
('Mortal Kombat 11', 'Brutal and cinematic fighting game.', 3, 1490.00, 2, '2019-04-23', 'NetherRealm Studios', 'WB Games'),
('Crash Bandicoot 4', 'Modern revival of the classic platformer.', 3, 2400.00, 2, '2020-10-02', 'Toys for Bob', 'Activision'),
('Tony Hawk''s Pro Skater 1+2', 'Remake of the classic skating titles.', 3, 1944.99, 2, '2020-09-04', 'Vicarious Visions', 'Activision'),
('Far Cry 6', 'Open world chaos in a fictional dictatorship.', 3, 2200.00, 2, '2021-10-07', 'Ubisoft Toronto', 'Ubisoft'),
('Gran Turismo 7', 'Realistic racing simulator.', 3, 3490.00, 2, '2022-03-04', 'Polyphony Digital', 'Sony'),
('Need for Speed Unbound', 'Street racing with stylized visuals.', 3, 2999.00, 2, '2022-12-02', 'Criterion Games', 'EA'),
('Horizon Zero Dawn', 'Experience Aloys entire legendary quest to unravel the mysteries of a world ruled by deadly Machines.', 3, 2490.00, 2, '2017-02-28', 'Guerrilla Games', 'Sony Interactive Entertainment'),
('Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure.', 3, 2895.00, 2, '2017-10-27', 'Nintendo EPD', 'Nintendo'),
('Halo Infinite', 'Master Chief returns in the most expansive Master Chief story yet.', 3, 3490.00, 2, '2021-12-08', '343 Industries', 'Microsoft Studios'),
('Ratchet & Clank: Rift Apart', 'Dimension-hopping action-platformer.', 3, 2990.00, 2, '2021-06-11', 'Insomniac Games', 'Sony'),
('Returnal', 'Sci-fi rogue-like shooter.', 3, 2990.00, 2, '2021-04-30', 'Housemarque', 'Sony'),
('Ghost of Tsushima', 'Open-world samurai action.', 3, 1950.00, 2, '2020-07-17', 'Sucker Punch Productions', 'Sony'),
('Demon''s Souls (Remake)', 'Hardcore action RPG.', 3, 3490.00, 2, '2020-11-12', 'Bluepoint Games', 'Sony'),
('Bayonetta 3', 'Hack and slash action game.', 3, 2495.00, 2, '2022-10-28', 'PlatinumGames', 'Nintendo'),
('Splatoon 3', 'Colorful ink-based shooter.', 3, 2350.00, 2, '2022-09-09', 'Nintendo EPD', 'Nintendo'),
('Fire Emblem Engage', 'Tactical RPG with returning heroes.', 3, 2495.00, 2, '2023-01-20', 'Intelligent Systems', 'Nintendo'),
('Kirby and the Forgotten Land', '3D Kirby platforming adventure.', 3, 2495.00, 2, '2022-03-25', 'HAL Laboratory', 'Nintendo'),
('The Last of Us Part I', 'Remake of the iconic narrative game.', 3, 2990.00, 2, '2022-09-02', 'Naughty Dog', 'Sony'),
('Metroid Dread', 'Side-scrolling sci-fi platformer.', 3, 2450.00, 2, '2021-10-08', 'MercurySteam', 'Nintendo'),

-- Mobile Games (Digital) - ptype_id = 1
('Mobile Legends: Bang Bang', 'MOBA optimized for mobile.', 1, 0.00, 1, '2016-07-11', 'Moonton', 'Moonton'),
('Candy Crush Saga', 'Classic match-three puzzle game.', 1, 0.00, 1, '2012-04-12', 'King', 'King'),
('Pokemon GO', 'Augmented reality monster-catching.', 1, 0.00, 1, '2016-07-06', 'Niantic', 'Niantic'),
('Brawl Stars', 'Multiplayer arena battler.', 1, 0.00, 1, '2018-12-12', 'Supercell', 'Supercell'),
('Roblox', 'User-generated game platform.', 1, 0.00, 1, '2006-09-01', 'Roblox Corp.', 'Roblox Corp.'),
('Subway Surfers', 'Endless runner game.', 1, 0.00, 1, '2012-05-24', 'SYBO Games', 'Kiloo'),
('Temple Run 2', 'Fast-paced temple running game.', 1, 0.00, 1, '2013-01-16', 'Imangi Studios', 'Imangi Studios'),
('Angry Birds 2', 'Slingshot destruction puzzler.', 1, 0.00, 1, '2015-07-30', 'Rovio', 'Rovio'),
('Plague Inc.', 'Simulate a global pandemic.', 1, 0.00, 1, '2012-05-26', 'Ndemic Creations', 'Ndemic Creations'),
('AFK Arena', 'Idle gacha RPG game.', 1, 0.00, 1, '2019-04-09', 'Lilith Games', 'Lilith Games');

-- Insert product images with CORRECTED product IDs matching the insertion order above
INSERT INTO product_images (product_id, image_url) VALUES
-- PC Games (Digital) - product_id 1-27
-- Cyberpunk 2077 (product_id = 1)
(1, '/images/products/cyberpunk2077/main.jpg'),
(1, '/images/products/cyberpunk2077/main2.jpg'),

-- The Witcher 3: Wild Hunt (product_id = 2)
(2, '/images/products/witcher3/main.jpg'),
(2, '/images/products/witcher3/world.jpg'),

-- Baldurs Gate 3 (product_id = 3)
(3, '/images/products/baldursgate3/main.jpg'),
(3, '/images/products/baldursgate3/combat.jpg'),

-- Hades (product_id = 4)
(4, '/images/products/hades/main.jpg'),
(4, '/images/products/hades/gameplay.jpg'),

-- Disco Elysium (product_id = 5)
(5, '/images/products/disco_elysium/main.jpg'),
(5, '/images/products/disco_elysium/dialogue.jpg'),

-- Among Us (product_id = 6)
(6, '/images/products/among_us/main.jpg'),
(6, '/images/products/among_us/emergency.jpg'),

-- The Stanley Parable (product_id = 7)
(7, '/images/products/stanley_parable/main.jpg'),
(7, '/images/products/stanley_parable/narrator.jpg'),

-- Factorio (product_id = 8)
(8, '/images/products/factorio/main.jpg'),
(8, '/images/products/factorio/factory.jpg'),

-- Subnautica (product_id = 9)
(9, '/images/products/subnautica/main.jpg'),
(9, '/images/products/subnautica/underwater.jpg'),

-- Dota 2 (product_id = 10)
(10, '/images/products/dota2/main.jpg'),
(10, '/images/products/dota2/heroes.jpg'),

-- Team Fortress 2 (product_id = 11)
(11, '/images/products/tf2/main.jpg'),
(11, '/images/products/tf2/classes.jpg'),

-- Slay the Spire (product_id = 12)
(12, '/images/products/slay_the_spire/main.jpg'),
(12, '/images/products/slay_the_spire/cards.jpg'),

-- Cuphead (product_id = 13)
(13, '/images/products/cuphead/main.jpg'),
(13, '/images/products/cuphead/boss.jpg'),

-- Star Wars Jedi: Survivor (product_id = 14)
(14, '/images/products/jedi_survivor/main.jpg'),
(14, '/images/products/jedi_survivor/combat.jpg'),

-- Elden Ring (product_id = 15)
(15, '/images/products/elden_ring/main.jpg'),
(15, '/images/products/elden_ring/boss.jpg'),

-- Valorant (product_id = 16)
(16, '/images/products/valorant/main.jpg'),
(16, '/images/products/valorant/gameplay.jpg'),

-- Minecraft (product_id = 17)
(17, '/images/products/minecraft/main.jpg'),
(17, '/images/products/minecraft/main2.jpg'),

-- Left 4 Dead 2 (product_id = 18)
(18, '/images/products/l4d2/main.jpg'),
(18, '/images/products/l4d2/zombies.jpg'),

-- Ori and the Blind Forest (product_id = 19)
(19, '/images/products/ori/main.jpg'),
(19, '/images/products/ori/spirit_tree.jpg'),

-- Metro Exodus (product_id = 20)
(20, '/images/products/metro_exodus/main.jpg'),
(20, '/images/products/metro_exodus/train.jpg'),

-- The Forest (product_id = 21)
(21, '/images/products/the_forest/main.jpg'),
(21, '/images/products/the_forest/cannibals.jpg'),

-- Satisfactory (product_id = 22)
(22, '/images/products/satisfactory/main.jpg'),
(22, '/images/products/satisfactory/automation.jpg'),

-- No Man's Sky (product_id = 23)
(23, '/images/products/nms/main.jpg'),
(23, '/images/products/nms/planets.jpg'),

-- RimWorld (product_id = 24)
(24, '/images/products/rimworld/main.jpg'),
(24, '/images/products/rimworld/colony.jpg'),

-- Project Zomboid (product_id = 25)
(25, '/images/products/project_zomboid/main.jpg'),
(25, '/images/products/project_zomboid/base.jpg'),

-- Hollow Knight (product_id = 26)
(26, '/images/products/hollow_knight/main.jpg'),
(26, '/images/products/hollow_knight/boss.jpg'),

-- Tunic (product_id = 27)
(27, '/images/products/tunic/main.jpg'),
(27, '/images/products/tunic/fox.jpg'),

-- Console Games (Physical) - product_id 28-54
-- The Legend of Zelda: Breath of the Wild (product_id = 28)
(28, '/images/products/zelda_botw/main.jpg'),
(28, '/images/products/zelda_botw/world.jpg'),

-- God of War (product_id = 29)
(29, '/images/products/god_of_war/main.jpg'),
(29, '/images/products/god_of_war/gameplay.jpg'),

-- Red Dead Redemption 2 (product_id = 30)
(30, '/images/products/rdr2/main.jpg'),
(30, '/images/products/rdr2/world.jpg'),

-- Spider-Man: Miles Morales (product_id = 31)
(31, '/images/products/spiderman_miles/main.jpg'),
(31, '/images/products/spiderman_miles/gameplay.jpg'),

-- Assassin's Creed Valhalla (product_id = 32)
(32, '/images/products/ac_valhalla/main.jpg'),
(32, '/images/products/ac_valhalla/viking.jpg'),

-- Resident Evil Village (product_id = 33)
(33, '/images/products/re_village/main.jpg'),
(33, '/images/products/re_village/lady_d.jpg'),

-- FIFA 23 (product_id = 34)
(34, '/images/products/fifa23/main.jpg'),
(34, '/images/products/fifa23/gameplay.jpg'),

-- NBA 2K24 (product_id = 35)
(35, '/images/products/nba2k24/main.jpg'),
(35, '/images/products/nba2k24/arena.jpg'),

-- Mortal Kombat 11 (product_id = 36)
(36, '/images/products/mk11/main.jpg'),
(36, '/images/products/mk11/fatality.jpg'),

-- Crash Bandicoot 4 (product_id = 37)
(37, '/images/products/crash4/main.jpg'),
(37, '/images/products/crash4/platforming.jpg'),

-- Tony Hawk's Pro Skater 1+2 (product_id = 38)
(38, '/images/products/thps1_2/main.jpg'),
(38, '/images/products/thps1_2/skating.jpg'),

-- Far Cry 6 (product_id = 39)
(39, '/images/products/farcry6/main.jpg'),
(39, '/images/products/farcry6/dictator.jpg'),

-- Gran Turismo 7 (product_id = 40)
(40, '/images/products/gt7/main.jpg'),
(40, '/images/products/gt7/car.jpg'),

-- Need for Speed Unbound (product_id = 41)
(41, '/images/products/nfs_unbound/main.jpg'),
(41, '/images/products/nfs_unbound/street.jpg'),

-- Horizon Zero Dawn (product_id = 42)
(42, '/images/products/horizon/main.jpg'),
(42, '/images/products/horizon/gameplay.jpg'),

-- Super Mario Odyssey (product_id = 43)
(43, '/images/products/mario_odyssey/main.jpg'),
(43, '/images/products/mario_odyssey/gameplay.jpg'),

-- Halo Infinite (product_id = 44)
(44, '/images/products/halo_infinite/main.jpg'),
(44, '/images/products/halo_infinite/gameplay.jpg'),

-- Ratchet & Clank: Rift Apart (product_id = 45)
(45, '/images/products/ratchet_rift_apart/main.jpg'),
(45, '/images/products/ratchet_rift_apart/dimension.jpg'),

-- Returnal (product_id = 46)
(46, '/images/products/returnal/main.jpg'),
(46, '/images/products/returnal/loop.jpg'),

-- Ghost of Tsushima (product_id = 47)
(47, '/images/products/ghost_of_tsushima/main.jpg'),
(47, '/images/products/ghost_of_tsushima/duel.jpg'),

-- Demon's Souls (Remake) (product_id = 48)
(48, '/images/products/demons_souls/main.jpg'),
(48, '/images/products/demons_souls/boss.jpg'),

-- Bayonetta 3 (product_id = 49)
(49, '/images/products/bayonetta3/main.jpg'),
(49, '/images/products/bayonetta3/combat.jpg'),

-- Splatoon 3 (product_id = 50)
(50, '/images/products/splatoon3/main.jpg'),
(50, '/images/products/splatoon3/multiplayer.jpg'),

-- Fire Emblem Engage (product_id = 51)
(51, '/images/products/fire_emblem_engage/main.jpg'),
(51, '/images/products/fire_emblem_engage/battle.jpg'),

-- Kirby and the Forgotten Land (product_id = 52)
(52, '/images/products/kirby_forgotten_land/main.jpg'),
(52, '/images/products/kirby_forgotten_land/world.jpg'),

-- The Last of Us Part I (product_id = 53)
(53, '/images/products/tlou1_remake/main.jpg'),
(53, '/images/products/tlou1_remake/ellie.jpg'),

-- Metroid Dread (product_id = 54)
(54, '/images/products/metroid_dread/main.jpg'),
(54, '/images/products/metroid_dread/samus.jpg'),

-- Mobile Games (Digital) - product_id 55-68
-- Mobile Legends: Bang Bang (product_id = 59)
(55, '/images/products/mlbb/main.jpg'),
(55, '/images/products/mlbb/heroes.jpg'),

-- Candy Crush Saga (product_id = 60)
(56, '/images/products/candy_crush/main.jpg'),
(56, '/images/products/candy_crush/levels.jpg'),

-- Pokemon GO (product_id = 61)
(57, '/images/products/pokemon_go/main.jpg'),
(57, '/images/products/pokemon_go/map.jpg'),

-- Brawl Stars (product_id = 62)
(58, '/images/products/brawl_stars/main.jpg'),
(58, '/images/products/brawl_stars/battle.jpg'),

-- Roblox (product_id = 63)
(59, '/images/products/roblox/main.jpg'),
(59, '/images/products/roblox/worlds.jpg'),

-- Subway Surfers (product_id = 64)
(60, '/images/products/subway_surfers/main.jpg'),
(60, '/images/products/subway_surfers/running.jpg'),

-- Temple Run 2 (product_id = 65)
(61, '/images/products/temple_run2/main.jpg'),
(61, '/images/products/temple_run2/temple.jpg'),

-- Angry Birds 2 (product_id = 66)
(62, '/images/products/angry_birds2/main.jpg'),
(62, '/images/products/angry_birds2/pigs.jpg'),

-- Plague Inc. (product_id = 67)
(63, '/images/products/plague_inc/main.jpg'),
(63, '/images/products/plague_inc/world_map.jpg'),

-- AFK Arena (product_id = 68)
(64, '/images/products/afk_arena/main.jpg'),
(64, '/images/products/afk_arena/heroes.jpg');

-- Insert stock ONLY for physical games (ptype_id = 2) with random quantities between 35-75
INSERT INTO stock (product_id, quantity)
SELECT 
    p.product_id,
    FLOOR(35 + (RAND() * 41)) as quantity  -- Random number between 35-75
FROM products p 
WHERE p.ptype_id = 2;  -- Only physical games

-- Display results
SELECT 'Products, images, and stock inserted successfully!' as message;

-- Show summary
SELECT 
    'Total Products' as category,
    COUNT(*) as count
FROM products
UNION ALL
SELECT 
    'Digital Products' as category,
    COUNT(*) as count
FROM products 
WHERE ptype_id = 1
UNION ALL
SELECT 
    'Physical Products' as category,
    COUNT(*) as count
FROM products 
WHERE ptype_id = 2
UNION ALL
SELECT 
    'Total Product Images' as category,
    COUNT(*) as count
FROM product_images
UNION ALL
SELECT 
    'Physical Games with Stock' as category,
    COUNT(*) as count
FROM products p
INNER JOIN stock s ON p.product_id = s.product_id
WHERE p.ptype_id = 2;

-- Show physical games with stock (should be all physical games)
SELECT 
    p.product_id,
    p.title,
    p.ptype_id,
    s.quantity
FROM products p
INNER JOIN stock s ON p.product_id = s.product_id
WHERE p.ptype_id = 2
ORDER BY p.product_id;
