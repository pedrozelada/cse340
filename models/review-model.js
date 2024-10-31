const pool = require("../database/")


/* ***************************
 *  Get all reviews by Inventory Id
 * ************************** */
async function getReviewById(review_id) {
  try {
  const data = await pool.query(
    `SELECT 
        r.review_id,
        r.review_text,
        r.review_date,
        r.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year
      FROM 
        review r
      JOIN 
        inventory i ON i.inv_id = r.inv_id
      WHERE 
        r.review_id = $1`,
    [review_id]
  )
  return data.rows[0]
} catch (error) {
  console.error("getReviewById error " + error)
  throw new Error('Database error: ' + error.message);
}
}

/* ***************************
 *  Get all reviews by Inventory Id
 * ************************** */
async function getallReviewsByInventoryId(inv_id) {
    try {
    const data = await pool.query(
      `SELECT review_text, review_date, account_id
      FROM public.review
      WHERE inv_id = $1
      ORDER BY review_date DESC;`
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    throw new Error('Database error: ' + error.message);
  }
}

/* ***************************
 *  Get reviews and autor by Inventory Id
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
    try {
    const data = await pool.query(
      `SELECT 
        r.review_id,
        r.review_text,
        r.review_date,
        r.inv_id,
        a.account_id,
        CONCAT(SUBSTRING(a.account_firstname, 1, 1), a.account_lastname) AS screen_name
      FROM 
        review r
      JOIN 
        account a ON r.account_id = a.account_id
      WHERE 
        r.inv_id = $1
      ORDER BY  r.review_date DESC`,
      [inv_id]
    )
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    throw new Error('Database error: ' + error.message);
  }
}


// Add a new review
async function addReview(review_text, inv_id, account_id) {
    try {
    const sql = `
      INSERT INTO public.review (review_text, inv_id, account_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `
    return await pool.query(sql, [review_text, inv_id, account_id])
} catch (error) {
    return error.message
  }
}

// Get reviews by account
async function getReviewsByAccountId(account_id) {
    try {
    const data = await pool.query(
     `SELECT 
        r.review_id,
        r.review_text,
        r.review_date,
        r.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year
      FROM 
        review r
      JOIN 
        inventory i ON i.inv_id = r.inv_id
      WHERE 
        r.account_id = $1
      ORDER BY  r.review_date DESC`,
      [account_id]
    )
    return data.rows
} catch (error) {
  console.error("getReviewsByAccountId error " + error)
  throw new Error('Database error: ' + error.message);
}
}


// Update an existing review
async function updateReview(review_id, review_text) {
  try {
    const sql = `
      UPDATE public.review
      SET review_text = $1, review_date = NOW()
      WHERE review_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [
      review_text, 
      review_id
    ])
    return data.rows[0]
} catch (error) {
  console.error("model error: " + error)
}
}

  
  // Delete a review
  async function deleteReview(review_id) {
    try {
    const sql = `
      DELETE FROM public.review
      WHERE review_id = $1
      RETURNING *;
    `
    const data = await pool.query(sql, [
      review_id
    ])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}
  
  
  module.exports = { getReviewsByInventoryId, addReview, getReviewsByAccountId, updateReview, deleteReview, getReviewById };