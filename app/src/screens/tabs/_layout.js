import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Font from "expo-font";

const TabLayout = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        BebasNeue: require("../../assets/fonts/BebasNeue-Regular.ttf"), // Font dosyasını yükleme
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Fontlar yüklenene kadar boş ekran göster
  }
  
  const handleGoBack = () => {
    router.push("/src/screens/tabs/event-page");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E9B741",
        tabBarInactiveTintColor: "#1D1E24",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        animationEnabled: true, // Animasyon etkinleştirme
        tabBarOptions: {
          activeTintColor: "#E9B741",
          inactiveTintColor: "#1D1E24",
        },
        animationTypeForReplace: "push", // Geçiş animasyon tipi
      }}
    >
      <Tabs.Screen
        name="profile-page"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: "#fff",
                height: 120,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              {/* Geri Dönüş Butonu */}
              <TouchableOpacity
                onPress={handleGoBack}
                style={{
                  paddingTop: 60,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="#1D1E24"
                />
              </TouchableOpacity>

              {/* Başlık */}
              <Text
                style={{
                  color: "#1D1E24",
                  fontSize: 30,
                  fontFamily: "BebasNeue", // Özel font kullanımı
                  textAlign: "center",
                  flex: 1,
                  marginRight: 20,
                  paddingTop: 60,
                }}
              >
                Profil
              </Text>
            </View>
          ),
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="event-page"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: "#fff",
                height: 130,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              {/* Başlık */}
              <Text
                style={{
                  color: "#1D1E24",
                  fontSize: 30,
                  fontFamily: "BebasNeue", // Özel font kullanımı
                  textAlign: "center",
                  flex: 1,
                  paddingTop: 60,
                }}
              >
                Etkinlikler
              </Text>
            </View>
          ),
          title: "Etkinlikler",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-page"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: "#fff",
                height: 120,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              {/* Geri Dönüş Butonu */}
              <TouchableOpacity
                onPress={handleGoBack}
                style={{
                  paddingTop: 60,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="#1D1E24"
                />
              </TouchableOpacity>

              {/* Başlık */}
              <Text
                style={{
                  color: "#1D1E24",
                  fontSize: 30,
                  fontFamily: "BebasNeue", // Özel font kullanımı
                  textAlign: "center",
                  flex: 1,
                  marginRight: 20,
                  paddingTop: 60,
                }}
              >
                Ayarlar
              </Text>
            </View>
          ),
          title: "Ayarlar",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;