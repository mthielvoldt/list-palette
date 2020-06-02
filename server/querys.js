

const insertUser =
  `WITH new_user AS( 
    INSERT INTO users(email, name, password) 
    VALUES ($1, $2, $3) 
    RETURNING user_id 
  ) 
  INSERT INTO items 
  SELECT user_id, 0 AS item_id, 'home' as item_text 
  FROM new_user 
  RETURNING user_id`;

const getItems =
  `SELECT item_id AS id, item_text AS text, item_child AS child, item_next AS next, item_status AS checked 
  FROM items 
  WHERE (user_id = $1)`;


module.exports = {
  insertUser: insertUser,
  getItems: getItems
}