import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

export default function BrandLogo({ size = 64, rise = 0 }) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [float]);

  const shell = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.28),
  };

  const iconSize = Math.max(16, Math.round(size * 0.42));

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: -Math.max(0, rise) },
          { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [1.5, -2.5] }) },
          { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] }) },
        ],
      }}
    >
      <View style={[styles.shell, shell]}>
      <View style={styles.backGlowBlue} />
      <View style={styles.backGlowOrange} />

      <View style={styles.innerCore}>
        <Ionicons name="home" size={iconSize} color={palette.textOnDark} />
      </View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: palette.darkHero,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backGlowBlue: {
    position: 'absolute',
    top: -12,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.58)',
  },
  backGlowOrange: {
    position: 'absolute',
    bottom: -12,
    left: -10,
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(249,115,22,0.62)',
  },
  innerCore: {
    width: '76%',
    height: '76%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.44)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
