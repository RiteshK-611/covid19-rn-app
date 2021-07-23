import axios from 'axios';
export default class BaseApi{
    
    // api base url
    public static readonly origin = 'https://api.covid19api.com';

    // all request should use it
    private static readonly apiClient = axios.create({baseURL: BaseApi.origin});

    // fetch world data
  public async fetchWorldData():Promise<IWorldData[] | null> {
    const end = new Date();
    let start = new Date();
    start.setDate(start.getDate() - 7);
    const response = await BaseApi.apiClient(
      `/world?from=${start}&to=${end}`,
    );
    const data: IWorldData[] = response.data;
    data.sort((a, b) => (a.Date < b.Date? -1: 1));
    return data || [];
  };

  // fetch country data
  public async fetchCountryData(countryName: string): Promise<IStatsRecord[] | null>{
    const response = await BaseApi.apiClient(
      `/live/country/${countryName}/status/confirmed`,
    );
    const records: IStatsRecord[] = response.data;
    records.sort((a, b) => (a.Date < b.Date ? -1: 1));
    return records || [];
  };
}