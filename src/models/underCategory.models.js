const { connection } = require("../../db-connection");

class UnderCategory {
  static findAll() {
    const sql = "SELECT uc.*, c.title as categoryTitle FROM under_category uc LEFT JOIN category c ON c.id=uc.category_id";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM under_category WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOne(category) {
    const sql = "INSERT INTO under_category SET ?";
    return connection.promise().query(sql, [category]);
  }

  static updateOne(category, id) {
    const sql = "UPDATE under_category SET ? WHERE id=?";
    return connection.promise().query(sql, [category, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM under_category WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findOneByTitle(title) {
    const sql = "SELECT * FROM under_category WHERE title=?";
    return connection.promise().query(sql, [title]);
  }

  static findCategories(id) {
    const sql = "SELECT * FROM under_category WHERE category_id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = UnderCategory;
