#!/bin/sh
now=$(date +"%T")
START=$(date +%s)
echo $now START UPDATE
cd /home/tptblockchain/Desktop/TPTBlockchain
git pull
npm install
/home/tptblockchain/Desktop/TPTBlockchain/node_modules/@angular/cli/bin/ng build --prod --base-href /TPTBlockchain/
rm -rf /var/www/html/TPTBlockchain/*
cp -r ./dist/TPTBlockchain /var/www/html/
cp .htaccess /var/www/html/TPTBlockchain
cd NodeServer
/usr/local/lib/node_modules/forever/bin/forever stop index.js
npm install
/usr/local/lib/node_modules/forever/bin/forever start index.js
now=$(date +"%T")
END=$(date +%s)
DIFF=$(( $END - $START ))
echo $now END UPDATE
echo "The UPDATE TOOK $(($DIFF / 60)) minutes and $(($DIFF % 60)) seconds!"
