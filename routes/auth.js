const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcript = require('bcryptjs');

router.get('/register',(req,res)=>{
    res.render('register.njk')
})

router.post('/register',async(req,res)=>{
    const {nombre,email,password} = req.body;
    const hash = await bcript.hash(password,10);
    await pool.query(
        'INSERT INTO usuarios(nombre,email,password) VALUES($1,$2,$3)',[nombre,email,hash]
    );
    res.redirect('/login')
    })

    router.get('/login',(req,res)=>{
        res.render('login.njk')
    })
    router.post('/login', async (req,res)=>{
        const { email,password }=req.body;
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 LIMIT 1;',
            [email]);
        if (result.rowCount ===0)return res.send
        ("Usuario no encontrado.");
        const usuario = result.rows[0];
        const ok = await bcript.compare(password,usuario.password)
        if(!ok)return res.send('Contraseña incorrecta');
        req.session.user=usuario;
        res.redirect('/');
    
    });

    router.get('/logout',(req,res)=>{
    req.session.destroy('/login');
});

module.exports = router;