
// constructed as a single, nested insert so that there is no way one insert can succeed
// while the other fails. 
const insertUser = `
  WITH new_user AS( 
    INSERT INTO users(email, name, password) 
    VALUES ($1, $2, $3) 
    RETURNING user_id 
  ) 
  INSERT INTO items 
  SELECT user_id, 0 AS item_id, 'home' as item_text 
  FROM new_user 
  RETURNING user_id`;

const getItems = `
  SELECT item_id AS id, item_text AS text, item_child AS child, item_next AS next, item_status AS checked 
  FROM items 
  WHERE (user_id = $1)`;

  // Insert array looks like this: 
  //[ user_id,   ]

const insertItem = `
  INSERT INTO items (user_id, item_id, item_text, item_status, item_next, item_child)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *`;


  /**
 * Parameters array format for both insertItems and updateItems: 
 * [ 
 *  user_id, 
 *  [item_id1, item_id2], 
 *  [text1, text2], 
 *  [status1, status2], 
 *  [next1, next2], 
 *  [child1, child2] 
 * ]
 */ 
const insertItems = `
INSERT INTO items (user_id, item_id, item_text, item_status, item_next, item_child)
VALUES (
  $1, 
  UNNEST($2::integer[]),
  UNNEST($3::text[]),
  UNNEST($4::text[]),
  UNNEST($5::integer[]),
  UNNEST($6::integer[])
)
RETURNING *`

const updateItems = `
  UPDATE items 
  SET 
    item_text  =temp.item_text,
    item_status=temp.item_status, 
    item_next  =temp.item_next, 
    item_child =temp.item_child
  FROM (
    SELECT 
      UNNEST($2::integer[]) AS item_id,
      UNNEST($3::text[]) AS item_text, 
      UNNEST($4::text[]) AS item_status, 
      UNNEST($5::integer[]) AS item_next, 
      UNNEST($6::integer[]) AS item_child
  ) AS temp
  WHERE items.user_id = $1 AND items.item_id = temp.item_id
  RETURNING items.user_id, items.item_id, items.item_text`


const deleteItem = ``;


module.exports = {
  insertUser: insertUser,
  getItems: getItems,
  insertItems: insertItems,
  updateItems: updateItems,
}