if(process.env.NODE_ENV === 'production')
{
    module.exports = {mongoURI : 
    'mongodb://ricvsweb-nodejs1:shRAbTFxgfGXoLWm@firstnodejscrud-1usf8.mongodb.net/test?retryWrites=true'
    }
}
else
{
    module.exports = {mongoURI : 
        'mmongodb://localhost/vidjot-dev'
        }

}