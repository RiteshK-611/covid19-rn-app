import BaseApi from "./BaseApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Singleton
export default class CachedApi extends BaseApi {

    private static _instance: CachedApi;

    // Cache age
    private age = 1000 * 60 * 10;

    public static getInstance = ():CachedApi => {
        if (CachedApi._instance == null){
            CachedApi._instance = new CachedApi();
        }
        return CachedApi._instance;
    }
    private constructor(){
        super();
    }
    private getDataFromCache = async <T>(key: string): Promise<T|null> => {
        const cache = await AsyncStorage.getItem(key);
        if (!cache){
            console.log('no cache');
            return null;
        }
        const data: IDataCache<T> = JSON.parse(cache);
        // is expired?
        const expiredAt = new Date(new Date(data.savedAt).valueOf() + data.age);
        console.log(`${data.savedAt} ${expiredAt}`)
        if (new Date() > expiredAt){
            // cache expired
            AsyncStorage.removeItem(key);
            return null;
        }
        console.log('has cache');
        return data.data;
    }
    public async fetchWorldData():Promise<IWorldData[] | null> {
        // get from cache
        const data = await this.getDataFromCache<IWorldData[]>('world-data');
        if (data){
            // cache valid
            return data;
        }
        // cache invalid
        const newData = await super.fetchWorldData();
        // cache new data
        const cache: IDataCache<IWorldData[]|null> = {
            data: newData,
            savedAt: new Date().toString(),
            age: this.age
        }
        console.log('cache data');
        AsyncStorage.setItem('world-data', JSON.stringify(cache));
        return newData;
      };
    
      // fetch country data
      public async fetchCountryData(countryName: string):Promise<IStatsRecord[] | null> {
          // get from cache
        const data = await this.getDataFromCache<IStatsRecord[]>(countryName);
        if (data){
            // cache valid
            return data;
        }
        // cache invalid
        const newData = await super.fetchCountryData(countryName);
        // cache new data
        const cache: IDataCache<IStatsRecord[]|null> = {
            data: newData,
            savedAt: new Date().toString(),
            age: this.age
        }
        console.log('cache data');
        AsyncStorage.setItem(countryName, JSON.stringify(cache));
        return newData;
      };
}