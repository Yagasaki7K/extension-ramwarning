#!/bin/bash
# Script simples para automatizar git pull, add, commit e push com comentário interativo.

# Pede o comentário do commit
read -p "Digite o comentário do commit: " comment

# Executa a sequência de comandos Git
git pull
git add .
git commit -am "$comment"
git push
