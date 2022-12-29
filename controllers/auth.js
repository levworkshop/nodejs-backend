const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const joi = require('joi');
const database = require('./database');
const bcrypt = require('bcrypt');

module.exports = {
    login: async function (req, res, next) {
        const reqBody = req.body;

        const schema = joi.object({
            email: joi.string().required().min(6).max(255).email(),
            password: joi.string().required().min(6),
        });

        const { error, value } = schema.validate(reqBody);

        if (error) {
            console.log(error.details[0].message);
            res.status(401).send('Unauthorized');
            return;
        }

        const sql = `SELECT * FROM customers WHERE email=?;`;

        try {
            const result = await database.query(sql, [value.email]);
            const customer = result[0][0];
            const validPassword = await bcrypt.compare(value.password, customer.password_hash);
            if (!validPassword) throw 'Invalid password';
            const param = { email: customer.email };
            const token = jwt.sign(param, config.JWT_SECRET, { expiresIn: '72800s' });
            res
                .json({
                    token: token,
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    business: customer.business
                });
        }
        catch (err) {
            console.log(`Error: ${err}`);
            res.status(401).send('Unauthorized');
            return;
        }
    },
}
