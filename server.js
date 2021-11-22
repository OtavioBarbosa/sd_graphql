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
    const {nome, curso, semestre, ra, cpf, cidade} = argumentos.campos
    let aluno = {
        nome: nome,
        curso: curso,
        semestre: semestre,
        ra: ra,
        cpf: cpf,
        cidade: cidade
    }
    alunos.push(aluno)
    return getAluno({ra: ra})
}

const alterarAluno = (argumentos) => {
    const {nome, curso, semestre, ra, cpf, cidade} = argumentos.campos
    let aluno = alunos.find(a => a.ra === argumentos.ra)
    aluno.nome = nome ? nome : aluno.nome,
    aluno.curso = curso ? curso : aluno.curso,
    aluno.semestre = semestre ? semestre : aluno.semestre,
    aluno.ra = ra ? ra : aluno.ra,
    aluno.cpf = cpf ? cpf : aluno.cpf,
    aluno.cidade = cidade ? cidade : aluno.cidade
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