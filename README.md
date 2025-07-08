# Teste prático para desenvolvedor de software

Bem vindo ao teste prático. Siga os passos abaixo e desenvolva o máximo que conseguir dentro do prazo.

## 1º Passo:

Baixe o docker e instale em sua maquina. [https://www.docker.com/get-started]

## 2º Passo: 

Execute o script `setup-mysql.sh` para automatizar a configuração do MySQL com Docker:
> ./setup-mysql.sh

***Caso sua maquina não de suporte ao docker, baixe e instale o MySQL e atualize a connectionstring do projeto***

## 3º Passo:

Faça o "fork" deste repositório e clone ele em sua máquina para começar o desenvolvimento. [https://docs.github.com/pt/github/getting-started-with-github/fork-a-repo]

## 4º Passo:

Execute o migrations no seu banco de dados local.

*Obs.: O comando deve ser executado via CMD dentro ta pasta do projeto "Persistence".*

> dotnet ef database update

## 5º Passo:

Hora de programar.

_________

*Usando seus conhecimentos, entanda o código e implemente as seguintes alterações:*


**Tarefa 1:** 

No projeto "WebApi", crie uma nova rota GET "/clients?document=123456" para que seja possível a filtragem de clientes pelo número do documento. Atente-se ao padrão já implementado em outras consultas já existentes. 


**Tarefa 2:** 

No projeto "WebApp", adicione na Index da ClientController o campo Documento para a busca e, com isto, realize a chamada do item criado na "Tarefa 1". Atente-se ao padrão já implementado em outras consultas já existentes. 


**Tarefa 3:** 

No projeto "WebApi", crie uma nova rota PUT "/clients/{id}" para que seja possível fazer a atualização dos dados de um cliente. Atente-se ao padrão já implementado em outros comandos já existentes. 


**Tarefa 4:** 

No projeto "WebApp", adicione uma nova Action na ClientController para edição dos dados de um cliente e realize a chamada do item criado na "Tarefa 3". Lembre-se de adiciona o link para pagina de edição no listagem de clientes. Atente-se ao padrão já implementado em outras telas já existentes. 


**Tarefa 5.1:** 

Adicione na classe de dominio Client a data de nascimento (BirthDate) do cliente como valor obrigatório. 

**Tarefa 5.2:** 

Ajuste as configurações do EntityFramework (que estão no projeto "Persistence") para contemplar o novo campo e crie o migrations para alteração do banco de dados.

> dotnet ef migrations add "Add_BirthDate_On_Client"


**Tarefa 5.3:** 

No projeto "WebApi", ajuste as APIs de Criação e Edição de cliente para receber e salvar o novo campo de data de nascimento e as APIs de listagens e consultas para retornar este novo campo.


**Tarefa 5.4:** 

No projeto "WebApp", inclua o campo data de nascimento nas telas de Listagem, Detalhe, Criação e Edição de cliente e use-o de acordo com a necessidade da tela.

________ _

## 6º Passo:

Faça um "Pull Request" das alterações para o repositório atual. [https://docs.github.com/pt/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork]




