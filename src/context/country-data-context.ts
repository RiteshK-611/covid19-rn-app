import React from 'react';
import {Country} from 'react-native-country-picker-modal';

type CountryDataContextType = {
    data: IStatsRecord[] | null;
    country?: Country;
    setCountry?: (country: Country) => void;
    refresh: (countryName: Country) => Promise<void>;
}

const CountryDataContext = React.createContext<CountryDataContextType>({data: [], refresh: async () => {}});

export default CountryDataContext;