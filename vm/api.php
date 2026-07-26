<?php
header('Content-Type: application/json; charset=utf-8');

// Intervalo oficial da Viagem Medieval 2026 (28 Julho a 09 Agosto de 2026)
$todas_as_datas = [
    '2026-07-29', '2026-07-30', '2026-07-31', 
    '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', 
    '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09'
];



$domingos = ['2026-08-02', '2026-08-09'];
$dias_uteis_e_sabados = array_diff($todas_as_datas, $domingos);
$dias_sem_fim_de_semana = array_diff($todas_as_datas, ['2026-08-01', '2026-08-02', '2026-08-08', '2026-08-09']);

// Base de Dados de Eventos Completa
$eventos_db = [
    // 1. A TROPEÇA DOS TRÊS VALES
    ['id' => 101, 'nome' => 'A Tropeça dos Três Vales', 'descricao' => 'Acompanhe a trupe pelos caminhos da vila e descubra os episódios que moldaram a história e a identidade do território.', 'local' => 'Terreiro das Guimbras', 'inicio' => '15:30', 'fim' => '19:30', 'preco' => 0.00, 'datas' => ['2026-07-29', '2026-07-31', '2026-08-03', '2026-08-05', '2026-08-07']],
    ['id' => 102, 'nome' => 'A Tropeça dos Três Vales', 'descricao' => 'Acompanhe a trupe pelos caminhos da vila e descubra os episódios que moldaram a história e a identidade do território.', 'local' => 'Ciclovia do Cáster', 'inicio' => '15:30', 'fim' => '19:30', 'preco' => 0.00, 'datas' => ['2026-07-30', '2026-08-01', '2026-08-02', '2026-08-04', '2026-08-06', '2026-08-08', '2026-08-09']],

    // 2. AFONSO HENRIQUES – O PODER DA VONTADE
    ['id' => 201, 'nome' => 'Afonso Henriques – O Poder da Vontade', 'descricao' => 'Acompanhe o cortejo de Afonso Henriques (Tiago Aldeia), cuja coragem e vontade o levam a reunir os homens da terra em torno de um ideal comum.', 'local' => 'Praça do Convento', 'inicio' => '16:30', 'fim' => '17:00', 'preco' => 0.00, 'datas' => array_values($dias_uteis_e_sabados)],

    // 3. AFONSO HENRIQUES – O REI ANTES DO REINO
    ['id' => 301, 'nome' => 'Afonso Henriques – O Rei Antes do Reino', 'descricao' => 'Assista ao espetáculo onde o jovem Afonso Henriques ergue-se contra a crescente influência galega no Condado Portucalense.', 'local' => 'Terreiro das Guimbras', 'inicio' => '23:30', 'fim' => '23:59', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 4. AS MÃOS QUE TECEM O DESTINO
    ['id' => 401, 'nome' => 'As Mãos que Tecem o Destino', 'descricao' => 'Venha descobrir a história de D. Teresa e os episódios que levaram o seu filho a cumprir um destino maior do que ele próprio.', 'local' => 'Terreiro das Guimbras', 'inicio' => '18:30', 'fim' => '19:00', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 5. CANTIGAS TROVADORESCAS GALEGO-PORTUGUESAS
    ['id' => 501, 'nome' => 'Cantigas Trovadorescas', 'descricao' => 'Deixe-se envolver pelos sons, versos e melodias que ecoam numa viagem pelas cantigas trovadorescas.', 'local' => 'Claustro do Museu Convento dos Loios', 'inicio' => '20:30', 'fim' => '20:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 502, 'nome' => 'Cantigas Trovadorescas', 'descricao' => 'Deixe-se envolver pelos sons, versos e melodias que ecoam numa viagem pelas cantigas trovadorescas.', 'local' => 'Interior da Igreja Matriz', 'inicio' => '22:30', 'fim' => '22:55', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 6. CORTEJO REAL
    ['id' => 601, 'nome' => 'Cortejo Real: D. Teresa e o Condado Portucalense', 'descricao' => 'Cortejo real que percorre do Largo da Igreja da Misericórdia ao Castelo.', 'local' => 'Largo da Igreja da Misericórdia', 'inicio' => '19:00', 'fim' => '20:00', 'preco' => 0.00, 'datas' => ['2026-08-02']],
    ['id' => 602, 'nome' => 'Cortejo Real: O Condado Portucalense nas Vésperas de Portugal', 'descricao' => 'Cortejo real que percorre do Largo da Igreja da Misericórdia ao Castelo.', 'local' => 'Largo da Igreja da Misericórdia', 'inicio' => '19:00', 'fim' => '20:00', 'preco' => 0.00, 'datas' => ['2026-08-09']],

    // 7. CRIMES E CASTIGOS
    ['id' => 701, 'nome' => 'Crimes e Castigos', 'descricao' => 'Acompanhe três histórias cómicas e caóticas inspiradas nas leis e costumes do século XII.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '16:30', 'fim' => '16:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 702, 'nome' => 'Crimes e Castigos', 'descricao' => 'Acompanhe três histórias cómicas e caóticas inspiradas nas leis e costumes do século XII.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '17:30', 'fim' => '17:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 703, 'nome' => 'Crimes e Castigos', 'descricao' => 'Acompanhe três histórias cómicas e caóticas inspiradas nas leis e costumes do século XII.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '19:00', 'fim' => '19:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 704, 'nome' => 'Crimes e Castigos', 'descricao' => 'Acompanhe três histórias cómicas e caóticas inspiradas nas leis e costumes do século XII.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '20:30', 'fim' => '20:55', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 8. DANÇAS DE CORTE
    ['id' => 801, 'nome' => 'Danças de Corte', 'descricao' => 'Celebre a elegância do passado com danças em roda, em procissão e em desfile.', 'local' => 'Praça da Câmara', 'inicio' => '22:00', 'fim' => '22:20', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 9. ECOS GREGORIANOS
    ['id' => 901, 'nome' => 'Ecos Gregorianos – As Rogações', 'descricao' => 'Mergulhe na tradição medieval das rogações, procissões de origem antiga onde fé, cânticos e comunidade se uniam.', 'local' => 'Interior da Igreja Matriz', 'inicio' => '21:30', 'fim' => '21:55', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 10. ENTRE O VENTRE E A COROA
    ['id' => 1001, 'nome' => 'Entre o Ventre e a Coroa', 'descricao' => 'Assista ao espetáculo que explora a identidade como um processo constante de rutura e transformação.', 'local' => 'Praça da Câmara', 'inicio' => '24:00', 'fim' => '24:30', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 11. ERA UMA VEZ… D. TERESA
    ['id' => 1101, 'nome' => 'Era uma vez… D. Teresa', 'descricao' => 'Conheça a história de D. Teresa contada de forma envolvente e para todas as idades.', 'local' => 'Ciclovia do Cáster', 'inicio' => '16:00', 'fim' => '16:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1102, 'nome' => 'Era uma vez… D. Teresa', 'descricao' => 'Conheça a história de D. Teresa contada de forma envolvente e para todas as idades.', 'local' => 'Ciclovia do Cáster', 'inicio' => '17:00', 'fim' => '17:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1103, 'nome' => 'Era uma vez… D. Teresa', 'descricao' => 'Conheça a história de D. Teresa contada de forma envolvente e para todas as idades.', 'local' => 'Ciclovia do Cáster', 'inicio' => '18:00', 'fim' => '18:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1104, 'nome' => 'Era uma vez… D. Teresa', 'descricao' => 'Conheça a história de D. Teresa contada de forma envolvente e para todas as idades.', 'local' => 'Ciclovia do Cáster', 'inicio' => '19:00', 'fim' => '19:30', 'preco' => 3.00, 'datas' => $todas_as_datas],

    // 12. FESTIM
    ['id' => 1201, 'nome' => 'Festim', 'descricao' => 'Junte-se ao povo na praça e deixe-se levar pela música, entre passos, gargalhadas e rodopios.', 'local' => 'Praça do Canastro', 'inicio' => '21:30', 'fim' => '21:55', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 13. FILHOS DA VIAGEM
    ['id' => 1301, 'nome' => 'Filhos da Viagem', 'descricao' => 'Espetáculo de abertura oficial celebrando os 30 anos da Viagem Medieval.', 'local' => 'Terreiro das Guimbras', 'inicio' => '22:00', 'fim' => '22:30', 'preco' => 0.00, 'datas' => ['2026-07-28']],

    // 14. FLORESTA MÁGICA
    ['id' => 1401, 'nome' => 'Floresta Mágica', 'descricao' => 'Venha descobrir uma floresta ancestral repleta de seres mágicos e segredos ocultos.', 'local' => 'Guimbras (Junto ao Castelo)', 'inicio' => '16:00', 'fim' => '16:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1402, 'nome' => 'Floresta Mágica', 'descricao' => 'Venha descobrir uma floresta ancestral repleta de seres mágicos e segredos ocultos.', 'local' => 'Guimbras (Junto ao Castelo)', 'inicio' => '17:00', 'fim' => '17:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1403, 'nome' => 'Floresta Mágica', 'descricao' => 'Venha descobrir uma floresta ancestral repleta de seres mágicos e segredos ocultos.', 'local' => 'Guimbras (Junto ao Castelo)', 'inicio' => '18:00', 'fim' => '18:30', 'preco' => 3.00, 'datas' => $todas_as_datas],
    ['id' => 1404, 'nome' => 'Floresta Mágica', 'descricao' => 'Venha descobrir uma floresta ancestral repleta de seres mágicos e segredos ocultos.', 'local' => 'Guimbras (Junto ao Castelo)', 'inicio' => '19:00', 'fim' => '19:30', 'preco' => 3.00, 'datas' => $todas_as_datas],

    // 15. GRITO DOS TAMBORES
    ['id' => 1501, 'nome' => 'Grito dos Tambores – Crónicas do Condado', 'descricao' => 'Acompanhe a jornada de um humilde vendedor de fruta transformada pelos ecos da guerra.', 'local' => 'Praça da Câmara', 'inicio' => '21:00', 'fim' => '21:20', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 16. GUARDIÕES DE VILLA DE FEIRA
    ['id' => 1601, 'nome' => 'Guardiões de Villa de Feira', 'descricao' => 'Uma celebração cheia de energia que dá vida ao nascimento de um Reino.', 'local' => 'Praça do Canastro', 'inicio' => '20:00', 'fim' => '20:20', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 17. HONRA E DESTINO
    ['id' => 1701, 'nome' => 'Honra e Destino', 'descricao' => 'A história de D. Teresa, marcada por alianças, traições e disputas que culminam no confronto com o filho.', 'local' => 'Terreiro das Guimbras', 'inicio' => '21:30', 'fim' => '22:00', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 18. O DESPERTAR DE UM REINO
    ['id' => 1801, 'nome' => 'O Despertar de um Reino', 'descricao' => 'Jograis e bobos narram, com humor e sátira, o início da história de Portugal.', 'local' => 'Praça do Canastro', 'inicio' => '15:30', 'fim' => '15:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 1802, 'nome' => 'O Despertar de um Reino', 'descricao' => 'Jograis e bobos narram, com humor e sátira, o início da história de Portugal.', 'local' => 'Chafariz Igreja Matriz', 'inicio' => '17:00', 'fim' => '17:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 1803, 'nome' => 'O Despertar de um Reino', 'descricao' => 'Jograis e bobos narram, com humor e sátira, o início da história de Portugal.', 'local' => 'Praça da Câmara', 'inicio' => '18:30', 'fim' => '18:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 1804, 'nome' => 'O Despertar de um Reino', 'descricao' => 'Jograis e bobos narram, com humor e sátira, o início da história de Portugal.', 'local' => 'Praça do Canastro', 'inicio' => '19:30', 'fim' => '19:55', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 19. O DISCURSO DO REI
    ['id' => 1901, 'nome' => 'O Discurso do Rei – Na Véspera da História', 'descricao' => 'D. Teresa e Afonso Henriques enfrentam-se num intenso duelo de palavras na noite antes de S. Mamede.', 'local' => 'Praça de Armas do Castelo', 'inicio' => '23:00', 'fim' => '23:30', 'preco' => 4.00, 'datas' => $todas_as_datas],

    // 20. OS CANTABUFAS
    ['id' => 2001, 'nome' => 'Os Cantabufas', 'descricao' => 'Peripécias de uma carismática dupla de segréis errantes.', 'local' => 'Praça do Canastro', 'inicio' => '16:30', 'fim' => '16:50', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2002, 'nome' => 'Os Cantabufas', 'descricao' => 'Peripécias de uma carismática dupla de segréis errantes.', 'local' => 'Chafariz Igreja Matriz', 'inicio' => '18:00', 'fim' => '18:20', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2003, 'nome' => 'Os Cantabufas', 'descricao' => 'Peripécias de uma carismática dupla de segréis errantes.', 'local' => 'Mercado Municipal', 'inicio' => '20:00', 'fim' => '20:20', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 21. QUEM MANDA NO CONDADO?
    ['id' => 2101, 'nome' => 'Quem Manda no Condado?', 'descricao' => 'História onde se cruzam os destinos de uma condessa determinada, um infante e um nobre indeciso.', 'local' => 'Praça do Convento', 'inicio' => '17:00', 'fim' => '17:25', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 22. QUEZÍLIAS NO CONDADO
    ['id' => 2201, 'nome' => 'Quezílias no Condado', 'descricao' => 'Entre alianças, traições e batalhas pelo poder, a história de D. Teresa revela a luta por Portucale.', 'local' => 'Salão Nobre da Câmara Municipal', 'inicio' => '15:00', 'fim' => '15:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2202, 'nome' => 'Quezílias no Condado', 'descricao' => 'Entre alianças, traições e batalhas pelo poder, a história de D. Teresa revela a luta por Portucale.', 'local' => 'Salão Nobre da Câmara Municipal', 'inicio' => '16:00', 'fim' => '16:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2203, 'nome' => 'Quezílias no Condado', 'descricao' => 'Entre alianças, traições e batalhas pelo poder, a história de D. Teresa revela a luta por Portucale.', 'local' => 'Salão Nobre da Câmara Municipal', 'inicio' => '17:00', 'fim' => '17:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2204, 'nome' => 'Quezílias no Condado', 'descricao' => 'Entre alianças, traições e batalhas pelo poder, a história de D. Teresa revela a luta por Portucale.', 'local' => 'Salão Nobre da Câmara Municipal', 'inicio' => '18:00', 'fim' => '18:25', 'preco' => 0.00, 'datas' => $todas_as_datas],

    // 23. RUMO A SÃO MAMEDE
    ['id' => 2301, 'nome' => 'Rumo a São Mamede', 'descricao' => 'Acompanhe o passo firme das tropas rumo à Batalha de São Mamede.', 'local' => 'Castelo', 'inicio' => '22:00', 'fim' => '22:40', 'preco' => 0.00, 'datas' => array_values($dias_sem_fim_de_semana)],

    // 24. SOB A LUA DE SANTA MARIA
    ['id' => 2401, 'nome' => 'Sob a Lua de Santa Maria', 'descricao' => 'Fábula em teatro de sombras sobre um jovem lobo dividido entre o dever e o destino.', 'local' => 'Capela do Castelo', 'inicio' => '17:00', 'fim' => '17:20', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2402, 'nome' => 'Sob a Lua de Santa Maria', 'descricao' => 'Fábula em teatro de sombras sobre um jovem lobo dividido entre o dever e o destino.', 'local' => 'Capela do Castelo', 'inicio' => '19:00', 'fim' => '19:20', 'preco' => 0.00, 'datas' => array_values($dias_uteis_e_sabados)],
    ['id' => 2403, 'nome' => 'Sob a Lua de Santa Maria', 'descricao' => 'Fábula em teatro de sombras sobre um jovem lobo dividido entre o dever e o destino.', 'local' => 'Capela do Castelo', 'inicio' => '18:00', 'fim' => '18:20', 'preco' => 0.00, 'datas' => $domingos],

    // 25. TERESA, POR VONTADE RAINHA
    ['id' => 2501, 'nome' => 'Teresa, Por Vontade Rainha', 'descricao' => 'Acompanhe o passeio de D. Teresa (Custódia Gallego) pelo Condado Portucalense.', 'local' => 'Praça do Convento', 'inicio' => '18:00', 'fim' => '18:40', 'preco' => 0.00, 'datas' => array_values($dias_uteis_e_sabados)],

    // 26. TORNEIOS
    ['id' => 2601, 'nome' => 'Torneio: A Revolta Portucalense', 'descricao' => 'Assista ao confronto decisivo entre Afonso Henriques e sua mãe, Teresa de Leão.', 'local' => 'Liça', 'inicio' => '19:30', 'fim' => '20:10', 'preco' => 5.00, 'datas' => $todas_as_datas],
    ['id' => 2602, 'nome' => 'O Grande Torneio – Pelo Trono Portucalense', 'descricao' => 'Confronto entre nobres galegos e portucalenses num torneio feroz.', 'local' => 'Liça', 'inicio' => '22:30', 'fim' => '23:10', 'preco' => 5.00, 'datas' => $todas_as_datas],

    // 27. TOSTA MISTA, O MALABARISTA
    ['id' => 2701, 'nome' => 'Tosta Mista, o Malabarista', 'descricao' => 'Habilidades e travessuras deste exímio bobo da corte.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '15:30', 'fim' => '15:55', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2702, 'nome' => 'Tosta Mista, o Malabarista', 'descricao' => 'Habilidades e travessuras deste exímio bobo da corte.', 'local' => 'Ruas do Centro Histórico', 'inicio' => '17:00', 'fim' => '17:25', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2703, 'nome' => 'Tosta Mista, o Malabarista', 'descricao' => 'Habilidades e travessuras deste exímio bobo da corte.', 'local' => 'Praça do Convento', 'inicio' => '19:00', 'fim' => '19:25', 'preco' => 0.00, 'datas' => array_values($dias_uteis_e_sabados)],

    // 28. TRUPE DE SALTIMBANCOS
    ['id' => 2801, 'nome' => 'Trupe de Saltimbancos', 'descricao' => 'Deixe-se encantar por saltimbancos que, com arte e destreza, desafiam a gravidade.', 'local' => 'Praça da Câmara', 'inicio' => '17:30', 'fim' => '18:00', 'preco' => 0.00, 'datas' => $todas_as_datas],
    ['id' => 2802, 'nome' => 'Trupe de Saltimbancos', 'descricao' => 'Deixe-se encantar por saltimbancos que, com arte e destreza, desafiam a gravidade.', 'local' => 'Praça da Câmara', 'inicio' => '19:30', 'fim' => '20:00', 'preco' => 0.00, 'datas' => array_values($dias_uteis_e_sabados)],
];

/**
 * MATRIZ DE TEMPOS DE CAMINHADA (Em Minutos)
 * Altera apenas os números (minutos de caminhada) no valor final de cada linha!
 */
$tempos_caminhada = [
    'Terreiro das Guimbras' => [
        'Terreiro das Guimbras' => 0,
        'Ciclovia do Cáster' => 7,
        'Praça do Convento' => 12,
        'Claustro do Museu Convento dos Loios' => 17,
        'Interior da Igreja Matriz' => 16,
        'Largo da Igreja da Misericórdia' => 22,
        'Ruas do Centro Histórico' => 8,
        'Praça da Câmara' => 9,
        'Praça do Canastro' => 6,
        'Guimbras (Junto ao Castelo)' => 8,
        'Chafariz Igreja Matriz' => 12,
        'Praça de Armas do Castelo' => 27,
        'Mercado Municipal' => 11,
        'Salão Nobre da Câmara Municipal' => 9,
        'Castelo' => 32,
        'Capela do Castelo' => 28,
        'Liça' => 8,
    ],
    'Ciclovia do Cáster' => [
        'Terreiro das Guimbras' => 7,
        'Ciclovia do Cáster' => 0,
        'Praça do Convento' => 14,
        'Claustro do Museu Convento dos Loios' => 18,
        'Interior da Igreja Matriz' => 17,
        'Largo da Igreja da Misericórdia' => 27,
        'Ruas do Centro Histórico' => 8,
        'Praça da Câmara' => 12,
        'Praça do Canastro' => 7,
        'Guimbras (Junto ao Castelo)' => 17,
        'Chafariz Igreja Matriz' => 15,
        'Praça de Armas do Castelo' => 28,
        'Mercado Municipal' => 14,
        'Salão Nobre da Câmara Municipal' => 18,
        'Castelo' => 29,
        'Capela do Castelo' => 26,
        'Liça' => 1,
    ],
    'Praça do Convento' => [
        'Terreiro das Guimbras' => 12,
        'Ciclovia do Cáster' => 14,
        'Praça do Convento' => 0,
        'Claustro do Museu Convento dos Loios' => 2,
        'Interior da Igreja Matriz' => 3,
        'Largo da Igreja da Misericórdia' => 8,
        'Ruas do Centro Histórico' => 3,
        'Praça da Câmara' => 6,
        'Praça do Canastro' => 9,
        'Guimbras (Junto ao Castelo)' => 4,
        'Chafariz Igreja Matriz' => 1,
        'Praça de Armas do Castelo' => 7,
        'Mercado Municipal' => 12,
        'Salão Nobre da Câmara Municipal' => 7,
        'Castelo' => 11,
        'Capela do Castelo' => 10,
        'Liça' => 14,
    ],
    'Claustro do Museu Convento dos Loios' => [
        'Terreiro das Guimbras' => 17,
        'Ciclovia do Cáster' => 18,
        'Praça do Convento' => 2,
        'Claustro do Museu Convento dos Loios' => 0,
        'Interior da Igreja Matriz' => 1,
        'Largo da Igreja da Misericórdia' => 14,
        'Ruas do Centro Histórico' => 24,
        'Praça da Câmara' => 11,
        'Praça do Canastro' => 8,
        'Guimbras (Junto ao Castelo)' => 4,
        'Chafariz Igreja Matriz' => 1,
        'Praça de Armas do Castelo' => 8,
        'Mercado Municipal' => 9,
        'Salão Nobre da Câmara Municipal' => 11,
        'Castelo' => 12,
        'Capela do Castelo' => 11,
        'Liça' => 14,
    ],
    'Interior da Igreja Matriz' => [
        'Terreiro das Guimbras' => 16,
        'Ciclovia do Cáster' => 17,
        'Praça do Convento' => 3,
        'Claustro do Museu Convento dos Loios' => 1,
        'Interior da Igreja Matriz' => 0,
        'Largo da Igreja da Misericórdia' => 12,
        'Ruas do Centro Histórico' => 6,
        'Praça da Câmara' => 8,
        'Praça do Canastro' => 11,
        'Guimbras (Junto ao Castelo)' => 5,
        'Chafariz Igreja Matriz' => 1,
        'Praça de Armas do Castelo' => 16,
        'Mercado Municipal' => 9,
        'Salão Nobre da Câmara Municipal' => 12,
        'Castelo' => 15,
        'Capela do Castelo' => 12,
        'Liça' => 14,
    ],
    'Largo da Igreja da Misericórdia' => [
        'Terreiro das Guimbras' => 22,
        'Ciclovia do Cáster' => 27,
        'Praça do Convento' => 8,
        'Claustro do Museu Convento dos Loios' => 14,
        'Interior da Igreja Matriz' => 12,
        'Largo da Igreja da Misericórdia' => 0,
        'Ruas do Centro Histórico' => 4,
        'Praça da Câmara' => 6,
        'Praça do Canastro' => 11,
        'Guimbras (Junto ao Castelo)' => 14,
        'Chafariz Igreja Matriz' => 11,
        'Praça de Armas do Castelo' => 37,
        'Mercado Municipal' => 11,
        'Salão Nobre da Câmara Municipal' => 7,
        'Castelo' => 31,
        'Capela do Castelo' => 29,
        'Liça' => 16,
    ],
    'Ruas do Centro Histórico' => [
        'Terreiro das Guimbras' => 8,
        'Ciclovia do Cáster' => 8,
        'Praça do Convento' => 3,
        'Claustro do Museu Convento dos Loios' => 24,
        'Interior da Igreja Matriz' => 6,
        'Largo da Igreja da Misericórdia' => 4,
        'Ruas do Centro Histórico' => 0,
        'Praça da Câmara' => 4,
        'Praça do Canastro' => 6,
        'Guimbras (Junto ao Castelo)' => 9,
        'Chafariz Igreja Matriz' => 8,
        'Praça de Armas do Castelo' => 11,
        'Mercado Municipal' => 2,
        'Salão Nobre da Câmara Municipal' => 4,
        'Castelo' => 11,
        'Capela do Castelo' => 10,
        'Liça' => 8,
    ],
    'Praça da Câmara' => [
        'Terreiro das Guimbras' => 9,
        'Ciclovia do Cáster' => 12,
        'Praça do Convento' => 6,
        'Claustro do Museu Convento dos Loios' => 11,
        'Interior da Igreja Matriz' => 8,
        'Largo da Igreja da Misericórdia' => 6,
        'Ruas do Centro Histórico' => 4,
        'Praça da Câmara' => 0,
        'Praça do Canastro' => 7,
        'Guimbras (Junto ao Castelo)' => 11,
        'Chafariz Igreja Matriz' => 10,
        'Praça de Armas do Castelo' => 18,
        'Mercado Municipal' => 2,
        'Salão Nobre da Câmara Municipal' => 2,
        'Castelo' => 17,
        'Capela do Castelo' => 16,
        'Liça' => 12,
    ],
    'Praça do Canastro' => [
        'Terreiro das Guimbras' => 6,
        'Ciclovia do Cáster' => 7,
        'Praça do Convento' => 9,
        'Claustro do Museu Convento dos Loios' => 8,
        'Interior da Igreja Matriz' => 11,
        'Largo da Igreja da Misericórdia' => 11,
        'Ruas do Centro Histórico' => 6,
        'Praça da Câmara' => 7,
        'Praça do Canastro' => 0,
        'Guimbras (Junto ao Castelo)' => 8,
        'Chafariz Igreja Matriz' => 9,
        'Praça de Armas do Castelo' => 11,
        'Mercado Municipal' => 3,
        'Salão Nobre da Câmara Municipal' => 7,
        'Castelo' => 10,
        'Capela do Castelo' => 11,
        'Liça' => 8,
    ],
    'Guimbras (Junto ao Castelo)' => [
        'Terreiro das Guimbras' => 8,
        'Ciclovia do Cáster' => 17,
        'Praça do Convento' => 4,
        'Claustro do Museu Convento dos Loios' => 4,
        'Interior da Igreja Matriz' => 5,
        'Largo da Igreja da Misericórdia' => 14,
        'Ruas do Centro Histórico' => 9,
        'Praça da Câmara' => 11,
        'Praça do Canastro' => 8,
        'Guimbras (Junto ao Castelo)' => 0,
        'Chafariz Igreja Matriz' => 6,
        'Praça de Armas do Castelo' => 9,
        'Mercado Municipal' => 12,
        'Salão Nobre da Câmara Municipal' => 14,
        'Castelo' => 8,
        'Capela do Castelo' => 9,
        'Liça' => 12,
    ],
    'Chafariz Igreja Matriz' => [
        'Terreiro das Guimbras' => 12,
        'Ciclovia do Cáster' => 15,
        'Praça do Convento' => 1,
        'Claustro do Museu Convento dos Loios' => 1,
        'Interior da Igreja Matriz' => 1,
        'Largo da Igreja da Misericórdia' => 11,
        'Ruas do Centro Histórico' => 8,
        'Praça da Câmara' => 10,
        'Praça do Canastro' => 9,
        'Guimbras (Junto ao Castelo)' => 6,
        'Chafariz Igreja Matriz' => 0,
        'Praça de Armas do Castelo' => 8,
        'Mercado Municipal' => 10,
        'Salão Nobre da Câmara Municipal' => 10,
        'Castelo' => 12,
        'Capela do Castelo' => 11,
        'Liça' => 14,
    ],
    'Praça de Armas do Castelo' => [
        'Terreiro das Guimbras' => 27,
        'Ciclovia do Cáster' => 28,
        'Praça do Convento' => 7,
        'Claustro do Museu Convento dos Loios' => 8,
        'Interior da Igreja Matriz' => 16,
        'Largo da Igreja da Misericórdia' => 37,
        'Ruas do Centro Histórico' => 11,
        'Praça da Câmara' => 18,
        'Praça do Canastro' => 11,
        'Guimbras (Junto ao Castelo)' => 9,
        'Chafariz Igreja Matriz' => 8,
        'Praça de Armas do Castelo' => 0,
        'Mercado Municipal' => 15,
        'Salão Nobre da Câmara Municipal' => 18,
        'Castelo' => 3,
        'Capela do Castelo' => 4,
        'Liça' => 10,
    ],
    'Mercado Municipal' => [
        'Terreiro das Guimbras' => 11,
        'Ciclovia do Cáster' => 14,
        'Praça do Convento' => 12,
        'Claustro do Museu Convento dos Loios' => 9,
        'Interior da Igreja Matriz' => 9,
        'Largo da Igreja da Misericórdia' => 11,
        'Ruas do Centro Histórico' => 2,
        'Praça da Câmara' => 2,
        'Praça do Canastro' => 3,
        'Guimbras (Junto ao Castelo)' => 12,
        'Chafariz Igreja Matriz' => 10,
        'Praça de Armas do Castelo' => 15,
        'Mercado Municipal' => 0,
        'Salão Nobre da Câmara Municipal' => 3,
        'Castelo' => 15,
        'Capela do Castelo' => 14,
        'Liça' => 13,
    ],
    'Salão Nobre da Câmara Municipal' => [
        'Terreiro das Guimbras' => 9,
        'Ciclovia do Cáster' => 18,
        'Praça do Convento' => 7,
        'Claustro do Museu Convento dos Loios' => 11,
        'Interior da Igreja Matriz' => 12,
        'Largo da Igreja da Misericórdia' => 7,
        'Ruas do Centro Histórico' => 4,
        'Praça da Câmara' => 2,
        'Praça do Canastro' => 7,
        'Guimbras (Junto ao Castelo)' => 14,
        'Chafariz Igreja Matriz' => 10,
        'Praça de Armas do Castelo' => 18,
        'Mercado Municipal' => 3,
        'Salão Nobre da Câmara Municipal' => 0,
        'Castelo' => 17,
        'Capela do Castelo' => 16,
        'Liça' => 15,
    ],
    'Castelo' => [
        'Terreiro das Guimbras' => 32,
        'Ciclovia do Cáster' => 29,
        'Praça do Convento' => 11,
        'Claustro do Museu Convento dos Loios' => 12,
        'Interior da Igreja Matriz' => 15,
        'Largo da Igreja da Misericórdia' => 31,
        'Ruas do Centro Histórico' => 11,
        'Praça da Câmara' => 17,
        'Praça do Canastro' => 10,
        'Guimbras (Junto ao Castelo)' => 8,
        'Chafariz Igreja Matriz' => 12,
        'Praça de Armas do Castelo' => 3,
        'Mercado Municipal' => 15,
        'Salão Nobre da Câmara Municipal' => 17,
        'Castelo' => 0,
        'Capela do Castelo' => 2,
        'Liça' => 9,
    ],
    'Capela do Castelo' => [
        'Terreiro das Guimbras' => 28,
        'Ciclovia do Cáster' => 26,
        'Praça do Convento' => 10,
        'Claustro do Museu Convento dos Loios' => 11,
        'Interior da Igreja Matriz' => 12,
        'Largo da Igreja da Misericórdia' => 29,
        'Ruas do Centro Histórico' => 10,
        'Praça da Câmara' => 16,
        'Praça do Canastro' => 11,
        'Guimbras (Junto ao Castelo)' => 9,
        'Chafariz Igreja Matriz' => 11,
        'Praça de Armas do Castelo' => 4,
        'Mercado Municipal' => 14,
        'Salão Nobre da Câmara Municipal' => 16,
        'Castelo' => 2,
        'Capela do Castelo' => 0,
        'Liça' => 8,
    ],
    'Liça' => [
        'Terreiro das Guimbras' => 8,
        'Ciclovia do Cáster' => 1,
        'Praça do Convento' => 14,
        'Claustro do Museu Convento dos Loios' => 14,
        'Interior da Igreja Matriz' => 14,
        'Largo da Igreja da Misericórdia' => 16,
        'Ruas do Centro Histórico' => 8,
        'Praça da Câmara' => 12,
        'Praça do Canastro' => 8,
        'Guimbras (Junto ao Castelo)' => 12,
        'Chafariz Igreja Matriz' => 14,
        'Praça de Armas do Castelo' => 10,
        'Mercado Municipal' => 13,
        'Salão Nobre da Câmara Municipal' => 15,
        'Castelo' => 9,
        'Capela do Castelo' => 8,
        'Liça' => 0,
    ]
];

// LÓGICA DA API
$acao = $_GET['acao'] ?? '';
$data_selecionada = $_GET['data'] ?? date('Y-m-d');

function horaParaMinutos($horaStr) {
    list($h, $m) = explode(':', $horaStr);
    return ((int)$h * 60) + (int)$m;
}

// 1. LISTAR EVENTOS (ORDENADOS POR HORÁRIO)
if ($acao === 'eventos') {
    $hoje = date('Y-m-d');
    $hora_atual = date('H:i');

    $eventos_do_dia = array_filter($eventos_db, function($e) use ($data_selecionada, $hoje, $hora_atual) {
        if (!in_array($data_selecionada, $e['datas'])) {
            return false;
        }

        // Se a data escolhida for HOJE, filtra eventos com horário inicial já ultrapassado
        if ($data_selecionada === $hoje) {
            return $e['inicio'] >= $hora_atual;
        }

        return true;
    });

    // Ordenação Cronológica Estrita (Início e Fim)
    usort($eventos_do_dia, function($a, $b) {
        $inicioA = horaParaMinutos($a['inicio']);
        $inicioB = horaParaMinutos($b['inicio']);
        if ($inicioA === $inicioB) {
            return horaParaMinutos($a['fim']) - horaParaMinutos($b['fim']);
        }
        return $inicioA - $inicioB;
    });

    echo json_encode([
        'status' => 'sucesso',
        'data' => $data_selecionada,
        'dados' => array_values($eventos_do_dia)
    ]);
    exit;
}

// 2. VALIDAR ROTEIRO MANUAL
if ($acao === 'validar') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $ids = $input['eventos_ids'] ?? [];
    
    $selecionados = array_filter($eventos_db, function($e) use ($ids, $data_selecionada) {
        return in_array($e['id'], $ids) && in_array($data_selecionada, $e['datas']);
    });

    usort($selecionados, function($a, $b) {
        return horaParaMinutos($a['inicio']) - horaParaMinutos($b['inicio']);
    });

    $alertas = [];
    $viavel = true;
    $preco_total = 0;
    $roteiro_processado = [];

    $total = count($selecionados);
    for ($i = 0; $i < $total; $i++) {
        $atual = $selecionados[$i];
        $preco_total += $atual['preco'];

        $info_passo = [
            'evento' => $atual,
            'tempo_caminhada_proximo' => 0,
            'tempo_espera_proximo' => 0
        ];

        if ($i < $total - 1) {
            $proximo = $selecionados[$i + 1];
            $fim_atual = horaParaMinutos($atual['fim']);
            $inicio_proximo = horaParaMinutos($proximo['inicio']);
            
            $tempo_deslocamento = $tempos_caminhada[$atual['local']][$proximo['local']] ?? 0;
            $folga_disponivel = $inicio_proximo - $fim_atual;

            $info_passo['tempo_caminhada_proximo'] = $tempo_deslocamento;
            $info_passo['tempo_espera_proximo'] = max(0, $folga_disponivel - $tempo_deslocamento);

            if ($folga_disponivel < 0) {
                $viavel = false;
                $alertas[] = "Sobreposição de horário:<br> '{$atual['nome']}' termina às {$atual['fim']} e '{$proximo['nome']}' começa às {$proximo['inicio']}.";
            } elseif ($folga_disponivel < $tempo_deslocamento) {
                $viavel = false;
                $alertas[] = "Tempo de deslocamento insuficiente<br> entre '{$atual['nome']}' e '{$proximo['nome']}' (necessários {$tempo_deslocamento} min).";
            }
        }
        $roteiro_processado[] = $info_passo;
    }

    echo json_encode([
        'status' => 'sucesso',
        'viavel' => $viavel,
        'alertas' => $alertas,
        'preco_total' => sprintf("%.2f€", $preco_total),
        'roteiro' => $roteiro_processado
    ]);
    exit;
}

// 3. OTIMIZADOR AUTOMÁTICO
if ($acao === 'otimizar') {
    $orcamento = floatval($_GET['orcamento'] ?? 0);
    $hoje = date('Y-m-d');
    $hora_atual = date('H:i');

    $disponiveis = array_filter($eventos_db, function($e) use ($data_selecionada, $hoje, $hora_atual) {
        if (!in_array($data_selecionada, $e['datas'])) {
            return false;
        }

        if ($data_selecionada === $hoje) {
            return $e['inicio'] >= $hora_atual;
        }

        return true;
    });

    usort($disponiveis, function($a, $b) {
        return horaParaMinutos($a['inicio']) - horaParaMinutos($b['inicio']);
    });

    $roteiro_ideal = [];
    $custo_acumulado = 0;
    $ultimo_evento = null;
    $nomes_incluidos = [];

    foreach ($disponiveis as $ev) {
        if ($custo_acumulado + $ev['preco'] > $orcamento) continue;

        // Evita incluir o mesmo espetáculo mais do que uma vez (mesmo que tenha várias sessões/horários)
        if (in_array($ev['nome'], $nomes_incluidos)) continue;

        $tempo_deslocamento_anterior = 0;

        if ($ultimo_evento !== null) {
            $fim_ultimo = horaParaMinutos($ultimo_evento['fim']);
            $inicio_atual = horaParaMinutos($ev['inicio']);
            $tempo_deslocamento_anterior = $tempos_caminhada[$ultimo_evento['local']][$ev['local']] ?? 0;

            if ($inicio_atual < ($fim_ultimo + $tempo_deslocamento_anterior)) continue;
        }

        $roteiro_ideal[] = [
            'evento' => $ev,
            'tempo_deslocamento_anterior' => $tempo_deslocamento_anterior
        ];
        $custo_acumulado += $ev['preco'];
        $ultimo_evento = $ev;
        $nomes_incluidos[] = $ev['nome'];
    }

    echo json_encode([
        'status' => 'sucesso',
        'total_eventos' => count($roteiro_ideal),
        'custo_total' => sprintf("%.2f€", $custo_acumulado),
        'roteiro' => $roteiro_ideal
    ]);
    exit;
}