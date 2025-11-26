const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
require('dotenv').config()

const app = express();
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))


nunjucks.configure('views',{
    autoescape:true,
    express:app
})

app.use('/',authRoutes);
app.use('/clientes',clientesRoutes);

app.get('/',(req,res)=>{
    if(!req.session.user)return res.redirect('/login');
    res.render('home.njk',{user:req.session.user});
});

const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`Servidor en puerto ${port}`));