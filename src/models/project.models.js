const { connection } = require("../../db-connection");

class Project {
  static findAll() {
    const sql = "SELECT * FROM project";
    return connection.promise().query(sql);
  }

  static findAllActive() {
    const sql = "SELECT * FROM project WHERE active=1";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM project WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOne(project) {
    const sql = "INSERT INTO project SET ?";
    return connection.promise().query(sql, [project]);
  }

  static updateOne(project, id) {
    const sql = "UPDATE project SET ? WHERE id=?";
    return connection.promise().query(sql, [project, id]);
  }

  static deleteOne(id) {
    const sql = "DELETE FROM project WHERE id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = Project;
