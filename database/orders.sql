-- Orders Import SQL for BITS & BYTES Video Game Store
-- This creates sample orders with realistic date distribution

USE bitsAndBytesDB;

-- Clear existing orders and order items
DELETE FROM order_items;
DELETE FROM orders;

-- Reset auto-increment
ALTER TABLE orders AUTO_INCREMENT = 1;

-- Insert sample orders with varied dates over the past 2 years
INSERT INTO orders (user_id, stat_id, order_date, shipped_date, delivered_date) VALUES

-- Orders from 2022 (older orders, mostly delivered)
(3, 4, '2022-01-15 10:30:00', '2022-01-17 14:20:00', '2022-01-20 16:45:00'),  -- Alice - delivered
(4, 4, '2022-02-08 14:15:00', '2022-02-10 09:30:00', '2022-02-13 11:20:00'),  -- Bob - delivered
(5, 4, '2022-02-20 16:45:00', '2022-02-22 13:15:00', '2022-02-25 15:30:00'),  -- Charlie - delivered
(6, 4, '2022-03-12 11:20:00', '2022-03-14 16:40:00', '2022-03-17 10:15:00'),  -- Diana - delivered
(7, 4, '2022-03-25 13:45:00', '2022-03-27 11:30:00', '2022-03-30 14:20:00'),  -- Edward - delivered
(3, 4, '2022-04-10 15:20:00', '2022-04-12 12:45:00', '2022-04-15 17:30:00'),  -- Alice - delivered
(4, 4, '2022-05-05 09:30:00', '2022-05-07 14:15:00', '2022-05-10 16:45:00'),  -- Bob - delivered
(5, 4, '2022-05-18 17:15:00', '2022-05-20 10:30:00', '2022-05-23 13:20:00'),  -- Charlie - delivered
(6, 4, '2022-06-02 12:40:00', '2022-06-04 15:25:00', '2022-06-07 11:45:00'),  -- Diana - delivered
(7, 4, '2022-06-20 14:30:00', '2022-06-22 16:15:00', '2022-06-25 12:30:00'),  -- Edward - delivered

-- Summer 2022 orders
(8, 4, '2022-07-08 10:15:00', '2022-07-10 13:45:00', '2022-07-13 15:20:00'),  -- Fiona - delivered
(9, 4, '2022-07-22 16:30:00', '2022-07-24 11:20:00', '2022-07-27 14:45:00'),  -- George - delivered
(10, 4, '2022-08-05 13:20:00', '2022-08-07 15:40:00', '2022-08-10 17:15:00'), -- Helen - delivered
(11, 4, '2022-08-18 11:45:00', '2022-08-20 14:30:00', '2022-08-23 16:20:00'), -- Ivan - delivered
(12, 4, '2022-09-02 15:30:00', '2022-09-04 12:15:00', '2022-09-07 14:40:00'), -- Jane - delivered
(13, 4, '2022-09-15 12:20:00', '2022-09-17 16:45:00', '2022-09-20 11:30:00'), -- Kevin - delivered
(14, 4, '2022-10-01 14:45:00', '2022-10-03 13:20:00', '2022-10-06 15:45:00'), -- Lisa - delivered
(15, 4, '2022-10-18 16:15:00', '2022-10-20 11:40:00', '2022-10-23 13:25:00'), -- Mike - delivered

-- Holiday season 2022 (more orders)
(3, 4, '2022-11-05 10:30:00', '2022-11-07 14:20:00', '2022-11-10 16:45:00'),  -- Alice - delivered
(4, 4, '2022-11-20 13:45:00', '2022-11-22 15:30:00', '2022-11-25 12:20:00'),  -- Bob - delivered
(5, 4, '2022-12-01 15:20:00', '2022-12-03 11:45:00', '2022-12-06 14:30:00'),  -- Charlie - delivered
(6, 4, '2022-12-10 12:15:00', '2022-12-12 16:40:00', '2022-12-15 13:25:00'),  -- Diana - delivered
(7, 4, '2022-12-20 14:30:00', '2022-12-22 12:15:00', '2022-12-27 15:45:00'),  -- Edward - delivered

