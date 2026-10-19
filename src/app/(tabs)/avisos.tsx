import { StyleSheet, Text, View } from "react-native";

export default function Avisos() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Avisos</Text>

      <Text>Todavia no hay avisos.</Text>
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
