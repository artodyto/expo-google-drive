import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import FilesScreen from "../screens/FilesScreen";

export type MainNavigationParamList = {
  Home: undefined;
  Files: {
    token: string;
  };
};

const Stack = createNativeStackNavigator<MainNavigationParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={AuthScreen} />
      <Stack.Screen name="Files" component={FilesScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
