import React, { useEffect, useState} from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, TextInput } from 'react-native';
import { Text, ThemeProvider, Button, Header} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome';

const sh = Dimensions.get('window').height;

const Finder = () => {

  const [pincode, setPincode] = useState(null);
  const [date, setDate] = useState(null);
  const [centers, setCenters] = useState([]);

  // useEffect(() => {
  //   handleSubmit()
  // }, [])

  const handleChange = value => setPincode(value);
  
  const handleSubmit = async () => {
    const res  = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`)
    setCenters(res.data["sessions"])
  }

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#483F97'} />
      <Header
        containerStyle={{
          backgroundColor: '#483F97',
          borderBottomColor: 'transparent',
        }}
        // leftComponent={{icon: 'menu', color: '#fff'}}
      />
      <ThemeProvider
        theme={{
          Text: {
            style: {
              color: 'white',
            },
          },
        }}>
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text h3 style={{color: '#fff'}}>
              Find Vaccine Slots(India)
            </Text>
          </View>
          {/* <Stack size={'lg'} /> */}
          <View style={styles.ctaRow}>
            <TextInput
              placeholder="Enter the pincode"
              value={pincode}
              keyboardType={'number-pad'}
              style={styles.inputField}
              onChangeText={handleChange}
            />

            <DatePicker
              style={{width: 150, backgroundColor: 'white', marginLeft: 10}}
              date={date}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-05-2020"
              maxDate="01-06-2025"
              showIcon={false}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={date => setDate(date)}
            />
            <Icon size={40} color={"white"} name="calendar" />
          </View>
          {/* <Stack size={'md'} /> */}
          <ThemeProvider
            theme={{
              Button: {
                containerStyle: {
                  // flex: 1,
                  marginHorizontal: 100,
                  borderRadius: 20,
                },
                buttonStyle: {
                  // padding: 10,
                },
              },
            }}>
            <Button
              title={'Get the Centers'}
              onPress={handleSubmit}
              buttonStyle={{backgroundColor: '#4C79FE', alignItems: 'center'}}
            />
            <View style={styles.ctaRow}>
            </View>
          </ThemeProvider>
        </View>
      </ThemeProvider>
      <View style={styles.slots}>
        {centers.length === 0 ? <Text style={styles.textStyle}>No Centers Found</Text> : 
          <View>
            <Text style={styles.textStyle}>{centers.length} Centers Found</Text>
            <ScrollView>
              <View>
                {centers.map((center, index) => {
                  return (
                  <View key={index} style={styles.card}>
                    <Text style={{fontSize: 14.5, fontWeight: 'bold'}}>{center.name}</Text>
                    <Text>{center.address}</Text>
                    <Text>{center.vaccine}</Text>
                    <Text>{center.fee_type}</Text>
                    <Text>Available Vaccines: {center.available_capacity}</Text>
                    <Text>Min. Age: {center.min_age_limit}</Text>
                  </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
        }
      </View>
    </ScrollView>
  );
};

export default Finder;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#483F97',
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
    justifyContent: 'center',
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
    alignItems: 'center',
  },
  inputField: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 20,
    marginVertical: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  slots: {
    padding: '5%',
    backgroundColor: 'white',
    borderRadius: 35,
    // height: 505
  },
  card: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    margin: 10,
  },
  textStyle: {
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10,
    alignSelf: 'center'
  }
});
