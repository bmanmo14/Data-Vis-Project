from csv import reader
import csv

R_PATH = "../data/religion/"
C_PATH = "../data/esg/"

relig_buckets = ["Christian", "Muslim", "New Age", "Hindu", "Buddhist", "Other"]
attrs = {'Literacy rate, adult total (% of people ages 15 and above)', 
         'Cause of death, by communicable diseases and maternal, prenatal and nutrition conditions (% of total)', 
         'Individuals using the Internet (% of population)', 
         'Electricity production from coal sources (% of total)',
         'GDP growth (annual %)', 
         'Renewable electricity output (% of total electricity output)', 
         'Population ages 65 and above (% of total population)', 
         'Children in employment, total (% of children ages 7-14)', 
         'School enrollment, primary and secondary (gross), gender parity index (GPI)', 
         'Fossil fuel energy consumption (% of total)', 
         'Proportion of seats held by women in national parliaments (%)', 
         'Government expenditure on education, total (% of government expenditure)', 
         'Poverty headcount ratio at national poverty lines (% of population)', 
         'Prevalence of overweight (% of adults)', 
         'Renewable energy consumption (% of total final energy consumption)', 
         'Unemployment, total (% of total labor force) (modeled ILO estimate)', 
         'Unmet need for contraception (% of married women ages 15-49)'}
START = 1978
END = 2018
YEARS = range(START, END - 1)

def parse(file_name):
    lines = []
    with open(file_name, encoding="utf-8") as f:
        for row in reader(f):
            lines.append(row)
    columnMap = {key : i for i, key in enumerate(lines[0])}
    return lines, columnMap

def get_bucket(parent_relig):
    if parent_relig in relig_buckets:
        return parent_relig
    else:
        return "Other"

r_lines, r_map = parse(R_PATH + "relig.csv")
c_lines, c_map = parse(C_PATH + "CountryData.csv")

def mean(l):
    return sum(l) / len(l)

def median(l):
    return sorted(l)[int(len(l) / 2)]

def mode(l):
    l = [int(v) for v in l]
    counts = {}
    highest = None
    highestCount = 0
    for v in l:
        if v not in counts:
            counts[v] = 1
        else:
            counts[v] += 1
        if counts[v] > highestCount:
            highest = v
            highestCount = counts[v]
    return highest

def pretty_dict(d):
    s = '{'
    for k, v in d.items():
        s += '{}: {}\n'.format(k, v)
    return s[:-1] + '}'

def calc_attr_metric_for_year_bucket(attr, metric_func, bucket, year):
    countries = set()
    year = str(year)
    for r in r_lines[1:]:
        if get_bucket(r[r_map["parent_religion"]]) == bucket and r[r_map["year"]] == year:
            countries.add(r[r_map["country_code"]])
    values = []
    for c in c_lines[1:]:
        if c[c_map["CountryCode"]] in countries and c[c_map["Indicator Name"]] == attr:
            v = c[c_map[year]]
            # v = 0 if v == "" else float(v)
            if v != '':
                values.append(float(v))
    return None if len(values) == 0 else round(metric_func(values))

def calc_metric(metric_func, attr):
    print("attr: {} --------------------------------------------------------------------".format(attr))
    values = {r : [0 for y in YEARS] for i, r in enumerate(relig_buckets)}
    for bucket in relig_buckets:
        for j, year in enumerate(YEARS):
            v = calc_attr_metric_for_year_bucket(attr, metric_func, bucket, year)
            values[bucket][j] = v
    print(pretty_dict(values), "\n")

def calc_metrics(metric_func):
    for attr in attrs:
        calc_metric(metric_func, attr)

# calc_metric(mean)
# calc_metric(median)
# calc_metric(mode)

# calc_metric(median, 'Fossil fuel energy consumption (% of total)')
for metric in [mean, median, mode]:
    calc_metric(metric, 'Renewable energy consumption (% of total final energy consumption)')