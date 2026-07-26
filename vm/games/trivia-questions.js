/* ============================================================
   BANCO DE PERGUNTAS — Cultura Geral sobre D. Afonso Henriques
   ============================================================
   Para acrescentar perguntas, copia o formato de um objeto e
   junta-o ao array. Cada pergunta tem:
     q             — o texto da pergunta
     options       — array com exatamente 4 hipóteses
     correctIndex  — índice (0 a 3) da hipótese certa em "options"
   Este ficheiro pode crescer livremente; o jogo lê sempre o
   array inteiro e escolhe perguntas ao acaso.
   ============================================================ */
window.MedievalTrivia = [
  {
    q: "Em que ano nasceu, aproximadamente, D. Afonso Henriques?",
    options: ["1094", "1109", "1128", "1143"],
    correctIndex: 1,
  },
  {
    q: "Quem foram os pais de D. Afonso Henriques?",
    options: [
      "Henrique de Borgonha e Teresa de Leão",
      "Sancho I e Dulce de Aragão",
      "Afonso VI de Leão e Castela e Zaida",
      "Raimundo de Borgonha e Urraca de Leão",
    ],
    correctIndex: 0,
  },
  {
    q: "Em que batalha Afonso Henriques se impôs à sua própria mãe, D. Teresa, e aos seus aliados?",
    options: ["Batalha de Ourique", "Batalha de São Mamede", "Batalha de Valdevez", "Batalha de Badajoz"],
    correctIndex: 1,
  },
  {
    q: "Em que ano se travou a Batalha de São Mamede?",
    options: ["1109", "1119", "1128", "1139"],
    correctIndex: 2,
  },
  {
    q: "Que cidade é tradicionalmente apontada como o 'berço da nação' portuguesa?",
    options: ["Coimbra", "Braga", "Guimarães", "Porto"],
    correctIndex: 2,
  },
  {
    q: "Segundo a tradição, em que batalha Afonso Henriques se autoproclamou Rei de Portugal?",
    options: ["Batalha de Ourique", "Cerco de Lisboa", "Batalha de São Mamede", "Cerco de Santarém"],
    correctIndex: 0,
  },
  {
    q: "Qual o tratado em que o Reino de Leão reconheceu Afonso Henriques como Rei de Portugal?",
    options: ["Tratado de Alcanizes", "Tratado de Zamora", "Tratado de Tordesilhas", "Tratado de Badajoz"],
    correctIndex: 1,
  },
  {
    q: "Em que ano foi assinado o Tratado de Zamora?",
    options: ["1128", "1139", "1143", "1179"],
    correctIndex: 2,
  },
  {
    q: "Qual o Papa que reconheceu Portugal como reino independente, através da bula Manifestis Probatum?",
    options: ["Papa Inocêncio II", "Papa Alexandre III", "Papa Eugénio III", "Papa Adriano IV"],
    correctIndex: 1,
  },
  {
    q: "Em que ano foi conquistada Santarém aos mouros?",
    options: ["1139", "1143", "1147", "1158"],
    correctIndex: 2,
  },
  {
    q: "Que apoio foi decisivo na conquista de Lisboa, em 1147?",
    options: [
      "Cavaleiros Templários vindos de Tomar",
      "Cruzados do norte da Europa a caminho da Terra Santa",
      "Tropas enviadas pelo Papa",
      "Um exército aragonês",
    ],
    correctIndex: 1,
  },
  {
    q: "Que cavaleiro é associado à conquista de Évora, em 1165?",
    options: ["Egas Moniz", "Martim Moniz", "Geraldo Sem Pavor", "Nuno Álvares Pereira"],
    correctIndex: 2,
  },
  {
    q: "Quem foi a esposa de D. Afonso Henriques?",
    options: ["Mafalda de Sabóia", "Beatriz de Castela", "Isabel de Aragão", "Urraca de Leão"],
    correctIndex: 0,
  },
  {
    q: "Quem sucedeu a D. Afonso Henriques como Rei de Portugal?",
    options: ["D. Dinis", "D. Sancho I", "D. Afonso II", "D. Afonso III"],
    correctIndex: 1,
  },
  {
    q: "Em que ano morreu D. Afonso Henriques?",
    options: ["1165", "1179", "1185", "1211"],
    correctIndex: 2,
  },
  {
    q: "Aproximadamente quantos anos durou o reinado de D. Afonso Henriques, um dos mais longos da Europa medieval?",
    options: ["Cerca de 20 anos", "Cerca de 35 anos", "Cerca de 46 anos", "Cerca de 57 anos"],
    correctIndex: 3,
  },
  {
    q: "Que alcunha é frequentemente associada a D. Afonso Henriques?",
    options: ["O Conquistador", "O Lavrador", "O Formoso", "O Justiceiro"],
    correctIndex: 0,
  },
  {
    q: "De que casa nobre era originário Henrique de Borgonha, pai de Afonso Henriques?",
    options: ["Casa de Habsburgo", "Casa de Borgonha", "Casa de Anjou", "Casa de Aragão"],
    correctIndex: 1,
  },
  {
    q: "A lenda das cinco quinas do brasão de Portugal está tradicionalmente associada a que episódio?",
    options: [
      "A vitória em Ourique sobre cinco reis mouros",
      "A conquista de Lisboa",
      "O Tratado de Zamora",
      "A fundação de Guimarães",
    ],
    correctIndex: 0,
  },
  {
    q: "Que ordem militar-religiosa recebeu terras no centro de Portugal (nomeadamente Tomar) para ajudar a defender o território conquistado?",
    options: ["Ordem de Santiago", "Ordem do Hospital", "Ordem do Templo", "Ordem de Avis"],
    correctIndex: 2,
  },
  
  
  {
    q: "Quem foi o aio e preceptor de D. Afonso Henriques durante a sua infância e juventude?",
    options: ["Geraldo Sem Pavor", "Egas Moniz", "Martim Moniz", "Gonçalo Mendes da Maia"],
    correctIndex: 1,
  },
  {
    q: "Em que cidade D. Afonso Henriques se armou cavaleiro a si próprio, em 1125?",
    options: ["Guimarães", "Coimbra", "Zamora", "Toledo"],
    correctIndex: 2,
  },
  {
    q: "Quem era o fidalgo galego cuja influência sobre D. Teresa desencadeou a oposição da nobreza portucalense?",
    options: ["Fernão Peres de Trava", "Raimundo de Borgonha", "Gomez Nunes", "Pedro Froilaz"],
    correctIndex: 0,
  },
  {
    q: "Para que cidade D. Afonso Henriques transferiu a capital do Condado Portucalense em 1131?",
    options: ["Lisboa", "Guimarães", "Braga", "Coimbra"],
    correctIndex: 3,
  },
  {
    q: "Em que mosteiro de Coimbra está sepultado D. Afonso Henriques?",
    options: ["Mosteiro de Alcobaça", "Mosteiro de Santa Cruz", "Mosteiro da Batalha", "Mosteiro dos Jerónimos"],
    correctIndex: 1,
  },
  {
    q: "Em que ano ocorreu o Recontro de Valdevez entre as forças de Afonso Henriques e de Afonso VII de Leão e Castela?",
    options: ["1128", "1139", "1140", "1147"],
    correctIndex: 2,
  },
  {
    q: "Qual era o título que D. Afonso Henriques usava antes de se intitular 'Rei'?",
    options: ["Duque de Portugal", "Infante ou Príncipe", "Conde Supremo", "Imperador das Espanhas"],
    correctIndex: 1,
  },
  {
    q: "Qual o nome do influente Arcebispo de Braga que foi um grande diplomata ao serviço da causa de D. Afonso Henriques?",
    options: ["D. Maurício Burdino", "D. João Peculiar", "D. Paio Mendes", "D. Martinho Geraldes"],
    correctIndex: 1,
  },
  {
    q: "Na lenda do Cerco de Lisboa, quem é a figura heroica que se terá atravessado na porta da cidade para permitir a entrada dos cristãos?",
    options: ["Egas Moniz", "Martim Moniz", "Geraldo Sem Pavor", "Gonçalo Mendes da Maia"],
    correctIndex: 1,
  },
  {
    q: "Que importante castelo militar foi construído por D. Afonso Henriques em 1135 para travar o avanço muçulmano rumo a Coimbra?",
    options: ["Castelo de Santarém", "Castelo de Leiria", "Castelo de Almourol", "Castelo de Almada"],
    correctIndex: 1,
  },
  {
    q: "Em que trágico evento militar em 1169 D. Afonso Henriques ficou gravemente ferido na perna e foi capturado pelo rei de Leão?",
    options: ["Batalha de Ourique", "Desastre de Badajoz", "Cerco de Santarém", "Tomada de Beja"],
    correctIndex: 1,
  },
  {
    q: "Qual era o nome do rei de Leão e Castela, primo de D. Afonso Henriques, com quem assinou o Tratado de Zamora?",
    options: ["Afonso VI", "Afonso VII", "Fernando II", "Sancho III"],
    correctIndex: 1,
  },
  {
    q: "Como é que os cronistas muçulmanos da época chamavam a D. Afonso Henriques pelas suas crónicas?",
    options: ["Ibn Al-Mansur", "Ibn Arrique", "Sultan Al-Garb", "Al-Bortukali"],
    correctIndex: 1,
  },
  {
    q: "Em 1143, D. Afonso Henriques declarou-se vassalo de que autoridade, oferecendo-lhe um censo anual em ouro?",
    options: ["Do Imperador do Sacro Império", "Da Santa Sé (Papa)", "Do Rei de França", "Do Rei de Leão"],
    correctIndex: 1,
  },
  {
    q: "Como se chama a bula papal de 1179 que confirmou a independência de Portugal?",
    options: ["Manifestis Probatum", "In Nomine Domini", "Unam Sanctam", "Aeterni Regis"],
    correctIndex: 0,
  },
  {
    q: "Que ordem religiosa de monges-agricultores recebeu de D. Afonso Henriques os terrenos para fundar a Abadia de Alcobaça?",
    options: ["Ordem de São Bento", "Ordem de Cister", "Ordem dos Franciscanos", "Ordem dos Dominicanos"],
    correctIndex: 1,
  },
  {
    q: "Qual destas filhas de D. Afonso Henriques se tornou Rainha de Leão ao casar com Fernando II?",
    options: ["D. Mafalda", "D. Urraca", "D. Teresa", "D. Sancha"],
    correctIndex: 1,
  },
  {
    q: "Que lendário guerreiro ficou conhecido como 'O Lidador' pelas suas proezas militares já em idade avançada ao serviço do rei?",
    options: ["Geraldo Sem Pavor", "Gonçalo Mendes da Maia", "Egas Moniz", "Martim Moniz"],
    correctIndex: 1,
  },
  {
    q: "Na Batalha de Ourique, contra quantos governadores/reis muçulmanos se diz tradicionalmente que D. Afonso Henriques lutou?",
    options: ["Três", "Cinco", "Sete", "Dez"],
    correctIndex: 1,
  },
  {
    q: "Quem era o Grão-Mestre da Ordem dos Templários em Portugal e conselheiro próximo de D. Afonso Henriques?",
    options: ["D. Gualdim Pais", "D. Paio Soares Correia", "D. Gonçalo Viegas", "D. Pedro Arnaldo"],
    correctIndex: 0,
  },
  {
    q: "Além de 'O Conquistador', que outra alcunha honorífica é atribuída a D. Afonso Henriques?",
    options: ["O Fundador", "O Lavrador", "O Desejado", "O Restaurador"],
    correctIndex: 0,
  },
  {
    q: "Em que ano foi conquistada a cidade de Beja aos mouros pelas forças cristãs?",
    options: ["1147", "1162", "1179", "1185"],
    correctIndex: 1,
  },
  {
    q: "Em que ano nasceu o herdeiro e sucessor de D. Afonso Henriques, o futuro D. Sancho I?",
    options: ["1139", "1154", "1169", "1179"],
    correctIndex: 1,
  },
  {
    q: "Que importante cidade espanhola foi cercada e ocupada por tropas de D. Afonso Henriques em 1169 antes do contra-ataque leonês?",
    options: ["Cáceres", "Badajoz", "Salamanca", "Sevilha"],
    correctIndex: 1,
  },
  {
    q: "Qual era a relação de parentesco entre D. Afonso Henriques e o Rei Afonso VI de Leão e Castela?",
    options: ["Afonso VI era seu pai", "Afonso VI era seu avô materno", "Afonso VI era seu irmão", "Afonso VI era seu tio"],
    correctIndex: 1,
  },
  {
    q: "Que bispo de Lisboa, de origem anglo-normanda, foi nomeado após a conquista da cidade em 1147?",
    options: ["D. João Peculiar", "D. Gilberto de Hastings", "D. Soeiro Viegas", "D. Manassés"],
    correctIndex: 1,
  },
  {
    q: "Qual destas fortalezas na margem sul do Tejo se rendeu a D. Afonso Henriques logo após a queda de Lisboa em 1147?",
    options: ["Palmela", "Silves", "Marvão", "Elvas"],
    correctIndex: 0,
  },
  {
    q: "Quem governava a região de Portugal antes da chegada do Conde D. Henrique de Borgonha?",
    options: ["Afonso VI de Leão e Castela", "O califa de Córdova", "O rei de Aragão", "A nobreza asturiana"],
    correctIndex: 0,
  },
  {
    q: "A Batalha de São Mamede foi travada nas proximidades de que castelo?",
    options: ["Castelo de Guimarães", "Castelo de Braga", "Castelo de Lindoso", "Castelo de Lanhoso"],
    correctIndex: 0,
  },
  {
    q: "Qual foi o motivo da vinda inicial do Conde D. Henrique para a Península Ibérica?",
    options: ["Comércio de especiarias", "Participar na Reconquista Cristã contra os Mouros", "Uma peregrinação a Santiago", "Fugir da peste na França"],
    correctIndex: 1,
  },
  {
    q: "Que importante mosteiro fundado em Lisboa em 1147 por D. Afonso Henriques serviu para cumprir uma promessa feita antes da conquista da cidade?",
    options: ["Mosteiro dos Jerónimos", "Mosteiro de São Vicente de Fora", "Convento do Carmo", "Mosteiro da Madre de Deus"],
    correctIndex: 1,
  },
  {
    q: "O que era o 'Foral' outorgado por D. Afonso Henriques a várias povoações?",
    options: ["Um imposto de guerra", "Um documento que estabelecia os direitos e deveres dos habitantes de um concelho", "Uma licença militar", "Um tratado de paz com Leão"],
    correctIndex: 1,
  },
  {
    q: "Qual foi o primeiro Santo português, cofundador do Mosteiro de Santa Cruz de Coimbra, que prestou grande auxílio espiritual ao rei?",
    options: ["Santo António", "São Teotónio", "São Nuno de Santa Maria", "São Gonçalo de Amarante"],
    correctIndex: 1,
  },
  {
    q: "Qual destas regiões históricas formava a base do Condado concedido ao Conde D. Henrique?",
    options: ["Entre-Douro-e-Minho", "Alentejo Central", "Algarve", "Beira Baixa"],
    correctIndex: 0,
  },
  {
    q: "O que aconteceu a D. Teresa após ser derrotada por D. Afonso Henriques na Batalha de São Mamede?",
    options: ["Foi coroada Rainha de Leão", "Foi afastada do governo do Condado Portucalense", "Fugiu para a Terra Santa", "Morreu no campo de batalha"],
    correctIndex: 1,
  },
  {
    q: "Em que ano faleceu o Conde D. Henrique, pai de D. Afonso Henriques?",
    options: ["1109", "1112", "1128", "1139"],
    correctIndex: 1,
  },
  {
    q: "Qual era o principal objetivo de D. Afonso Henriques ao conceder vastos territórios às Ordens Militares?",
    options: ["Promover a agricultura de exportação", "Defender e povoar as zonas de fronteira conquistadas", "Construir palácios reais", "Aumentar a influência espanhola"],
    correctIndex: 1,
  },
  {
    q: "Na Batalha de Ourique, em 1139, onde se localizava o campo de batalha segundo a tradição historiográfica?",
    options: ["Na região do Alentejo (Castro Verde)", "Junto ao rio Minho", "Nos arredores de Lisboa", "Na serra da Estrela"],
    correctIndex: 0,
  },
  {
    q: "Após a conquista de Santarém em 1147, D. Afonso Henriques doou terras na região de Alcobaça a que ordem religiosa?",
    options: ["Ordem do Templo", "Ordem de Cister", "Ordem de Avis", "Ordem dos Hospitalários"],
    correctIndex: 1,
  },
  {
    q: "Quem era o califa ou líder muçulmano que cercou Santarém em 1184, acabando por morrer durante o cerco?",
    options: ["Yusuf I (Abu Yaqub Yusuf)", "Tariq ibn Ziyad", "Al-Mu'tamid", "Abderramão III"],
    correctIndex: 0,
  },
  {
    q: "Que filho de D. Afonso Henriques esteve à frente da defesa vitoriosa de Santarém no cerco almoçada de 1184?",
    options: ["Infante D. Henrique", "Infante D. Sancho", "Infante D. Pedro", "Infante D. Fernando"],
    correctIndex: 1,
  },
  {
    q: "Que rei de Leão capturou D. Afonso Henriques no desastre de Badajoz em 1169?",
    options: ["Afonso VII", "Afonso VIII", "Fernando II", "Sancho III"],
    correctIndex: 2,
  },
  {
    q: "O Tratado de Zamora (1143) foi assinado na presença de que representante oficial do Papa?",
    options: ["Cardeal Guido de Vico", "Cardeal Humberto", "Bispo de Roma", "Legado de Cluny"],
    correctIndex: 0,
  },
  {
    q: "Qual era a origem da família de Mafalda de Saboia, esposa de D. Afonso Henriques?",
    options: ["Região dos Alpes (atual França/Itália)", "Reino de Castela", "Flandres", "Sícilia"],
    correctIndex: 0,
  },
  {
    q: "Em que ano se deu o famoso cerco e conquista da fortaleza de Sintra por D. Afonso Henriques?",
    options: ["1128", "1139", "1147", "1165"],
    correctIndex: 2,
  },
  {
    q: "Como se chama a lenda associada à promessa de fidelidade de Egas Moniz ao Rei de Leão em nome de Afonso Henriques?",
    options: ["Lenda do Milagre de Ourique", "Lenda do Aio Egas Moniz (Corda ao Pescoço)", "Lenda da Padeira de Aljubarrota", "Lenda dos Sete Infantes"],
    correctIndex: 1,
  },
  {
    q: "A Batalha de Sacavém (1147), embora de historicidade debatida, é associada à conquista de que grande cidade?",
    options: ["Coimbra", "Santarém", "Lisboa", "Évora"],
    correctIndex: 2,
  },
  {
    q: "Que alcunha foi dada ao nobre Gonçalo Mendes da Maia pela sua bravura e longevidade nas lutas contra os mouros?",
    options: ["O Lidador", "O Sem Pavor", "O Bravo", "O Velho"],
    correctIndex: 0,
  },
  {
    q: "Em que ano é que D. Afonso Henriques concedeu o importante Foral a Guimarães para reorganizar o povoamento local?",
    options: ["1128", "1136", "1143", "1179"],
    correctIndex: 1,
  },
  {
    q: "Quem era o avô paterno de D. Afonso Henriques?",
    options: ["Henrique I da Inglaterra", "Henrique, Duque da Borgonha", "Afonso VI de Leão", "Roberto I, Duque da Borgonha"],
    correctIndex: 3,
  },
  {
    q: "Que documento assinado por D. Afonso Henriques em 1127 à ermida de São Vicente de Fragoso é tido como o primeiro sinal de rebeldia contra a sua mãe?",
    options: ["Carta de Couto", "Foral de Braga", "Tratado de Paz", "Testamento Real"],
    correctIndex: 0,
  },
  {
    q: "Qual destas ordens miliares fundadas ou estabelecidas no reinado de D. Afonso Henriques teve a sua sede no Castelo de Tomar?",
    options: ["Ordem de Santiago", "Ordem do Templo (Templários)", "Ordem de Calatrava", "Ordem de Malta"],
    correctIndex: 1,
  },
  {
    q: "Onde se deu o encontro diplomático em 1137 onde D. Afonso Henriques e Afonso VII assinaram a Paz de Tui?",
    options: ["Tui (Galiza)", "Zamora", "Guimarães", "Badajoz"],
    correctIndex: 0,
  },
  {
    q: "Que cidade alentejana foi reconquistada em 1162 sob o comando de tropas leais a D. Afonso Henriques?",
    options: ["Beja", "Serpa", "Moura", "Portalegre"],
    correctIndex: 0,
  },
  {
    q: "Qual destas ordens religiosas teve um papel fundamental na chancelaria e na formação documental do novo reino a partir de Coimbra?",
    options: ["Canoas Regrantes de Santo Agostinho (Santa Cruz)", "Beneditinos de Tibães", "Franciscanos", "Dominicanos"],
    correctIndex: 0,
  },
  {
    q: "Em 1170, D. Afonso Henriques outorgou um foral especial a que grupo populacional residente nas cidades conquistadas?",
    options: ["Aos Cruzados ingleses", "Aos Mouros forros (livres)", "Aos mercadores genoveses", "Aos nobres leoneses"],
    correctIndex: 1,
  },
  {
    q: "Qual era o nome da irmã de D. Afonso Henriques que casou com o conde de Trava?",
    options: ["D. Sancha Henriques", "D. Urraca Henriques", "D. Teresa Henriques", "D. Mafalda Henriques"],
    correctIndex: 0,
  },
  {
    q: "Que importante rio marcava a linha divisória de defesa e expansão durante a segunda fase do reinado de D. Afonso Henriques?",
    options: ["Rio Minho", "Rio Douro", "Rio Tejo", "Rio Guadiana"],
    correctIndex: 2,
  },
  {
    q: "Quem assumiu a regência de facto do Reino de Portugal a partir de 1169 devido ao estado de saúde e incapacidade física de D. Afonso Henriques?",
    options: ["D. Teresa", "O Infante D. Sancho", "Gualdim Pais", "D. João Peculiar"],
    correctIndex: 1,
  },
  {
    q: "A Bula Manifestis Probatum de 1179 foi emitida durante o pontificado de qual Papa?",
    options: ["Inocêncio III", "Alexandre III", "Urbano II", "Gregório VII"],
    correctIndex: 1,
  },
];
