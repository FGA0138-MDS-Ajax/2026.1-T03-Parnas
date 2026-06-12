# Documentação - Upload de Foto no Chamado

Esta documentação descreve a regra de upload de foto durante a criação de chamados no sistema Keep UnB.

## Objetivo

Permitir que o solicitante anexe uma foto ao chamado, com o objetivo de complementar a descrição do problema por meio de uma evidência visual.

A imagem fica associada ao chamado criado e pode ser consultada posteriormente por usuários autorizados.

## Quando a foto pode ser adicionada

A foto pode ser adicionada no momento de criação do chamado.

Para isso, a requisição deve ser enviada no formato `multipart/form-data`, contendo os dados textuais do chamado e, opcionalmente, o arquivo de imagem.

Os campos enviados na criação do chamado são:

- `local`
- `tipo_manutencao`
- `descricao`
- `photo`

O campo responsável pelo envio da imagem é `photo`.

## Obrigatoriedade da foto

O envio da foto é opcional.

Isso significa que o solicitante pode criar um chamado normalmente mesmo sem anexar uma imagem. Caso a foto seja enviada, o backend realiza as validações de formato, tipo de conteúdo e tamanho antes de salvar o arquivo.

## Formatos aceitos

O sistema aceita apenas arquivos de imagem nos seguintes formatos:

- `.jpg`
- `.jpeg`
- `.png`

Além da extensão do arquivo, também é validado o tipo de conteúdo da imagem.

Os tipos aceitos são:

- `image/jpeg`
- `image/png`

Caso o arquivo enviado não esteja em um dos formatos permitidos, o sistema retorna erro `400 Bad Request`.

## Tamanho máximo permitido

O tamanho máximo permitido para a foto é de **10 MB**.

Esse limite é definido no backend por meio da constante:

```python
MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024