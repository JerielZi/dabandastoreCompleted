const User = require('../models/User')
const {formatNif} = require('../../lib/utils')

module.exports = {
  registerForm(req, res) {
    return res.render("user/register")
  },
  async show(req, res) {
    const { user } = req
    user.nif = formatNif(user.nif)

    return res.render('user/index', { user })
  },
  async post(req, res) {

    const userId = await User.create(req.body)

    req.session.userId = userId

    return res.redirect('/users')
  }, 
  async update(req, res) {
    try {
      const { user } = req
      let { name, email, nif, address } = req.body

      nif = nif.replace(/\D/g, "")

      await User.update(user.id, {
        name,
        email,
        nif,
        address
      })

      return res.render("user/index", {
        user: req.body,
        success: "Conta atualizada com sucesso!"
      })

    } catch (err) {
      console.error(err)
      return res.render("user/index", {
        error:"Algum erro aconteceu!"
      })
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id)
      req.session.destroy()

      return res.render("session/login", {
        success:"Conta deletada com sucesso!"
      })
      
    } catch (err) {
      console.error(err);
      return res.render("user/index", {
        user: req.body,
        error:"Erro ao tentar deletar a conta! Tente novamente!"
      })
    }
  }
}