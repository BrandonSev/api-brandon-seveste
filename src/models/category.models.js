const { connection } = require("../../db-connection");

class Category {
  static findAll() {
    const sql = "SELECT * FROM category";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM category WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOne(category) {
    const sql = "INSERT INTO category SET ?";
    return connection.promise().query(sql, [category]);
  }

  static updateOne(category, id) {
    const sql = "UPDATE category SET ? WHERE id=?";
    return connection.promise().query(sql, [category, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM category WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findOneByTitle(title) {
    const sql = "SELECT * FROM category WHERE title=?";
    return connection.promise().query(sql, [title]);
  }
}

module.exports = Category;
