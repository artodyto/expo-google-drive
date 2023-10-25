import { User } from "@react-native-google-signin/google-signin";
import React from "react";
import { Button, Image, Text, View } from "react-native";

const CurrentUser: React.FC<{
  currentUser: User;
  onLogout: () => void;
  onRevokeAccess: () => void;
}> = ({ currentUser, onLogout, onRevokeAccess }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
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
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Button title="Logout" onPress={onLogout} />
        <Button title="Revoke access" onPress={onRevokeAccess} />
      </View>
    </View>
  );
};

export default CurrentUser;
