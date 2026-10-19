import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router/js-tabs";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="avisos"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="permisos"
        options={{
          title: "Permisos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
