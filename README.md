# EvolutionFit

Aplicação web desenvolvida como Trabalho de Conclusão de Curso de Sistemas de Informação da Universidade de Franca (Unifran).

O sistema permite gerenciar alunos, exercícios, treinos, agendamentos, avaliações físicas e histórico de cargas, com acesso separado para aluno e personal.

**Autor:** Fernando Moreno Silva  
**Orientador:** Renato Rocha

## Tecnologias utilizadas

- Frontend: React, Vite e Tailwind CSS.
- Comunicação com a API: Axios.
- Ícones: Lucide React e React Icons.
- Gráficos: Recharts.
- Backend: Node.js e Express.
- Banco de dados: MySQL.
- Acesso ao banco: Sequelize e mysql2.
- Autenticação: JSON Web Token (JWT).
- Proteção de senhas: bcrypt.
- Configuração: dotenv.
- Logs: Winston.
- Reinicialização durante o desenvolvimento: nodemon.

## Organização do projeto

- `backend/`: API, rotas, controllers, middlewares e models.
- `frontend/`: interface web e componentes React.
- `sql/academia_estrutura.sql`: estrutura do banco de dados, sem registros de usuários.
- `README.md`: instruções de instalação e execução.

## Pré-requisitos

Ambiente utilizado no desenvolvimento e nos testes:

- Node.js 24.18.0 e npm.
- MySQL Server 8.0.46.
- MySQL Workbench para administrar e importar o banco.
- Navegador web.
- Git, caso o projeto seja obtido por clonagem.

O serviço do MySQL deve estar em execução antes de iniciar a API.

## Instalação

Baixe ou clone o repositório e abra a pasta principal `projetoTCC` no terminal.

Instale as dependências do backend:

```bash
cd backend
npm install
```

Depois, instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

As dependências de cada parte estão declaradas nos respectivos arquivos `package.json`.

## Criação do banco de dados

O arquivo `sql/academia_estrutura.sql` contém a criação do banco `academia` e das seguintes tabelas:

- `usuarios`
- `exercicios`
- `treinos`
- `treino_exercicios`
- `agenda_treinos`
- `historico_cargas`
- `avaliacoes`

Para uma instalação inicial:

1. Abra uma conexão com o MySQL no Workbench.
2. Acesse **File → Open SQL Script**.
3. Selecione `sql/academia_estrutura.sql`.
4. Execute o script completo.
5. Atualize a lista de schemas e confira o banco `academia`.

**Atenção:** o script contém comandos `DROP TABLE` que apagam e recriam as tabelas. Utilize-o somente em uma instalação inicial, sem dados que precisem ser preservados. Não o execute novamente no banco utilizado pela aplicação.

Para testar uma instalação do zero preservando os dados existentes, utilize uma instância separada do MySQL ou adapte previamente o script e a configuração para um banco de teste.

A importação cria somente a estrutura. Alunos, treinos, exercícios e demais registros devem ser cadastrados depois.

## Configuração do backend

Crie um arquivo chamado `.env` dentro da pasta `backend`:

```env
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=academia
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=substitua_por_uma_chave_aleatoria
```

Configure `DB_USER` e `DB_PASS` com as credenciais do seu MySQL.

A conexão atual utiliza a porta padrão do MySQL: `3306`.

Para gerar uma chave aleatória para `JWT_SECRET`, execute:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para o valor de `JWT_SECRET` no seu `.env`.

Os valores acima são exemplos. O arquivo `.env` com as credenciais reais e a chave JWT não deve ser publicado no repositório.

## Execução do backend

Em um terminal aberto na pasta principal do projeto, execute:

```bash
cd backend
npm start
```

A API é utilizada pelo frontend no endereço:

```text
http://localhost:5000
```

Confira no terminal a inicialização do servidor e a mensagem `DB Connected`, que indica a conexão com o MySQL.

Mantenha esse terminal aberto enquanto utilizar o sistema.

## Execução do frontend

Abra outro terminal na pasta principal do projeto:

```bash
cd frontend
npm run dev
```

Abra no navegador o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

O frontend está configurado para acessar a API em `http://localhost:5000`. Para utilizar outro endereço, é necessário ajustar as chamadas à API.

## Primeiro acesso

A estrutura SQL não inclui contas nem senhas prontas.

Cadastre uma conta pela interface de cadastro. O cadastro público cria exclusivamente usuários com o perfil `aluno`.

Para preparar a primeira conta de personal em uma instalação local, cadastre primeiro uma conta com um e-mail sob seu controle. Depois, o responsável pelo banco deve executar no Workbench:

```sql
USE academia;

UPDATE usuarios
SET tipo_usuario = 'personal'
WHERE email = 'email_da_conta_que_voce_cadastrou';
```

Substitua o e-mail do exemplo pelo e-mail exato da conta cadastrada.

Se estiver utilizando um banco de teste com outro nome, ajuste também o comando `USE`.

Saia da aplicação, caso esteja conectado, e faça login novamente.

Essa configuração inicial é realizada diretamente pelo responsável pelo banco. O cadastro público não permite escolher o perfil de personal.

## Perfis de acesso

### Personal

Permite gerenciar alunos, exercícios, treinos, agendamentos e avaliações, conforme as permissões das rotas da API.

