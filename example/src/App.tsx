import { Text, View, StyleSheet } from 'react-native';
import OTPInputExample from './otp-input-example';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <OTPInputExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
