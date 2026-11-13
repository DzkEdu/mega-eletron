/* ============================================================
   Catálogo — Mega Elétron Pouso Alegre
   Os dados vêm de dados.js + o que o painel (backend/) salvou.
   ============================================================ */
(function () {
  var L = window.MegaLoja;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var dados, cfg;
  var estado = { cat: "todos", busca: "", trajeto: false, ordem: "destaque" };
  var trajeto = { km: 18, mexeu: false };

  var NOMES_COR = {
    "#d5be8c": "dourado", "#f4f1ea": "branco", "#1c1c1f": "preto", "#7fb7a8": "verde-água",
    "#c9474b": "vermelho", "#5c6b7a": "grafite", "#8a5a3c": "marrom"
  };

  var ICONE_ZAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.4 11.4 0 0 1-4.4-3.9c-.5-.7-1.2-1.8-1.2-3.4s.8-2.4 1.1-2.7c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.4.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.6.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>';
  var ICONE_MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v14h-2zM5 11h14v2H5z"/></svg>';

  /* ---------- regras ---------- */
  function visiveis() { return dados.produtos.filter(function (p) { return p.visivel !== false; }); }
  function ehVeiculo(p) { return p.cat !== "acessorio" && Number(p.autonomia) > 0; }
  function serve(p) {
    return ehVeiculo(p) && p.estoque !== "esgotado" && p.visivel !== false &&
      Number(p.autonomia) >= trajeto.km;
  }
  function nomeCor(hex, i) { return NOMES_COR[String(hex).toLowerCase()] || ("opção " + (i + 1)); }
  function precoTexto(p) { return cfg.mostrarPrecos && p.preco ? L.reais(p.preco) : ""; }
  function semAcento(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

  /* ---------- painel do trajeto (assinatura) ---------- */
  function montarGomos() {
    var g = $("#gomos"); g.innerHTML = "";
    for (var i = 0; i < 10; i++) g.appendChild(document.createElement("i"));
  }

  function atualizarTrajeto() {
    var km = trajeto.km;
    $("#kmValor").textContent = km;
    var r = $("#km");
    r.style.setProperty("--p", ((km - r.min) / (r.max - r.min) * 100) + "%");

    var lista = visiveis().filter(serve);
    // sugere o mais barato que ainda chega com folga (20%); sem folga, o de maior autonomia
    var porPreco = lista.slice().sort(function (a, b) { return (a.preco || Infinity) - (b.preco || Infinity); });
    var melhor = porPreco.filter(function (p) { return km / p.autonomia <= .8; })[0] ||
      lista.slice().sort(function (a, b) { return b.autonomia - a.autonomia; })[0];

    var gomos = $("#gomos"), txt = $("#cargaTxt");
    gomos.classList.remove("baixa", "vazia");
    var acesos = 0;
    if (melhor) {
      var sobra = Math.max(0, 1 - km / melhor.autonomia);
      acesos = Math.round(sobra * 10);
      if (sobra < .3) gomos.classList.add("baixa");
      var dias = Math.floor(melhor.autonomia / km);
      txt.innerHTML = "Com a <b>" + L.esc(melhor.nome) + "</b>, sobra <b>" + Math.round(sobra * 100) +
        "%</b> de bateria no fim do dia. " +
        (dias >= 2 ? "Dá pra carregar a cada <b>" + dias + " dias</b>." : "Carrega à noite, sai cheia de manhã.");
    } else {
      gomos.classList.add("vazia");
      txt.innerHTML = "<b>" + km + " km</b> numa carga só é muito pra esses modelos. Fala com a gente sobre <b>bateria extra</b>.";
    }
    $$("#gomos i").forEach(function (g, i) { g.classList.toggle("on", i < acesos); });

    // economia
    var kmMes = km * cfg.diasMes;
    var luz = kmMes * cfg.consumoKwh100 / 100 * cfg.precoKwh;
    var moto = kmMes / cfg.kmPorLitroMoto * cfg.precoGasolina;
    var carro = kmMes / cfg.kmPorLitroCarro * cfg.precoGasolina;
    $("#qtdServem").textContent = lista.length;
    $("#ecoMoto").textContent = L.reais(Math.max(0, moto - luz));
    $("#ecoCarro").textContent = L.reais(Math.max(0, carro - luz));
    $("#painelNota").textContent = "Por mês, rodando " + kmMes.toLocaleString("pt-BR") + " km: luz ≈ " +
      L.reais(luz) + ". Gasolina a " + L.reais(cfg.precoGasolina, true) + "/l. Conta aproximada.";

    var btn = $("#verServem");
    btn.textContent = lista.length ? "Ver os " + lista.length + " modelos que servem" : "Ver o catálogo completo";
    if (lista.length === 1) btn.textContent = "Ver o modelo que serve";

    var ft = $("#fTrajeto");
    ft.textContent = "Cabe nos meus " + km + " km";
    if (trajeto.mexeu) ft.hidden = false;
    if (estado.trajeto || trajeto.mexeu) renderGrade();
  }

  function ligarTrajeto() {
    $("#km").addEventListener("input", function (e) {
      trajeto.km = Number(e.target.value); trajeto.mexeu = true; atualizarTrajeto();
    });
    $("#verServem").addEventListener("click", function () {
      if (!visiveis().some(serve)) { limparFiltros(); return; }
      trajeto.mexeu = true;
      estado.cat = "todos"; estado.busca = ""; $("#busca").value = "";
      estado.trajeto = true;
      sincronizarFiltros(); renderGrade();
    });
  }

  /* ---------- filtros ---------- */
  function renderChips() {
    var vis = visiveis();
    var html = chip("todos", "Todos", vis.length);
    dados.categorias.forEach(function (c) {
      var n = vis.filter(function (p) { return p.cat === c.id; }).length;
      if (n) html += chip(c.id, c.nome, n);
    });
    $("#chips").innerHTML = html;
    function chip(id, nome, n) {
      return '<button type="button" class="chip" data-cat="' + id + '" aria-pressed="' + (estado.cat === id) + '">' +
        L.esc(nome) + " <small>" + n + "</small></button>";
    }
  }

  function sincronizarFiltros() {
    $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.cat === estado.cat)); });
    $("#fTrajeto").setAttribute("aria-pressed", String(estado.trajeto));
    if (estado.trajeto) $("#fTrajeto").hidden = false;
    $("#ordem").value = estado.ordem;
  }

  function limparFiltros() {
    estado = { cat: "todos", busca: "", trajeto: false, ordem: estado.ordem };
    $("#busca").value = "";
    sincronizarFiltros(); renderGrade();
  }

  function ligarFiltros() {
    $("#chips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      estado.cat = b.dataset.cat; sincronizarFiltros(); renderGrade();
    });
    $("#busca").addEventListener("input", function (e) { estado.busca = e.target.value; renderGrade(); });
    $("#fTrajeto").addEventListener("click", function () { estado.trajeto = !estado.trajeto; sincronizarFiltros(); renderGrade(); });
    $("#ordem").addEventListener("change", function (e) { estado.ordem = e.target.value; renderGrade(); });
    $("#limpar").addEventListener("click", limparFiltros);

    $$("[data-filtro-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.busca = ""; $("#busca").value = ""; estado.trajeto = false;
        estado.cat = b.dataset.filtroCat;
        sincronizarFiltros(); renderGrade();
        $("#catalogo").scrollIntoView({ behavior: reduzido() ? "auto" : "smooth" });
      });
    });
  }

  function filtrados() {
    var termo = semAcento(estado.busca.trim());
    var lista = visiveis().filter(function (p) {
      if (estado.cat !== "todos" && p.cat !== estado.cat) return false;
      if (estado.trajeto && !serve(p)) return false;
      if (termo) {
        var alvo = semAcento(p.nome + " " + p.resumo + " " + L.categoria(p.cat, dados.categorias).nome);
        if (alvo.indexOf(termo) < 0) return false;
      }
      return true;
    });
    var pesoEstoque = { disponivel: 0, encomenda: 1, esgotado: 2 };
    var ordem = dados.produtos.map(function (p) { return p.id; });
    lista.sort(function (a, b) {
      if (estado.ordem === "menor" || estado.ordem === "maior") {
        var pa = a.preco || (estado.ordem === "menor" ? Infinity : -Infinity);
        var pb = b.preco || (estado.ordem === "menor" ? Infinity : -Infinity);
        if (pa !== pb) return estado.ordem === "menor" ? pa - pb : pb - pa;
      } else if (estado.ordem === "autonomia") {
        var d = (Number(b.autonomia) || -1) - (Number(a.autonomia) || -1);
        if (d) return d;
      } else {
        if (!!b.destaque !== !!a.destaque) return b.destaque ? 1 : -1;
        var e = (pesoEstoque[a.estoque] || 0) - (pesoEstoque[b.estoque] || 0);
        if (e) return e;
      }
      return ordem.indexOf(a.id) - ordem.indexOf(b.id);
    });
    return lista;
  }

  /* ---------- cards ---------- */
  function midia(p, classe) {
    return p.foto
      ? '<img src="' + L.esc(p.foto) + '" alt="' + L.esc(p.nome) + '" loading="lazy">'
      : MegaIlustra(p, classe);
  }

  function selos(p, comDestaque) {
    var h = L.HABILITACAO[p.habilitacao], s = "";
    if (h) s += '<span class="selo ' + (h.semCnh ? "selo-ok" : "selo-cnh") + '">' + h.curto + "</span>";
    if (p.estoque === "encomenda") s += '<span class="selo selo-aviso">Sob encomenda</span>';
    if (p.estoque === "esgotado") s += '<span class="selo selo-fora">Esgotado</span>';
    if (comDestaque && p.destaque) s += '<span class="selo selo-dest">Destaque</span>';
    return s;
  }

  function msgProduto(p, cor) {
    var preco = precoTexto(p);
    if (p.estoque === "esgotado") {
      return "Oi! Vi no catálogo o *" + p.nome + "*, que está esgotado. Me avisa quando chegar?";
    }
    return "Oi! Vi no catálogo o *" + p.nome + "*" + (preco ? " (" + preco + ")" : "") +
      (cor ? " na cor *" + cor + "*" : "") + " e quero saber mais.";
  }

  function card(p) {
    var cat = L.categoria(p.cat, dados.categorias);
    var fichas = "";
    if (p.vel) fichas += '<div class="ficha"><b>' + p.vel + '</b><span>km/h</span></div>';
    if (p.autonomia) fichas += '<div class="ficha' + (trajeto.mexeu && serve(p) ? " serve" : "") + '"><b>' + p.autonomia + '</b><span>km por carga</span></div>';
    if (p.motor) fichas += '<div class="ficha"><b>' + L.esc(p.motor) + '</b><span>motor</span></div>';
    var preco = precoTexto(p);
    return '<article class="card' + (p.estoque === "esgotado" ? " esgotado" : "") + (trajeto.mexeu && serve(p) ? " serve" : "") + '">' +
      '<button type="button" class="card-midia" data-abrir="' + L.esc(p.id) + '" aria-label="Ver detalhes de ' + L.esc(p.nome) + '">' +
        midia(p) +
        '<span class="card-selos">' + selos(p, true) + "</span>" +
        (p.exemplo ? '<span class="selo-ex">exemplo</span>' : "") +
      "</button>" +
      '<div class="card-info">' +
        '<span class="card-cat">' + L.esc(cat.singular) + "</span>" +
        "<h3>" + L.esc(p.nome) + "</h3>" +
        '<p class="card-resumo">' + L.esc(p.resumo) + "</p>" +
        (fichas ? '<div class="fichas">' + fichas + "</div>" : "") +
        '<div class="card-pe">' +
          '<div class="preco">' +
            (preco && p.precoDe && p.precoDe > p.preco ? "<s>" + L.reais(p.precoDe) + "</s>" : "") +
            (preco ? "<b>" + preco + "</b>" : '<b class="consulte">Consulte</b>') +
          "</div>" +
          '<div class="card-acoes">' +
            '<button type="button" class="btn-icone" data-abrir="' + L.esc(p.id) + '" aria-label="Detalhes de ' + L.esc(p.nome) + '">' + ICONE_MAIS + "</button>" +
            '<a class="btn-icone zap" href="' + L.zap(cfg.whatsapp, msgProduto(p)) + '" target="_blank" rel="noopener" aria-label="Chamar no WhatsApp sobre ' + L.esc(p.nome) + '">' + ICONE_ZAP + "</a>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function renderGrade() {
    var lista = filtrados();
    $("#grade").innerHTML = lista.map(card).join("");
    $("#vazio").hidden = lista.length > 0;
    var partes = [];
    if (estado.trajeto) partes.push("que fazem " + trajeto.km + " km numa carga");
    $("#contagem").textContent = lista.length + (lista.length === 1 ? " produto" : " produtos") +
      (partes.length ? " " + partes.join(", ") : "");
  }

  /* ---------- detalhe ---------- */
  function abrir(id) {
    var p = dados.produtos.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var cat = L.categoria(p.cat, dados.categorias);
    var h = L.HABILITACAO[p.habilitacao];
    var preco = precoTexto(p);
    var linhas = [
      ["Velocidade máx.", p.vel ? p.vel + " km/h" : ""],
      ["Autonomia", p.autonomia ? "até " + p.autonomia + " km" : ""],
      ["Motor", p.motor], ["Bateria", p.bateria], ["Recarga", p.recarga],
      ["Carga máx.", p.cargaMax ? p.cargaMax + " kg" : ""],
      ["Estoque", L.ESTOQUE[p.estoque] || ""]
    ].filter(function (l) { return l[1]; });
    var cores = (p.cores || []);

    $("#detalheCorpo").innerHTML =
      '<div class="det-midia">' + midia(p) + (p.exemplo ? '<span class="selo-ex">exemplo</span>' : "") +
        (p.foto && p.fotoCredito ? '<span class="foto-credito">' + L.esc(p.fotoCredito) + "</span>" : "") + "</div>" +
      '<div class="det-info">' +
        '<span class="card-cat">' + L.esc(cat.singular) + "</span>" +
        '<h2 id="detNome">' + L.esc(p.nome) + "</h2>" +
        '<div class="card-selos" style="position:static">' + selos(p, false) + "</div>" +
        '<p class="card-resumo">' + L.esc(p.resumo) + "</p>" +
        '<div class="det-preco">' + (preco ? "<b>" + preco + "</b>" + (p.precoDe > p.preco ? "<s>" + L.reais(p.precoDe) + "</s>" : "") : "<b class='consulte'>Preço sob consulta</b>") + "</div>" +
        '<dl class="det-tabela">' + linhas.map(function (l) { return "<div><dt>" + l[0] + "</dt><dd>" + L.esc(l[1]) + "</dd></div>"; }).join("") + "</dl>" +
        (h ? '<p class="det-hab">' + h.longo + ".</p>" : "") +
        (cores.length > 1 ? '<div class="det-cores"><span>Cor:</span>' + cores.map(function (c, i) {
          return '<button type="button" class="cor-op" style="--c:' + L.esc(c) + '" data-cor="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + nomeCor(c, i) + '" title="' + nomeCor(c, i) + '"></button>';
        }).join("") + "</div>" : "") +
        '<div class="det-acoes">' +
          '<a class="btn btn-ouro btn-cheio" id="detZap" target="_blank" rel="noopener" href="' + L.zap(cfg.whatsapp, msgProduto(p, cores.length > 1 ? nomeCor(cores[0], 0) : "")) + '">' + (p.estoque === "esgotado" ? "Me avisa quando chegar" : "Quero esse") + "</a>" +
          (ehVeiculo(p) && p.estoque !== "esgotado" ? '<button type="button" class="btn btn-linha btn-cheio" id="detTest">Agendar um teste</button>' : "") +
        "</div>" +
      "</div>";

    $$(".cor-op", $("#detalheCorpo")).forEach(function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.dataset.cor);
        $$(".cor-op").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        $("#detZap").href = L.zap(cfg.whatsapp, msgProduto(p, nomeCor(cores[i], i)));
        var svg = $(".det-midia .ilu"); if (svg) svg.style.setProperty("--cor", cores[i]);
      });
    });
    var bt = $("#detTest");
    if (bt) bt.addEventListener("click", function () {
      $("#detalhe").close();
      $("#testModelo").value = p.id;
      $("#test-ride").scrollIntoView({ behavior: reduzido() ? "auto" : "smooth" });
    });

    var dlg = $("#detalhe");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  /* ---------- teste na loja ---------- */
  function renderTestModelos() {
    var sel = $("#testModelo"), atual = sel.value;
    var html = '<option value="">Escolhe um modelo</option>';
    dados.categorias.forEach(function (c) {
      var ps = visiveis().filter(function (p) { return p.cat === c.id && ehVeiculo(p) && p.estoque !== "esgotado"; });
      if (!ps.length) return;
      html += '<optgroup label="' + L.esc(c.nome) + '">' + ps.map(function (p) {
        return '<option value="' + L.esc(p.id) + '">' + L.esc(p.nome) + "</option>";
      }).join("") + "</optgroup>";
    });
    html += '<option value="indeciso">Ainda não sei, quero ajuda</option>';
    sel.innerHTML = html;
    sel.value = atual;
  }

  function ligarTest() {
    var hoje = new Date(); hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    $("#testDia").min = hoje.toISOString().slice(0, 10);
    $("#formTest").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      var nome = f.nome.value.trim(), modelo = f.modelo.value, dia = f.dia.value;
      if (!nome || !modelo || !dia) { $("#testErro").hidden = false; return; }
      $("#testErro").hidden = true;
      var p = dados.produtos.filter(function (x) { return x.id === modelo; })[0];
      var data = new Date(dia + "T12:00:00");
      var diaTxt = data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
      var msg = "Oi! Quero agendar um *teste na loja*.\n\n" +
        "*Nome:* " + nome + "\n" +
        "*Modelo:* " + (p ? p.nome : "ainda não sei, quero ajuda") + "\n" +
        "*Dia:* " + diaTxt + " · " + f.periodo.value;
      window.open(L.zap(cfg.whatsapp, msg), "_blank", "noopener");
    });
  }

  /* ---------- loja / contatos ---------- */
  var MSGS = {
    oficina: "Oi! Queria falar com a oficina sobre a manutenção do meu veículo elétrico.",
    padrao: "Oi! Vi o catálogo da Mega Elétron Pouso Alegre e queria tirar uma dúvida."
  };
  function renderLoja() {
    $$("[data-zap]").forEach(function (a) {
      a.href = L.zap(cfg.whatsapp, MSGS[a.dataset.zap] || MSGS.padrao);
      a.target = "_blank"; a.rel = "noopener";
    });
    $("#lojaEndereco").textContent = cfg.endereco;
    $("#lojaHorario").textContent = cfg.horario || "Chama no WhatsApp pra confirmar o horário de hoje.";
    $("#lojaRota").href = cfg.mapsLink || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cfg.endereco));
    var mapa = "https://www.google.com/maps?q=" + encodeURIComponent(cfg.endereco) + "&output=embed";
    if ($("#lojaMapa").getAttribute("src") !== mapa) $("#lojaMapa").src = mapa;
    var insta = $("#lojaInsta");
    insta.hidden = !cfg.instagram;
    insta.href = "https://www.instagram.com/" + cfg.instagram + "/";
    insta.textContent = "@" + cfg.instagram;
    $("#rodapeLoja").textContent = cfg.loja + " · " + cfg.endereco;
    var creditos = visiveis().filter(function (p) { return p.foto && p.fotoCredito; })
      .map(function (p) { return p.nome + ": " + p.fotoCredito.replace(/^Foto:\s*/, ""); });
    $("#rodapeCreditos").textContent = creditos.length ? "Fotos de exemplo · " + creditos.join(" · ") : "";
    $("#faixaPrevia").hidden = !cfg.avisoExemplo;
  }

  /* ---------- botão fixo some quando outro CTA aparece ---------- */
  function ligarZapFixo() {
    if (!("IntersectionObserver" in window)) return;
    var fixo = $(".zap-fixo"), vistos = new Set();
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target); });
      fixo.classList.toggle("some", vistos.size > 0);
    }, { threshold: .4 });
    $$(".cta-zap").forEach(function (el) { io.observe(el); });
  }

  /* ---------- entrada das seções ---------- */
  function reduzido() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function ligarRevela() {
    if (!("IntersectionObserver" in window) || reduzido()) return;
    var alvos = $$(".secao-cab, .regras li, .servicos li, .form, .loja-mapa, .faq-lista, .final h2");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px" });
    alvos.forEach(function (el, i) {
      el.classList.add("revela");
      el.style.transitionDelay = (el.matches("li") ? (Array.prototype.indexOf.call(el.parentNode.children, el) * 80) : 0) + "ms";
      io.observe(el);
    });
  }

  /* ---------- tudo junto ---------- */
  function carregarTudo() {
    dados = L.carregar(); cfg = dados.config;
    renderChips(); sincronizarFiltros(); renderGrade(); renderTestModelos(); renderLoja(); atualizarTrajeto();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-abrir]");
    if (b) abrir(b.dataset.abrir);
  });
  $("#detalhe").addEventListener("click", function (e) { if (e.target === e.currentTarget) e.currentTarget.close(); });

  // painel aberto em outra aba salvou? atualiza na hora
  window.addEventListener("storage", function (e) { if (e.key === L.CHAVE || e.key === null) carregarTudo(); });

  montarGomos();
  carregarTudo();
  ligarTrajeto(); ligarFiltros(); ligarTest(); ligarZapFixo(); ligarRevela();

  var pedido = new URLSearchParams(location.search).get("produto");
  if (pedido) abrir(pedido);
})();
