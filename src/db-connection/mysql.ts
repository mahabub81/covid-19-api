import * as appConfig  from './../config/config';
import * as mysql from 'mysql';


let mysqlPool  = mysql.createPool(appConfig.mysqldb);

exports.getConnection = () => {
    return new Promise((resolve, reject) => {
        mysqlPool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
           // console.log(connection);
            resolve(connection);
        });
    });
};