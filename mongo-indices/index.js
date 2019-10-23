const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const timer = require('execution-time')()

const URL = 'mongodb://localhost:27017'
const DB_NAME = 'mongo-indices'

const gerarNumero = () => Math.floor(Math.random() * 101)

const agruparDados = (dados, { quantidadePorGrupo }) => {
  const dadosAgrupados = []
  let posicaoInicial = 0
  quantidadeGrupos = Math.ceil(dados.length/quantidadePorGrupo)
  while (quantidadeGrupos--) {
    const grupo = dados.slice(posicaoInicial, posicaoInicial + quantidadePorGrupo)
    dadosAgrupados.push(grupo)
    posicaoInicial += quantidadePorGrupo
  }
  return dadosAgrupados
}

const insertMany = (documentos, collection) => new Promise((resolve, reject) => {
  collection.insertMany(documentos, erro => {
    if (erro) reject(erro)
    resolve()
  })
})

const inserirDados = async (dados, collection) => {
  for(grupo of dados) {
    await insertMany(grupo, collection)
  }
}

const gerarDados = quantidade => {
  const documentos = Array.from({length: quantidade}, () => ({
    val1: gerarNumero(), val2: gerarNumero()
  }))
  return agruparDados(documentos, { quantidadePorGrupo: 10000 })
}

const medirTempoExecucao = async (funcao, nome) => {
  console.log(`Iniciando '${nome}' ...`)
  timer.start(nome)
  await funcao()
  console.log('---------------------------------------------------------')
  console.log(`'${nome}' executado em ${timer.stop(nome).words}`)
  console.log('---------------------------------------------------------')
}
 
const app = async (err, client) => {
  if(err) {
    console.log('Erro ao conectar ao servidor')
    return
  }
  console.log("Conectado ao servidor")

  const db = client.db(DB_NAME)
  const collection = db.collection('documentos')
  console.log('Gerando dados ...')
  const dados = gerarDados(1000000)

  await medirTempoExecucao(() => inserirDados(dados, collection), 'Inserção de dados sem indexação')
  // await medirTempoExecucao(() => inserirDados(dados, collection), 'Consulta por valores em val1 entre 0 e 10')

  console.log('Apagando todos os documentos ...')
  db.collection('documentos').drop()
  
  client.close()
}

MongoClient.connect(URL, app)