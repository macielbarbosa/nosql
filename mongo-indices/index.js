const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const timer = require('execution-time')()

const URL = 'mongodb://localhost:27017'
const DB_NAME = 'mongo-indices'

const gerarNumero = () => Math.floor(Math.random() * 101)
const exibirTempo = resultado => { console.log(resultado.words) }

const agruparDados = (dados, {quantidade}) => {
  const dadosAgrupados = []
  let posicaoInicial = 0
  quantidadeGrupos = Math.ceil(dados.length/quantidade)
  while (quantidadeGrupos--) {
    const grupo = dados.slice(posicaoInicial, posicaoInicial + quantidade)
    dadosAgrupados.push(grupo)
    posicaoInicial += quantidade
  }
  return dadosAgrupados
}

const inserirDados = db => {
  const documentos = Array.from({length: 10000000}, () => ({
    val1: gerarNumero(), val2: gerarNumero()
  }))
  const documentosAgrupados = agruparDados(documentos, {quantidade: 4})
  //const collection = db.collection()
}

medirTempoExecucao = (func, nome) => {
  timer.start(nome)
  func()
  console.log(`'${nome}' executado em: ${timer.stop(nome).words}`)
}
 
const app = (err, client) => {
  if(err) {
    console.log('Erro ao conectar ao servidor')
    return
  }
  console.log("Conectado ao servidor")

  const db = client.db(DB_NAME)
  medirTempoExecucao(() => { inserirDados(db)}, 'Inserção de dados')
  
  client.close()
}

MongoClient.connect(URL, app)