## Protocolos de Comunicação

Os protocolos de comunicação são formas previsíveis de nos comunicarmos, dessa forma existe um padrão, uma expectativa de formato.

HTTP <- Protocolo usado para Hyper Text
FTP <- Producolo usado para Files
SMTP <- Protocolo usado para Simple Mails (E-mails)

Protocolos que são referentes a segurança dos pacotes
UDP <- Nesse protocolo cada pacote é individual e não existe uma perda significativa se um pacote é perdido no caminho. Muito usado quando latência importa, por exemplo: Chamadas e Jogos Online
TCP <- Já nesse protocolo asseguramos que todos os pacotes chegaram corretamente, se não chegaram eles são reenviados e o cliente espera até ter todos os pacotes na ordem correta. Comprometendo latência em benefício de ter todos os pacotes

IP <- Internet Protocol: Protocolo de comunicação na internet.

Sendo que é comum termos multiplos protocolos trabalhando juntos, por exemplo HTTP -> TCP -> IP. Mas claro, como o TCP é custoso (perde latência), não é usado para todos os casos.

## Funcionamento do Git (Git Deep Dive)

### Commits

O Git é um formato de versionamento descentralizado, isso significa que não temos um repositório central, mas sim multiplos repositórios que podem funcionar de forma independente.
Além disso, quando lidamos com o Git cada versão é uma "foto" do momento atual do projeto, sendo que essa foto registra todos os arquivos presentes no projeto naquele momento e salva cada arquivo em um Blob.

- Caso um arquivo tenha sido criado ou alterado é criado um novo blob do arquivo completo
- Por outro lado, se o arquivo for mantido sem alteração o apontamento não é para um novo blob, mas para o blob da última versão que o Git gerou desse arquivo (independente de quantas versões anteriores for).
- Já se o arquivo foi removido o apontamento é removido, então o arquivo não é mais referenciado mesmo existindo em versões anteriores.

Sendo assim existe uma árvore de referências a arquivos blob que só atualiza seus nós caso aquele nó tenha sido alterado e um novo blob seja criado, caso contrário a referência permanece.

Já as diffs entre versões do Git são geradas "on demand", ou seja, só é feito o diff quando queremos comparar duas versão diretamente e esse cálculo é feito naquele momento, não sendo armazenado no git essa diferença como em outros padrões.

Além disso, o Git segue um formado de Gráfo Acíclico Direcional (DAG).

### Branchs

Uma branch no git nada mais é do que um arquivo de texto que tem um apontamento para um commit expecífico na "linha do tempo dos commits", sendo que podemos ter múltiplos apontamentos para mesmas branchs ou branchs diferentes, já que a única coisa que realmente é criada é um arquivo de texto simples com o commit que está sendo referenciado.

Já o `HEAD` do git é a referência do que está sendo mostrado atualmente no projeto, então é outro apontamento que pode acontecer diretamente ao hash de um commit ou ao nome da branch. Sendo assim é apenas outro apontamento.

Sendo assim podemos entender o `HEAD` como o apontamento principal do projeto e podemos entender que uma branch é um ALIAS para um commit ou linha de commits. Sendo que quando estamos em uma branch e um novo commit é feito o apontamento da branch é atualizado.

## DNS

### Resolução de DNS (Domain name system)

Quando usamos uma URL para acessar o site não estamos acessando diretamente o conteúdo do site, na realidade existe todo um caminho que esse dominio passa até termos acesso ao servidor e ao conteúdo que queremos.

A comunicação que ocorre entre computadores (e um servidor nada mais é do que um computador) ocorre seguindo o prodocolo IP, sendo assim precisamos de um IP para nos conectarmos diretamente com o servidor. Porém como seria complexo termos a informação do IP de cada site que queremos, além dessa informação poder ser alterada, usamos **Servidores de Resolução DNS**.

Computador -----> Server DNS
Computador <----- Server DNS

Nessa comunicação informamos para o servidor qual endereço queremos e o servidor nos retorna o IP atual que esse domínio está hospedado, para que então possamos nos conectar com ele. Sendo que como sites podem mudar de domínios essa informação é volátil e pode ser alterada, por isso a importância desses **Servidores de Resolução DNS**.

