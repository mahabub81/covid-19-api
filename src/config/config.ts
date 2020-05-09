
const config = {
    tableName: 'covid19_daywise_data',
    fileWritePath:  process.env.FILE_WRITE_PATH,
    gitRepo: process.env.GIT_REPO || '',
    dateFormat: 'YYYY-MM-DD',
    mysqldb: {
        user: process.env.MYSQL_USER || '',
        database: process.env.MYSQL_DATABASE || '',
        password: process.env.MYSQL_PASSWORD || '',
        host: process.env.MYSQL_HOST || '',
        port:  parseInt(<string>process.env.MYSQL_PORT, 10) || 3000,
        max:  500,
        idleTimeoutMillis: 300,
        connectionLimit: 20
    },

    pgsql: {
        host: process.env.POSTGRESS_HOST || '',
        user: process.env.POSTGRES_USER || '',
        database: process.env.POSTGRES_DB || '',
        password: process.env.POSTGRES_PASSWORD || '',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        port:  5432,
    }
}

export = config;