#! /bin/sh
wget https://ihmecovid19storage.blob.core.windows.net/latest/ihme-covid19.zip -O "../data/tmp/ihme-covid19.zip"
cd ../data/tmp/
for D in `find . -type d`
do
    mv $D/*.csv ../csv/
done

echo "the tmp directory can be manually emptied now if needed"

