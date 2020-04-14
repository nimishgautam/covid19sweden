import sys
import json
from generate_json_from_el import add_more_data

#column names to keep
keep_cols = ['Antal_avlidna',
	     'Kumulativa_avlidna',
	     'Antal_intensivvardade',
	     'Kumulativa_intensivvardade',
	     'Statistikdatum']

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

# python3 <filename> <csvfile> <outputfile>
if __name__ == "__main__":
  csvfile = sys.argv[1]
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
  add_more_data(final_json_obj)
  json_str = json.dumps( final_json_obj )
  # Saves an async call if it's a valid JS file
  js_file = "var covid_data = " + json_str + ";"
  f = open(sys.argv[2], "w")
  f.write(js_file)
  f.close()

