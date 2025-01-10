import { View, Text } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import { useRef } from 'react';
import { Alert } from 'react-native';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { cn } from './utils';

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
        <View className="flex-1 flex-row items-center justify-center my-4">
          <View className="flex-row">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
          <FakeDash />
          <View className="flex-row">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
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
  index,
}: SlotProps & { index: number }) {
  const isFirst = index === 0;
  const isLast = index === 2;
  return (
    <View
      className={cn(
        `w-12 h-16 items-center justify-center bg-gray-50`,
        'border border-gray-200',
        {
          'rounded-r-lg': isLast,
          'rounded-l-lg': isFirst,
          'bg-white border-black': isActive,
        }
      )}
    >
      {char !== null && (
        <Text className="text-2xl font-medium text-gray-900">{char}</Text>
      )}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeDash() {
  return (
    <View className="w-8 items-center justify-center">
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
    height: 32,
    backgroundColor: 'black',
    borderRadius: 1,
  };

  return (
    <View className="absolute w-full h-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}
