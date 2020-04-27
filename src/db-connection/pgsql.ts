import * as appConfig from './../config/config'

const {Pool} = require('pg')



const pool = new Pool(appConfig.pgsql)



export default class PgSQLQuery {

    public async query(sql: any, params: any[]) {

        return new Promise((resolve, reject) => {
            try {
                pool.query(sql, params,(err, res) => {

                    if (err) {
                        reject(err)
                    }
                    resolve(res);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}