const joi = require('joi');
const bcrypt = require('bcrypt');
const database = require('./database');

module.exports = {
    getDetails: async function (req, res, next) { 
        const schema = joi.object({
            id: joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);

        if (error) {
            res.status(400).send(`error get details`);
            console.log(error.details[0].message);
            return;
        }
        
        const sql = `SELECT 
            customers.id,
            customers.name,
            customers.email,
            customers.business
            FROM customers WHERE id=?;`;

        try {
            const result = await database.query(sql, [value.id]);
            res.json(result[0]);
        }
        catch (err) {
            res.status(400).send(`error get details`);
            console.log(err.message);
        }
    },

    addNew: async function (req, res, next) {
        const schema = joi.object({
            name: joi.string().required().min(2).max(200),
            email: joi.string().required().email().min(6).max(255),
            password: joi.string().required().min(6).max(32),
            business: joi.boolean().default(1),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            res.status(400).send(`error adding customer`);
            console.log(error.details[0].message);
            return;
        }
        
        const sql = `INSERT INTO customers(name, email, password_hash, business) VALUES(?,?,?,?);`;

        try {
            const hash = await bcrypt.hash(value.password, 10);
            const result = await database.query(
                sql,
                [
                    value.name,
                    value.email,
                    hash,
                    value.business
                ]
            );
            res.json(result[0]);
        }
        catch (err) {
            res.status(400).send(`error adding customer`);
            console.log(err.message);
        }
    },
}