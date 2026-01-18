import { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type Props = PropsWithChildren<{
  duration?: number;
  style?: ViewStyle | ViewStyle[];
}>;

export default function FadeInView({ children, duration = 220, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });

    anim.start();

    return () => {
      anim.stop();
    };
  }, [duration, opacity]);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}
