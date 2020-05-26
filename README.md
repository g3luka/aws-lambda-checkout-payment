<p align="center">Amazon Lambda Checkout com PicPay, MercadoPago e PagSeguro</p>

## Descrição

  Aplicação de captura de checkout de compra (via HTTP POST) e envio para pagamento usando os Gateways de pagamento PacPay, MercadoPago ou PagSeguro.
  Feita em NestJS usa o Serverless Framework para subir em uma Amazon Lambda.
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" /></a>

## Instalação

  Antes de tudo, preencha o arquivo correspondente ao ambiente que deseja rodar a aplicação em /config/serverless/stage/* com suas credenciais de cada serviço e dados de conexão com banco de dados e afins. Feito isso, execute os comandos abaixo.

```bash
$ yarn
```

## Deploy

  Depois da instação, já com o arquivo de configuração ambiente devidamente preenchido, execute abaixo:

```bash
# Deploy em homologação
# necessita /config/serverless/stage/stg.yml
$ yarn run deploy:stg

# Deploy em produção
# necessita /config/serverless/stage/prd.yml
$ yarn run deploy:prd
```

## Local

```bash
# Seta as variáveis de ambiente localmente
$ yarn run dotenv
# Executa a aplicação localmente na porta 3000
$ yarn run start
# ou com flag --watch
$ yarn run start:dev
# ou com flag --debug --watch
$ yarn run start:debug
```

## Suporte

  Se precisa se ajuda abra um [Issue](https://github.com/g3luka/aws-lambda-checkout-payment/issues) aqui no Github que responderei o mais rapidamente possível

## Licença

  Está aplicação é distribuída com a licença [MIT](LICENSE).
