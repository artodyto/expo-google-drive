import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CurrentUser from "./CurrentUser";

const WEB_CLIENT_ID = Constants?.expoConfig?.extra?.WEB_CLIENT_ID;

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.appdata"],
  webClientId: WEB_CLIENT_ID,
});

const URL = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder";

export default function () {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState<boolean>(false);
  const [gDriveToken, setGDriveToken] = useState<string | null>(null);
  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    setCurrentUser(currentUser);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    const initializeGoogleDrive = async () => {
      try {
        if (!isFetchingToken) {
          setIsFetchingToken(true);
          let token = await GoogleSignin.getTokens();
          if (!token) return alert("Failed to get token");
          setGDriveToken(token.accessToken);
          console.log("res.accessToken =>", token.accessToken);
        }
      } catch (error) {
        console.log({ error });
      } finally {
        setIsFetchingToken(false);
      }
    };

    if (!currentUser) return;
    initializeGoogleDrive();

    return () => {
      setIsFetchingToken(false);
    };
  }, [currentUser]);

  if (currentUser) {
    return (
      <View>
        <CurrentUser
          currentUser={currentUser}
          onLogout={async () => {
            try {
              await GoogleSignin.signOut();
              setCurrentUser(null); // Remember to remove the user from your app's state as well
            } catch (error) {
              console.error(error);
            }
          }}
          onRevokeAccess={async () => {
            try {
              await GoogleSignin.revokeAccess();
            } catch (error) {
              console.error(error);
            }
          }}
        />
        {isFetchingToken ? <Text>Fetching token...</Text> : null}
      </View>
    );
  }

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          setCurrentUser(userInfo);
        } catch (error) {
          console.log({ error });
        }
      }}
    />
  );
}
