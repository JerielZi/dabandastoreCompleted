const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  const keys = Object.keys(body)

    for(key of keys) {
      if (body[key] == "") {
        return  {
          user: body,
          error: 'Por favor, preencha todos os campos.'
        }
      }
    }
}

async function show(req, res, next) {
  const { userId: id } = req.session

  const user = await User.findOne({where: {id} })

  if (!user) return res.render("user/register", {
    error: "Utilizador não encontrado"
  })

  req.user = user

  next()
}
async function post(req, res, next) {
   //check if has all fields
   const fillAllFields = checkAllFields(req.body)
   if (fillAllFields) {
     return res.render("user/register", fillAllFields)
   }
    
    //check if user exixts [email, nif]
    let {email, nif, password, passwordRepeat } = req.body

    nif = nif.replace(/\D/g, "")

    const user = await User.findOne({ 
      where: { email },
      or: { nif }
    })

    if (user) return res.render('user/register', {
      user: req.body,
      error: 'Utilizador já registado.'
    })

    // check if password match
    if (password != passwordRepeat)
      return res.render('user/register', {
        user: req.body,
        error: 'As senhas não são iguais. Tente novamente.'
      })
      next()
}
async function update(req, res, next) {
   //check if has all fields
   const fillAllFields = checkAllFields(req.body)
   if (fillAllFields) {
     return res.render("user/index", fillAllFields)
   }

   const { id, password } = req.body

   //Check if has password
   if (!password) return res.render("user/index", {
     user:req.body,
     error: "Coloque a sua senha para atualizar seu registo."
   })

   //Check if password match
   const user = await User.findOne({ where: {id} })

   const passed = await compare(password, user.password)

   if (!passed) return res.render("user/index", {
     user: req.body,
     error: "Senha incorreta."
   })

   req.user = user

   next()
}

module.exports = {
  post, 
  show,
  update
}