import React, {useContext, useEffect, useMemo, useState} from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, Linking, TouchableWithoutFeedback } from 'react-native';
import { Text, Card, ThemeProvider, Button, Header, Image } from 'react-native-elements';
import {Stack} from '../components/spacing';
import CountryPicker, {Country} from 'react-native-country-picker-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryDataContext from '../context/country-data-context';
import numeral from 'numeral';

import SegmentedControlTabs from '../components/segmented-control';
import TextTabs from '../components/text-tabs';
import WorldDataContext from '../context/world-data-context';

const sh = Dimensions.get('window').height;
const HomeScreen = () => {

  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const countryDataContext = useContext(CountryDataContext);
  const [country, setCountry] = useState<Country | undefined>(
    countryDataContext.country,
  );

  const [periodIndex, setPeriodIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const worldContext = useContext(WorldDataContext);
  const countryContext = useContext(CountryDataContext);

  const diffRecords = (
    stats1: IStatsRecord | null,
    stats2: IStatsRecord | null,
  ): IStatsRecord | null => {
    if (!stats1 || !stats2) {
      return null;
    }
    const diff: IStatsRecord = {
      ...stats1,
      ...stats2,
      Confirmed: stats1.Confirmed - stats2.Confirmed,
      Deaths: stats1.Deaths - stats2.Deaths,
      Recovered: stats1.Recovered - stats2.Recovered,
    };
    return diff;
  };
  const diffStatsAtIndex = (
    index: number | null | undefined,
    records: IStatsRecord[] | null | undefined,
  ): IStatsRecord | null => {
    if (!records) {
      return null;
    }
    if (!index) {
      return null;
    }
    if (index < 0) {
      return null;
    }
    const stats1: IStatsRecord = records[index];
    const stats2: IStatsRecord = records[index - 1];
    return diffRecords(stats1, stats2);
  };

  const worldRecords = useMemo<IStatsRecord[] | undefined>(():
    | IStatsRecord[]
    | undefined => {
    return worldContext.data?.map((w: IWorldData, index) => {
      const stats: IStatsRecord = {
        ID: w.Date,
        Country: 'World',
        CountryCode: 'world',
        Province: 'world',
        City: 'world',
        CityCode: 'world',
        Lat: '0',
        Lon: '0',
        Confirmed: w.TotalConfirmed,
        Deaths: w.TotalDeaths,
        Recovered: w.TotalRecovered,
        Date: w.Date,
      };
      return stats;
    });
  }, [worldContext.data]);

  // data loading
  const isCountryLoading = useMemo<boolean>(() => {
    // console.log(`is cd ${countryContext.data?.length}`);
    return countryContext.data == null;
  }, [countryContext.data]);
  const isWorldLoading = useMemo<boolean>(() => {
    // console.log(`is wd ${worldContext.data?.length}`);
    return worldContext.data == null;
  }, [worldContext.data]);

  // current records
  const records = useMemo<IStatsRecord[] | null | undefined>(() => {
    switch (areaIndex) {
      case 0:
        return countryContext.data;
      default:
        return worldRecords;
    }
  }, [areaIndex, countryContext, worldRecords]);

  // my country or global
  const areas = useMemo<string[]>((): string[] => {
    return ['My country', 'Global'];
  }, []);

  const periods = useMemo<string[]>((): string[] => {
    return ['Today', 'Total'];
  }, []);

  const currentStats = useMemo<IStatsRecord | null>((): IStatsRecord | null => {
    switch (periodIndex) {
      case 0:
        // today
        return diffStatsAtIndex((records?.length || 0) - 1, records);
      case 1:
        // total
        return records![(records?.length || 0) - 1];
    }
    return null;
  }, [records, periodIndex]);

  const handleAreaChanged = async (index: number): Promise<void> => {
    // console.log('handle area change');
    setAreaIndex(index);
  };

  const handlePeriodChanged = (index: number): void => {
    // console.log('handle period change');
    setPeriodIndex(index);
  };

  const handleCountrySelect = (country: Country) => {
    setCountry(country);
    countryDataContext.refresh(country);
    AsyncStorage.setItem('country', JSON.stringify(country));
  };
  return (
    <ScrollView style={styles.scroll}>
      <StatusBar backgroundColor={'#483F97'} />
      <Header
        containerStyle={{
          backgroundColor: '#483F97',
          borderBottomColor: 'transparent',
        }}
        // leftComponent={{icon: 'menu', color: '#fff'}}
      />
      <ThemeProvider theme={{ Text: { style: { color: 'white' } }}}>
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text h2 style={{color: '#fff'}}>
              Covid-19
            </Text>
            <TouchableWithoutFeedback
              onPress={() => setPickerVisible(!pickerVisible)}>
              <View style={styles.flagRow}>
                <CountryPicker
                  visible={pickerVisible}
                  countryCode={country!.cca2}
                  withFlag
                  onSelect={handleCountrySelect}
                />

                <Text h4 style={{color: '#333'}}>
                  {country?.name || ''}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Stack size={'lg'} />
          <Text h4 style={{color: '#fff'}}>
          Statistics
        </Text>
        <Stack size={'md'} />
        <SegmentedControlTabs
          currentIndex={areaIndex}
          values={areas}
          onChanged={handleAreaChanged}
        />
        <Stack size={'md'} />
        <ThemeProvider theme={{ Text: { style: { color: '#B6B2D4' } }}}>
          <TextTabs
            currentIndex={periodIndex}
            values={periods}
            onChanged={handlePeriodChanged}
          />
        </ThemeProvider>
        <Stack size={'xs'} />
        <ThemeProvider
          theme={{
            Card: {
              containerStyle: { flex: 1, borderRadius: 10, borderWidth: 0, padding: 12, marginLeft: 15, marginRight: 0 },
              innerStyle: { justifyContent: 'flex-start' },
            },
            Text: { style: { color: 'white' } }
          }}>
          <View style={styles.cardRow}>
            <Card containerStyle={{backgroundColor: '#FFB159', marginLeft: 0, height: 105}}>
              <Card.Title
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={styles.cardTitle}>
                Affected
              </Card.Title>
              <Text h3 allowFontScaling numberOfLines={1} adjustsFontSizeToFit>
                {numeral(currentStats?.Confirmed ?? 0).format(`0,0`)}
              </Text>
            </Card>
            <Card containerStyle={{backgroundColor: '#FF5958'}}>
              <Card.Title
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.cardTitle}>
                Death
              </Card.Title>
              <Text h3 allowFontScaling numberOfLines={1} adjustsFontSizeToFit>
                {numeral(currentStats?.Deaths ?? 0).format(`0,0`)}
              </Text>
            </Card>
            <Card containerStyle={{backgroundColor: '#4BD97A'}}>
              <Card.Title
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.cardTitle}>
                Recovered
              </Card.Title>
              <Text h3 allowFontScaling numberOfLines={1} adjustsFontSizeToFit>
                {numeral(currentStats?.Recovered ?? 0).format(`0,0`)}
              </Text>
            </Card>
          </View>
        </ThemeProvider>
        </View>
      </ThemeProvider>
      
      <View style={styles.bodySection}>
        <Text h2>Prevention</Text>
        <Stack size={'md'} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <ThemeProvider
            theme={{
              Card: {
                containerStyle: {
                  flex: 1,
                  margin: 0,
                  padding: 5,
                },
              },
            }}>
            <Card
              containerStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                elevation: 0,
              }}>
              <Card.Image
                resizeMode="contain"
                source={require('../../assets/images/remote-work-man.png')}
              />
              <Stack size={'sm'} />
              <Card.Title>Avoid close contact</Card.Title>
            </Card>
            <Card
              containerStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                elevation: 0,
              }}>
              <Card.Image
                resizeMode="contain"
                source={require('../../assets/images/doctor-man.png')}
              />
              <Stack size={'sm'} />
              <Card.Title>Clean your hands often</Card.Title>
            </Card>
            <Card
              containerStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                elevation: 0,
              }}>
              <Card.Image
                resizeMode="contain"
                source={require('../../assets/images/mask-woman.png')}
              />
              <Stack size={'sm'} />
              <Card.Title>Wear a facemask</Card.Title>
            </Card>
          </ThemeProvider>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    flex: 1,
    height: sh,
  },
  headerSection: {
    padding: '5%',
    backgroundColor: '#483F97',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  bodySection: {
    padding: '5%',
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flagRow: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    textAlign: 'left',
    color: 'white',
  },
  cardRow: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
