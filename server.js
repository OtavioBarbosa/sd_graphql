var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')

var schema = buildSchema(`
    input AlunoCampos {
        nome: String!
        curso: String
        semestre: Int
        ra: Int!
        cpf: Float
        cidade: String
    }
    type Query {
        alunos: [Aluno]
        aluno(ra: Int!): Aluno
    },
    type Mutation {
        inserirAluno(
            campos: AlunoCampos
        ): Aluno
        alterarAluno(
            ra: Int!
            campos: AlunoCampos
        ): Aluno,
        excluirAluno(ra: Int!): Aluno
    },
    type Aluno {
        nome: String
        curso: String
        semestre: Int
        ra: Int
        cpf: Float
        cidade: String
    }
`);

var alunos = [
    {
        nome: "João Pedro",
        curso: "Ciência da Computação",
        semestre: 8,
        ra: 579610,
        cpf: 12345678902,
        cidade: "Marília"
    },
    {
        nome: "João Victor",
        curso: "Ciência da Computação",
        semestre: 8,
        ra: 579211,
        cpf: 12345678903,
        cidade: "Marília"
    },
    {
        nome: "Marcos Vinicius",
        curso: "Ciência da Computação",
        semestre: 8,
        ra: 580678,
        cpf: 12345678904,
        cidade: "Marília"
    },
    {
        nome: "Otávio Barbosa",
        curso: "Ciência da Computação",
        semestre: 8,
        ra: 577359,
        cpf: 12345678901,
        cidade: "Marília"
    }
]

const getAlunos = () => {
    return alunos
}

const getAluno = (argumentos) => {
    return alunos.find(a => a.ra === argumentos.ra)
}

const inserirAluno = (argumentos) => {
    let aluno = {
        nome: argumentos.campos.nome,
        curso: argumentos.campos.curso,
        semestre: argumentos.campos.semestre,
        ra: argumentos.campos.ra,
        cpf: argumentos.campos.cpf,
        cidade: argumentos.campos.cidade
    }
    alunos.push(aluno)
    return getAluno({ra: argumentos.campos.ra})
}

const alterarAluno = (argumentos) => {
    let aluno = alunos.find(a => a.ra === argumentos.ra)
    aluno.nome = argumentos.campos.nome ? argumentos.campos.nome : aluno.nome,
    aluno.curso = argumentos.campos.curso ? argumentos.campos.curso : aluno.curso,
    aluno.semestre = argumentos.campos.semestre ? argumentos.campos.semestre : aluno.semestre,
    aluno.ra = argumentos.campos.ra ? argumentos.campos.ra : aluno.ra,
    aluno.cpf = argumentos.campos.cpf ? argumentos.campos.cpf : aluno.cpf,
    aluno.cidade = argumentos.campos.cidade ? argumentos.campos.cidade : aluno.cidade
    return getAluno({ra: argumentos.ra})
}

const excluirAluno = (argumentos) => {
    let indice = alunos.map(a => a.ra).indexOf(argumentos.ra)
    let aluno = indice !== null ? alunos.splice(indice, 1) : null
    return aluno[0]
}

var root = { 
    alunos: getAlunos,
    aluno: getAluno,
    inserirAluno: inserirAluno,
    alterarAluno: alterarAluno,
    excluirAluno: excluirAluno
}

var app = express()

app.use('/sd_graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('API GRAPHQL'))