const { connection } = require("../../db-connection");

class Admin {
  static findAll() {
    const sql = "SELECT * FROM admin";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM admin WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findOneByEmail(email) {
    const sql = "SELECT * FROM admin WHERE email=?";
    return connection.promise().query(sql, [email]);
  }

  static createOne(admin) {
    const sql = "INSERT INTO admin SET ?";
    return connection.promise().query(sql, [admin]);
  }

  static updateOne(admin, id) {
    const sql = "UPDATE admin SET ? WHERE id=?";
    return connection.promise().query(sql, [admin, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM admin WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findOneByTitle(title) {
    const sql = "SELECT * FROM admin WHERE title=?";
    return connection.promise().query(sql, [title]);
  }
}

module.exports = Admin;
