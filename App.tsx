/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useLayoutEffect} from 'react';
 import { StyleSheet } from 'react-native';
 
 import {NavigationContainer} from '@react-navigation/native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import {Country} from 'react-native-country-picker-modal';
 
 import CachedApi from './src/api/CachedApi';
 
 import CountryDataContext from './src/context/country-data-context';
 import WorldDataContext from './src/context/world-data-context';
 import MainScreen from './src/screens/main-screen';
 
 const defaultCountry: Country = {
   callingCode: ['976'],
   cca2: 'MN',
   currency: ['MNT'],
   flag: 'flag-mn',
   name: 'Mongolia',
   region: 'Asia',
   subregion: 'Eastern Asia',
 };
 const App = () => {
   /* =====
     States
   ======*/
   const [country, setCountry] = useState<Country>(defaultCountry);
   const [countryData, setCountryData] = useState<IStatsRecord[] | null>(null);
   const [worldData, setWorldData] = useState<IWorldData[] | null>(null);
 
   /* =====
     Cache
   ======*/
 
   /* =====
     Utilities
   ======*/
 
   // fetch world data
   const refreshWorldData = async (): Promise<void> => {
     setWorldData(null);
     const data:
       | IWorldData[]
       | null = await CachedApi.getInstance().fetchWorldData();
     setWorldData(data);
   };
 
   // fetch country data
   const refreshCountryData = async (country: Country): Promise<void> => {
     setCountryData(null);
     const data:
       | IStatsRecord[]
       | null = await CachedApi.getInstance().fetchCountryData(
       country.name.toString().toLowerCase(),
     );
     setCountryData(data);
   };
 
   const refreshData = async () => {
     refreshWorldData();
     refreshCountryData(country);
   };
   // from cache or fetch from api
   // cache data has a maximum age of 10 mins
   const initData = async () => {
     // no cache
     refreshData();
     return;
   };
 
   const initCountry = async () => {
     const json = await AsyncStorage.getItem('country');
     if (json) {
       console.log('set country');
       console.log(json);
       const country: Country = JSON.parse(json);
       setCountry(country);
     }
   };
   /* =====
     Side Effects
   ======*/
   // onMount
   useLayoutEffect(() => {
     (async () => {
       // clear local storage when open the app
       await initCountry();
       await AsyncStorage.clear();
       // but keep the country cache
       AsyncStorage.setItem('country', JSON.stringify(country));
       initData();
     })();
   }, []);
 
   return (
     <>
       <WorldDataContext.Provider
         value={{data: worldData, refresh: refreshWorldData}}>
         <CountryDataContext.Provider
           value={{
             data: countryData,
             country: country,
             refresh: refreshCountryData,
           }}>
           <NavigationContainer>
             <MainScreen />
           </NavigationContainer>
         </CountryDataContext.Provider>
       </WorldDataContext.Provider>
     </>
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });
 
 export default App;
 