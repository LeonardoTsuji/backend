const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { User } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const userSchema = {
  name: (name) => name,
  email: (email) => email,
  password: (password) => password,
  phone: (phone) => phone,
  idRole: (idRole) => idRole,
};

describe("Usuário", () => {
  it("Criar um usuário", async () => {
    const user = await User.create({
      email: "leonardo@hotmail.com",
      password: "tsuji",
      name: "Leonardo",
      phone: "149985068121",
      idRole: 1,
    });

    // Verifica se as caracteristicas do objeto user é igual ao userSchema
    chai.expect(user).to.containSubset(userSchema);
  });

  it("Lista as regras", async () => {
    await User.create({
      email: "rogerio@hotmail.com",
      password: "tsuji",
      name: "Rogério",
      phone: "14998506819",
      idRole: 1,
    });
    await User.create({
      email: "fabio@hotmail.com",
      password: "tsuji",
      name: "Fabio",
      phone: "149985068120",
      idRole: 1,
    });

    const users = await User.findAll();

    chai.expect(users.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao userSchema
    chai.expect(users).to.containSubset([userSchema]);
  });
});
