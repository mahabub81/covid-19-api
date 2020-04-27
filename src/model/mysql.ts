import moment from "moment";

const db = require('../db-connection/mysql');

export default class MySQLQuery {
    public async insertQuery(table_name: string, column_values) {
        const connection = await db.getConnection();
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO ' + table_name + ' SET ?', column_values, function (error: any, results: any, fields: any) {
                connection.release();
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
    }


    public async query(query: string, params: Array<any>){
        const connection = await db.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(query,params, function (error: any, results: any, fields: any) {
                connection.release();
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
    }


}