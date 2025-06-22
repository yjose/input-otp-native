<p align="center">
    <img alt="Input OTP Native" src="./demo.gif"   />
</p>
<h1 align="center">
Input OTP Native 🔐
</h1>
<p align="center">
✨ One time passcode Input For React Native/Expo. Unstyled and fully customizable. ✨
</p>

<p align="center">
<a href="https://github.com/yjose/input-otp-native/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/yjose/input-otp-native/ci.yml?style=flat-square&label=Test&logo=github&color=32A9C3&labelColor=1B3C4A" alt="Test status"></a>
  <a href="https://www.npmjs.com/package/input-otp-native"><img src="https://img.shields.io/npm/v/input-otp-native.svg?style=flat-square&color=32A9C3&labelColor=1B3C4A" alt="version"></a>
  <a href="http://www.npmtrends.com/input-otp-native"><img src="https://img.shields.io/npm/dt/input-otp-native.svg?style=flat-square&color=32A9C3&labelColor=1B3C4A" alt="downloads"></a>
  <a href="https://github.com/yjose/input-otp-native/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/input-otp-native.svg?style=flat-square&color=32A9C3&labelColor=1B3C4A" alt="license"></a>
  <a href="https://github.com/yjose/input-otp-native/stargazers"><img src="https://img.shields.io/github/stars/yjose/input-otp-native.svg?style=flat-square&color=32A9C3&labelColor=1B3C4A" alt="Star on GitHub"></a>

</p>

<hr/>

## Features

- 📱 Built specifically for React Native/Expo
- 🎨 Fully customizable styling with render props ( supports nativewind )
- 📋 Four copy paste styles (Apple, Stripe, Revolt, Dashed)
- 🧪 100% test coverage
- 🔄 Easily animated with react-native-reanimated
- 🌐 Web support with using `otp-input`

```sh
## npm
npm install input-otp-native

## yarn
yarn add input-otp-native

#pnpm
pnpm add input-otp-native
```

## Documentation

- [Homepage](https://input-otp-native.better-app.dev)
- [Getting Started](https://input-otp-native.better-app.dev/getting-started)
- [Examples](https://input-otp-native.better-app.dev/examples)
  - [Apple](https://input-otp-native.better-app.dev/examples/apple)
  - [Stripe](https://input-otp-native.better-app.dev/examples/stripe)
  - [Revolt](https://input-otp-native.better-app.dev/examples/revolt)
  - [Dashed](https://input-otp-native.better-app.dev/examples/dashed)

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
