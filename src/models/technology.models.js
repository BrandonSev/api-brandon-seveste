const { connection } = require("../../db-connection");

class Technology {
  static findAll() {
    const sql =
      "SELECT t.*, c.title as category, uc.title as under_category FROM technology as t LEFT JOIN category as c ON t.category_id=c.id LEFT JOIN under_category as uc ON uc.id=t.under_category_id";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM technology WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOne(technology) {
    const sql = "INSERT INTO technology SET ?";
    return connection.promise().query(sql, [technology]);
  }

  static updateOne(technology, id) {
    const sql = "UPDATE technology SET ? WHERE id=?";
    return connection.promise().query(sql, [technology, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM technology WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findCategories(id) {
    const sql = "SELECT * FROM technology WHERE under_category_id=?";
    return connection.promise().query(sql, [id]);
  }

  static findUnderCategories(id) {
    const sql = "SELECT * from technology WHERE under_category_id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = Technology;
