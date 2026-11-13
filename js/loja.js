/* ============================================================
   Camada de dados compartilhada (catálogo + painel)
   ------------------------------------------------------------
   Hoje: salva no navegador (localStorage) por cima do dados.js.
   Versão final: trocar carregar()/salvar() por chamadas a um
   servidor (ex.: Supabase) — o resto do código não muda.
   ============================================================ */
(function () {
  var CHAVE = "megaeletron.pa.v1";

  function clonar(o) { return JSON.parse(JSON.stringify(o)); }

  function lerSalvo() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      return bruto ? JSON.parse(bruto) : null;
    } catch (e) { return null; }
  }

  function carregar() {
    var base = clonar(window.MEGA_PADRAO);
    var salvo = lerSalvo();
    if (!salvo || !Array.isArray(salvo.produtos)) return base;
    // config nova do padrão entra, mas o que o painel salvou vence
    base.config = Object.assign(base.config, salvo.config || {});
    if ((salvo.versaoPadrao || 1) < base.versao) {
      // exemplos mudaram desde o último salvamento: mantém os produtos reais e renova os exemplos
      var reais = salvo.produtos.filter(function (p) { return !p.exemplo; });
      base.produtos = reais.concat(base.produtos);
    } else {
      base.produtos = salvo.produtos;
    }
    base.atualizado = salvo.atualizado || null;
    return base;
  }

  function salvar(dados) {
    var pacote = {
      versao: 1,
      versaoPadrao: window.MEGA_PADRAO.versao,
      atualizado: new Date().toISOString(),
      config: dados.config,
      produtos: dados.produtos
    };
    localStorage.setItem(CHAVE, JSON.stringify(pacote)); // pode lançar QuotaExceededError
    return pacote.atualizado;
  }

  function restaurar() {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    return carregar();
  }

  function temAlteracoes() { return !!lerSalvo(); }

  function categoria(id, cats) {
    cats = cats || window.MEGA_PADRAO.categorias;
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i];
    return { id: id, nome: id, singular: id };
  }

  var HABILITACAO = {
    auto:  { curto: "Sem CNH",        longo: "Autopropelido: até 32 km/h, não precisa de CNH nem placa", semCnh: true },
    bike:  { curto: "Sem CNH",        longo: "Bicicleta elétrica com pedal assistido: não precisa de CNH", semCnh: true },
    ciclo: { curto: "ACC ou CNH A",   longo: "Ciclomotor: até 50 km/h, precisa de ACC ou CNH A e placa", semCnh: false },
    moto:  { curto: "CNH A",          longo: "Motocicleta elétrica: precisa de CNH A e placa", semCnh: false }
  };

  var ESTOQUE = {
    disponivel: "Pronta entrega",
    encomenda: "Sob encomenda",
    esgotado: "Esgotado"
  };

  function reais(v, centavos) {
    if (v === null || v === undefined || v === "" || isNaN(v)) return "";
    return Number(v).toLocaleString("pt-BR", {
      style: "currency", currency: "BRL",
      minimumFractionDigits: centavos ? 2 : 0, maximumFractionDigits: centavos ? 2 : 0
    });
  }

  function zap(numero, texto) {
    return "https://wa.me/" + String(numero).replace(/\D/g, "") + "?text=" + encodeURIComponent(texto);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  window.MegaLoja = {
    CHAVE: CHAVE,
    carregar: carregar, salvar: salvar, restaurar: restaurar, temAlteracoes: temAlteracoes,
    categoria: categoria, HABILITACAO: HABILITACAO, ESTOQUE: ESTOQUE,
    reais: reais, zap: zap, esc: esc, clonar: clonar
  };
})();
