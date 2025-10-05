const fs = require("fs");

exports.add_user = (username, id, db) => {
    db.users[username] = id;
    fs.writeFile("./db/db.json", JSON.stringify(db, null, "\t"), () => {});
    return require("./db/db");
}
