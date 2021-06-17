var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const checkValidation = require('../services/checkValidation')



var con = checkValidation.connectDB()

function checkCompanyName(req, res, next) {
    var companyName = req.body.companyName;

    var query = "select * from `companydetails` where `companyName`=?";
    var getQuery = mysql.format(query, [companyName]);
    con.query(getQuery, function (err, result) {

        if (err) throw err;
        if (result.length > 0)
            res.send({ title: 'Company', result: false, message: "Company Name already exist. Try with diff name.", code: 400 });
        else
            next();
    });
}

// async function checkCompanyName(req, res, next) {
//     var companyName = req.body.companyName;
//     const query = await util.promisify(con.query).bind(con);

//     let companydata = await query("select * from `companydetails` where `companyName`=?", [companyName])
//     if (companydata.length > 0) {
//         res.send({ title: 'Company', result: false, message: "Company Name already exist. Try with diff name.", code: 400 });
//     } else {
//         next();
//     }
// }


router.post('/addcomapnydetails', checkCompanyName, [check('companyName', "Emplty value not allow").isLength({ min: 1 })], async function (req, res, next) {

    let payload = await checkValidation.checkUserAuth(req, res, next, "addcomapnydetails")

    if (!payload) {
        return
    }
    var companyName = req.body.companyName;
    var address = req.body.address;
    var emailid = req.body.emailid;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.send({ title: 'Company', result: false, message: errors.mapped(), code: 404 });
    } else {


        var insertQuery = 'insert into `companydetails` (`companyName`,`address`,`emailid`) VALUES (?,?,?)';

        var query = mysql.format(insertQuery, [companyName, address, emailid]);
        con.query(query, function (err, response) {
            // console.log("response", response);
            try {
                if (err) throw err;
                else
                    res.send({ title: 'Company', result: true, message: 'Company Details Inserted Successfully', code: 201 });
            } catch (error) {
                res.send({ title: 'Company', result: false, message: "Somthing Wrong On Server    " + error, code: 500 });
            }

        });
    }
})


router.get('/companylist', async function (req, res, next,) {

    let payload = await checkValidation.checkUserAuth(req, res, next, "companylist")

    if (!payload) {
        return
    }
    var query = "select * from `companydetails`";
    con.query(query, function (err, result) {

        if (err) throw err;
        if (result.length > 0)
            res.send({ title: 'Company', result: result, message: "Company List", code: 200 });
        else
            res.send({ title: 'Company', result: false, message: "Company list not found.", code: 400 });

    });
})


module.exports = router;
