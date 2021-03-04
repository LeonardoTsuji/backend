const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { Role } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const roleSchema = {
  name: (name) => name,
  description: (description) => description,
};

describe("Regra", () => {
  it("Criar uma regra", async () => {
    const role = await Role.create({
      name: "ADM",
      description: "System administrator",
    });

    // Verifica se as caracteristicas do objeto role é igual ao roleSchema
    chai.expect(role).to.containSubset(roleSchema);
  });

  it("Lista as regras", async () => {
    await Role.create({ name: "USER", description: "System user" });
    await Role.create({ name: "OPERATOR", description: "System operator" });

    const roles = await Role.findAll();

    chai.expect(roles.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao roleSchema
    chai.expect(roles).to.containSubset([roleSchema]);
  });
});
