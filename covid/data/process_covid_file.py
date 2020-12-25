import pandas as pd

covid_file = pd.ExcelFile('covid19.xlsx')
cases_by_region = pd.read_excel(covid_file, 0)
rolling_means = cases_by_region.rolling(7, on='Statistikdatum', min_periods=1).mean()
rolling_means = rolling_means.rename(
        columns={'Statistikdatum': 'date',
                 'Jämtland_Härjedalen': 'Jämtland',
                 'Västra_Götaland': 'VästraGötaland',
                 'Sörmland': 'Södermanland',
                 'Totalt_antal_fall': 'Sverige'})
rolling_means.to_json('cases_rolling_means.json')

deaths = pd.read_excel(covid_file, 1)
deaths = deaths[:-1]
deaths = deaths.rename(
        columns={'Datum_avliden': 'date',
                 'Antal_avlidna': 'num_dead'})
deaths = deaths.rolling(7, on='date', min_periods=1).mean()
deaths.to_json('deaths.json')

icu = pd.read_excel(covid_file, 2)
icu_rolling_means = icu.rolling(7, on='Datum_vårdstart', min_periods=1).mean()
icu_rolling_means = icu_rolling_means.rename(
        columns={'Datum_vårdstart': 'date',
                 'Antal_intensivvårdade': 'num_icu'})
icu_rolling_means.to_json('icu.json')

totals = pd.read_excel(covid_file, 3)
totals = totals.append(totals.sum(numeric_only=True), ignore_index=True)
totals.at[21,'Region'] = 'Sverige'
totals = totals.set_index('Region')
totals = totals.rename(
        columns={'Totalt_antal_intensivvårdade': 'icu',
                 'Totalt_antal_fall': 'cases',
                 'Totalt_antal_avlidna': 'dead'})
totals = totals.rename(
        index={'Jämtland Härjedalen': 'Jämtland',
               'Västra Götaland': 'VästraGötaland',
               'Sörmland': 'Södermanland'})
totals.to_json('totals.json')
