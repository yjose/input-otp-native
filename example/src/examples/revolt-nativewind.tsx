import { View, Text, Alert } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import React, { useRef } from 'react';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { cn } from './utils';

export default function RevoltOTPInput() {
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
        maxLength={6}
        render={({ slots }) => (
          <View className="flex-row gap-3 justify-center my-4">
            {slots.map((slot, idx) => (
              <React.Fragment key={idx}>
                <Slot {...slot} />
                {idx === 2 && <FakeDash />}
              </React.Fragment>
            ))}
          </View>
        )}
      />
    </View>
  );
}

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <View
      className={cn(
        'w-12 h-12 items-center justify-center border border-gray-200 rounded-lg bg-gray-50',
        {
          'border-blue-600 border-2': isActive,
        }
      )}
    >
      {char !== null && (
        <Text className="text-xl font-medium text-gray-900">{char}</Text>
      )}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeDash() {
  return (
    <View className="w-2 items-center justify-center">
      <View className="w-2 h-0.5 bg-gray-200 rounded-sm" />
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

  const baseStyle = {
    width: 2,
    height: 24,
    backgroundColor: '#2563EB',
    borderRadius: 1,
  };

  return (
    <View className="absolute w-full h-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}