-- 2023 orders with more variety in status
-- January 2023
(8, 4, '2023-01-08 11:20:00', '2023-01-10 14:45:00', '2023-01-13 16:30:00'),  -- Fiona - delivered
(9, 4, '2023-01-22 15:45:00', '2023-01-24 12:30:00', '2023-01-27 14:15:00'),  -- George - delivered
(10, 4, '2023-02-05 13:30:00', '2023-02-07 15:20:00', '2023-02-10 11:45:00'), -- Helen - delivered
(11, 4, '2023-02-18 16:15:00', '2023-02-20 13:40:00', '2023-02-23 15:25:00'), -- Ivan - delivered

-- Spring 2023
(12, 4, '2023-03-05 12:45:00', '2023-03-07 14:30:00', '2023-03-10 16:20:00'), -- Jane - delivered
(13, 4, '2023-03-20 14:20:00', '2023-03-22 11:45:00', '2023-03-25 13:30:00'), -- Kevin - delivered
(14, 4, '2023-04-02 10:30:00', '2023-04-04 15:15:00', '2023-04-07 12:45:00'), -- Lisa - delivered
(15, 4, '2023-04-18 16:45:00', '2023-04-20 13:20:00', '2023-04-23 15:40:00'), -- Mike - delivered
(3, 4, '2023-05-05 11:15:00', '2023-05-07 14:40:00', '2023-05-10 16:25:00'),  -- Alice - delivered
(4, 4, '2023-05-22 13:50:00', '2023-05-24 15:30:00', '2023-05-27 12:15:00'),  -- Bob - delivered

-- Summer 2023
(5, 4, '2023-06-08 15:30:00', '2023-06-10 12:45:00', '2023-06-13 14:20:00'),  -- Charlie - delivered
(6, 4, '2023-06-25 12:20:00', '2023-06-27 16:15:00', '2023-06-30 13:45:00'),  -- Diana - delivered
(7, 4, '2023-07-10 14:45:00', '2023-07-12 11:30:00', '2023-07-15 15:20:00'),  -- Edward - delivered
(8, 4, '2023-07-28 16:20:00', '2023-07-30 13:45:00', '2023-08-02 15:30:00'),  -- Fiona - delivered
(9, 4, '2023-08-12 11:40:00', '2023-08-14 14:25:00', '2023-08-17 16:15:00'),  -- George - delivered
(10, 4, '2023-08-30 13:25:00', '2023-09-01 15:40:00', '2023-09-04 12:30:00'), -- Helen - delivered

-- Fall 2023
(11, 4, '2023-09-15 15:15:00', '2023-09-17 12:40:00', '2023-09-20 14:25:00'), -- Ivan - delivered
(12, 4, '2023-10-02 12:30:00', '2023-10-04 16:15:00', '2023-10-07 13:45:00'), -- Jane - delivered
(13, 4, '2023-10-20 14:40:00', '2023-10-22 11:25:00', '2023-10-25 15:30:00'), -- Kevin - delivered
(14, 4, '2023-11-05 16:25:00', '2023-11-07 13:40:00', '2023-11-10 15:15:00'), -- Lisa - delivered

-- Recent orders with different statuses (late 2023 to early 2024)
(15, 3, '2023-11-20 11:30:00', '2023-11-22 14:45:00', NULL),                  -- Mike - shipped
(3, 3, '2023-12-05 13:45:00', '2023-12-07 16:20:00', NULL),                   -- Alice - shipped
(4, 2, '2023-12-18 15:20:00', NULL, NULL),                                    -- Bob - processing
(5, 4, '2023-12-22 12:15:00', '2023-12-24 15:30:00', '2023-12-28 14:20:00'), -- Charlie - delivered
(6, 1, '2024-01-05 14:30:00', NULL, NULL),                                    -- Diana - pending
(7, 2, '2024-01-12 16:45:00', NULL, NULL),                                    -- Edward - processing
(8, 1, '2024-01-18 11:20:00', NULL, NULL),                                    -- Fiona - pending
(9, 3, '2024-01-25 13:40:00', '2024-01-27 15:25:00', NULL),                  -- George - shipped

-- Very recent orders (2024)
(10, 1, '2024-02-02 10:15:00', NULL, NULL),                                   -- Helen - pending
(11, 2, '2024-02-08 14:50:00', NULL, NULL),                                   -- Ivan - processing
(12, 1, '2024-02-15 16:30:00', NULL, NULL),                                   -- Jane - pending
(13, 3, '2024-02-20 12:45:00', '2024-02-22 14:20:00', NULL),                 -- Kevin - shipped
(14, 4, '2024-02-25 15:15:00', '2024-02-27 11:40:00', '2024-03-02 13:25:00'), -- Lisa - delivered

