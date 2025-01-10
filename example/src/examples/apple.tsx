import { View, Text, StyleSheet, type ViewStyle, Alert } from 'react-native';
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

export default function AppleOTPInput() {
  const ref = useRef<OTPInputRef>(null);
  const onComplete = (code: string) => {
    Alert.alert('Completed with code:', code);
    ref.current?.clear();
  };

  return (
    <View>
      <OTPInput
        ref={ref}
        onComplete={onComplete}
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
    <View style={[styles.slot, isActive && styles.activeSlot]}>
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
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
    gap: 8,
  },
  slot: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  activeSlot: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  char: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111827',
  },
  /* Caret */
  fakeCaretContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeCaret: {
    width: 2,
    height: 28,
    backgroundColor: '#000',
    borderRadius: 1,
  },
});
