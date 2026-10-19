import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { AppProvider } from "@/context/AppContext";
import { theme } from "@/lib/theme";

//configurar presentacion de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primaryDark,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerBackTitle: 'Volver',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            presentation: "modal",
            title: "Permiso",
            headerShown: true,
          }}
        />
        {/*rutas para el flujo de reporte*/}
        <Stack.Screen name="reporte/nuevo" options={{ title: "Nuevo reporte" }} />
        <Stack.Screen name="reporte/escanear" options={{ title: "Escanear QR" }} />
        <Stack.Screen name="reporte/foto" options={{ title: "Adjuntar foto" }} />
        <Stack.Screen name="reporte/ubicacion" options={{ title: "Ubicación" }} />
        <Stack.Screen name="reporte/[id]" options={{ title: "Detalle de reporte" }} />
        {/*ruta para ajustes de la app*/}
        <Stack.Screen name="ajustes-app" options={{ title: "Ajustes de la App" }} />
      </Stack>
    </AppProvider>
  );
}
