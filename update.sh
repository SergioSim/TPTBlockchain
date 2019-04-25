#!/bin/sh
cd /home/pi/Desktop/tpt/TPTBlockchain
git up
npm install
ng build --prod --base-href /TPTBlockchain/
rm -rf /var/www/html/TPTBlockchain/
cp -r ./dist/TPTBlockchain /var/www/html/
cp .htaccess /var/www/html/TPTBlockchain
cd NodeServer
forever stop /home/pi/Desktop/tpt/TPTBlockchain/NodeServer/index.js
npm install
forever start /home/pi/Desktop/tpt/TPTBlockchain/NodeServer/index.js
