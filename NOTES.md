## Protocolos de Comunicação

Implementação do Tabnews.com.br para treinar desenvolvimento de software.

HTTP <- Protocolo usado para Hyper Text
FTP <- Producolo usado para Files
SMTP <- Protocolo usado para Simple Mails (E-mails)

Protocolos que são referentes a segurança dos pacotes
UDP <- Nesse protocolo cada pacote é individual e não existe uma perda significativa se um pacote é perdido no caminho. Muito usado quando latência importa, por exemplo: Chamadas e Jogos Online
TCP <- Já nesse protocolo asseguramos que todos os pacotes chegaram corretamente, se não chegaram eles são reenviados e o cliente espera até ter todos os pacotes na ordem correta. Comprometendo latência em benefício de ter todos os pacotes

IP <- Internet Protocol: Protocolo de comunicação na internet.

Sendo que é comum termos multiplos protocolos trabalhando juntos, por exemplo HTTP -> TCP -> IP. Mas claro, como o TCP é custoso (perde latência), não é usado para todos os casos.
