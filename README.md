# Diagnóstico LED CCD

Guia interativo para diagnosticar a válvula de freio ECP (CCD) dos carros de passageiros pelos LEDs **PWR**, **COM**, **BRK** e **FLT**. Abre com um autoteste animado dos LEDs, funciona off-line e pode ser instalado como aplicativo. Depois de aberto uma vez com internet, o app fica salvo no aparelho.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `diagnostico-led-ccd`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No repositório, abra **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
5. Depois de alguns minutos o app estará em `https://SEU-USUARIO.github.io/diagnostico-led-ccd/`.

## Instalar

- **Android / Chrome:** abra o endereço e toque em **Instalar app** (ou menu ⋮ → *Adicionar à tela inicial*).
- **iPhone / Safari:** botão Compartilhar → *Adicionar à Tela de Início*.
- **Computador (Chrome/Edge):** ícone de instalação na barra de endereço.

## Atualizar

Ao modificar algum arquivo, aumente a versão em `sw.js` (`led-ccd-v3` → `led-ccd-v4`) para que os aparelhos recebam a nova versão.
