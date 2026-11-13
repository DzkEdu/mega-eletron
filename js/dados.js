/* ============================================================
   MEGA ELÉTRON POUSO ALEGRE — dados padrão do catálogo
   ------------------------------------------------------------
   Esse arquivo é o "estoque de fábrica". O painel (backend/)
   salva as alterações por cima dele. Se o painel nunca foi
   usado, o catálogo mostra exatamente o que está aqui.

   ATENÇÃO: os produtos abaixo são EXEMPLOS (exemplo: true).
   Nomes, preços e fichas técnicas são ilustrativos até a loja
   passar os modelos reais.
   ============================================================ */

window.MEGA_PADRAO = {
  // Subir esse número sempre que mudar os produtos de exemplo: os navegadores
  // que já usaram o painel trocam os exemplos antigos pelos novos sozinhos.
  versao: 2,

  config: {
    loja: "Mega Elétron Pouso Alegre",
    cidade: "Pouso Alegre - MG",
    whatsapp: "5535998860825",
    endereco: "R. Comendador José García, 1169 - Santa Elisa, Pouso Alegre - MG, 37553-101",
    mapsLink: "https://maps.app.goo.gl/1Znt7a9jaYnXrkXD9",
    instagram: "megaeletronpousoalegre",
    horario: "", // ex.: "Seg a sex 8h–18h · Sáb 8h–12h" (vazio = pede pra confirmar no WhatsApp)
    mostrarPrecos: true,
    avisoExemplo: true,

    // Conta da economia (usada no painel do topo)
    precoGasolina: 6.29,   // R$ por litro
    kmPorLitroMoto: 40,    // moto 125–160 cc
    kmPorLitroCarro: 11,   // carro popular na cidade
    precoKwh: 1.05,        // R$ por kWh (conta de luz com impostos)
    consumoKwh100: 2.2,    // kWh a cada 100 km (média de scooter elétrica)
    diasMes: 26
  },

  categorias: [
    { id: "scooter",   nome: "Scooters",            singular: "Scooter" },
    { id: "patinete",  nome: "Patinetes e hoverboards", singular: "Patinete" },
    { id: "bike",      nome: "Bikes elétricas",     singular: "Bike elétrica" },
    { id: "triciclo",  nome: "Triciclos",           singular: "Triciclo" },
    { id: "acessorio", nome: "Acessórios",          singular: "Acessório" }
  ],

  /* A loja só vende modelos até 1000 W / 32 km/h — nenhum precisa de CNH.
     habilitacao:
     auto  = autopropelido (até 32 km/h, até 1000 W) — sem CNH
     bike  = bicicleta elétrica com pedal assistido — sem CNH
     ""    = acessório
     desenho (opcional): força a ilustração (ex.: "moto" pra scooter estilo moto) */

  produtos: [
    {
      id: "scooter-urbana-1000", exemplo: true,
      nome: "Scooter Urbana 1000W", cat: "scooter", habilitacao: "auto",
      preco: 6490, precoDe: 6990,
      vel: 32, autonomia: 50, motor: "1000 W", bateria: "Lítio 60V 20Ah", recarga: "6 a 8 h", cargaMax: 150,
      cores: ["#d5be8c", "#f4f1ea", "#1c1c1f"],
      resumo: "A queridinha da loja. Leve, baixa e com bateria de lítio que sai pra carregar em casa.",
      estoque: "disponivel", visivel: true, destaque: true, foto: ""
    },
    {
      id: "scooter-classic-800", exemplo: true,
      nome: "Scooter Classic 800W", cat: "scooter", habilitacao: "auto",
      preco: 5790, precoDe: null,
      vel: 32, autonomia: 40, motor: "800 W", bateria: "Chumbo-gel 48V 20Ah", recarga: "8 h", cargaMax: 130,
      cores: ["#7fb7a8", "#c9474b", "#f4f1ea"],
      resumo: "Visual retrô, banco largo e baú atrás. Pra quem quer ir à padaria com estilo.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    },
    {
      id: "scooter-duo-1000", exemplo: true,
      nome: "Scooter Duo 1000W · 2 baterias", cat: "scooter", habilitacao: "auto",
      preco: 7990, precoDe: null,
      vel: 32, autonomia: 80, motor: "1000 W", bateria: "2× Lítio 60V 20Ah removíveis", recarga: "6 h cada", cargaMax: 150,
      cores: ["#1c1c1f", "#5c6b7a"],
      resumo: "Duas baterias que saem do banco. Uma roda, a outra carrega no escritório.",
      estoque: "encomenda", visivel: true, destaque: true, foto: ""
    },
    {
      id: "scooter-street-1000", exemplo: true, desenho: "moto",
      nome: "Scooter Street 1000W estilo moto", cat: "scooter", habilitacao: "auto",
      preco: 7490, precoDe: 7990,
      vel: 32, autonomia: 60, motor: "1000 W", bateria: "Lítio 60V 26Ah", recarga: "6 a 8 h", cargaMax: 150,
      cores: ["#1c1c1f", "#c9474b"],
      resumo: "Cara de moto, sem precisar de carteira. Roda grande e banco alto pra quem quer presença.",
      estoque: "disponivel", visivel: true, destaque: true, foto: ""
    },
    {
      id: "patinete-dobravel-350", exemplo: true,
      nome: "Patinete Dobrável 350W", cat: "patinete", habilitacao: "auto",
      preco: 2490, precoDe: null,
      vel: 25, autonomia: 30, motor: "350 W", bateria: "Lítio 36V 10Ah", recarga: "4 a 5 h", cargaMax: 100,
      cores: ["#1c1c1f"],
      resumo: "Dobra em 3 segundos, cabe no porta-malas e sobe no ônibus.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    },
    {
      id: "patinete-off-800", exemplo: true,
      nome: "Patinete Off 800W", cat: "patinete", habilitacao: "auto",
      preco: 3990, precoDe: null,
      vel: 32, autonomia: 45, motor: "800 W", bateria: "Lítio 48V 15Ah", recarga: "6 h", cargaMax: 120,
      cores: ["#1c1c1f", "#d5be8c"],
      resumo: "Pneu largo e suspensão nas duas rodas. Encara paralelepípedo sem sacudir.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    },
    {
      id: "hoverboard-10", exemplo: true,
      nome: "Hoverboard 10\" com Bluetooth", cat: "patinete", habilitacao: "auto",
      preco: 1690, precoDe: 1890,
      vel: 12, autonomia: 15, motor: "2× 350 W", bateria: "Lítio 36V 4,4Ah", recarga: "3 h", cargaMax: 100,
      cores: ["#1c1c1f", "#c9474b", "#5c6b7a"],
      resumo: "Pneu 10\" que aguenta calçada, caixinha de som e luz de LED. Presente certo.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    },
    {
      id: "bike-aro26-350", exemplo: true,
      nome: "Bike Elétrica Aro 26 · 350W", cat: "bike", habilitacao: "bike",
      preco: 4690, precoDe: null,
      vel: 25, autonomia: 40, motor: "350 W", bateria: "Lítio 36V 10Ah (no quadro)", recarga: "5 h", cargaMax: 120,
      cores: ["#8a5a3c", "#1c1c1f"],
      resumo: "Pedala junto com você. Subida da Santa Elisa vira plano.",
      estoque: "disponivel", visivel: true, destaque: false,
      foto: "assets/produtos/bike-aro26.jpg",
      fotoCredito: "Foto: Javier Carro, CC BY-SA 4.0, via Wikimedia Commons"
    },
    {
      id: "bike-dobravel-aro20", exemplo: true,
      nome: "Bike Elétrica Dobrável Aro 20", cat: "bike", habilitacao: "bike",
      preco: 4290, precoDe: null,
      vel: 25, autonomia: 35, motor: "350 W", bateria: "Lítio 36V 8Ah", recarga: "4 h", cargaMax: 110,
      cores: ["#f4f1ea", "#1c1c1f"],
      resumo: "Dobra no meio e vai pro apartamento, pro carro ou pra debaixo da mesa.",
      estoque: "disponivel", visivel: true, destaque: true,
      foto: "assets/produtos/bike-dobravel-aro20.jpg",
      fotoCredito: "Foto: Zest96, CC BY 3.0, via Wikimedia Commons"
    },
    {
      id: "triciclo-800", exemplo: true,
      nome: "Triciclo Elétrico 800W com cesto", cat: "triciclo", habilitacao: "auto",
      preco: 8490, precoDe: null,
      vel: 25, autonomia: 40, motor: "800 W", bateria: "Chumbo-gel 48V 20Ah", recarga: "8 h", cargaMax: 150,
      cores: ["#c9474b", "#7fb7a8", "#f4f1ea"],
      resumo: "Três rodas, ré e banco com encosto. Firme pra quem tem receio de equilíbrio.",
      estoque: "disponivel", visivel: true, destaque: true, foto: ""
    },
    {
      id: "triciclo-cargo-1000", exemplo: true,
      nome: "Triciclo Cargo 1000W", cat: "triciclo", habilitacao: "auto",
      preco: 9990, precoDe: null,
      vel: 25, autonomia: 45, motor: "1000 W", bateria: "Lítio 60V 20Ah", recarga: "6 h", cargaMax: 250,
      cores: ["#f4f1ea", "#5c6b7a"],
      resumo: "Caçamba atrás pra feira, obra ou entrega no bairro. Carrega até 250 kg.",
      estoque: "encomenda", visivel: true, destaque: false, foto: ""
    },
    {
      id: "capacete-aberto", exemplo: true,
      nome: "Capacete Aberto com viseira", cat: "acessorio", habilitacao: "",
      preco: 189, precoDe: null,
      vel: null, autonomia: null, motor: "", bateria: "", recarga: "", cargaMax: null,
      cores: ["#1c1c1f", "#f4f1ea", "#d5be8c"],
      resumo: "Certificado pelo Inmetro, forro removível. Do P ao GG.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    },
    {
      id: "cadeado-alarme", exemplo: true,
      nome: "Trava de disco com alarme", cat: "acessorio", habilitacao: "",
      preco: 149, precoDe: null,
      vel: null, autonomia: null, motor: "", bateria: "", recarga: "", cargaMax: null,
      cores: ["#d5be8c"],
      resumo: "Mexeu, apita a 110 dB. Pra estacionar tranquilo no centro.",
      estoque: "esgotado", visivel: true, destaque: false, foto: ""
    },
    {
      id: "bateria-extra-60v", exemplo: true,
      nome: "Bateria extra Lítio 60V 20Ah", cat: "acessorio", habilitacao: "",
      preco: 1890, precoDe: null,
      vel: null, autonomia: null, motor: "", bateria: "Lítio 60V 20Ah", recarga: "6 h", cargaMax: null,
      cores: ["#1c1c1f"],
      resumo: "Dobra a autonomia das scooters 60V. Também serve de troca quando a velha cansar.",
      estoque: "disponivel", visivel: true, destaque: false, foto: ""
    }
  ]
};
