interface IStatsRecord{
    ID: string;
    Country: string;
    CountryCode: string;
    Province: string;
    City: string;
    CityCode: string;
    Lat: string;
    Lon: string;
    Confirmed: number;
    Deaths: number;
    Recovered: number;
    Active?: number;
    Date: string;
}

interface IWorldData {
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: string;
}

type ChartData = {
    labels: string[],
    datasets: any[]
}

interface IDataCache<T> {
    age: number; // age millis
    savedAt: string; // cache saved at
    data: T;
}