-- Some cancelled orders for realism
(15, 5, '2023-06-15 13:20:00', NULL, NULL),                                   -- Mike - cancelled
(3, 5, '2023-09-08 15:45:00', NULL, NULL),                                    -- Alice - cancelled
(4, 5, '2023-11-12 11:30:00', NULL, NULL);                                    -- Bob - cancelled

-- Insert order items for each order
INSERT INTO order_items (order_id, product_id, quantity) VALUES

-- Order 1 (Alice, 2022-01-15) - PC Games
(1, 1, 1),  -- Cyberpunk 2077
(1, 2, 1),  -- The Witcher 3

-- Order 2 (Bob, 2022-02-08) - Console Games
(2, 28, 1), -- Zelda BOTW
(2, 29, 1), -- God of War

-- Order 3 (Charlie, 2022-02-20) - Mixed
(3, 15, 1), -- Elden Ring
(3, 17, 1), -- Minecraft

-- Order 4 (Diana, 2022-03-12) - Console
(4, 30, 1), -- Red Dead Redemption 2
(4, 31, 1), -- Spider-Man Miles Morales

-- Order 5 (Edward, 2022-03-25) - PC
(5, 4, 1),  -- Hades
(5, 5, 1),  -- Disco Elysium
(5, 6, 1),  -- Among Us

-- Order 6 (Alice, 2022-04-10) - Single item
(6, 3, 1),  -- Baldurs Gate 3

-- Order 7 (Bob, 2022-05-05) - Sports games
(7, 34, 1), -- FIFA 23
(7, 35, 1), -- NBA 2K24

-- Order 8 (Charlie, 2022-05-18) - Action games
(8, 32, 1), -- AC Valhalla
(8, 33, 1), -- RE Village

-- Order 9 (Diana, 2022-06-02) - Nintendo games
(9, 43, 1), -- Super Mario Odyssey
(9, 50, 1), -- Splatoon 3

-- Order 10 (Edward, 2022-06-20) - Racing
(10, 40, 1), -- Gran Turismo 7
(10, 41, 1), -- NFS Unbound

-- Order 11 (Fiona, 2022-07-08) - Indie games
(11, 12, 1), -- Slay the Spire
(11, 13, 1), -- Cuphead
(11, 26, 1), -- Hollow Knight

-- Order 12 (George, 2022-07-22) - Big titles
(12, 14, 1), -- Star Wars Jedi Survivor
(12, 44, 1), -- Halo Infinite

-- Order 13 (Helen, 2022-08-05) - Survival games
(13, 9, 1),  -- Subnautica
(13, 21, 1), -- The Forest
(13, 23, 1), -- No Man's Sky

-- Order 14 (Ivan, 2022-08-18) - Strategy
(14, 8, 1),  -- Factorio
(14, 24, 1), -- RimWorld

-- Order 15 (Jane, 2022-09-02) - Platformers
(15, 19, 1), -- Ori and the Blind Forest
(15, 37, 1), -- Crash Bandicoot 4
(15, 52, 1), -- Kirby Forgotten Land

-- Order 16 (Kevin, 2022-09-15) - Fighting games
(16, 36, 1), -- Mortal Kombat 11
(16, 49, 1), -- Bayonetta 3

-- Order 17 (Lisa, 2022-10-01) - RPGs
(17, 42, 1), -- Horizon Zero Dawn
(17, 47, 1), -- Ghost of Tsushima

-- Order 18 (Mike, 2022-10-18) - Horror
(18, 48, 1), -- Demon's Souls
(18, 46, 1), -- Returnal

-- Continue with more order items for remaining orders...
-- Order 19 (Alice, 2022-11-05) - Holiday shopping
(19, 45, 1), -- Ratchet & Clank
(19, 51, 1), -- Fire Emblem Engage

-- Order 20 (Bob, 2022-11-20) - More holiday shopping
(20, 53, 1), -- The Last of Us Part I
(20, 54, 1), -- Metroid Dread

