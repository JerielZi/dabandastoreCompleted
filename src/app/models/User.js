const db = require('../../config/db')

const { hash } = require('bcryptjs')

module.exports = {
  async findOne(filters){
    let query = "SELECT * FROM users"

    Object.keys(filters).map(key => {
      // WHERE | OR | AND
      query = `${query}
      ${key}
      `

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)
    
    return results.rows[0]
  },
  async create(data) {

    try{

      const query = `
      INSERT INTO users (
        name,
        email, 
        password,
        nif,
        address
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `
      // hash of password
      const passwordHash = await hash(data.password, 8)

      const values = [
        data.name,
        data.email, 
        passwordHash,
        data.nif.replace(/\D/g, ""),
        data.address
      ]

      const results = await db.query(query, values)
      return results.rows[0].id

    }
    catch(err){
      console.error(err)
    }

  }
}