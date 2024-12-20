import { Text, View, StyleSheet } from 'react-native';
import StripeOTPInput from './stripe';
import { Title } from './title';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <View style={styles.exampleContainer}>
        <Title>Stripe OTP Input</Title>
        <StripeOTPInput />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleContainer: {
    marginTop: 16,
  },
});
