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
        {/* rutas para el flujo de reporte */}
        <Stack.Screen name="reporte/nuevo" options={{ title: "Nuevo reporte" }} />
        <Stack.Screen name="reporte/escanear" options={{ title: "Escanear QR" }} />
        <Stack.Screen name="reporte/foto" options={{ title: "Adjuntar foto" }} />
        <Stack.Screen name="reporte/ubicacion" options={{ title: "Ubicación" }} />
      </Stack>
    </AppProvider>
  );
}
