import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import StripeOTPInput from './examples/stripe';
import AppleOTPInput from './examples/apple';
import RevoltOTPInput from './examples/revolt';
import DashedOTPInput from './examples/dashed';
import StripeNativewind from './examples/stripe-nativewind';
import RevoltNativewind from './examples/revolt-nativewind';
import AppleNativewind from './examples/apple-nativewind';
import DashedNativewind from './examples/dashed-nativewind';
import AnimatedDashedNativewind from './examples/animated-dashed-nativewind';
import AnimatedStripeOTPInput from './examples/animated-stripe-nativewind';

type TabType = 'regular' | 'nativewind';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('regular');

  const examples = [
    {
      title: 'Stripe',
      description: 'Clean, minimal design with subtle borders',
      regular: StripeOTPInput,
      nativewind: StripeNativewind,
      color: '#6772E5',
    },
    {
      title: 'Apple',
      description: 'iOS-style with rounded corners and shadows',
      regular: AppleOTPInput,
      nativewind: AppleNativewind,
      color: '#007AFF',
    },
    {
      title: 'Revolt',
      description: 'Modern design with gradient backgrounds',
      regular: RevoltOTPInput,
      nativewind: RevoltNativewind,
      color: '#FF6B6B',
    },
    {
      title: 'Dashed',
      description: 'Simple dashed border style',
      regular: DashedOTPInput,
      nativewind: DashedNativewind,
      color: '#4ECDC4',
    },
    {
      title: 'Animated Dashed',
      description: 'Dashed style with slide-in animation',
      regular: AnimatedDashedNativewind,
      nativewind: AnimatedDashedNativewind,
      color: '#8B5CF6',
    },
    {
      title: 'Animated Stripe',
      description: 'Stripe style with slide-in animation',
      regular: AnimatedStripeOTPInput,
      nativewind: AnimatedStripeOTPInput,
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-5 pb-4 bg-white">
        <Text className="text-3xl font-bold text-slate-800 mb-1">
          OTP Input Examples
        </Text>
        <Text className="text-base text-slate-500 leading-6">
          Beautiful, customizable one-time password inputs
        </Text>
      </View>

      <View className="flex-row bg-white px-5 pb-4 border-b border-slate-200">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 mx-1 rounded-lg ${
            activeTab === 'regular' ? 'bg-blue-500' : 'bg-slate-100'
          }`}
          onPress={() => setActiveTab('regular')}
        >
          <Text
            className={`text-center text-sm font-semibold ${
              activeTab === 'regular' ? 'text-white' : 'text-slate-500'
            }`}
          >
            StyleSheet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 mx-1 rounded-lg ${
            activeTab === 'nativewind' ? 'bg-blue-500' : 'bg-slate-100'
          }`}
          onPress={() => setActiveTab('nativewind')}
        >
          <Text
            className={`text-center text-sm font-semibold ${
              activeTab === 'nativewind' ? 'text-white' : 'text-slate-500'
            }`}
          >
            NativeWind
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {examples.map((example) => (
          <View
            key={example.title}
            className="mx-5 mt-5 bg-white rounded-2xl shadow-sm"
          >
            <View className="flex-row items-center px-4 py-2 border-b border-slate-200">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: example.color }}
              >
                <Text className="text-white text-lg font-bold">
                  {example.title[0]}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-800 mb-1">
                  {example.title}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {example.description}
                </Text>
              </View>
            </View>

            <View className="bg-slate-50 rounded-b-2xl p-4 items-center h-[120px] justify-center">
              {activeTab === 'regular' ? (
                <example.regular />
              ) : (
                <example.nativewind />
              )}
            </View>
          </View>
        ))}

        <View className="py-10 items-center">
          <Text className="text-sm text-slate-400 text-center">
            Built with ❤️ using input-otp-native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
