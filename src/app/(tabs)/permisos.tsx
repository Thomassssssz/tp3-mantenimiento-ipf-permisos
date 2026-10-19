import { StyleSheet, Text, View } from "react-native";

export default function Permisos() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Permisos</Text>

      <Text>Estado de los permisos de la aplicacion.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
