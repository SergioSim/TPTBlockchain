#!/bin/sh
cd /home/tptblockchain/Desktop/TPTBlockchain
git pull
npm install
ng build --prod --base-href /TPTBlockchain/
rm -rf /var/www/html/TPTBlockchain/*
cp -r ./dist/TPTBlockchain /var/www/html/
cp .htaccess /var/www/html/TPTBlockchain
cd NodeServer
forever stop index.js
npm install
forever start index.js
