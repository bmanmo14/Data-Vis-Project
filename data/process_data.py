import pandas as pd
'''
CountryData:
    Country Full Name - CountryName
    Country - CountryCode
    Topic - ESGSeries - Topic
    Description - ESGSeries Longdefinition
    Attribute - SeriesCode
    Year
ReligionData:
    Country - ABBREV
    Leader - XCFULLNAME
    Religion - XCRNAME
    Year - FIRSTYEAR and LASTYEAR
'''
INDICATOR_NAMES = {
    "EG.ELC.COAL.ZS": "Electricity production from coal sources (% of total)",
    "EG.ELC.RNEW.ZS": "Renewable electricity output (% of total electricity output)",
    "EG.FEC.RNEW.ZS": "Renewable energy consumption (% of total final energy consumption)",
    "EG.USE.COMM.FO.ZS": "Fossil fuel energy consumption (% of total)",
    "IT.NET.USER.ZS": "Individuals using the Internet (% of population)",
    "NY.GDP.MKTP.KD.ZG": "GDP growth (annual %)",
    "SE.ADT.LITR.ZS": "Literacy rate, adult total (% of people ages 15 and above)",
    "SE.ENR.PRSC.FM.ZS": "School enrollment, primary and secondary (gross), gender parity index (GPI)",
    "SE.XPD.TOTL.GB.ZS": "Government expenditure on education, total (% of government expenditure)",
    "SG.GEN.PARL.ZS": "Proportion of seats held by women in national parliaments (%)",
    "SH.DTH.COMM.ZS": "Cause of death, by communicable diseases and maternal, prenatal and nutrition conditions (% of total)",
    "SH.STA.OWAD.ZS": "Prevalence of overweight (% of adults)",
    "SI.POV.NAHC": "Poverty headcount ratio at national poverty lines (% of population)",
    "SL.TLF.0714.ZS": "Children in employment, total (% of children ages 7-14)",
    "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force) (modeled ILO estimate)",
    "SP.POP.65UP.TO.ZS": "Population ages 65 and above (% of total population)",
    "SP.UWT.TFRT": "Unmet need for contraception (% of married women ages 15-49)",
}

esg_data = pd.read_csv('esg/ESGData.csv', sep=',')
esg_series = pd.read_csv('esg/ESGSeries.csv', sep=',')
religion_individual = pd.read_csv('religion/Religion_Individual.csv', sep=',')

prune_esg_result = esg_data.loc[esg_data['SeriesCode'].isin(
    INDICATOR_NAMES.keys())]
prune_esg_series = esg_series.loc[esg_series['SeriesCode'].isin(
    INDICATOR_NAMES.keys())]
prune_esg_result = prune_esg_result.drop(columns=["2050", "Unnamed: 65"])

prune_esg_result["Topic"] = [prune_esg_series.loc[prune_esg_series["SeriesCode"]
                                                  == esg, 'Topic'].values[0] for esg in prune_esg_result['SeriesCode'].values]
prune_esg_result["Definition"] = [prune_esg_series.loc[prune_esg_series["SeriesCode"]
                                                       == esg, 'Longdefinition'].values[0] for esg in prune_esg_result['SeriesCode'].values]

prune_esg_result.to_csv(r'./esg/CountryData.csv', index=False)

