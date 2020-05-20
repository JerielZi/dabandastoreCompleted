const User = require('../models/User')

async function post(req, res, next) {
   //check if has all fields
    //Lógica de Salvar
    const keys = Object.keys(req.body)

    for(key of keys) {
      //req.body.key == ""
      if (req.body[key] == "") {
        return res.render('user/register', {
          user: req.body,
          error: 'Por favor, preencha todos os campos.'
        })
      }
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

module.exports = {
  post
}