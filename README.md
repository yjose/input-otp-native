# Input OTP Native 🔐

One time passcode Input For React Native/Expo. Unstyled and fully customizable.

## Features

- 📱 Built specifically for React Native/Expo
- 🎨 Fully customizable styling with render props
- 📋 Smart paste support
- ⌨️ Custom keyboard types
- 🔄 Controlled & uncontrolled modes
- 🎯 Auto-focus & auto-submit capabilities

## Installation

```sh
npm install input-otp-native
```

Or if you use yarn:

```sh
yarn add input-otp-native
```

## Basic Usage

```jsx
import { StyleSheet, View, Text } from 'react-native';
import { OTPInput } from 'input-otp-native';

function MyOTPScreen() {
  return (
    <OTPInput
      maxLength={6}
      containerStyle={styles.container}
      render={({ slots }) => (
        <View style={styles.slotsContainer}>
          {slots.map((slot, idx) => (
            <View
              key={idx}
              style={[styles.slot, slot.isActive && styles.activeSlot]}
            >
              {slot.char && <Text style={styles.char}>{slot.char}</Text>}
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    width: 40,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSlot: {
    borderColor: '#007AFF',
  },
  char: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000000',
  },
});
```

## Advanced Example: Stripe-like OTP Input

Here's an example of how to create a Stripe-like OTP input with a dash separator:

```jsx
import { StyleSheet, View, Text } from 'react-native';
import { OTPInput } from 'input-otp-native';

function StripeOTPInput() {
  return (
    <OTPInput
      maxLength={6}
      containerStyle={styles.container}
      render={({ slots }) => (
        <>
          <View style={styles.slotsContainer}>
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>

          <View style={styles.dashContainer}>
            <View style={styles.dash} />
          </View>

          <View style={styles.slotsContainer}>
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
        </>
      )}
    />
  );
}

function Slot({ char, isActive, index }) {
  return (
    <View
      style={[
        styles.slot,
        isActive && styles.activeSlot,
        { borderLeftWidth: index === 0 ? 0 : 1 },
      ]}
    >
      {char && <Text style={styles.char}>{char}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dashContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dash: {
    width: 8,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
});
```

## API Reference

### OTPInput Props

| Prop               | Type                              | Default   | Description                         |
| ------------------ | --------------------------------- | --------- | ----------------------------------- |
| `maxLength`        | number                            | Required  | Number of OTP digits                |
| `render`           | (props: RenderProps) => ReactNode | Required  | Render function for OTP slots       |
| `value`            | string                            | undefined | Controlled value of the input       |
| `onChange`         | (value: string) => void           | undefined | Callback when value changes         |
| `onComplete`       | (value: string) => void           | undefined | Callback when all digits are filled |
| `containerStyle`   | ViewStyle                         | undefined | Style for the container             |
| `pattern`          | string                            | undefined | Regex pattern for input validation  |
| `textAlign`        | 'left' \| 'center' \| 'right'     | 'left'    | Text alignment within input         |
| `pasteTransformer` | (pasted: string) => string        | undefined | Transform pasted text               |

### RenderProps

| Prop        | Type        | Description                     |
| ----------- | ----------- | ------------------------------- |
| `slots`     | SlotProps[] | Array of slot objects to render |
| `isFocused` | boolean     | Whether the input is focused    |

### SlotProps

| Prop              | Type           | Description                |
| ----------------- | -------------- | -------------------------- |
| `char`            | string \| null | Character in the slot      |
| `isActive`        | boolean        | Whether the slot is active |
| `hasFakeCaret`    | boolean        | Whether to show fake caret |
| `placeholderChar` | string \| null | Placeholder character      |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

## Credits

- [create-react-native-library](https://github.com/callstack/react-native-builder-bob) for the library template.

- [otp-input](https://github.com/guilhermerodz/input-otp) for the original idea and some code.
