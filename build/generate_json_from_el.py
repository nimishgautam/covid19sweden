import sys
import json

input_csv = "../data/csv/time_series_deaths-deaths.csv"

replacements = {
  "Jämtland Härjedalen": "Jämtland",
  "Sörmland":"Södermanland",
  "Kalmar län":"Kalmar"
}

def add_more_data(input_obj):
  if 'Antal_avlidna' not in input_obj:
    input_obj['Antal_avlidna'] = {}
  if 'Kumulativa_avlidna' not in input_obj:
    input_obj['Kumulativa_avlidna'] = {}

  with open(input_csv, 'r') as input_file:
    input_rows = [x.strip() for x in input_file.readlines()]
    #replacements
    for i in range(0, len(input_rows)):
      for j in replacements:
        input_rows[i] = input_rows[i].replace( j, replacements[j] )
    # zero until 03-06 for intensive care, drop dates until then.
    headers = input_rows[0]
    start_date_idx = 15
    # this will include today
    end_date_idx = headers.count(',') - 2

    sweden_daily = []
    sweden_cumulative = []
    for i in range(start_date_idx, end_date_idx):
      sweden_daily.append("0")
      sweden_cumulative.append("0")

    for row in input_rows[1:22]:
      row_vals = row.split(',')
      region_name = row_vals[1]
      region_data = row_vals[start_date_idx:end_date_idx]
      input_obj['Antal_avlidna'][region_name] = region_data
      
      for i in range(0, len(sweden_daily)):
        swe_daily_int = int(region_data[i]) + int(sweden_daily[i])
        sweden_daily[i] = str(swe_daily_int)

      cumulative_data = []
      cumulative_total = 0
      for val in region_data:
        cumulative_data.append( str( cumulative_total + int(val) ))
        cumulative_total += int(val)
      input_obj['Kumulativa_avlidna'][region_name] = cumulative_data
      
      for i in range(0, len(sweden_cumulative)):
        swe_cumulative_int = int(cumulative_data[i]) + int(sweden_cumulative[i])
        sweden_cumulative[i] = str( swe_cumulative_int )
    input_obj['Antal_avlidna']['Sweden (regional)'] = sweden_daily
    input_obj['Kumulativa_avlidna']['Sweden (regional)'] = sweden_cumulative

if __name__ == "__main__":
  input_obj = {}
  add_more_data(input_obj)
  print(input_obj)

    