Uma vez que temos o IP do servidor que queremos acessar nos comunicamos diretamente com os Backbones da internet para que seja feita a resolução do IP que queremos, criando um caminho de resolução de IPs até chegar no destino final, dessa forma a cada nó percorrido na internet é conferido o IP que queremos atingir para que sejamos direcionados para o caminho mais rápido até esse IP.

Computador -----> N IPs Intermediários ----> IP do Servidor

Como já falado, o IP de uma aplicação pode mudar caso a mesma seja alterada em algum momento, por conta disso é importante entender que a informação dos DNS pode e será alterada de tempos em tempos, para refletir a versão mais atual do Domínio que queremos.

### Deep Dive da Resolução DNS

`FQDN (Fully Qualified Domain Name)` -> é o domínio real que um site tem, termina em `.`, esse `.` representa o Root Server que será chamado primeiramente para a resolução desse Domínio. Sendo que pode chamar qualquer um dos Root Servers, o que for mais rápido.

`Recursive Resolver` -> São do próprio provedor de internet e que tem como objetivo a resolução do Domínio solicitado pelo usuário, **tem como única informação principal os IPs do Root Servers**.

`Root Servers` -> servidores base distribuídos pelo mundo e que são os pontos de entrada para resolução DNS realmente começar, são a base de toda resolução DNS pelo mundo. Temos serca de 13 Root Servers, porém mais de 1000 servidores para termos redundância e garantir a disponibilidade e estabilidade desse serviço. Esse servidor não sabe realmente onde o domínio expecífico vai estar, mas sabe fazer a resolução ao contrário para chegar mais perto, achando seu TLD, **então tudo que um Root Server tem é o IP dos TLDs** .

`Sever TLD (Top-Level Domain)` -> É o grupo de servidores que tem a resolução do TLD, sendo assim eles ainda não vão ter a resolução do Domínio, mas vão saber em que servidor achar esse domínio, os chamados **Authoritative Servers**. Os códigos de TLD são divididos entre ccTLD e gTLD. em ccTLD (Country Code TLD) são os códigos de TLD expecíficos de um pais, como .br, .ca. Já os gTLD (Generic TLD), são os TLDs genéricos não associados a um país, como .org, .net, .com, .dev.

`Authoritative Servers` -> O servidor que realmente vai ter físicamente as informações daquele domínio pedido, os Authoritative Servers ficam listados nos TLDs e vão ter a informação de vários domínios, entre eles os que estamos procurando, como curso.dev por exemplo.

`Cache TTL (Time to live)` -> estratégia de cache usado em **toda essa cadeia de comunicação**, sendo assim em cada camada vamos ter um cache de informações que ajuda a tornar a resposta mais rápida. Sendo que esses caches tem um tempo para expirar, então durante todo esse tempo o que acontece é que se a camada tiver uma resposta direta da resolução DNS essa resposta é dada e o fluxo é cortado.

**Sendo assim o caminho que temos REAL para resolução DNS é:**

- 1. O computador manda uma request com curso.dev
- 2. A request vai para o Root Server, _se tiver o DNS Record em cache retorna diretamente_, se não chama o TLD compativel, nesse caso `.dev`
- 3. Os gTTLs `.dev` é acionado, sendo feita uma request para um de seus servidores, _caso tiver o DNS Record em cache retorna diretamente_, caso contrário passa o IP do Authoritative Server que tem esse domínio.
- 4. O Authoritative Server retorna o DNS Register, sendo que durante toda a comunicação vai atualizando o cache de cada uma das camadas
- 5. Só então, já com o IP "em mãos" o computador vai se comunicar pela internet até chegar no IP final.

## Versionamento e Atualização de Dependências

Quando olhamos uma dependência ela tem uma estrutura nesse formato:

[x].[y].[z]

x -> representa uma versão MAJOR, ou seja, algo maior que possivelmente terá breaking changes
y -> versão MINOR, representa uma mudança no pacote, mas que provavelmente não conta com breaking changes
z -> PATCH, uma versão de correção que não deve ter impácto prático, apenas correções ou atualizações não funcionais (em teoria).

## Dependências e uso do ~, ^ ou nada

