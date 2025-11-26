const express = require('express');
const router = express.Router();
const pool = require('../db');
const { route } = require('./auth');

function auth(req,res,next){
    if(!req.session.user) return res.redirect('/login');
    next();
}

router.get('/',auth,async(req,res)=>{
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre ASC')
    res.render('clientes/index.njk',{cliente:result.rows})
});

router.get('/agregar',auth,(req,res)=>{
    res.render('clientes/agregar.njk');
});

router.post('/agregar',auth,async(req,res)=>{
    const {nombre,apellido,telefono,email} = req.body;
    await pool.query('INSERT INTO clientes(nombre,apellido,telefono,email) VALUES($1,$2,$3,$4)',[nombre,apellido,telefono,email])
    res.redirect('/clientes')
});

router.get('/editar/:id',auth,async(req,res)=>{
    const {id} = req.params
    const {result} = await pool.query('Select * FROM clientes WHERE id = $1 LIMIT 1',[id]);
    if(result.rowCount === 0) return res.send('Cliente no existe');

    res.render('/clientes/editar.njk',{cliente:result.rows[0]})
});

router.post('/editar/:id',auth,async(req,res)=>{
    const {id} = req.params;
    const {nombre,apellido,telefono,email} = res.body;

    await pool.query('UPDATE clientes SET nombre = $1, apellido = $2, telefono = $3,  email = $4 WHERE id = $5 ',[nombre,apellido,telefono,email,id]);
    res.render('/clientes')
})

router.get('/elimnar/:id',auth,async(req,res)=>{
    const {id} = req.params;
    
    await pool.query('DELETE FROM clientes WHERE id = $1',[id]);
    res.render('/clientes')
})

module.exports = router;