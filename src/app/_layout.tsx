import { Stack } from "expo-router";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            presentation: "modal",
            title: "Permiso",
            headerShown: true,
          }}
        />
      </Stack>
    </AppProvider>
  );
}
