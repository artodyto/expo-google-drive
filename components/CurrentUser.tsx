import { User } from "@react-native-google-signin/google-signin";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";

import { Button, Image, Text, View } from "react-native";
import { MainNavigationParamList } from "../navigator/MainNavigator";

const CurrentUser: React.FC<{
  currentUser: User;
  gDriveToken: string | null;
  onLogout: () => void;
  onRevokeAccess: () => void;
}> = ({ currentUser, gDriveToken, onLogout, onRevokeAccess }) => {
  const navigation = useNavigation<NavigationProp<MainNavigationParamList>>();
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        padding: 10,
      }}
    >
      <View>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Welcome to Expo Google Drive,
        </Text>
        {currentUser.user.photo ? (
          <Image
            source={{ uri: currentUser.user.photo }}
            width={50}
            height={50}
          />
        ) : null}

        <Text
          style={{ textAlign: "center", fontWeight: "bold", marginBottom: 10 }}
        >
          {currentUser.user.givenName}
          {currentUser.user.familyName ? ` ${currentUser.user.familyName}` : ""}
        </Text>

        {gDriveToken ? (
          <Button
            title="View Files"
            onPress={() => {
              navigation.navigate("Files", { token: gDriveToken });
            }}
          />
        ) : null}
      </View>
      <View style={{ flexDirection: "row", gap: 5, marginBottom: 10 }}>
        <Button title="Logout" onPress={onLogout} />
        <Button title="Revoke access and log-out" onPress={onRevokeAccess} />
      </View>
    </View>
  );
};

export default CurrentUser;