Quando olhamos um arquivo de dependências eles podem ter deps com diferentes símbulos, como **^**, **~** ou nenhum.

"~1.4.12" -> o **~** representa que qualquer versão **patch** acima da 12 é permitida, ou seja, a versão 1.4.20 (por exemplo) pode ser instalada

"^1.4.12" -> já o uso do **^** representa que versões **minor** podem ser instaladas, ou seja, a versão 1.5.2 poderia ser instalada nesse caso

"1.4.12" -> neste último caso apenas a versão definida será instalada, zero flexibilidade por aqui!

Ou seja, podemos controlar o nível de flexibilidade na versão da dependência seguindo esse padrão, sendo assim um tradeoff de flexibilidade x controle.

## Análise de dependências

Podemos usar a lib `npm-check-updates` para fazer a análise de updates no projeto.

Importante notar que esse método não atua verificando segurança das libs (como o npm audit), porém é útil na atualização de versões.

Para usar essa lib é utilizado o comando `npx npm-check-updates`

## Comand Line

### cURL and Relateds

Quando usamos o cURL temos um client HTTP que pode fazer requests diretamente contra um endpoint, usando o modelo `curl https://tabnews-project-mocha.vercel.app/api/v1/status` por exemplo.

Quando queremos mudar o **Method** do cURL podemos usar a flag `-X DELETE` por exemplo para usar o method DELETE. Dessa forma a URL seria: `curl -X DELETE https://tabnews-project-mocha.vercel.app/api/v1/status`

O curl pode ser usado junto com um pipe, que é pegarmos o retorno de seu endpoint e jogar dentro de outro método da linha de comando. Um exemplo disso seria usar o comando `jq` para melhorar a visualização de um retorno JSON. Porém isso trás informações sobre a execução do curl, então para silenciar essas informações usamos o comando `-s` (para ativar o _silence mode_) Dessa forma o comando seria por exemplo: `curl -s https://tabnews-project-mocha.vercel.app/api/v1/status | jq`.

Por fim, caso quisermos fazer com que o endpoint seja consultado com um intervalo de tempo, **sendo consultado a cada segundo por exemplo**, podemos usar o comando `watch`, esse comando por padrão roda a cada 2 secs mas pode ser configurado passando o numero de segundos pela flag `-n`. Depois disso passamos o comando que queremos que seja executado em aspas simples, como aqui: `watch -n 1 'curl -s -X GET https://tabnews-project-mocha.vercel.app/api/v1/status | jq'`.

## Development Strategies

### Trunk-Based Development

Nessa estratégia temos uma branch principal que faz o processo de CI/CD e tudo é desenvolvido e integrado diretamente nessa branch. Sendo que para que esse desenvolvimento não quebre nada é usado estratégias como `Feature Flag` e `Abstractions`. Os prós dessa estrategia são uma maior velocidade e um sync maior entre o que cada desenvolvedor faz e seu Trunk, sendo assim temos maior velocidade. Porém isso exige maior maturidade, uma cultura orientada a esse tipo de desenvolvimento e uma qualidade grande nos testes que são gerados em cada desenvolvimento, para que nenhuma feature nova impacte o sistema o que já existe no sistema.

#### Feature Flag

É uma estratégia em que uma feature nova só é visível para um desenvolvedor ou o grupo que está trabalhando nela, sendo assim essa feature existe no código, mas ela ainda não é aplicável ou tem impacto em outras partes do sistema. Além disso essa abordagem pode fazer com que outras pessoas possam pedir para terem essa feature flag e participarem do processo de uso ou teste da feature.

#### Abstractions

Esse processo quase sempre é somado com a criação de abstrações, então uma vez que uma feature que já funciona precisa ser alterada o que fazemos é criar uma abstração na frente da feature, fazer os apontamentos e usos da feature antiga pela abstração que ainda aponta para a versão antiga. Depois começa o processo de desenvolvimento da nova versão da feature, para que então o apontamento da abstração seja substituído e até mesmo a abstração possa ser removida.

#### Abstractions + Feature Flag

