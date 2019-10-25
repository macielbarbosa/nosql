const MongoClient = require('mongodb').MongoClient
const timer = require('execution-time')()

const URL = 'mongodb://localhost:27017'
const DB_NAME = 'mongo-indices'
var collection

const gerarNumero = () => Math.floor(Math.random() * 101)

const apagarColecao = () => new Promise((resolve, reject) => {
  console.log('Apagando todos os documentos ...')
  collection.drop({}, erro=> {
    if(erro) reject(erro)
    resolve()
  })
})

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

const insertMany = (documentos) => new Promise((resolve, reject) => {
  collection.insertMany(documentos, erro => {
    if (erro) reject(erro)
    resolve()
  })
})

const inserirDados = dados => async () => {
  for(grupo of dados) {
    await insertMany(grupo)
  }
}

const gerarDados = quantidade => {
  console.log(`Gerando ${quantidade} dados ...\n`)
  const documentos = Array.from({length: quantidade}, () => ({
    val1: gerarNumero(), val2: gerarNumero()
  }))
  return agruparDados(documentos, { quantidadePorGrupo: 10000 })
}

const medirTempoExecucao = async (funcao, nome) => {
  console.log(`Iniciando '${nome}' ...`)
  timer.start(nome)
  await funcao()
  console.log(`-> '${nome}' executado em ${timer.stop(nome).words}\n`)
}

const consultar = (projecao = false) => () => new Promise((resolve, reject) => {
  const options = projecao ? {projection: {val1: 1, _id: 0}} : {} 
  collection.find({val1: { $gte:0, $lte:10 }}, options).toArray((erro, resultado) => {
    if (erro) {
      reject(erro)
    }
    resolve()
  })
})

const criarIndice = () => new Promise((resolve, reject) => {
  console.log('Criando índice ...')
  collection.createIndex('val1', {}, erro => {
    if (erro) reject(erro)
    resolve()
  })
})

const app = async (err, client) => {
  try {
    if(err) {
      console.log('Erro ao conectar ao servidor')
      return
    }
    console.log("Conectado ao servidor\n")
    
    const db = client.db(DB_NAME)
    collection = db.collection('documentos')

    const dados = gerarDados(4000000)
    
    await medirTempoExecucao(inserirDados(dados), 'Inserção de dados sem indexação')
    await medirTempoExecucao(consultar(), 'Consulta sem indexação')
    
    await criarIndice()
    await medirTempoExecucao(consultar(), 'Consulta com indexação')
    
    await medirTempoExecucao(consultar(true), 'Consulta com indexação e projeção')
    
    await apagarColecao()
    await criarIndice()
    await medirTempoExecucao(inserirDados(dados), 'Inserção de dados com indexação')

    await apagarColecao()
  } catch (erro) {
    console.error(erro)
  } finally {
    client.close()
  }
}

MongoClient.connect(URL, app)