### Aluno

Permite consultar seus treinos e informações pessoais, registrar cargas e concluir os próprios agendamentos, conforme as permissões das rotas da API.

As rotas protegidas verificam o token JWT e as permissões no backend. Alterar informações armazenadas no navegador não concede autorização na API.

## Medidas e cálculo do IMC

No cadastro e na edição de alunos e de avaliações físicas:

- Peso em quilogramas, com até duas casas decimais.
- Altura em centímetros inteiros: por exemplo, `175`.
- Altura aceita pela aplicação entre 50 e 300 centímetros.
- IMC calculado com a altura convertida para metros.

Exemplo de conversão:

```text
175 cm / 100 = 1,75 m
```

A fórmula utilizada é:

```text
IMC = peso / (altura_em_metros × altura_em_metros)
```

Os campos de peso e IMC utilizam duas casas decimais. A carga dos exercícios na tabela `historico_cargas` utiliza números inteiros.

## Finalização de treinos

A interface envia o identificador do agendamento e as cargas informadas em uma única requisição para a API.

O backend verifica a autorização do usuário, o estado do agendamento, os exercícios vinculados ao treino e a validade das cargas.

O registro das cargas e a alteração do agendamento para `concluido` são realizados na mesma transação do banco de dados:

- Se todas as etapas forem concluídas, a transação é confirmada.
- Se ocorrer uma falha antes da confirmação, as alterações da transação são desfeitas.
- Uma tentativa de finalizar novamente um agendamento já concluído é recusada.

As cargas devem ser números inteiros positivos.

Se a interface informar que não foi possível confirmar a finalização, consulte o status em **Meu Treino** antes de tentar novamente. A ausência de resposta pode ocorrer mesmo quando o servidor já processou a requisição.

## Comandos adicionais do frontend

Execute os comandos abaixo dentro da pasta `frontend`.

Gerar a versão de produção:

```bash
npm run build
```

Visualizar localmente a versão gerada:

```bash
npm run preview
```

Executar a análise estática:

```bash
npm run lint
```

O comando `preview` serve para conferir o build localmente. A API e o MySQL continuam necessários.

O build validado apresentou um aviso sobre o tamanho do arquivo JavaScript gerado. Esse aviso não impediu a conclusão do build e indica uma possibilidade futura de otimização.

## Validação

Foram realizados testes manuais de integração entre a interface, a API e o MySQL, incluindo:

- Login com credenciais válidas e inválidas.
- Restrições de acesso por perfil e por usuário.
- Cadastro, consulta, edição e exclusão nos módulos principais.
- Registro de cargas.
- Conclusão de agendamentos e recusa de repetição.
- Persistência de medidas e cálculo do IMC.
- Conferência dos gráficos com registros consultados no MySQL.
- Responsividade nos tamanhos de tela selecionados.
- Falhas de comunicação durante a finalização de treinos.
- Rollback após falha controlada dentro da transação.
- Recuperação após a remoção da falha controlada.

As evidências, os dados utilizados e os limites dos testes são registrados na documentação do TCC.

Na última verificação do frontend:

- `npm run build`: concluído com sucesso, com aviso sobre tamanho de chunk.
- `npm run lint`: concluído sem avisos e sem erros.

Essas verificações não substituem os testes manuais nem comprovam o funcionamento de todos os cenários possíveis.

O script `npm test` do backend ainda é o comando padrão de aviso e não executa uma suíte automatizada.

## Criação e evolução do projeto

O projeto começou com HTML, CSS e JavaScript e evoluiu para uma arquitetura com frontend React e API Node.js.

A interface utiliza Vite, com o template React. O backend utiliza módulos JavaScript, Express e Sequelize para integrar as funcionalidades ao MySQL.

Para executar a versão existente, utilize os arquivos deste repositório e siga as etapas de instalação. Não é necessário criar novamente um projeto Vite.

## Problemas comuns

### Erro de conexão com o banco

Confira:

- Se o serviço MySQL está em execução.
- Se a estrutura SQL foi importada.
- Se as variáveis do arquivo `backend/.env` estão corretas.
- Se o MySQL está acessível na porta `3306`.

### Frontend não consegue acessar a API

Confira se o backend está em execução em `http://localhost:5000`.

Se estiver utilizando o bloqueio de requisições do DevTools para testes, desative as regras de bloqueio antes de voltar ao uso normal.

### Falha de autenticação

Faça login novamente. As rotas protegidas exigem um token válido.

### Erro ao finalizar treino

Confira:

- Se o backend e o MySQL estão em execução.
- Se o agendamento ainda está pendente.
- Se as cargas são números inteiros positivos.
- Se não existem regras de bloqueio de requisições ativas no DevTools.

Se a mensagem indicar que não foi possível confirmar a finalização, consulte o status em **Meu Treino** antes de repetir a operação.

### Alterações no arquivo .env

Reinicie o backend para carregar a nova configuração.

## Finalidade acadêmica

Projeto desenvolvido para demonstrar a integração entre interface web, API, autenticação, regras de acesso e banco de dados relacional.

Os resultados apresentados correspondem ao ambiente e aos cenários registrados na documentação do TCC.