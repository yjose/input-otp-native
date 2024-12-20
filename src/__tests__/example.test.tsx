import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';

function ExampleComponent({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>Click me</Text>
    </Pressable>
  );
}

describe('Example Test', () => {
  it('should handle press events', () => {
    const onPress = jest.fn();
    render(<ExampleComponent onPress={onPress} />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalled();
  });
});
