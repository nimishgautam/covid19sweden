import json
from clean_data import final_enriched_json

input_csv = "../data/csv/region.csv"
input_model_csv = "../data/csv/Hospitalization_all_locs.csv"
output_js = "../data/js/covid-data.js"

def get_full_prediction_series(daily_json):
  prediction_json = {}
  yesterday = daily_json['Statistikdatum'][-2]
  prediction_json[ 'dates' ] = daily_json['Statistikdatum'][:-1].copy()

  prediction_json['d_mean'] = daily_json['Antal_avlidna']['Sweden (official)'][:-1].copy()
  prediction_json['d_lower'] = daily_json['Antal_avlidna']['Sweden (official)'][:-1].copy()
  prediction_json['d_upper'] = daily_json['Antal_avlidna']['Sweden (official)'][:-1].copy()

  prediction_json['t_mean'] = daily_json['Kumulativa_avlidna']['Sweden (official)'][:-1].copy()
  prediction_json['t_lower'] = daily_json['Kumulativa_avlidna']['Sweden (official)'][:-1].copy()
  prediction_json['t_upper'] = daily_json['Kumulativa_avlidna']['Sweden (official)'][:-1].copy()

  with open(input_model_csv) as model_file:
    rows = [x.strip() for x in model_file.readlines()]
    headers = rows[0].split(',')
    
    d_mean = headers.index('"deaths_mean"')
    d_lower = headers.index('"deaths_lower"')
    d_upper = headers.index('"deaths_upper"')

    t_mean = headers.index('"totdea_mean"')
    t_lower = headers.index('"totdea_lower"')
    t_upper = headers.index('"totdea_upper"')

    loc_idx = headers.index('"location_name"')
    date_idx = headers.index('"date"')

    rows = rows[1:]
    for row in rows:
      entries = row.split(',')
      country = entries[loc_idx].strip()
      if country != '"Sweden"':
        continue
      date = entries[date_idx].strip()[6:11]
      if date <= yesterday:
        continue
      prediction_json['dates'].append(date)
      
      prediction_json['d_mean'].append( entries[d_mean] )
      prediction_json['d_lower'].append( entries[d_lower] )
      prediction_json['d_upper'].append( entries[d_upper] )

      prediction_json['t_mean'].append( entries[t_mean] )
      prediction_json['t_upper'].append( entries[t_upper] )
      prediction_json['t_lower'].append( entries[t_lower] )
  
  return prediction_json

if __name__ == "__main__":
  daily_json = final_enriched_json( input_csv )
  prediction_json = get_full_prediction_series( daily_json )
  json_str = json.dumps( prediction_json )
  js_str = "var covid_prediction = " + json_str + ";"
  f = open(output_js, 'a')
  f.write(js_str)
  f.close()
  # use prediction for today onwards, but historic data for yesterday and before

