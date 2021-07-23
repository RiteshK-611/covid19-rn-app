import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text, ThemeProvider} from 'react-native-elements';

type TextTabsProps = {
  currentIndex: number;
  values: string[];
  activeColor?: string;
  inactiveColor?: string;
  onChanged: (index: number) => void;
  initialIndex?: number;
};
const TextTabs: React.FC<TextTabsProps> = (props: TextTabsProps) => {
  const handleChange = (index: number) => {
    props.onChanged(index);
  };
  return (
    <ThemeProvider
      theme={{
        Text: {
          style: {
            color: '#B6B2D4',
          },
        },
      }}>
      <View style={styles.container}>
        {props.values.map((val: string, index) => (
          <Pressable key={val} onPress={() => handleChange(index)}>
            <Text
              style={{
                color:
                  props.currentIndex == index
                    ? props.activeColor
                    : props.inactiveColor,
              }}>
              {val}
            </Text>
          </Pressable>
        ))}
      </View>
    </ThemeProvider>
  );
};

TextTabs.defaultProps = {
  initialIndex: 0,
  activeColor: '#fff',
  inactiveColor: '#B6B2D4',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default TextTabs;
