module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hour = date.getHours()
    const minutes = date.getMinutes()

    return {
      day,
      month,
      year,
      hour,
      minutes,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format:`${day}/${month}/${year}`
    }
  },
  formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'AKZ'
    }).format(price/100)
  },  
  formatNif(value) {
    //Mascara para o NIF
    value = value.replace(/\D/g,"")

    if (value.length > 9)
      value = value.slice(0, -1)

    value = value.replace(/(\d{3})(\d)/, "$1 $2")

    value = value.replace(/(\d{3})(\d)/, "$1 $2")

    return value

  }
}