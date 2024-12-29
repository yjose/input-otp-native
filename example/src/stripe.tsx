import { View, Text, StyleSheet, Pressable } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import { FakeCaret } from './fake-caret';
import type { OTPInputRef } from '../../src/types';
import { useRef } from 'react';

export default function StripeOTPInput() {
  const ref = useRef<OTPInputRef>(null);

  return (
    <View>
      <OTPInput
        ref={ref}
        containerStyle={styles.container}
        maxLength={6}
        render={({ slots, isFocused }) => (
          <>
            <View style={styles.slotsContainer}>
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} index={idx} />
              ))}
            </View>
            {isFocused && <FakeDash />}
            <FakeDash />

            <View style={styles.slotsContainer}>
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} index={idx} />
              ))}
            </View>
          </>
        )}
      />
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={() => ref.current?.focus()}
        >
          <Text style={styles.actionButtonText}>Focus</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={() => ref.current?.blur()}
        >
          <Text style={styles.actionButtonText}>Blur</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={() => ref.current?.clear()}
        >
          <Text style={styles.actionButtonText}>Clear</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={() => ref.current?.setValue('123')}
        >
          <Text style={styles.actionButtonText}>Set Value</Text>
        </Pressable>
      </View>
    </View>
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
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButtonPressed: {
    backgroundColor: '#4338CA',
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
