var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')

var schema = buildSchema(`
    type Query {
        alunos: [Aluno]
        aluno(ra: Int!): Aluno
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
        nome: "Otávio",
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

var root = { 
    alunos: getAlunos,
    aluno: getAluno
}

var app = express()

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('API GRAPHQL'))