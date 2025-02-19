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

O Git é um formato de versionamento descentralizado, isso significa que não temos um repositório central, mas sim multiplos repositórios que podem funcionar de forma independente.
Além disso, quando lidamos com o Git cada versão é uma "foto" do momento atual do projeto, sendo que essa foto registra todos os arquivos presentes no projeto naquele momento e salva cada arquivo em um Blob.

- Caso um arquivo tenha sido criado ou alterado é criado um novo blob do arquivo completo
- Por outro lado, se o arquivo for mantido sem alteração o apontamento não é para um novo blob, mas para o blob da última versão que o Git gerou desse arquivo (independente de quantas versões anteriores for).
- Já se o arquivo foi removido o apontamento é removido, então o arquivo não é mais referenciado mesmo existindo em versões anteriores.

Sendo assim existe uma árvore de referências a arquivos blob que só atualiza seus nós caso aquele nó tenha sido alterado e um novo blob seja criado, caso contrário a referência permanece.

Já as diffs entre versões do Git são geradas "on demand", ou seja, só é feito o diff quando queremos comparar duas versão diretamente e esse cálculo é feito naquele momento, não sendo armazenado no git essa diferença como em outros padrões.

Além disso, o Git segue um formado de Gráfo Acíclico Direcional (DAG).
