export function LiquidBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const g = useGlassTokens();

  return (
    <ImageBackground
      source={require('../assets/bg-wallpaper.jpg')}
      resizeMode="cover"
      blurRadius={3}
      style={[styles.container, { backgroundColor: g.bgBase }, style]}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: g.isDark
              ? 'rgba(7, 11, 20, 0.45)'
              : 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
}
