import { View, Text, StyleSheet, Pressable } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function FocusSlotExample() {
  return (
    <View style={styles.wrapper}>
      <OTPInput
        maxLength={6}
        render={({ slots }) => (
          <View style={styles.slotsRow}>
            {slots.map((slot, index) => (
              <Pressable key={index} onPress={slot.focus}>
                <Slot {...slot} />
              </Pressable>
            ))}
          </View>
        )}
      />
      <Text style={styles.hint}>Tap any slot to focus it</Text>
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

function FakeCaret() {
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
      <Animated.View style={[styles.fakeCaret, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 10,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    width: 42,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  activeSlot: {
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  char: {
    fontSize: 22,
    fontWeight: '500',
    color: '#111827',
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
    height: 28,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
  },
});
