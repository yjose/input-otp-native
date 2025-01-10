import { Text, StyleSheet } from 'react-native';

interface TitleProps {
  children: string;
}

export function Title({ children }: TitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
