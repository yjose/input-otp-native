import { View, StyleSheet, ScrollView } from 'react-native';
import StripeOTPInput from './examples/stripe';
import { Title } from './title';
import AppleOTPInput from './examples/apple';
import RevoltOTPInput from './examples/revolt';
import DashedOTPInput from './examples/dashed';
import StripeNativewind from './examples/stripe-nativewind';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.exampleContainer}>
        <Title>Stripe OTP Input</Title>
        <StripeOTPInput />
        <StripeNativewind />
      </View>
      <View style={styles.exampleContainer}>
        <Title>Apple OTP Input</Title>
        <AppleOTPInput />
      </View>
      <View style={styles.exampleContainer}>
        <Title>Revolt OTP Input</Title>
        <RevoltOTPInput />
      </View>
      <View style={styles.exampleContainer}>
        <Title>Dashed OTP Input</Title>
        <DashedOTPInput />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  exampleContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
});
