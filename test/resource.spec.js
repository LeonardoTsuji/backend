const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { Resource } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const resourceSchema = {
  name: (name) => name,
};

describe("Recurso", () => {
  it("Criar um recurso", async () => {
    const resource = await Resource.create({ name: "Fabricante" });

    // Verifica se as caracteristicas do objeto resource é igual ao resourceSchema
    chai.expect(resource).to.containSubset(resourceSchema);
  });

  it("Lista os recursos", async () => {
    await Resource.create({ name: "Categoria" });
    await Resource.create({ name: "Produto" });

    const categories = await Resource.findAll();

    chai.expect(categories.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao resourceSchema
    chai.expect(categories).to.containSubset([resourceSchema]);
  });
});
