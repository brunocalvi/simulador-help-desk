module.exports = () => {
  async function validPassword(password) {
    let erro = [];

    if(password.length < 8) {
      erro.push("Senha deve ter no mínimo 8 caracteres.");
    }

    if(!password.match(/[a-z]/)) {
      erro.push("Senha deve conter letras minusculas.");
    }

    if(!password.match(/[A-Z]/)) {
      erro.push("Senha deve conter letras maiúsculas.");
    }

    if(!password.match(/\d/)) {
      erro.push("Senha deve conter números.");
    }

    if(!password.match(/[^a-zA-Z\d]/)) {
      erro.push("Senha deve conter caracteres especiais.");
    }

    return erro;
  }

  async function estadoChamado(estado) {
    switch(estado) {
      case "AB":
        return "ABERTO";  
        break;
      case "EE":
        return "EM ESPERA";
        break;
      case "EA":
        return "EM ATENDIMENTO";
        break;
      case "CO":
        return "CONCLUIDO";
        break;
      default:
        return "ABERTO";
    }
  }

  return { validPassword, estadoChamado }
}