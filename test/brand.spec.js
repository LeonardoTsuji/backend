const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { Brand } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const brandSchema = {
  name: (name) => name,
};

describe("Marca", () => {
  it("Criar uma marca", async () => {
    const brand = await Brand.create({ name: "Ford" });

    // Verifica se as caracteristicas do objeto brand é igual ao brandSchema
    chai.expect(brand).to.containSubset(brandSchema);
  });

  it("Lista as marcas", async () => {
    await Brand.create({ name: "Toyota" });
    await Brand.create({ name: "Honda" });

    const brands = await Brand.findAll();

    chai.expect(brands.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao brandSchema
    chai.expect(brands).to.containSubset([brandSchema]);
  });
});
