const joi = require('joi');
const database = require('./database');

module.exports = {
    getListByCustomer: async function (req, res, next) {
        const schema = joi.object({
            id: joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);

        if (error) {
            res.status(400).send(`error get cards of a customer`);
            console.log(error.details[0].message);
            return;
        }
        
        const sql = `SELECT 
            cards.*, customers.id AS customers_id, 
            customers.name AS customers_name, customers.email, customers.business 
        FROM cards
        LEFT JOIN customers ON cards.customer_id = customers.id;`;

        try {
            const result = await database.query(sql, [value.id]);
            res.json(result[0]);
        }
        catch (err) {
            res.status(400).send(`error get cards of a customer`);
            console.log(err.message);
        }
    },
    
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
        
        const sql = `SELECT * FROM cards WHERE id=?;`;

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
            name: joi.string().required().min(2).max(100),
            description: joi.string().min(2).max(300).default(''),
            address: joi.string().required().min(2).max(300),
            phone: joi.string().required().regex(/^[0-9]{8,11}$/),
            image: joi.string().min(5).max(200).default(''),
            customer_id: joi.number().required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            res.status(400).send(`error adding card`);
            console.log(error.details[0].message);
            return;
        }
        console.log(value);
        const sql = `INSERT INTO cards
            (name, description, address, phone, image, customer_id) VALUES(?,?,?,?,?,?);`;

        try {
            const result = await database.query(sql, [
                value.name,
                value.description,
                value.address,
                value.phone,
                value.image,
                value.customer_id,
            ]);
            res.json({
                name: value.name,
                description: value.description,
                address: value.address,
                phone: value.phone,
                image: value.image,
                customer: result[0].insertId
            });
        }
        catch (err) {
            res.status(400).send(`error adding card`);
            console.log(err.message);
        }
    },

    updateDetails: async function (req, res, next) {
        const schema = joi.object({
            name: joi.string().min(2).max(100),
            description: joi.string().min(2).max(300),
            address: joi.string().min(2).max(300),
            phone: joi.string().regex(/^[0-9]{8,11}$/),
            image: joi.string().min(5).max(200),
        }).min(1);

        const { error, value } = schema.validate(req.body);

        if (error) {
            res.status(400).send(`error updating card`);
            console.log(error.details[0].message);
            return;
        }
                
        const keys = Object.keys(value);
        const values = Object.values(value); // const values = [...Object.values(value), req.params.id];
        const fields = keys.map(key => `${key}=?`).join(',');
        values.push(req.params.id);
        const sql = `UPDATE cards SET ${fields} WHERE id=?;`;
        
        try {
            const result = await database.query(sql, values);
            res.json(result[0]);
        }
        catch (err) {
            res.status(400).send(`error updating card`);
            console.log(err.message);
        }
    },
    
    deleteCard: async function (req, res, next) {
        const schema = joi.object({
            id: joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);

        if (error) {
            res.status(400).send(`error delete card`);
            console.log(error.details[0].message);
            return;
        }
        
        const sql = `DELETE FROM cards WHERE id=?;`;

        try {
            const result = await database.query(sql, [value.id]);
            res.json(result[0]);
        }
        catch (err) {
            res.status(400).send(`error delete card`);
            console.log(err.message);
        }
    },
}