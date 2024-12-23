import type { TextInputProps, StyleProp, ViewStyle } from 'react-native';

export interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}

export interface RenderProps {
  slots: SlotProps[];
  isFocused: boolean;
}

type OverrideProps<T, R> = Omit<T, keyof R> & R;

// TODO: remove values from the types  as well as onTextChange
type OTPInputBaseProps = OverrideProps<
  TextInputProps,
  {
    value?: string;
    onChange?: (newValue: string) => unknown;

    maxLength: number;
    pattern?: string | RegExp;

    textAlign?: 'left' | 'center' | 'right';

    onComplete?: (...args: any[]) => unknown;
    pasteTransformer?: (pasted: string) => string;

    containerClassName?: string;
    containerStyle?: StyleProp<ViewStyle>;
  }
>;

export type InputOTPRenderFn = (props: RenderProps) => React.ReactNode;

export type OTPInputProps = OTPInputBaseProps & {
  render?: InputOTPRenderFn;
};