Uma vez que as abstrações criam essa separação entre o uso da feature antiga e nova é possível usar as duas abordagens somadas, sendo assim uma feature flag controla se a abstração vai retornar a feature antiga ou a feature nova.

### Feature Branch

Abordagem também conhecida como GitHub flow, nessa abordagem temos uma linha principal e vamos criando ramificações para desenvolvimento de features, sendo que essas branchs precisam ter vida curta e precisam passar por um processo de integração com o ramo principal.

Essa estratégia também cria a possibilidade de termos uma branch de release por exemplo, que é responsável por conter o que verdadeiramente está em produção, para dessa forma termos uma separação do que está como código principal, features sendo feitas e o código em produção.

Porém como essa estratégia cria uma barreira maior pode tornar o processo mais lento e mais burocrático, causando demora no momento de integrar todas as entregas.

### Git Flow

Processo mais lento e burocrático de todos, só incentivado quando temos que dar manutenção a versões diferentes de um mesmo software. Em casos como aplicativos e sites isso não se faz necessário.

## Development with Tests

Quando desenvolvemos sistemas orientados a testes temos que entendender qual o papel dos testes e o que eles representam no sistema. Se os testes forem escritos por alguém técnico podemos ter um teste sendo algo muito formal sobre a lógica usada. Por outro lado se for feito por alguém de negócio podemos ter o comportamento esperado, mas descasando da implementação feita.

Mas para esse projeto tentaremos achar o caminho do meio.

### TDD (Test Driven Development)

O TDD é uma forma muito usada para escrita de testes e desenvolvimento, nesse formato primeiro escrevemos os testes e depois fazemos o desenvolvimento com base no que foi escrito em cada teste. Porém por conta da natureza técnica desse formato acabamos tendo afirmações muito técnicas sobre o que está ocorrendo e que podem não ser tão precisas sobre o comportamento real.

Além disso, como a escrita do teste independe do assert que está sendo feito pelo teste podemos ter casos em que um teste é alterado sem mudar seu contexto, dessa forma descasando o desenvolvimento do teste e sua descrição.

### BDD (Behavior Driven Development)

Nesse formato temos os testes sendo muito mais focados em documentações de negócio, são excelentes para contexto, porém trazem uma verbosidade e uma complexidade no foramto, além disso trazem tanto afirmações de comportamento como de cenários esperados.

#### Gherkin

Temos executores de testes especializados na leitura de testes escritos no formato **Gherkin**, como o **Cucumber**

Usa termos claros sobre o comportamento do sistema, criando assim um formato que seja claro para pessoas técnicas e não técnicas. `Given.....When....Then`, como no exemplo:

```md
`Given` the user is not logged in
`When` the user make a POST to /migrations endpoint
`Then` the migration should be executed successfully
```

### Tests por Contexto + Afirmação

Nesse formato usamos o `describe` e o `test` (ou `it`) apenas para trazer um contexto do escopo que está sendo testado para que quem leia os testes possa se orientar, mas a afirmação de como o sistema se comporta não fica no título do teste e no seu tesste (lógico), mas sim apenas no seu `assert`. Dessa forma simplificamos e padronizamos a escrita do teste, além disso em caso de manutenção no assert o texto não precisa ser alterado, diminuindo riscos de manutenção.

## Autenticação

Primeira questão, qualquer tecnologia tem problemas de segurança, então é mais uma questão de quanto tempo e esforço é necessário para conseguir encontrar e abusar dessas brechas.

Já existem bibliotecas e tecnologias validadas que atuam para utilizarmos na camada de autenticação, porém a ideia aqui é entender os principais formatos de autenticação e suas características.

### Texto puro (plain text)

É uma forma simples, porém **nada segura**, nesse formato salvamos a senha da mesma forma que o usuário inseriu. Sendo assim não faz nenhum sentido usar essa abordagem

### Encriptação

Nessa etapa a senha não é mais salva diretamente, passamos por um processo de encriptação, que é quando transformamos o texto antigo em algo novo. Para isso são usadas cifras, como a cifra de Cesar, ou ainda uma **chave mestra**.

Porém essa opção também oferece riscos, uma vez que toda a informação da senha permanece no texto original, além disso uma vez que sabemos a cifra ou chave mestra temos acesso a todas as senhas de uma vez.

