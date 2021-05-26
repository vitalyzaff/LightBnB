INSERT INTO users (name, email, password)
VALUES ('Jake Smith', 'jakeysmithy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Maria Gonzalez', 'gonzalezalltheway@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('David Marks', 'markdavid@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Sweet Home', 'description', 'https://google.com', 'https://google.com', 458, 2, 3, 5, 'Canada', 'Random Ave', 'Toronto', 'Ontario', 'j4m6n4', TRUE),
(2, 'Sweeter Home', 'description', 'https://google.com', 'https://google.com', 257, 1, 4, 2, 'Canada', 'Not So Random Ave', 'Calgary',  'Alberta', 'l8p4j5', TRUE),
(3, 'THE Sweetest Home', 'description', 'https://google.com', 'https://google.com', 998, 3, 5, 9, 'Canada', 'Firts of a kinf Ave', 'Victoria','British Columbia', 't2t1j7', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-14', 1, 1),
('2019-09-11', '2019-11-14', 2, 2),
('2018-09-11', '2021-12-24', 3, 3);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'wonderful'),
(2, 2, 2, 5, 'amazing'),
(3, 3, 3, 3, 'phenomenal');