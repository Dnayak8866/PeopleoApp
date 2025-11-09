import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface PinInputProps {
  length?: number; // default 6
  onChangePin?: (pin: string) => void;
  boxStyle?: object;
  inputStyle?: object;
}

const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  onChangePin,
  boxStyle = {},
  inputStyle = {},
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newValues = [...values];
      // Detect backspace: if text is empty and previous value was not
      if (text === '' && values[idx] !== '') {
        newValues[idx] = '';
        setValues(newValues);
        onChangePin?.(newValues.join(''));
        if (idx > 0) {
          inputs.current[idx - 1]?.focus();
        }
        return;
      }
      newValues[idx] = text;
      setValues(newValues);
      onChangePin?.(newValues.join(''));
      if (text && idx < length - 1) {
        inputs.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !values[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleFocus = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <View style={[styles.container, boxStyle]}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={ref => { inputs.current[idx] = ref; }}
          style={[
            styles.input,
            inputStyle,
            activeIndex === idx && styles.inputActive,
          ]}
          keyboardType="phone-pad"
          maxLength={1}
          value={values[idx]}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          onFocus={() => handleFocus(idx)}
          returnKeyType="next"
          textAlign="center"
          autoFocus={idx === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    width: 44,
    height: 54,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  inputActive: {
    borderColor: '#007AFF', // iOS blue, or use your theme color
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default PinInput; 