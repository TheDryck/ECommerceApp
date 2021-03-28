const mySqli = require('mysqli');

let conn = new mySqli({
   host: 'localhost',
    post: 3306,
    user: 'root',
    pass: '',
    db: 'mega_shop'
});

let db = conn.emit(false, '');

module.exports = {
    database: db
}