import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import StripeOTPInput from './examples/stripe';
import { Title } from './title';
import AppleOTPInput from './examples/apple';
import RevoltOTPInput from './examples/revolt';
import DashedOTPInput from './examples/dashed';
import StripeNativewind from './examples/stripe-nativewind';
import RevoltNativewind from './examples/revolt-nativewind';
import AppleNativewind from './examples/apple-nativewind';
import DashedNativewind from './examples/dashed-nativewind';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.exampleContainer}>
          <Title>Stripe OTP Input</Title>
          <StripeOTPInput />
          <StripeNativewind />
        </View>
        <View style={styles.exampleContainer}>
          <Title>Apple OTP Input</Title>
          <AppleOTPInput />
          <AppleNativewind />
        </View>
        <View style={styles.exampleContainer}>
          <Title>Revolt OTP Input</Title>
          <RevoltOTPInput />
          <RevoltNativewind />
        </View>
        <View style={styles.exampleContainer}>
          <Title>Dashed OTP Input</Title>
          <DashedOTPInput />
          <DashedNativewind />
        </View>
      </SafeAreaView>
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
