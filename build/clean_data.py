import sys
import json
import datetime
from generate_json_from_el import add_more_data
from check_discrepancies import return_totals

#column names to keep
keep_cols = ['Antal_avlidna',
             'Kumulativa_avlidna',
             'Antal_intensivvardade',
             'Kumulativa_intensivvardade',
             'Statistikdatum']

def check_for_today(json_obj):
  today = datetime.date.today().strftime("%m-%d")
  latest_day = json_obj['Statistikdatum'][-1]
  # sometimes the latest day isn't included. If so, duplicate the cumulative values
  # and set the rest to zero
  if latest_day != today:
    for col in keep_cols:
      if col == 'Statistikdatum':
        json_obj['Statistikdatum'].append(today)
      elif col.startswith('Kumulativa'):
        json_obj[col]['Sweden (official)'].append( json_obj[col]['Sweden (official)'][-1] )
      else:
        json_obj[col]['Sweden (official)'].append("0")

def add_discrepancy_set(json_obj):
  total = return_totals()
  claimed_total = int(json_obj['Kumulativa_avlidna']['Sweden (official)'][-1])
  if total > claimed_total:
    json_obj['Kumulativa_avlidna']['(discrepancy)'] = json_obj['Kumulativa_avlidna']['Sweden (official)'].copy()
    json_obj['Kumulativa_avlidna']['(discrepancy)'][-1] = str(total)

def csv_to_JSON(csvfile, droprows=0):
  json_obj = {}
  # drop the last 'droprows' number of rows, since they're very small values
  droprows = 0 - droprows
  with open(csvfile) as csvfilehandle:
    rows = [x.strip() for x in csvfilehandle.readlines()]
    rows = rows[:droprows]
    header = rows[0].split(',')
    rows = rows[1:]
    for header_val in header:
      json_obj[header_val] = []
    for row in rows:
      rowvals = row.split(',')
      idx = 0
      for header_val in header:
        val = rowvals[idx]
        # index 27 is the date in the form YYYY-MM-DD, making it MM-DD for readability
        if idx == 27:
          val = val[5:]
        json_obj[header_val].insert(0, val )
        idx+=1
  return json_obj

def final_enriched_json(csvfile):
  # first 29 days arbitrarily dropped since they're low
  csv_obj = csv_to_JSON(csvfile, 31)
  final_json_obj = {}
  # copy only the columns in keep_cols for the final JSON object
  for col in keep_cols:
    if col == 'Statistikdatum':
      final_json_obj[col] = csv_obj[col]
    else:
      final_json_obj[col] = {}
      final_json_obj[col]["Sweden (official)"] = csv_obj[col]
  check_for_today(final_json_obj)
  add_more_data(final_json_obj)
  add_discrepancy_set(final_json_obj)
  return final_json_obj

  json_str = json.dumps( final_json_obj )
  # Saves an async call if it's a valid JS file
  js_file = "var covid_data = " + json_str + ";"
  f = open(sys.argv[2], "w")
  f.write(js_file)
  f.close()

# python3 <filename> <csvfile> <outputfile>
if __name__ == "__main__":
  
  final_json_obj = final_enriched_json( sys.argv[1] )

  json_str = json.dumps( final_json_obj )
  # Saves an async call if it's a valid JS file
  js_file = "var covid_data = " + json_str + ";"
  f = open(sys.argv[2], "w")
  f.write(js_file)
  f.close()