Então mesmo sendo uma opção melhor, ainda não é uma opção segura.

### Hash

Primeiro, é importante entender que um hash não serve para compactar as informações, ele utiliza informações como base para criar o hash e essas informações são "destruidas" no processo de criação do Hash.

Sendo que podemos entender que a transformação de um hash é uma **one-way function**, ou seja uma função em que a informação só vai em uma direção. Por outro lado a encriptação é uma **two-way function**, sendo assim a informação pode ser encriptada e desencriptada. Desta forma uma vez que um hash é criado nós nunca mais conseguimos transformar a informação no valor original.

Sendo que esses hashs são determinísticos, ou seja dada a uma mesma entrada sempre teremos uma mesma saída. Por isso que quando vamos recuperar uma senha e digitamos a mesma senha o sistema consegue determinar se essa senha era igual a anterior. Isso acontece pois mesmo com a transformação da senha, como é algo determinístico, podemos comparar o hash gerado com o hash antigo, e se ambos forem iguais podemos determinar que as senhas são iguais, **ou pelo menos na teoria**.

Essa questão teórica sobre as senhas serem iguais é importante, pois mostra que para que o hash realmente seja seguro precisamos de um algoritmo que evite colições, pois uma vez que senhas colidam um agente mal intencionado pode criar uma senha falsa e colidir com o hash da senha real.

Para isso já tivemos vários algoritmos: **MD5**, **SHA-1** e hoje temos o **SHA-256**. Porém é importante notar que esses algoritmos podem ser quebrados em algum momento e que essas tecnologias evoluem.

Mas o problema de segurança aqui é outro, os Hashs são realmente mais seguros e continuam evoluindo, porém não impedem que o usuário crie uma senha que seja fraca, como 123456 e se torne um alvo. Hoje existem **Rainbow tables**, que são tabelas pré-computadas com hashs já quebrados ou já conhecidos por Hackers, que normalmente tem senhas comuns que já foram usadas por outros usuários.

Então a questão de segurança agora é garantir que mesmo um usuário que coloque a senha 123456 esteja mais seguro, e para isso temos algumas opções novas.

### Hash + Salt

A coluna salt é uma coluna concreta, que vai realmente existir na tabela do banco de dados (ou pelo menos a informação vai existir no banco) e que é unica pra cada usuário.

Falei que a informação vai existir, pois existem estratégias como do BCrypt que faz esse hashing com salt concatenando todas as informações, além de adicionar uma camada extra de segurança!

Essa camada extra de seguranda são os **Rounds** (ou Cost Factor), esse valor determina o número de vezes que um hash será re-imbaralhado. Sendo que esse valor escala de forma exponencial no tempo, então quanto maior o valor de rounds mais demorado para gerar o Hash. Agora, por que isso é bom? Quanto maior o Rounds mais complexa a senha e mais difícil de ser quebrada, além disso em um adaque de milhares de milhares de tentativa quanto mais complexo um mesmo hash for mais tempo para que um único valor ser testado.

Estrutura: `$<versao>$<rounds>$<salt>+<senha>`
Exemplo real: `$2a$14$iljTnCmwUONpdNOUevXFtuDCVPa0l2hiYoT61JTLqhEus21DfgFZG`

Dessa forma essa é uma estratégia muito mais segura e robusta, ajudando a mitigar muitos ataques, porém mesmo assim existe um plus

### Hash + Salt + Pepper

O Pepper é um texto randomico, que vai ser único e que deve ser o mais aleatório possível. Porém o importante aqui é que **esse valor não deve ser salvo no banco de dados**, sendo um valor que deve ser escondido.

Essa questão do pepper não ser salvo no banco garante que caso um ataque no banco tenha sucesso as senhas mesmo assim não seram comprometidas.

Da mesma forma essa combinação de Hash + Salt + Pepper irá usar uma solução como o Bcrypt, porém concatenando o pepper no começo ou final da senha no processo de formação do hash.

A parte desse valor ser escondido é importante para evitar vazamentos, então o ideal é que esse pepper seja, por exemplo, uma variável de ambiente, dessa forma garantindo que tudo esteja o mais protegido possível.
