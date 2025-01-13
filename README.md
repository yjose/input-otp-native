![Input OTP Native](./demo.gif)

# Input OTP Native 🔐

One time passcode Input For React Native/Expo. Unstyled and fully customizable.

## Features

- 📱 Built specifically for React Native/Expo
- 🎨 Fully customizable styling with render props ( supports nativewind )
- 📋 Four copy paste styles (Apple, Stripe, Revolt, Dashed)
- 🧪 100% test coverage

## Installation

```sh
## npm
npm install input-otp-native

## yarn
yarn add input-otp-native

#pnpm
pnpm add input-otp-native
```

## Examples ( copy paste)

> [Apple OTP Input](./example/src/examples/apple.tsx)

> [Apple OTP Input with Nativewind](./example/src/examples/apple-nativewind.tsx)

> [Stripe OTP Input](./example/src/examples/stripe.tsx)

> [Stripe OTP Input with Nativewind](./example/src/examples/stripe-nativewind.tsx)

> [Revolt OTP Input](./example/src/examples/revolt.tsx)

> [Revolt OTP Input with Nativewind](./example/src/examples/revolt-nativewind.tsx)

> [Dashed OTP Input](./example/src/examples/dashed.tsx)

> [Dashed OTP Input with Nativewind](./example/src/examples/dashed-nativewind.tsx)

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

## Web support

The library is mainly inspired by [otp-input](https://github.com/guilhermerodz/input-otp) and has a similar API, so we recommend using it on the web.

We can easily create the same component for web and create a new file for it (example/src/examples/apple.web.tsx)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

## Credits

- [create-react-native-library](https://github.com/callstack/react-native-builder-bob) for the library template.

- [otp-input](https://github.com/guilhermerodz/input-otp) for the original idea and some code.
