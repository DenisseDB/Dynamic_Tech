const db = require('../util/database');

module.exports = class Historial{
    static fecthAllPeriodo() {
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo DESC;')
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });
    }
}