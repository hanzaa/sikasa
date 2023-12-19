const db = require("../configs/db.config");


const register = async (username, hash, role) => {
    try {
        await db.query(`INSERT INTO akun (username, password, role) VALUES ($1, $2, $3)`, [username, hash, role])
    } catch (err) {
        throw err
    }
}

const login = async (username) => {
    try {
        const user = await db.query(`SELECT * FROM akun WHERE username = $1`, [username])
        return user.rows
    } catch (err) {
        throw err
    }
}

module.exports= {
    register,
    login,
}