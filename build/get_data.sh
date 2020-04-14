#! /bin/sh
mv ../data/csv/region.csv ../data/csv/region_old.csv
mv ../data/csv/today_by_region.csv ../data/csv/today_by_region_old.csv
wget https://free.entryscape.com/store/360/resource/15 -O "../data/csv/region.csv"
wget https://free.entryscape.com/store/360/resource/4 -O "../data/csv/today_by_region.csv"
wget https://raw.githubusercontent.com/elinlutz/gatsby-map/master/src/data/time_series/time_series_deaths-deaths.csv -O "../data/csv/today_region_elinlutz.csv"
python3 clean_data.py ../data/csv/region.csv ../data/js/covid-data.js
python3 fix_county_sheet.py
