#!/bin/sh
cd /home/pi/Desktop/tpt/TPTBlockchain
git up
ng build --prod --base-href /TPTBlockchain/
rm -rf /var/www/html/TPTBlockchain/
cp -r ./dist/TPTBlockchain /var/www/html/
cp .htaccess /var/www/html/TPTBlockchain
