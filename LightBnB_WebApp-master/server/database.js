const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query = 'SELECT * FROM reservations JOIN properties ON property_id = properties.id WHERE guest_id = $1 LIMIT $2;';
  const values = [guest_id, limit];
  return pool
    .query(query, values)
    .then((result) => result.rows)
    .catch((err) => err.message);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  let query = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  const values = [];
  
  if (options.owner_id) {
    values.push(`${options.owner_id}`);
    query += `WHERE owner_id = $${values.length}`;
  }
  
  if (options.city && options.minimum_price_per_night && options.maximum_price_per_night) {
    values.push(`%${options.city}%`);
    values.push(`${options.minimum_price_per_night}`);
    values.push(`${options.maximum_price_per_night}`);
    query += `WHERE city LIKE $${values.length - 2} AND cost_per_night > $${values.length - 1} AND cost_per_night < $${values.length}`;
  } else if (options.city && options.maximum_price_per_night) {
    values.push(`%${options.city}%`);
    values.push(`${options.maximum_price_per_night}`);
    query += `WHERE city LIKE $${values.length - 1} AND cost_per_night < $${values.length }`;
  } else if (options.city && options.minimum_price_per_night) {
    values.push(`%${options.city}%`);
    values.push(`${options.minimum_price_per_night}`);
    query += `WHERE city LIKE $${values.length - 1} AND cost_per_night > $${values.length}`;
  } else if (options.minimum_price_per_night && options.maximum_price_per_night) {
    values.push(`${options.minimum_price_per_night}`);
    values.push(`${options.maximum_price_per_night}`);
    query += `WHERE cost_per_night > $${values.length - 1} AND cost_per_night < $${values.length}`;
  } else if (options.minimum_price_per_night) {
    values.push(`${options.minimum_price_per_night}`);
    query += `WHERE cost_per_night > $${values.length}`;
  } else if (options.maximum_price_per_night) {
    values.push(`${options.maximum_price_per_night}`);
    query += `WHERE cost_per_night < $${values.length}`;
  } else if (options.city) {
    values.push(`%${options.city}%`);
    query += `WHERE city LIKE $${values.length}`;
  }

  // if (options.minimum_rating) {
  //   values.push(`${options.minimum_rating}`);
  //   query += `WHERE avg(property_reviews.rating) > $${values.length}`;
  // }
  
  values.push(limit);
  query += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${values.length};
    `;
  return pool
    .query(query, values)
    .then((res) => res.rows)
    .catch((err) => err.message);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let query = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
  RETURNING *;`;
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  return pool
    .query(query, values)
    .then((result) => result.rows[0])
    .catch((error) => error.message);
};
exports.addProperty = addProperty;
