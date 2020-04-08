import sys

input_csv = "../data/csv/today_by_region.csv"
add_csv = "../data/csv/county-populations.csv"
output_csv = "../data/csv/deaths_by_region.csv"

replacements = {
  "Jämtland Härjedalen": "Jämtland",
  "Sörmland":"Södermanland"
}


def getAddObj():
  addObj = {}
  with open(add_csv,'r') as add_file:
    add_rows = [x.strip() for x in add_file.readlines()]
    header = add_rows[0]
    add_rows = add_rows[1:]
    headers = header.split(',')
    addObj['_headers'] = headers[1:]
    for row in add_rows:
      row_entries = row.split(',')
      area_name = row_entries[0]
      if area_name not in addObj:
        addObj[area_name] = {}
      for i in range(1, len(headers)):
        addObj[area_name][ headers[i] ] = row_entries[i]
  return addObj



if __name__ == "__main__":
  finalCsv = []
  with open(input_csv, 'r') as input_file:
    input_rows = [x.strip() for x in input_file.readlines()]
    #replacements
    for i in range(0, len(input_rows)):
      for j in replacements:
        input_rows[i] = input_rows[i].replace( j, replacements[j] )
    addObj = getAddObj()
    
    finalCsvHeaders = input_rows[0]
    for header in addObj['_headers']:
      finalCsvHeaders += "," + header
    finalCsv.append(finalCsvHeaders)

    for row in input_rows[1:]:
      finalRow = row
      row_bits = row.split(',')
      row_name = row_bits[0]
      for entry in addObj['_headers']:
        finalRow += "," + addObj[row_name][entry]
      finalCsv.append(finalRow)
  with open(output_csv, 'w') as outfile:
    for x in finalCsv:
      outfile.write( x + "\n" )
