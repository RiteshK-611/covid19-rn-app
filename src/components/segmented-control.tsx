import React, {useState} from 'react';
import SegmentedControlTabs from '@react-native-segmented-control/segmented-control';

type SegmentedControlProps = {
  currentIndex: number;
  values: string[];
  onChanged: (index: number) => void;
};
const SegmentedControl: React.FC<SegmentedControlProps> = (
  props: SegmentedControlProps,
) => {
  const handleChangeIndex = (index: number) => {
    props.onChanged(index);
  };
  return (
    <SegmentedControlTabs
      values={['My country', 'Global']}
      backgroundColor={'#6D65AC'}
      style={{padding: 0, height: 50}}
      fontStyle={{color: '#FDFDFD'}}
      activeFontStyle={{color: 'black'}}
      selectedIndex={props.currentIndex}
      tintColor={'#fff'}
      onChange={event => {
        handleChangeIndex(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
};

export default SegmentedControl;
