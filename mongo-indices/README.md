Desenvolva um pequeno programa que crie documentos e salve em uma coleção e siga os seguintes pontos:
* O documento deve possuir dois campos (val1 e val2) numéricos com valores aleatórios de 0 a 100.
* Gere e insira pelo menos 1 milhão de documentos (meça o tempo de inserção total)
* Realize uma consulta por valores em val1 entre 0 e 10 e meça o tempo.
* Crie um indice pelo campo val1
* Repita a consulta anterior medindo o tempo. O que ocorre?
* Agora repita a consulta anterior retornando apenas o campo val1 (utilize projeção para remover o _id e val2). O que ocorre?
* Insira mais 1 milhão de registros e meça o tempo de inserção comparando com o valor obtido antes do índice.
