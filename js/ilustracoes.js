/* ============================================================
   Ilustrações em traço (SVG) — aparecem enquanto o produto
   não tem foto. Cada uma pinta o "corpo" com a 1ª cor do produto.
   Classes: .tr traço · .cp corpo (cor do produto) · .es escuro
   ============================================================ */
(function () {
  var D = {};

  D.scooter =
    '<circle class="tr" cx="58" cy="118" r="21"/><circle class="tr fino" cx="58" cy="118" r="6"/>' +
    '<circle class="tr" cx="182" cy="118" r="21"/><circle class="tr fino" cx="182" cy="118" r="6"/>' +
    '<path class="tr" d="M38 106C44 92 70 92 78 104"/>' +
    '<rect class="cp" x="78" y="106" width="78" height="9" rx="3"/>' +
    '<path class="cp" d="M150 116C150 98 164 86 184 86H204C214 86 218 96 214 108L210 114C204 100 196 96 184 96C170 96 160 104 160 116Z"/>' +
    '<path class="es" d="M150 78C168 71 196 71 208 76C208 82 202 85 196 85H158C151 85 148 81 150 78Z"/>' +
    '<path class="cp" d="M72 112C80 96 82 74 76 52L88 49C96 74 96 98 88 112Z"/>' +
    '<path class="tr" d="M66 46L98 41"/><path class="tr fino" d="M94 42L100 31"/>' +
    '<circle class="luz" cx="84" cy="58" r="4"/><rect class="luz" x="210" y="92" width="6" height="5" rx="2"/>';

  D.moto =
    '<circle class="tr" cx="56" cy="116" r="25"/><circle class="tr fino" cx="56" cy="116" r="17"/>' +
    '<circle class="tr" cx="188" cy="116" r="25"/><circle class="tr fino" cx="188" cy="116" r="17"/>' +
    '<path class="tr" d="M56 116L82 56"/><path class="tr" d="M70 52L98 47"/>' +
    '<path class="tr" d="M86 64L102 98"/><path class="tr" d="M150 104L188 116"/>' +
    '<path class="cp" d="M90 68L140 61L152 76L100 85Z"/>' +
    '<path class="es" d="M138 62L188 68C193 69 193 77 188 77L150 79Z"/>' +
    '<rect class="es" x="98" y="84" width="56" height="25" rx="4"/>' +
    '<path class="luz" d="M130 88L119 99H126L121 107L134 94H127Z"/>' +
    '<path class="cp" d="M184 70L210 66L208 74L188 76Z"/>' +
    '<circle class="cp" cx="77" cy="66" r="7"/><circle class="luz" cx="75" cy="66" r="3"/>';

  D.patinete =
    '<circle class="tr" cx="48" cy="128" r="13"/><circle class="tr" cx="192" cy="128" r="13"/>' +
    '<path class="tr" d="M32 122C36 110 58 108 64 116"/>' +
    '<path class="cp" d="M52 114H168C177 114 181 119 183 126H60C55 126 52 121 52 114Z"/>' +
    '<path class="tr grosso" d="M192 126L172 36"/><path class="tr" d="M156 34L190 39"/>' +
    '<rect class="es" x="164" y="44" width="14" height="10" rx="3" transform="rotate(-12 171 49)"/>' +
    '<circle class="luz" cx="179" cy="66" r="3"/>';

  D.hoverboard =
    '<circle class="tr" cx="38" cy="106" r="26"/><circle class="tr fino" cx="38" cy="106" r="12"/>' +
    '<circle class="tr" cx="202" cy="106" r="26"/><circle class="tr fino" cx="202" cy="106" r="12"/>' +
    '<rect class="cp" x="52" y="88" width="136" height="28" rx="12"/>' +
    '<rect class="es" x="66" y="92" width="38" height="16" rx="5"/><rect class="es" x="136" y="92" width="38" height="16" rx="5"/>' +
    '<path class="luz-traco" d="M70 112H170"/>';

  D.bike =
    '<circle class="tr" cx="58" cy="108" r="30"/><circle class="tr fino" cx="58" cy="108" r="25"/>' +
    '<circle class="tr" cx="182" cy="108" r="30"/><circle class="tr fino" cx="182" cy="108" r="25"/>' +
    '<circle class="cp" cx="58" cy="108" r="9"/>' +
    '<path class="tr" d="M58 108H112L100 58M58 108L100 60M100 62L160 57M112 108L166 72M162 60L182 108"/>' +
    '<path class="cp" d="M118 95L156 69L162 78L124 104Z"/>' +
    '<path class="tr" d="M100 58L96 48M160 57L158 42L174 40"/>' +
    '<path class="es" d="M84 46C92 41 104 41 110 45L108 50H86Z"/>' +
    '<circle class="tr fino" cx="112" cy="108" r="7"/>';

  D.triciclo =
    '<circle class="tr apagado" cx="198" cy="112" r="24"/>' +
    '<circle class="tr" cx="182" cy="116" r="24"/><circle class="tr fino" cx="182" cy="116" r="8"/>' +
    '<circle class="tr" cx="52" cy="118" r="22"/><circle class="tr fino" cx="52" cy="118" r="7"/>' +
    '<path class="tr" d="M52 118L70 62M62 58L86 53"/>' +
    '<path class="tr" d="M72 70C82 104 104 112 140 112H182M136 112V80"/>' +
    '<path class="cp" d="M86 98C98 110 120 112 150 110L158 98Z"/>' +
    '<path class="es" d="M118 72H152L150 80H120Z"/><path class="tr" d="M150 78L156 52"/>' +
    '<rect class="cp-claro" x="160" y="64" width="62" height="32" rx="4"/>' +
    '<path class="tr fino" d="M160 64H222V96H160ZM176 64V96M191 64V96M206 64V96"/>' +
    '<circle class="luz" cx="72" cy="66" r="3"/>';

  D.capacete =
    '<path class="cp" d="M48 116C46 66 86 34 130 34C176 34 202 68 202 104V118H150C140 118 132 112 128 104H76C62 104 54 108 48 116Z"/>' +
    '<path class="es" d="M140 68C170 62 198 74 204 100V118H152C142 118 136 110 136 100C136 86 137 76 140 68Z"/>' +
    '<path class="tr" d="M66 72C94 46 140 42 172 56"/><path class="tr fino" d="M90 104C90 112 96 118 104 118"/>';

  D.cadeado =
    '<path class="tr grosso" d="M92 72V52C92 28 148 28 148 52V72"/>' +
    '<rect class="cp" x="68" y="70" width="104" height="56" rx="14"/>' +
    '<circle class="es" cx="120" cy="92" r="7"/><rect class="es" x="117" y="96" width="6" height="14" rx="2"/>' +
    '<path class="tr fino" d="M184 82C191 90 191 104 184 112M194 74C206 88 206 106 194 120"/>';

  D.bateria =
    '<path class="tr" d="M94 52V40H146V52"/>' +
    '<rect class="luz" x="64" y="44" width="16" height="9" rx="2"/><rect class="luz" x="160" y="44" width="16" height="9" rx="2"/>' +
    '<rect class="cp" x="50" y="52" width="140" height="78" rx="10"/>' +
    '<path class="es" d="M126 64L102 96H118L112 118L138 84H122Z"/>' +
    '<path class="tr fino" d="M150 70H176M150 80H170"/>';

  function tipo(p) {
    if (p.desenho && D[p.desenho]) return p.desenho;
    var n = (p.nome || "").toLowerCase();
    if (p.cat === "acessorio") {
      if (n.indexOf("capacete") > -1) return "capacete";
      if (n.indexOf("bateria") > -1) return "bateria";
      return "cadeado";
    }
    if (n.indexOf("hoverboard") > -1) return "hoverboard";
    return D[p.cat] ? p.cat : "scooter";
  }

  window.MegaIlustra = function (p, extraClasse) {
    var cor = (p.cores && p.cores[0]) || "#d5be8c";
    return '<svg class="ilu ' + (extraClasse || "") + '" viewBox="0 0 240 160" role="img" aria-label="Ilustração: ' +
      MegaLoja.esc(p.nome) + '" style="--cor:' + cor + '">' +
      '<ellipse class="sombra" cx="120" cy="146" rx="96" ry="5"/>' + D[tipo(p)] + "</svg>";
  };
})();
