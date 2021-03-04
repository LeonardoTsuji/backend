const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { MechanicalService } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const mechanicalServiceSchema = {
  name: (name) => name,
  description: (description) => description,
  price: (price) => price,
};

describe("Serviços mecânicos", () => {
  it("Criar um serviço mecânico", async () => {
    const mechanicalService = await MechanicalService.create({
      name: "Troca de óleo",
      description: "Serviço fundamental para o bom funcionamento do veículo",
      price: 200,
    });

    // Verifica se as caracteristicas do objeto mechanicalService é igual ao mechanicalServiceSchema
    chai.expect(mechanicalService).to.containSubset(mechanicalServiceSchema);
  });

  it("Lista as regras", async () => {
    await MechanicalService.create({
      name: "Troca das pastilhas de freio",
      description: "Serviço fundamental para o bom funcionamento do veículo",
      price: 200,
    });
    await MechanicalService.create({
      name: "Troca dos discos de freio",
      description: "Serviço fundamental para o bom funcionamento do veículo",
      price: 200,
    });

    const mechanicalServices = await MechanicalService.findAll();

    chai.expect(mechanicalServices.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao mechanicalServiceSchema
    chai.expect(mechanicalServices).to.containSubset([mechanicalServiceSchema]);
  });
});
