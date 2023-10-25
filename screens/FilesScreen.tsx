import { NavigationProp, RouteProp } from "@react-navigation/native";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";

import { MainNavigationParamList } from "../navigator/MainNavigator";

const URL = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder";
const gDrive = new GDrive();
const { StorageAccessFramework } = FileSystem;

const getFilesAsync = async (accessToken: string) => {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
  }
};

const uploadFileAsync = async (callback: () => void) => {
  try {
    await gDrive.files
      .newMultipartUploader()
      .setRequestBody({
        name: new Date().toLocaleDateString() + ".json",
        parents: ["appDataFolder"],
      })
      .setData(
        JSON.stringify({
          data: {
            title: "this is some test title",
          },
        }),
        MimeTypes.JSON
      )
      .execute();

    callback();
    alert("File successfully uploaded!");
  } catch (error) {
    alert(error);
  }
};

const FilesScreen: React.FC<{
  navigation: NavigationProp<MainNavigationParamList>;
  route: RouteProp<MainNavigationParamList, "Files">;
}> = ({ navigation, route }) => {
  const { token } = route.params || {};
  gDrive.accessToken = token;

  const [files, setFiles] = useState<{
    files: { id: string; kind: string; mimeType: string; name: string }[];
  }>();

  const getFilesClient = async () => {
    const files = await getFilesAsync(token);
    setFiles(files);
  };
  useEffect(() => {
    getFilesClient();
  }, [token]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView>
        {files?.files?.map((file) => {
          return (
            <View
              key={file.id}
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 10,
              }}
            >
              <Text>{file.id}</Text>
              <Text>{file.name}</Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Button
                  title="View"
                  onPress={async () => {
                    const response = await gDrive.files.getContent(file.id);
                    const data = await response.json();
                    alert(JSON.stringify(data));
                  }}
                />
                <Button
                  title="Delete"
                  onPress={async () => {
                    try {
                      await gDrive.files.delete(file.id);
                      getFilesClient();
                      alert("Successfully removed " + file.id);
                    } catch (error) {
                      alert(error);
                    }
                  }}
                />
                <Button
                  title="Download"
                  onPress={async () => {
                    const response = await gDrive.files.get(file.id);
                    const data = JSON.stringify(await response.json());

                    const permission =
                      await StorageAccessFramework.requestDirectoryPermissionsAsync();
                    const formattedToday = new Date().toLocaleDateString(
                      "en-US",
                      {}
                    );

                    try {
                      if (!permission?.granted) {
                        const response =
                          await StorageAccessFramework.requestDirectoryPermissionsAsync();

                        if (response.granted) {
                          const fileUri =
                            await StorageAccessFramework.createFileAsync(
                              response.directoryUri,
                              `back-up-${formattedToday}`,
                              "application/json"
                            );
                          await FileSystem.writeAsStringAsync(fileUri, data, {
                            encoding: FileSystem.EncodingType.UTF8,
                          });
                          alert("successfully exported");
                        }
                        return;
                      }

                      // Get the directory uri that was approved
                      const fileUri =
                        await StorageAccessFramework.createFileAsync(
                          permission.directoryUri,
                          `back-up-${formattedToday}`,
                          "application/json"
                        );
                      await FileSystem.writeAsStringAsync(fileUri, data, {
                        encoding: FileSystem.EncodingType.UTF8,
                      });
                      alert("successfully exported");
                    } catch (error) {
                      alert(error);
                    }
                  }}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Text>Total Items: {files?.files.length || 0}</Text>
      <Button
        title="Upload"
        onPress={() => {
          uploadFileAsync(() => getFilesClient());
        }}
      />
    </View>
  );
};

export default FilesScreen;
