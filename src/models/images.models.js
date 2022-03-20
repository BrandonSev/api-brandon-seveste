const { connection } = require("../../db-connection");

class Images {
  static findAll() {
    const sql = "SELECT i.*, p.title as project_name FROM images as i INNER JOIN project as p ON p.id=i.project_id";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT i.*, p.title as project_name FROM images as i INNER JOIN project as p ON p.id=i.project_id WHERE i.id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOne(image) {
    const sql = "INSERT INTO images SET ?";
    return connection.promise().query(sql, [image]);
  }

  static updateOne(image, id) {
    const sql = "UPDATE images SET ? WHERE id=?";
    return connection.promise().query(sql, [image, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM images WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findImagesByProjectId(id) {
    const sql = "SELECT * FROM images WHERE project_id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = Images;
