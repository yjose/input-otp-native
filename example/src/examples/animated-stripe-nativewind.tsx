import { View, Text, Alert } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import { useRef } from 'react';

import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { cn } from './utils';

export default function AnimatedStripeOTPInput() {
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
          <View className="flex-1 flex-row items-center justify-center my-4">
            <View className="flex-row">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} index={idx} />
              ))}
            </View>
            <FakeDash />
            <View className="flex-row">
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} index={idx + 3} />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

function Slot({
  char,
  isActive,
  hasFakeCaret,
  index,
}: SlotProps & { index: number }) {
  const isFirst = index === 0;
  const isLast = index === 2 || index === 5;

  return (
    <View
      className={cn(
        `w-12 h-16 items-center justify-center bg-gray-50 relative`,
        'border border-gray-200',
        {
          'rounded-r-lg': isLast,
          'rounded-l-lg': isFirst,
          'bg-white border-black': isActive,
        }
      )}
    >
      {char !== null && (
        <Animated.View
          entering={FadeInDown.springify()
            .damping(15)
            .stiffness(150)
            .mass(1)
            .overshootClamping(0)}
        >
          <Text className="text-2xl font-medium text-gray-900">{char}</Text>
        </Animated.View>
      )}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeDash() {
  const opacity = useSharedValue(0.5);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(1.2, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="w-8 items-center justify-center">
      <Animated.View
        style={animatedStyle}
        className="w-2 h-0.5 bg-gray-200 rounded-sm"
      />
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);
  const height = useSharedValue(24);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );

    height.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 500 }),
        withTiming(28, { duration: 500 })
      ),
      -1,
      true
    );
  }, [opacity, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
  }));

  const baseStyle = {
    width: 2,
    backgroundColor: '#111827',
    borderRadius: 1,
  };

  return (
    <View className="absolute w-full h-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}
