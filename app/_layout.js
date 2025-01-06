import { Stack } from "expo-router/stack";
import { TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // İkon kütüphanesi
import { useRouter } from "expo-router"; // Router fonksiyonunu import edin

const AppLayout = () => {
  const router = useRouter(); // Router objesini burada tanımlayın

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#1D1E24",
        headerShadowVisible: false,
        animation: "slide_from_right",
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
    >
      {/* Sekme Ekranı */}
      <Stack.Screen
        name="src/screens/tabs"
        options={{
          headerShown: false,
        }}
      />

      {/* Login Ekranı */}
      <Stack.Screen
        name="src/screens/login"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: "#fff",
                height: 80,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              {/* Geri Dönüş Butonu */}
              <TouchableOpacity
                onPress={() => router.push("/src/screens/front-page")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 60,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="#121212"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
};

export default AppLayout;