-- Order 21 (Charlie, 2022-12-01) - Gift buying
(21, 38, 1), -- Tony Hawk Pro Skater
(21, 39, 1), -- Far Cry 6

-- Order 22 (Diana, 2022-12-10) - Christmas gifts
(22, 7, 1),  -- Stanley Parable
(22, 18, 1), -- Left 4 Dead 2

-- Order 23 (Edward, 2022-12-20) - Year end
(23, 20, 1), -- Metro Exodus
(23, 22, 1), -- Satisfactory

-- Continue with 2023 orders...
-- Order 24 (Fiona, 2023-01-08) - New year
(24, 25, 1), -- Project Zomboid
(24, 27, 1), -- Tunic

-- Order 25 (George, 2023-01-22)
(25, 10, 1), -- Dota 2 (free but maybe merchandise)
(25, 11, 1), -- Team Fortress 2

-- Add more order items for remaining orders with realistic game combinations
-- Recent orders with current popular games
(26, 3, 1),  -- Order 26 - Baldurs Gate 3
(27, 15, 1), -- Order 27 - Elden Ring
(28, 1, 1),  -- Order 28 - Cyberpunk 2077
(29, 17, 1), -- Order 29 - Minecraft
(30, 2, 1),  -- Order 30 - Witcher 3
(31, 4, 1),  -- Order 31 - Hades
(32, 28, 1), -- Order 32 - Zelda BOTW
(33, 29, 1), -- Order 33 - God of War
(34, 30, 1), -- Order 34 - RDR2
(35, 31, 1), -- Order 35 - Spider-Man Miles
(36, 14, 1), -- Order 36 - Jedi Survivor
(37, 44, 1), -- Order 37 - Halo Infinite
(38, 32, 1), -- Order 38 - AC Valhalla
(39, 33, 1), -- Order 39 - RE Village
(40, 43, 1), -- Order 40 - Mario Odyssey
(41, 34, 1), -- Order 41 - FIFA 23
(42, 35, 1), -- Order 42 - NBA 2K24
(43, 40, 1), -- Order 43 - Gran Turismo 7
(44, 45, 1), -- Order 44 - Ratchet & Clank
(45, 46, 1), -- Order 45 - Returnal
(46, 47, 1), -- Order 46 - Ghost of Tsushima
(47, 48, 1), -- Order 47 - Demon's Souls
(48, 49, 1), -- Order 48 - Bayonetta 3
(49, 50, 1), -- Order 49 - Splatoon 3
(50, 51, 1), -- Order 50 - Fire Emblem
(51, 52, 1), -- Order 51 - Kirby
(52, 53, 1), -- Order 52 - TLOU Part I
(53, 54, 1), -- Order 53 - Metroid Dread
(54, 5, 1),  -- Order 54 - Disco Elysium
(55, 12, 1), -- Order 55 - Slay the Spire
(56, 13, 1), -- Order 56 - Cuphead
(57, 26, 1); -- Order 57 - Hollow Knight

-- Display order statistics
SELECT 
    'Orders imported successfully!' as message,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN stat_id = 1 THEN 1 END) as pending_orders,
    COUNT(CASE WHEN stat_id = 2 THEN 1 END) as processing_orders,
    COUNT(CASE WHEN stat_id = 3 THEN 1 END) as shipped_orders,
    COUNT(CASE WHEN stat_id = 4 THEN 1 END) as delivered_orders,
    COUNT(CASE WHEN stat_id = 5 THEN 1 END) as cancelled_orders
FROM orders;

-- Show order distribution by month
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') as month,
    COUNT(*) as order_count
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month;

-- Show top customers by order count
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    COUNT(o.order_id) as order_count,
    SUM(CASE WHEN o.stat_id = 4 THEN 1 ELSE 0 END) as delivered_orders
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.role_id = 1  -- Only customers
GROUP BY u.user_id, u.first_name, u.last_name
HAVING order_count > 0
ORDER BY order_count DESC;

-- Show recent orders with status
SELECT 
    o.order_id,
    CONCAT(u.first_name, ' ', u.last_name) as customer,
    s.description as status,
    o.order_date,
    COUNT(oi.product_id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN status s ON o.stat_id = s.stat_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_date >= '2024-01-01'
GROUP BY o.order_id, u.first_name, u.last_name, s.description, o.order_date
ORDER BY o.order_date DESC;
