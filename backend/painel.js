/* ============================================================
   Painel da loja — Mega Elétron Pouso Alegre
   Cadastra/edita produtos e dados da loja. Salva via MegaLoja.
   ============================================================ */
(function () {
  var L = window.MegaLoja;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var SENHA_DEMO = "mega2026";     // demonstração — na versão final vira login de verdade
  var SESSAO = "megaeletron.painel";

  var dados = L.carregar();

  // fotos do dados.js ficam em catalogo/assets — o painel mora em backend/
  function urlFoto(f) { return /^(data:|https?:|\/)/.test(f) ? f : "../" + f; }
  var editando = null;            // produto em edição (cópia)
  var fotoAtual = "";

  /* ---------- login ---------- */
  function logado() { try { return sessionStorage.getItem(SESSAO) === "1"; } catch (e) { return false; } }
  function mostrarApp() { $("#entrar").hidden = true; $("#app").hidden = false; renderTudo(); }

  $("#formEntrar").addEventListener("submit", function (e) {
    e.preventDefault();
    if ($("#senha").value.trim() === SENHA_DEMO) {
      try { sessionStorage.setItem(SESSAO, "1"); } catch (er) {}
      mostrarApp();
    } else {
      $("#erroSenha").hidden = false; $("#senha").select();
    }
  });
  $("#sair").addEventListener("click", function () {
    try { sessionStorage.removeItem(SESSAO); } catch (e) {}
    location.reload();
  });

  /* ---------- salvar ---------- */
  function gravar(msg) {
    try {
      L.salvar(dados);
      toast(msg || "Salvo. O catálogo já mostra.", false, true);
      return true;
    } catch (e) {
      toast("Não coube no navegador. Use fotos menores ou tire alguma foto.", true);
      dados = L.carregar(); renderTudo();
      return false;
    }
  }

  var tToast;
  function toast(txt, ruim, link) {
    var t = $("#toast");
    t.innerHTML = L.esc(txt) + (link ? ' <a href="../index.html" target="_blank" rel="noopener">Abrir catálogo</a>' : "");
    t.classList.toggle("ruim", !!ruim);
    t.hidden = false;
    clearTimeout(tToast);
    tToast = setTimeout(function () { t.hidden = true; }, 3800);
  }

  /* ---------- abas ---------- */
  $$(".aba").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".aba").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      $$(".painel-aba").forEach(function (s) { s.hidden = s.id !== "aba-" + b.dataset.aba; });
    });
  });

  /* ---------- números ---------- */
  function renderNumeros() {
    var ps = dados.produtos;
    var visiveis = ps.filter(function (p) { return p.visivel !== false; }).length;
    var esgot = ps.filter(function (p) { return p.estoque === "esgotado"; }).length;
    var encom = ps.filter(function (p) { return p.estoque === "encomenda"; }).length;
    var exemplos = ps.filter(function (p) { return p.exemplo; }).length;
    $("#numeros").innerHTML =
      num(visiveis, "no catálogo") +
      num(ps.length - visiveis, "ocultos") +
      num(esgot + encom, esgot + " esgotado" + (esgot === 1 ? "" : "s") + " · " + encom + " sob encomenda", esgot > 0) +
      num(exemplos, exemplos ? "ainda de exemplo" : "todos reais", exemplos > 0);
    function num(n, t, alerta) { return '<div class="num' + (alerta ? " alerta" : "") + '"><b>' + n + "</b><span>" + t + "</span></div>"; }
  }

  /* ---------- lista ---------- */
  var ICO = {
    estrela: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    editar: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg>',
    copiar: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
    lixo: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>'
  };

  function renderFiltrosCat() {
    var sel = $("#pCat"), atual = sel.value;
    sel.innerHTML = '<option value="">Todas as categorias</option>' + dados.categorias.map(function (c) {
      return '<option value="' + c.id + '">' + L.esc(c.nome) + "</option>";
    }).join("");
    sel.value = atual;
    $("#edCat").innerHTML = dados.categorias.map(function (c) {
      return '<option value="' + c.id + '">' + L.esc(c.singular) + "</option>";
    }).join("");
  }

  function renderLista() {
    var termo = $("#pBusca").value.trim().toLowerCase();
    var cat = $("#pCat").value, est = $("#pEstoque").value;
    var lista = dados.produtos.filter(function (p) {
      if (cat && p.cat !== cat) return false;
      if (est === "oculto" && p.visivel !== false) return false;
      if (est && est !== "oculto" && p.estoque !== est) return false;
      if (termo && (p.nome + " " + p.resumo).toLowerCase().indexOf(termo) < 0) return false;
      return true;
    });
    if (!lista.length) { $("#lista").innerHTML = '<p class="lista-vazia">Nenhum produto com esse filtro.</p>'; return; }
    $("#lista").innerHTML = lista.map(function (p) {
      var c = L.categoria(p.cat, dados.categorias);
      return '<div class="linha' + (p.visivel === false ? " oculto" : "") + '" data-id="' + L.esc(p.id) + '">' +
        '<button type="button" class="thumb" data-acao="editar" aria-label="Editar ' + L.esc(p.nome) + '">' +
          (p.foto ? '<img src="' + L.esc(urlFoto(p.foto)) + '" alt="">' : MegaIlustra(p)) + "</button>" +
        '<div class="linha-nome"><b>' + L.esc(p.nome) + "</b><small>" + L.esc(c.singular) +
          (p.exemplo ? '<span class="etq">exemplo</span>' : "") +
          (p.destaque ? '<span class="etq dest">destaque</span>' : "") + "</small></div>" +
        '<div class="linha-preco' + (p.preco ? "" : " vazio") + '">' + (p.preco ? L.reais(p.preco) : "Consulte") + "</div>" +
        '<div class="linha-estoque"><select data-acao="estoque" class="' + p.estoque + '" aria-label="Estoque de ' + L.esc(p.nome) + '">' +
          ["disponivel", "encomenda", "esgotado"].map(function (e) {
            return '<option value="' + e + '"' + (p.estoque === e ? " selected" : "") + ">" + L.ESTOQUE[e] + "</option>";
          }).join("") + "</select></div>" +
        '<label class="troca linha-vis"><input type="checkbox" data-acao="visivel"' + (p.visivel !== false ? " checked" : "") + "> <span>No catálogo</span></label>" +
        '<div class="linha-acoes">' +
          '<button type="button" class="ico' + (p.destaque ? " on" : "") + '" data-acao="destaque" title="Destaque" aria-label="Destaque" aria-pressed="' + !!p.destaque + '">' + ICO.estrela + "</button>" +
          '<button type="button" class="ico" data-acao="editar" title="Editar" aria-label="Editar">' + ICO.editar + "</button>" +
          '<button type="button" class="ico" data-acao="duplicar" title="Duplicar" aria-label="Duplicar">' + ICO.copiar + "</button>" +
          '<button type="button" class="ico" data-acao="excluir" title="Excluir" aria-label="Excluir">' + ICO.lixo + "</button>" +
        "</div>" +
      "</div>";
    }).join("");
  }

  function acharProduto(id) { return dados.produtos.filter(function (p) { return p.id === id; })[0]; }

  $("#lista").addEventListener("click", function (e) {
    var b = e.target.closest("[data-acao]"); if (!b || b.tagName === "SELECT" || b.type === "checkbox") return;
    var p = acharProduto(b.closest(".linha").dataset.id); if (!p) return;
    var acao = b.dataset.acao;
    if (acao === "editar") abrirEditor(p);
    if (acao === "destaque") { p.destaque = !p.destaque; gravar(p.destaque ? "Marcado como destaque." : "Tirado dos destaques."); renderTudo(); }
    if (acao === "duplicar") {
      var copia = L.clonar(p);
      copia.id = novoId(p.nome); copia.nome = p.nome + " (cópia)"; copia.visivel = false; copia.destaque = false;
      dados.produtos.splice(dados.produtos.indexOf(p) + 1, 0, copia);
      gravar("Cópia criada (escondida do catálogo)."); renderTudo(); abrirEditor(copia);
    }
    if (acao === "excluir") excluir(p);
  });
  $("#lista").addEventListener("change", function (e) {
    var el = e.target, linha = el.closest(".linha"); if (!linha) return;
    var p = acharProduto(linha.dataset.id); if (!p) return;
    if (el.dataset.acao === "estoque") { p.estoque = el.value; el.className = el.value; gravar("Estoque: " + L.ESTOQUE[el.value] + "."); renderNumeros(); }
    if (el.dataset.acao === "visivel") { p.visivel = el.checked; linha.classList.toggle("oculto", !el.checked); gravar(el.checked ? "Aparece no catálogo." : "Escondido do catálogo."); renderNumeros(); }
  });
  ["#pBusca", "#pCat", "#pEstoque"].forEach(function (s) { $(s).addEventListener("input", renderLista); });

  function excluir(p) {
    if (!confirm("Excluir “" + p.nome + "”? Não dá pra desfazer (a não ser por backup).")) return false;
    dados.produtos = dados.produtos.filter(function (x) { return x !== p; });
    gravar("Produto excluído."); renderTudo();
    return true;
  }

  function novoId(nome) {
    var base = String(nome || "produto").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "produto";
    var id = base, n = 2;
    while (acharProduto(id)) id = base + "-" + n++;
    return id;
  }

  /* ---------- editor ---------- */
  var form = $("#formProduto");
  var CAMPOS_NUM = ["preco", "precoDe", "vel", "autonomia", "cargaMax"];
  var CAMPOS_TXT = ["nome", "cat", "habilitacao", "motor", "bateria", "recarga", "resumo", "estoque"];
  var CHECKS = ["visivel", "destaque", "exemplo"];

  function abrirEditor(p) {
    var novo = !p;
    editando = novo ? {
      id: "", exemplo: false, nome: "", cat: $("#pCat").value || "scooter", habilitacao: "auto",
      preco: null, precoDe: null, vel: null, autonomia: null, motor: "", bateria: "", recarga: "", cargaMax: null,
      cores: ["#d5be8c"], resumo: "", estoque: "disponivel", visivel: true, destaque: false, foto: ""
    } : L.clonar(p);
    $("#edTitulo").textContent = novo ? "Novo produto" : "Editar produto";
    $("#excluir").hidden = novo;
    $("#erroProduto").hidden = true;
    CAMPOS_TXT.forEach(function (k) { form.elements[k].value = editando[k] == null ? "" : editando[k]; });
    CAMPOS_NUM.forEach(function (k) { form.elements[k].value = editando[k] == null ? "" : editando[k]; });
    CHECKS.forEach(function (k) { form.elements[k].checked = k === "visivel" ? editando.visivel !== false : !!editando[k]; });
    fotoAtual = editando.foto || "";
    renderCores(); renderPrevia();
    $("#editor").showModal();
    if (novo) form.elements.nome.focus();
  }

  function lerForm() {
    CAMPOS_TXT.forEach(function (k) { editando[k] = form.elements[k].value.trim(); });
    CAMPOS_NUM.forEach(function (k) { var v = form.elements[k].value; editando[k] = v === "" ? null : Number(v); });
    CHECKS.forEach(function (k) { editando[k] = form.elements[k].checked; });
    editando.cores = $$("#cores input[type=color]").map(function (i) { return i.value; });
    if (editando.foto !== fotoAtual) delete editando.fotoCredito; // foto trocada: crédito antigo não vale mais
    editando.foto = fotoAtual;
  }

  function renderPrevia() {
    var p = { nome: form.elements.nome.value || "Produto", cat: form.elements.cat.value,
      cores: $$("#cores input[type=color]").map(function (i) { return i.value; }) };
    $("#previa").innerHTML = fotoAtual ? '<img src="' + L.esc(urlFoto(fotoAtual)) + '" alt="Foto do produto">' : MegaIlustra(p);
    $("#tirarFoto").hidden = !fotoAtual;
  }

  function renderCores() {
    $("#cores").innerHTML = (editando.cores || []).map(function (c, i) {
      return '<span class="cor-item"><input type="color" value="' + L.esc(c) + '" aria-label="Cor ' + (i + 1) + '">' +
        '<button type="button" data-tirar="' + i + '" aria-label="Remover cor ' + (i + 1) + '">×</button></span>';
    }).join("");
  }
  $("#cores").addEventListener("input", renderPrevia);
  $("#cores").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tirar]"); if (!b) return;
    editando.cores = $$("#cores input[type=color]").map(function (i) { return i.value; });
    editando.cores.splice(Number(b.dataset.tirar), 1);
    renderCores(); renderPrevia();
  });
  $("#addCor").addEventListener("click", function () {
    editando.cores = $$("#cores input[type=color]").map(function (i) { return i.value; });
    if (editando.cores.length >= 6) return;
    editando.cores.push("#f4f1ea"); renderCores(); renderPrevia();
  });
  form.elements.nome.addEventListener("input", renderPrevia);
  form.elements.cat.addEventListener("change", function () {
    if (form.elements.cat.value === "acessorio") form.elements.habilitacao.value = "";
    else if (!form.elements.habilitacao.value) form.elements.habilitacao.value = "auto";
    renderPrevia();
  });

  // foto: reduz pra no máx. 1000px e JPEG ~80% antes de guardar
  $("#foto").addEventListener("change", function (e) {
    var arq = e.target.files && e.target.files[0]; e.target.value = "";
    if (!arq) return;
    if (!/^image\//.test(arq.type)) { toast("Esse arquivo não é imagem.", true); return; }
    var leitor = new FileReader();
    leitor.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1000, esc = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * esc); cv.height = Math.round(img.height * esc);
        var ctx = cv.getContext("2d");
        ctx.fillStyle = "#0d1626"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        fotoAtual = cv.toDataURL("image/jpeg", .8);
        renderPrevia();
      };
      img.onerror = function () { toast("Não consegui abrir essa imagem.", true); };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arq);
  });
  $("#tirarFoto").addEventListener("click", function () { fotoAtual = ""; renderPrevia(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    lerForm();
    if (!editando.nome) { $("#erroProduto").hidden = false; form.elements.nome.focus(); return; }
    if (editando.cat === "acessorio") { editando.habilitacao = ""; }
    if (!editando.cores.length) editando.cores = ["#d5be8c"];
    var antigo = editando.id && acharProduto(editando.id);
    var backup = L.clonar(dados.produtos);
    if (antigo) dados.produtos[dados.produtos.indexOf(antigo)] = editando;
    else { editando.id = novoId(editando.nome); dados.produtos.unshift(editando); }
    try { L.salvar(dados); }
    catch (er) {
      dados.produtos = backup;
      toast("Não coube no navegador. Tenta uma foto menor.", true);
      return;
    }
    $("#editor").close();
    toast(antigo ? "Produto atualizado." : "Produto criado.", false, true);
    renderTudo();
  });

  $("#excluir").addEventListener("click", function () {
    var p = editando && acharProduto(editando.id);
    if (p && excluir(p)) $("#editor").close();
  });
  $$("[data-fechar]").forEach(function (b) { b.addEventListener("click", function () { $("#editor").close(); }); });
  $("#novo").addEventListener("click", function () { abrirEditor(null); });

  /* ---------- config da loja ---------- */
  var fc = $("#formConfig");
  var CFG_NUM = ["precoGasolina", "precoKwh", "consumoKwh100", "kmPorLitroMoto", "kmPorLitroCarro", "diasMes"];
  function renderConfig() {
    var c = dados.config;
    ["loja", "endereco", "mapsLink", "instagram", "horario"].forEach(function (k) { fc.elements[k].value = c[k] || ""; });
    fc.elements.whatsapp.value = formatarFone(c.whatsapp);
    CFG_NUM.forEach(function (k) { fc.elements[k].value = c[k]; });
    fc.elements.mostrarPrecos.checked = !!c.mostrarPrecos;
    fc.elements.avisoExemplo.checked = !!c.avisoExemplo;
  }
  function formatarFone(n) {
    var d = String(n || "").replace(/\D/g, "").replace(/^55/, "");
    return d.length === 11 ? d.slice(0, 2) + " " + d.slice(2, 7) + "-" + d.slice(7) : d;
  }
  fc.addEventListener("submit", function (e) {
    e.preventDefault();
    var fone = fc.elements.whatsapp.value.replace(/\D/g, "");
    if (fone.length < 10 || fone.length > 13) { toast("WhatsApp precisa ter DDD + número.", true); return; }
    if (fone.length <= 11) fone = "55" + fone;
    var c = dados.config;
    ["loja", "endereco", "mapsLink", "instagram", "horario"].forEach(function (k) { c[k] = fc.elements[k].value.trim(); });
    c.instagram = c.instagram.replace(/^@/, "");
    c.whatsapp = fone;
    CFG_NUM.forEach(function (k) { var v = Number(fc.elements[k].value); if (v > 0) c[k] = v; });
    c.mostrarPrecos = fc.elements.mostrarPrecos.checked;
    c.avisoExemplo = fc.elements.avisoExemplo.checked;
    gravar("Dados da loja salvos.");
    renderConfig();
  });

  /* ---------- backup ---------- */
  $("#exportar").addEventListener("click", function () {
    var pacote = { versao: 1, exportado: new Date().toISOString(), config: dados.config, produtos: dados.produtos };
    var blob = new Blob([JSON.stringify(pacote, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "megaeletron-pa-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast("Backup baixado.");
  });
  $("#importar").addEventListener("change", function (e) {
    var arq = e.target.files && e.target.files[0]; e.target.value = "";
    if (!arq) return;
    arq.text().then(function (txt) {
      var p = JSON.parse(txt);
      if (!p || !Array.isArray(p.produtos) || !p.produtos.every(function (x) { return x && x.id && x.nome; })) throw new Error("formato");
      if (!confirm("Restaurar " + p.produtos.length + " produtos desse backup? O que está no painel agora vai ser substituído.")) return;
      var antes = dados;
      dados = L.carregar();
      dados.produtos = p.produtos;
      if (p.config) dados.config = Object.assign(dados.config, p.config);
      if (gravar("Backup restaurado.")) renderTudo(); else dados = antes;
    }).catch(function () { toast("Esse arquivo não é um backup do painel.", true); });
  });
  $("#restaurar").addEventListener("click", function () {
    if (!confirm("Apagar todas as alterações e voltar pros produtos de exemplo?")) return;
    dados = L.restaurar(); renderTudo(); toast("Voltou pro exemplo.", false, true);
  });

  /* ---------- geral ---------- */
  function renderTudo() {
    renderNumeros(); renderFiltrosCat(); renderLista(); renderConfig();
    var at = L.temAlteracoes() ? L.carregar().atualizado : null;
    $("#ultimaAlteracao").textContent = at
      ? "Última alteração: " + new Date(at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) + "."
      : "Nenhuma alteração ainda. O catálogo está mostrando os produtos de exemplo.";
  }

  // outra aba mexeu? recarrega
  window.addEventListener("storage", function (e) {
    if (e.key === L.CHAVE && !$("#editor").open) { dados = L.carregar(); renderTudo(); }
  });

  if (logado()) mostrarApp();
})();
