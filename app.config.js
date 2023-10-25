export default {
  expo: {
    name: "expo-google-drive",
    slug: "expo-google-drive",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.artodyto.expogoogledrive",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "8e4883de-fd74-408f-b807-3259770d36ed",
      },
    },
    plugins: ["@react-native-google-signin/google-signin"],
  },
};
