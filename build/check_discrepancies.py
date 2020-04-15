import sys

input_csv = "../data/csv/deaths_by_region.csv"

def return_totals():
  with open(input_csv, 'r') as inputcsv:
    rows = [x.strip() for x in inputcsv.readlines()]
    header = rows[0]
    rows = rows[1:]
    total = 0
    for row in rows:
      vals = row.split(',')
      total += int( vals[4] )
    return total
