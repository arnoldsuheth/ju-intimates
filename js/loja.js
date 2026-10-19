/* ================================================================
   JU INTIMATES · a parte que funciona (sacola, janela, zoom, música…)
   ================================================================ */
(function () {
    const WHATSAPP = '5527998979722';

    /* ===== 1) OS PRODUTOS: troque aqui quando a Juliana comprar o estoque =====
       fotos: códigos das fotos do Unsplash (ilustrativas) · conj = conjunto · sut = sutiã · cal = calcinha */
    const PRODUTOS = [
        { id: 'rose', nome: 'Rosé Cetim', tecido: 'Cetim com renda', grupo: 'claras', cores: ['#E8C7BE'], selo: 'Mais desejado',
          fotos: ['1594631761754-09569bd41e54', '1594631775771-890a902ae42d', '1594631767857-52af186837a5', '1594631773033-814817f000e8'], conj: 159.9, sut: 99.9, cal: 64.9,
          desc: 'Alcinha e shortinho em cetim rosé com acabamento de renda. Delicado, macio e lindo pra dormir ou presentear.' },
        { id: 'nude', nome: 'Nude Essencial', tecido: 'Bralette de microfibra', grupo: 'claras', cores: ['#D9B9A4'], selo: 'Conforto',
          fotos: ['1660070607601-f7d0234665c4', '1633699124189-17c808027f4a'], conj: 99.9, sut: 64.9, cal: 39.9,
          desc: 'Sem bojo e sem costuras aparentes. Some debaixo da roupa e abraça o corpo o dia inteiro.' },
        { id: 'champagne', nome: 'Champagne', tecido: 'Renda floral', grupo: 'claras', cores: ['#E9D3B8'], selo: 'Novo',
          fotos: ['1568441556126-f36ae0900180'], conj: 129.9, sut: 84.9, cal: 49.9,
          desc: 'Renda floral em tom champagne. Clássico, feminino e combina com tudo.' },
        { id: 'bordo', nome: 'Bordô', tecido: 'Bralette de renda', grupo: 'coloridas', cores: ['#7D1F33'], selo: '',
          fotos: ['1572109754335-3807540beef2'], conj: 129.9, sut: 84.9, cal: 49.9,
          desc: 'Renda bordô com alças finas cruzadas. Elegante e cheia de personalidade.' },
        { id: 'noite', nome: 'Noite', tecido: 'Renda preta', grupo: 'pretas', cores: ['#1E1A18'], selo: '',
          fotos: ['1599836641623-a596a2c44abc'], conj: 139.9, sut: 89.9, cal: 54.9,
          desc: 'Renda preta com desenho floral. O preto que nunca sai de moda.' },
        { id: 'royal', nome: 'Azul Royal', tecido: 'Renda azul', grupo: 'coloridas', cores: ['#2340A8'], selo: '',
          fotos: ['1620228681518-5f0e3e29940d'], conj: 129.9, sut: 84.9, cal: 49.9,
          desc: 'Azul vibrante em renda delicada. Pra sair do óbvio com muita elegância.' },
        { id: 'branco', nome: 'Branco Puro', tecido: 'Bralette canelado', grupo: 'claras', cores: ['#FFFFFF'], selo: '',
          fotos: ['1622116756680-fee39c84f9bd'], conj: 99.9, sut: 64.9, cal: 39.9,
          desc: 'Branco, macio e confortável, com alças finas. Básico do jeito mais bonito.' },
        { id: 'classico', nome: 'Clássico Preto', tecido: 'Tule e microfibra', grupo: 'pretas', cores: ['#1E1A18'], selo: '',
          fotos: ['1572358764342-612d02e2d2d2'], conj: 119.9, sut: 74.9, cal: 44.9,
          desc: 'Preto com detalhe de tule. Sofisticado e confortável pra qualquer ocasião.' }
    ];
    const TAM_SUTIA = ['40', '42', '44', '46', '48'];
    const TAM_CALCINHA = ['P', 'M', 'G', 'GG'];
    const foto = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=80`;
    const real = v => 'R$ ' + v.toFixed(2).replace('.', ',');
    const nomeTipo = { conjunto: 'Conjunto', sutia: 'Sutiã', calcinha: 'Calcinha' };
    const precoDe = (p, tipo) => tipo === 'sutia' ? p.sut : tipo === 'calcinha' ? p.cal : p.conj;
    const $ = s => document.querySelector(s);

    /* ===== 2) CARTÃO DE PRODUTO ===== */
    function cartao(p, tipo) {
        tipo = tipo || 'conjunto';
        const f2 = p.fotos[1] ? `<img class="f2" src="${foto(p.fotos[1], 700, 933)}" alt="" loading="lazy">` : '';
        const preco = tipo === 'conjunto'
            ? `<span class="preco">Conjunto ${real(p.conj)}</span><span class="avulso">ou sutiã ${real(p.sut)} · calcinha ${real(p.cal)}</span>`
            : `<span class="preco">${nomeTipo[tipo]} ${real(precoDe(p, tipo))}</span><span class="avulso">conjunto completo ${real(p.conj)}</span>`;
        return `<article class="produto revelar" data-id="${p.id}" data-tipo="${tipo}">
            <div class="fotos">${p.selo ? `<span class="selo">${p.selo.toUpperCase()}</span>` : ''}
                <img src="${foto(p.fotos[0], 700, 933)}" alt="${p.nome}, ${p.tecido}" loading="lazy">${f2}
                <span class="rapido">VER DETALHES</span></div>
            <div class="info"><span class="tecido">${p.tecido}</span><h3>${p.nome}</h3>${preco}
                <span class="cores">${p.cores.map(c => `<i style="background:${c}"></i>`).join('')}</span></div>
            <button class="btn comprar" type="button">Comprar</button>
        </article>`;
    }

    /* ===== 3) APARECER AO ROLAR ===== */
    let observador = null;
    function revelar() {
        if (observador) observador.disconnect();
        observador = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visto'); observador.unobserve(e.target); }
        }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.revelar:not(.visto)').forEach((el, i) => {
            el.style.transitionDelay = (el.classList.contains('produto') ? (i % 4) * 0.09 : 0) + 's';
            observador.observe(el);
        });
    }

    /* ===== 4) CADA PÁGINA ===== */
    let timerCapa = null;
    function iniciarPagina() {
        clearInterval(timerCapa);
        const main = document.querySelector('main');
        const pagina = main.dataset.pagina;
        document.querySelectorAll('.menu a, .gaveta-menu a').forEach(a => a.classList.toggle('ativo', a.dataset.pagina === pagina));

        /* vitrines com produtos (destaques na capa, coleção completa) */
        document.querySelectorAll('[data-grade]').forEach(g => {
            const lim = +g.dataset.grade || 99;
            g.innerHTML = PRODUTOS.slice(0, lim).map(p => cartao(p)).join('');
        });

        /* coleção: filtros por categoria e cor */
        const filtros = $('#filtros');
        if (filtros) {
            const params = new URLSearchParams(location.search);
            let cat = params.get('cat') || 'todos';
            const grade = $('#grade-colecao');
            const montar = () => {
                const tipo = ['sutia', 'calcinha'].includes(cat) ? cat : 'conjunto';
                const lista = PRODUTOS.filter(p => ['todos', 'conjunto', 'sutia', 'calcinha'].includes(cat) || p.grupo === cat);
                grade.innerHTML = lista.map(p => cartao(p, tipo)).join('');
                filtros.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat));
                const t = { todos: 'Toda a coleção', conjunto: 'Conjuntos', sutia: 'Sutiãs', calcinha: 'Calcinhas', claras: 'Tons claros', coloridas: 'Coloridas', pretas: 'Pretas' };
                const h = $('#titulo-colecao'); if (h) h.textContent = t[cat] || 'Coleção';
                revelar();
            };
            filtros.onclick = e => {
                const b = e.target.closest('button'); if (!b) return;
                cat = b.dataset.cat;
                history.replaceState({}, '', cat === 'todos' ? 'colecao.html' : 'colecao.html?cat=' + cat);
                montar();
            };
            montar();
        }

        /* capa: banners que trocam sozinhos */
        const slides = document.querySelectorAll('.capa .slide');
        if (slides.length) {
            const pontos = $('.capa .pontos');
            pontos.innerHTML = [...slides].map((_, i) => `<button type="button" aria-label="Banner ${i + 1}"></button>`).join('');
            let atual = 0;
            const ir = n => {
                atual = (n + slides.length) % slides.length;
                slides.forEach((s, i) => s.classList.toggle('ativo', i === atual));
                pontos.querySelectorAll('button').forEach((b, i) => { b.classList.remove('ativo'); void b.offsetWidth; b.classList.toggle('ativo', i === atual); });
            };
            pontos.onclick = e => { const b = e.target.closest('button'); if (!b) return; ir([...pontos.children].indexOf(b)); reiniciar(); };
            const reiniciar = () => { clearInterval(timerCapa); timerCapa = setInterval(() => ir(atual + 1), 6000); };
            ir(0); reiniciar();
        }
        const petalas = $('#petalas');
        if (petalas && !petalas.children.length) for (let i = 0; i < 14; i++) {
            const p = document.createElement('i');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = 10 + Math.random() * 10 + 's';
            p.style.animationDelay = -Math.random() * 18 + 's';
            p.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
            petalas.appendChild(p);
        }
        const coracao = $('#coracao');
        if (coracao) coracao.onclick = () => mostrar('Para Juliana, com todo o amor do Arnold ♡');

        revelar();
    }

    /* ===== 5) JANELA DO PRODUTO + LUPA + ZOOM ===== */
    const fundo = $('#fundo');
    let atual = null, escolha = {}, fotoAtual = 0;
    function opcoes(el, lista, chave) {
        el.innerHTML = lista.map(t => `<button type="button" aria-pressed="${escolha[chave] === t}" data-v="${t}">${t}</button>`).join('');
    }
    function atualizarJanela() {
        const p = atual;
        const tipos = [['conjunto', 'Conjunto', p.conj], ['sutia', 'Só o sutiã', p.sut], ['calcinha', 'Só a calcinha', p.cal]];
        $('#j-tipo').innerHTML = tipos.map(([v, n, pr]) => `<button type="button" data-v="${v}" aria-pressed="${escolha.tipo === v}">${n}<small>${real(pr)}</small></button>`).join('');
        $('#bloco-sutia').hidden = escolha.tipo === 'calcinha';
        $('#bloco-calcinha').hidden = escolha.tipo === 'sutia';
        opcoes($('#j-sutia'), TAM_SUTIA, 'sutia');
        opcoes($('#j-calcinha'), TAM_CALCINHA, 'calcinha');
        $('#j-total').textContent = real(precoDe(p, escolha.tipo));
        $('#j-economia').textContent = escolha.tipo === 'conjunto' ? `No conjunto você economiza ${real(p.sut + p.cal - p.conj)}` : '';
    }
    function trocarFoto(n) {
        fotoAtual = n;
        $('#j-foto').src = foto(atual.fotos[n], 900, 1200);
        $('#j-miniaturas').querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === n));
    }
    function abrirProduto(id, tipo) {
        atual = PRODUTOS.find(p => p.id === id);
        escolha = { tipo: tipo || 'conjunto', sutia: null, calcinha: null };
        $('#j-nome').textContent = atual.nome;
        $('#j-tecido').textContent = atual.tecido.toUpperCase();
        $('#j-desc').textContent = atual.desc;
        $('#j-aviso').textContent = '';
        $('#j-miniaturas').innerHTML = atual.fotos.map((f, i) => `<button type="button" aria-label="Foto ${i + 1}"><img src="${foto(f, 140, 187)}" alt=""></button>`).join('');
        $('#j-miniaturas').style.display = atual.fotos.length > 1 ? '' : 'none';
        trocarFoto(0);
        atualizarJanela();
        fundo.classList.add('aberto');
        document.body.style.overflow = 'hidden';
    }
    function fecharProduto() { fundo.classList.remove('aberto'); document.body.style.overflow = ''; }
    document.addEventListener('click', e => {
        const b = e.target.closest('.produto');
        if (b) abrirProduto(b.dataset.id, b.dataset.tipo);
    });
    $('#fechar').onclick = fecharProduto;
    fundo.addEventListener('click', e => { if (e.target === fundo) fecharProduto(); });
    $('#j-miniaturas').onclick = e => { const b = e.target.closest('button'); if (b) trocarFoto([...b.parentNode.children].indexOf(b)); };
    $('#j-tipo').onclick = e => { const b = e.target.closest('button'); if (!b) return; escolha.tipo = b.dataset.v; atualizarJanela(); };
    $('#j-sutia').onclick = e => { const b = e.target.closest('button'); if (!b) return; escolha.sutia = b.dataset.v; atualizarJanela(); };
    $('#j-calcinha').onclick = e => { const b = e.target.closest('button'); if (!b) return; escolha.calcinha = b.dataset.v; atualizarJanela(); };

    /* lupa: no computador, passar o mouse amplia */
    const lupa = $('#j-lupa'), imgLupa = $('#j-foto');
    lupa.addEventListener('mousemove', e => {
        const r = lupa.getBoundingClientRect();
        imgLupa.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
        imgLupa.style.transform = 'scale(2)';
    });
    lupa.addEventListener('mouseleave', () => { imgLupa.style.transform = ''; });
    lupa.addEventListener('click', () => abrirZoom());

    /* zoom em tela cheia: toque/clique amplia, arrasta pra ver detalhes */
    const zoom = $('#zoom'), imgZoom = $('#zoom-img');
    let escala = 1, px = 0, py = 0, arrastando = false, ini = null, moveu = false;
    function aplicar() { imgZoom.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${escala})`; zoom.classList.toggle('ampliado', escala > 1); }
    function abrirZoom() {
        escala = 1; px = py = 0; aplicar();
        imgZoom.src = foto(atual.fotos[fotoAtual], 1800);
        $('#zoom-legenda').textContent = `${atual.nome.toUpperCase()} · ${fotoAtual + 1}/${atual.fotos.length}`;
        zoom.querySelectorAll('.seta-zoom').forEach(s => s.hidden = atual.fotos.length < 2);
        zoom.classList.add('aberto');
    }
    function passar(d) { trocarFoto((fotoAtual + d + atual.fotos.length) % atual.fotos.length); abrirZoom(); }
    $('#zoom-fechar').onclick = () => zoom.classList.remove('aberto');
    $('#zoom-ant').onclick = () => passar(-1);
    $('#zoom-prox').onclick = () => passar(1);
    imgZoom.addEventListener('pointerdown', e => { arrastando = true; moveu = false; ini = { x: e.clientX - px, y: e.clientY - py, cx: e.clientX, cy: e.clientY }; imgZoom.setPointerCapture(e.pointerId); });
    imgZoom.addEventListener('pointermove', e => {
        if (!arrastando) return;
        if (Math.abs(e.clientX - ini.cx) + Math.abs(e.clientY - ini.cy) > 6) moveu = true;
        if (escala > 1 && moveu) { px = e.clientX - ini.x; py = e.clientY - ini.y; aplicar(); }
    });
    imgZoom.addEventListener('pointerup', e => {
        arrastando = false;
        if (moveu) return;
        if (escala > 1) { escala = 1; px = py = 0; }
        else {
            escala = 2.6;
            const r = zoom.getBoundingClientRect();
            px = (r.width / 2 - e.clientX) * (escala - 1); py = (r.height / 2 - e.clientY) * (escala - 1);
        }
        aplicar();
    });

    /* ===== 6) A SACOLA (fica guardada no aparelho da cliente) ===== */
    let sacola = [];
    try { sacola = JSON.parse(localStorage.getItem('ju-sacola')) || []; } catch (e) { sacola = []; }
    const guardar = () => { try { localStorage.setItem('ju-sacola', JSON.stringify(sacola)); } catch (e) { } };
    function escolhaOk() {
        const aviso = $('#j-aviso');
        if (escolha.tipo !== 'calcinha' && !escolha.sutia) { aviso.textContent = 'Escolha o tamanho do sutiã'; return false; }
        if (escolha.tipo !== 'sutia' && !escolha.calcinha) { aviso.textContent = 'Escolha o tamanho da calcinha'; return false; }
        return true;
    }
    $('#j-agora').onclick = e => {
        if (!escolhaOk()) { e.preventDefault(); return; }
        const p = atual;
        const tam = [escolha.tipo !== 'calcinha' ? 'Sutiã ' + escolha.sutia : '', escolha.tipo !== 'sutia' ? 'Calcinha ' + escolha.calcinha : ''].filter(Boolean).join(' · ');
        const valor = precoDe(p, escolha.tipo), f = calcularFrete(valor);
        const msg = `Olá, Juliana! Quero comprar na Ju Intimates ♡\n\n• 1x ${nomeTipo[escolha.tipo]} ${p.nome} (${tam}) – ${real(valor)}\n${f && !f.erro ? textoFrete(f) + '\nTotal: ' + real(valor + f.cobrar) : 'Meu CEP é: '}\n\nPode me passar as formas de pagamento?`;
        $('#j-agora').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
    };
    $('#j-adicionar').onclick = () => {
        const aviso = $('#j-aviso');
        if (escolha.tipo !== 'calcinha' && !escolha.sutia) { aviso.textContent = 'Escolha o tamanho do sutiã'; return; }
        if (escolha.tipo !== 'sutia' && !escolha.calcinha) { aviso.textContent = 'Escolha o tamanho da calcinha'; return; }
        const p = atual;
        const tam = [escolha.tipo !== 'calcinha' ? 'Sutiã ' + escolha.sutia : '', escolha.tipo !== 'sutia' ? 'Calcinha ' + escolha.calcinha : ''].filter(Boolean).join(' · ');
        const chave = [p.id, escolha.tipo, tam].join('|');
        const ja = sacola.find(i => i.chave === chave);
        if (ja) ja.qtd++; else sacola.push({ chave, id: p.id, tipo: escolha.tipo, tam, preco: precoDe(p, escolha.tipo), qtd: 1 });
        guardar(); desenharSacola(); fecharProduto(); abrirSacola();
    };

    /* ===== 6b) FRETE pelo CEP (tabela por região, grátis acima de R$ 299) ===== */
    const FRETE_GRATIS = 299;
    function regiaoDoCep(cep) {
        const n = +cep.slice(0, 5);
        if ((n >= 29000 && n <= 29189) || (n >= 29200 && n <= 29229)) return { nome: 'Grande Vitória', valor: 10 };
        if (n >= 29000 && n <= 29999) return { nome: 'Espírito Santo', valor: 18 };
        if ((n >= 1000 && n <= 19999) || (n >= 20000 && n <= 28999) || (n >= 30000 && n <= 39999)) return { nome: 'Sudeste', valor: 25 };
        if ((n >= 70000 && n <= 76799) || (n >= 78000 && n <= 79999) || (n >= 80000 && n <= 99999)) return { nome: 'Sul e Centro-Oeste', valor: 32 };
        if ((n >= 40000 && n <= 69999) || (n >= 76800 && n <= 77999)) return { nome: 'Norte e Nordeste', valor: 40 };
        return null;
    }
    let cepSalvo = '';
    try { cepSalvo = localStorage.getItem('ju-cep') || ''; } catch (e) { }
    const formatarCep = v => { const d = v.replace(/\D/g, '').slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; };
    function calcularFrete(subtotal) {
        const d = cepSalvo.replace(/\D/g, '');
        if (d.length !== 8) return null;
        const r = regiaoDoCep(d); if (!r) return { erro: true };
        return { ...r, cep: formatarCep(d), cobrar: subtotal >= FRETE_GRATIS ? 0 : r.valor };
    }
    const textoFrete = f => !f || f.erro ? 'Frete: a calcular' : `Frete (${f.nome}, CEP ${f.cep}): ${f.cobrar ? real(f.cobrar) : 'GRÁTIS'}`;
    $('#cep').value = formatarCep(cepSalvo);
    $('#cep').addEventListener('input', e => { e.target.value = formatarCep(e.target.value); });
    $('#cep-form').addEventListener('submit', e => {
        e.preventDefault();
        cepSalvo = $('#cep').value.replace(/\D/g, '');
        try { localStorage.setItem('ju-cep', cepSalvo); } catch (er) { }
        desenharSacola();
    });
    function desenharSacola() {
        const qtd = sacola.reduce((s, i) => s + i.qtd, 0);
        const cont = $('#contador'); cont.hidden = !qtd; cont.textContent = qtd;
        const total = sacola.reduce((s, i) => s + i.preco * i.qtd, 0);
        const frete = calcularFrete(total);
        const info = $('#cep-info'), fv = $('#frete-valor');
        info.classList.remove('erro');
        if (!frete) { fv.textContent = 'informe o CEP'; info.textContent = total >= FRETE_GRATIS ? 'Seu pedido já tem frete grátis ♡' : `Frete grátis acima de ${real(FRETE_GRATIS)}. Faltam ${real(FRETE_GRATIS - total)}`; }
        else if (frete.erro) { fv.textContent = 'CEP não encontrado'; info.textContent = 'Confira o CEP digitado.'; info.classList.add('erro'); }
        else {
            fv.innerHTML = frete.cobrar ? real(frete.cobrar) : '<span class="gratis">GRÁTIS</span>';
            info.textContent = frete.cobrar ? `${frete.nome} · faltam ${real(FRETE_GRATIS - total)} para o frete grátis` : `${frete.nome} · frete grátis ♡`;
        }
        $('#subtotal').textContent = real(total);
        const totalFinal = total + (frete && !frete.erro ? frete.cobrar : 0);
        $('#soma').textContent = real(totalFinal);
        $('#itens').innerHTML = !sacola.length
            ? '<div class="vazia"><b>Sua sacola está vazia</b>Que tal escolher algo lindo pra você?</div>'
            : sacola.map((i, n) => {
                const p = PRODUTOS.find(x => x.id === i.id) || PRODUTOS[0];
                return `<div class="item"><img src="${foto(p.fotos[0], 150, 200)}" alt="">
                    <div><b>${nomeTipo[i.tipo]} ${p.nome}</b><small>${i.tam}</small>
                    <div class="qtd"><button type="button" data-n="${n}" data-d="-1" aria-label="Diminuir">−</button><span>${i.qtd}</span><button type="button" data-n="${n}" data-d="1" aria-label="Aumentar">+</button></div></div>
                    <span class="valor">${real(i.preco * i.qtd)}</span></div>`;
            }).join('');
        const linhas = sacola.map(i => `• ${i.qtd}x ${nomeTipo[i.tipo]} ${(PRODUTOS.find(x => x.id === i.id) || {}).nome} (${i.tam}) – ${real(i.preco * i.qtd)}`);
        const msg = `Olá, Juliana! Quero fazer um pedido na Ju Intimates ♡\n\n${linhas.join('\n')}\n\nSubtotal: ${real(total)}\n${textoFrete(frete)}\nTotal: ${real(totalFinal)}\n\nPode me passar as formas de pagamento?`;
        const fim = $('#finalizar');
        fim.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
        fim.style.opacity = sacola.length ? 1 : .45;
        fim.style.pointerEvents = sacola.length ? 'auto' : 'none';
    }
    $('#itens').onclick = e => {
        const b = e.target.closest('button[data-n]'); if (!b) return;
        const i = sacola[+b.dataset.n]; i.qtd += +b.dataset.d;
        if (i.qtd <= 0) sacola.splice(+b.dataset.n, 1);
        guardar(); desenharSacola();
    };
    const sombra = $('#sombra');
    function abrirSacola() { $('#sacola').classList.add('aberta'); sombra.classList.add('ver'); }
    function fecharTudo() { $('#sacola').classList.remove('aberta'); $('#gaveta-menu').classList.remove('aberta'); sombra.classList.remove('ver'); }
    $('#abrir-sacola').onclick = abrirSacola;
    $('#fechar-sacola').onclick = fecharTudo;
    $('#continuar').onclick = fecharTudo;
    sombra.onclick = fecharTudo;
    $('#abrir-menu').onclick = () => { $('#gaveta-menu').classList.add('aberta'); sombra.classList.add('ver'); };
    $('#fechar-menu').onclick = fecharTudo;
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (zoom.classList.contains('aberto')) zoom.classList.remove('aberto'); else { fecharProduto(); fecharTudo(); }
    });
    desenharSacola();

    /* ===== 7) AVISOS ===== */
    let tempo;
    function mostrar(t) { const el = $('#toast'); el.textContent = t; el.classList.add('ver'); clearTimeout(tempo); tempo = setTimeout(() => el.classList.remove('ver'), 3400); }
    window.addEventListener('scroll', () => $('.topo').classList.toggle('rolou', scrollY > 10), { passive: true });

    /* ===== 8) ABERTURA: o logo se desenhando (só na 1ª página da visita) ===== */
    const abertura = $('#abertura');
    let jaViu = false;
    try { jaViu = sessionStorage.getItem('ju-abertura') === '1'; sessionStorage.setItem('ju-abertura', '1'); } catch (e) { }
    if (abertura) {
        if (jaViu || matchMedia('(prefers-reduced-motion: reduce)').matches) abertura.remove();
        else {
            abertura.querySelectorAll('.int span').forEach((s, i) => s.style.animationDelay = (1.1 + i * .07) + 's');
            setTimeout(() => { abertura.classList.add('fim'); setTimeout(() => abertura.remove(), 1200); }, 3000);
        }
    }

    /* ===== 9) MÚSICA (Spotify · playlist Sexy R&B) ===== */
    const FAIXAS = ['5oO3drDxtziYU2H1X23ZIp', '2uv4moS862MAZcntQfurpz', '3ibKnFDaa3GhpPGlOUj7ff', '68vgtRHr7iZHpzGpon6Jlo',
        '1AajFWbXbqpomHwLb3vYC3', '09mEdoA6zrmBPgTEN5qXmN', '4iZ4pt7kvcaH6Yo8UoZ4s2', '2hNf1rawV2XAZ6Jld2Fxwf', '0PJIbOdMs3bd5AT8liULMQ',
        '2uP6t2J5MEwhr9rDkAAzwh', '4PhsKqMdgMEUSstTDAmMpg', '5kY2DRIom6dcVZbQb1SAX8', '7J41dYQolQJEtj3UmKLu5r', '7lxWzjZCSkXndL8eYKfFWU',
        '6rbhWExtuchhpLC5fHnB8n', '2Gyc6e2cLxA5hoX1NOvYnU', '3yhhVI7szVLsqVKt9gg01e', '6XIzOJWgi4JGCcPUskVu3J', '6BQrmjAgPfPTwILoFEK3Hd',
        '2zbjlcLi1VQWqDNYdhyx1l', '1B6TmCvKjC4dopBohVW51x', '2pg2TiYo9Rb8KeB5JjP7jS', '6CTWathupIiDs7U4InHnDA', '5hJFhO9dvhJoDvUZZ9iWSw',
        '7DFnq8FYhHMCylykf6ZCxA', '1mjMXiWYKSJ5XmJCC0O9HJ', '5W3UniuRMkHHIpaiQo1hAW', '3XgGQ1wjo5khvq2UImjyNF'];
    const fila = FAIXAS.slice();
    for (let i = fila.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fila[i], fila[j]] = [fila[j], fila[i]]; }
    let posicao = 0, tocouAlgo = false, trocando = false, controle = null, tocando = false, desligou = false;
    const player = $('#player'), painel = $('#painel-musica');
    function marcar(t) { tocando = t; player.classList.toggle('tocando', t); if (t) player.classList.remove('esperando'); }
    window.onSpotifyIframeApiReady = function (API) {
        API.createController($('#spotify'), { uri: 'spotify:track:' + fila[0], width: '100%', height: 152 }, function (c) {
            controle = c;
            c.addListener('playback_update', function (e) {
                const d = e.data;
                if (!d.isPaused) { tocouAlgo = true; trocando = false; }
                const acabou = d.isPaused && d.duration > 0 && (d.position === 0 || d.position >= d.duration - 1500);
                if (tocouAlgo && acabou && !desligou && !trocando) { proxima(); return; }
                if (!trocando) marcar(!d.isPaused);
            });
            c.addListener('ready', function () { if (!desligou) c.play(); });
        });
    };
    function proxima() {
        trocando = true; tocouAlgo = false;
        posicao = (posicao + 1) % fila.length;
        controle.loadUri('spotify:track:' + fila[posicao]);
        setTimeout(() => controle.play(), 800);
    }
    const api = document.createElement('script');
    api.src = 'https://open.spotify.com/embed/iframe-api/v1'; api.async = true;
    document.body.appendChild(api);
    function primeiroToque(e) { if (desligou || tocando || !controle || player.contains(e.target)) return; controle.play(); }
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, primeiroToque, { passive: true }));
    $('#tocar').onclick = () => { if (!controle) return; desligou = tocando; controle.togglePlay(); };
    player.querySelector('.spot').onclick = () => painel.classList.toggle('aberto');

    /* ===== 10) NAVEGAÇÃO CONTÍNUA: troca só o conteúdo, a música não para ===== */
    const PAGINA = /\/(index|colecao|guia|sobre)\.html$|\/$/;
    async function irPara(endereco, novaEntrada) {
        try {
            const r = await fetch(endereco);
            if (!r.ok) throw new Error('falhou');
            const nova = new DOMParser().parseFromString(await r.text(), 'text/html');
            document.title = nova.title;
            const main = document.querySelector('main');
            main.style.transition = 'opacity .25s'; main.style.opacity = 0;
            await new Promise(ok => setTimeout(ok, 220));
            main.replaceWith(document.importNode(nova.querySelector('main'), true));
            if (novaEntrada) history.pushState({}, '', endereco);
            fecharProduto(); fecharTudo();
            const alvo = new URL(endereco).hash;
            if (alvo && document.querySelector(alvo)) document.querySelector(alvo).scrollIntoView(); else window.scrollTo(0, 0);
            iniciarPagina();
        } catch (erro) { location.href = endereco; }
    }
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link || link.target || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !PAGINA.test(url.pathname)) return;
        if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
        e.preventDefault();
        irPara(url.href, true);
    });
    window.addEventListener('popstate', () => irPara(location.href, false));

    iniciarPagina();
})();
