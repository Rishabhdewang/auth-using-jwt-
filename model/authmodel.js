const {Model} = require('objection');

class auth extends Model {
    static get tableName(){
        return "auth1"
    }
}

module.exports=auth;