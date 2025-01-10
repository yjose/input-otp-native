import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import { useRef } from 'react';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function DashedOTPInput() {
  const ref = useRef<OTPInputRef>(null);

  return (
    <View>
      <OTPInput
        ref={ref}
        containerStyle={styles.container}
        maxLength={5}
        render={({ slots }) => (
          <View style={styles.slotsContainer}>
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <View style={styles.slot}>
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
      <View style={[styles.underline, isActive && styles.activeUnderline]} />
    </View>
  );
}

function FakeCaret({ style }: { style?: ViewStyle }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.fakeCaretContainer}>
      <Animated.View style={[styles.fakeCaret, style, animatedStyle]} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111827',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  activeUnderline: {
    backgroundColor: '#111827',
    height: 2,
  },
  fakeCaretContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeCaret: {
    width: 2,
    height: 24,
    backgroundColor: '#111827',
    borderRadius: 1,
  },
});
