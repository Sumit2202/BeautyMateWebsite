const env = process.env.NODEJS_ENV || 'dev';
let token = sessionStorage.getItem('token');

const config = {
    dev: {
        backend: {
            host: 'https://cors-anywhere.herokuapp.com/http://beauty-mate-api.azurewebsites.net/api',
            //host: 'http://localhost:3001',
        },
        server: {
            port: parseInt(process.env.PORT) || 3001
        },
        header: {
            headers : {
            "Accept" : "application/json, text/plain, */*",
            "Authorization" : token,
            "Content-Type" : "application/json;charset=utf-8",
            }
        }
    },
    prd: {
        backend: {
            host: 'http://beauty-mate-api.azurewebsites.net/api',
            //host: 'http://localhost:3001',
        },
        headers : {
            "Accept" : "application/json, text/plain, */*",
            "Authorization" : token,
            "Content-Type" : "application/json;charset=utf-8",
        }
    }
};

module.exports = config[env];