var jwt = require('jsonwebtoken');
var mysql = require('mysql');
const util = require('util')


const SECRET_KEY = "loginToken";
module.exports = {

    checkUserAuth: async function (req, res, next, apiname) {
        let headertoken = req.headers.authorization
        let payload
        if (!headertoken || headertoken == undefined) {
            res.send({ title: 'Company', result: false, message: "Missing or invalid authentication token", code: 401 });
            return false
        }
        let token = headertoken.replace('Bearer ', '')
        try {
            payload = await jwt.verify(token, SECRET_KEY);
            if (!payload.uid) {
                res.send({ title: 'Company', result: false, message: "Missing or invalid authentication token", code: 401 });
                return false
            }
        } catch (error) {
            res.send({ title: 'Company', result: false, message: "Missing or invalid authentication token", code: 401 });
            return false
        }


        let con = this.connectDB();

        try {
            const query = await util.promisify(con.query).bind(con);
            let pageid = await query("SELECT * FROM `permissions` where `name`=?", [apiname])
            if (pageid.length > 0) {
                let permissions = await query("SELECT * FROM `roll_has_permission` where `roleid`=? and permissionid=?", [payload.rolltype, pageid[0].id])
                if (permissions.length > 0) {
                    return payload;
                } else {
                    res.send({ title: 'Company', result: false, message: "Permission not grandted", code: 402 });
                    return false
                }

            } else {
                res.send({ title: 'Company', result: false, message: "Page not found", code: 400 });
                return false;
            }
        } catch (error) {
            console.log("validation error", error);
            return false;
        }

    },


    connectDB: function () {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "company"
        });

        con.connect(function (err) {
            if (err) throw err;
        });

        return con
    }

}