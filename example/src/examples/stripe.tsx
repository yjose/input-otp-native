import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  Alert,
  Pressable,
} from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import { useRef } from 'react';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useDerivedValue,
} from 'react-native-reanimated';

export default function StripeOTPInput() {
  const ref = useRef<OTPInputRef>(null);
  const onComplete = (code: string) => {
    Alert.alert('Completed with code:', code);
    ref.current?.clear();
  };

  return (
    <OTPInput
      ref={ref}
      onComplete={onComplete}
      maxLength={6}
      render={({ slots }) => (
        <View style={styles.mainContainer}>
          <View style={styles.slotsContainer}>
            {slots.slice(0, 3).map((slot, slotIndex) => (
              <Slot key={`slot-${slotIndex}`} {...slot} index={slotIndex} />
            ))}
          </View>
          <FakeDash />
          <View style={styles.slotsContainer}>
            {slots.slice(3).map((slot, slotIndex) => (
              <Slot key={`slot-${slotIndex}`} {...slot} index={slotIndex} />
            ))}
          </View>
        </View>
      )}
    />
  );
}

function Slot({
  char,
  isActive,
  hasFakeCaret,
  focus,
  index,
}: SlotProps & { index: number }) {
  const isFirst = index === 0;
  const isLast = index === 2;

  return (
    <Pressable
      onPress={focus}
      style={[
        styles.slot,
        isFirst && styles.slotFirst,
        isLast && styles.slotLast,
        isActive && styles.activeSlot,
      ]}
    >
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
    </Pressable>
  );
}

function FakeDash() {
  return (
    <View style={styles.fakeDashContainer}>
      <View style={styles.fakeDash} />
    </View>
  );
}

function FakeCaret({ style }: { style?: ViewStyle }) {
  const opacity = useDerivedValue(
    () =>
      withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      ),
    []
  );

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
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  slotsContainer: {
    flexDirection: 'row',
  },
  slot: {
    width: 42,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  slotLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    height: 32,
    backgroundColor: '#000',
    borderRadius: 1,
  },
});
