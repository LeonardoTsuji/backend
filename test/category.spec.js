const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { Category } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const categorySchema = {
  name: (name) => name,
};

describe("Categoria", () => {
  it("Criar uma categoria", async () => {
    const category = await Category.create({ name: "Hatch" });

    // Verifica se as caracteristicas do objeto category é igual ao categorySchema
    chai.expect(category).to.containSubset(categorySchema);
  });

  it("Lista as categorias", async () => {
    await Category.create({ name: "Sedan" });
    await Category.create({ name: "SUV" });

    const categories = await Category.findAll();

    chai.expect(categories.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao categorySchema
    chai.expect(categories).to.containSubset([categorySchema]);
  });
});
