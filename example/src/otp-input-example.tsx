import { View, Text, StyleSheet } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

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
      -1, // infinite repeats
      true // reverse
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

function FakeDash() {
  return (
    <View style={styles.fakeDashContainer}>
      <View style={styles.fakeDash} />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: 40,
    height: 56,
    fontSize: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 2,
  },
  activeSlot: {
    borderColor: '#000',
  },
  char: {
    fontSize: 32,
  },
  fakeCaretContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeCaret: {
    width: 1,
    height: 32,
    backgroundColor: '#000',
  },
  fakeDashContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeDash: {
    width: 12,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
});

export default function OTPInputExample() {
  return (
    <OTPInput
      containerStyle={{ flexDirection: 'row' }}
      maxLength={6}
      render={({ slots }) => (
        <>
          <View style={{ flexDirection: 'row' }}>
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </View>

          <FakeDash />

          <View style={{ flexDirection: 'row' }}>
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </View>
        </>
      )}
    />
  );
}
