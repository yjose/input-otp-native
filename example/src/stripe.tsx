import { View, Text, StyleSheet } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import { FakeCaret } from './fake-caret';

export default function StripeOTPInput() {
  return (
    <OTPInput
      containerStyle={styles.container}
      maxLength={6}
      render={({ slots }) => (
        <>
          <View style={styles.slotsContainer}>
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>

          <FakeDash />

          <View style={styles.slotsContainer}>
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
        </>
      )}
    />
  );
}

function Slot({
  char,
  isActive,
  hasFakeCaret,
  index,
}: SlotProps & { index: number }) {
  return (
    <View
      style={[
        styles.slot,
        isActive && styles.activeSlot,
        { borderLeftWidth: index === 0 ? 0 : 1 },
      ]}
    >
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeDash() {
  return (
    <View style={styles.fakeDashContainer}>
      <View style={styles.fakeDash} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  slot: {
    width: 48,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  activeSlot: {
    backgroundColor: '#FFF',
  },
  char: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111827',
  },
  fakeDashContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeDash: {
    width: 8,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
});
