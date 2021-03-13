const chai = require("chai");
const http = require("chai-http"); // Extensão da lib chai p/ simular requisições http
const subSet = require("chai-subset"); // Extensao da lib chai p/ verificar objetos

const { Schedule } = require("../src/models");

chai.use(http);
chai.use(subSet);

// O atributo do objeto será testado para verificar se ele existe
// O atributo recebe uma função, e ela deve retornar true para o teste passar
const ScheduleSchema = {
  status: (status) => status,
  userId: (userId) => userId,
  dateSchedule: (dateSchedule) => dateSchedule,
  hourSchedule: (hourSchedule) => hourSchedule,
  vehicleId: (vehicleId) => vehicleId,
};

describe("Agenda", () => {
  it("Criar uma agenda", async () => {
    const schedule = await Schedule.create({
      status: "ATIVO",
      userId: 1,
      dateSchedule: "10/06/2021",
      hourSchedule: "09:00",
      vehicleId: 1,
    });

    // Verifica se as caracteristicas do objeto Schedule é igual ao ScheduleSchema
    chai.expect(schedule).to.containSubset(ScheduleSchema);
  });

  it("Lista as agendas", async () => {
    await Schedule.create({
      status: "ATIVO",
      userId: 1,
      dateSchedule: "10/06/2021",
      hourSchedule: "09:00",
      vehicleId: 1,
    });
    await Schedule.create({
      status: "ATIVO",
      userId: 2,
      dateSchedule: new Date(),
      hourSchedule: "10:00",
      vehicleId: 2,
    });

    const categories = await Schedule.findAll();

    chai.expect(categories.length).to.be.equals(3);
    // Primeiro se verifica se está retornando um array
    // Verifica se as caracteristicas dos objetos no array é igual ao ScheduleSchema
    chai.expect(categories).to.containSubset([ScheduleSchema]);
  });
});
