import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mantenimiento IPF</Text>

      <Text style={styles.descripcion}>
        Reportá desperfectos del Instituto.
      </Text>

      <Text style={styles.subtitulo}>Mis reportes</Text>

      <Text style={styles.vacio}>Todavia no hay reportes cargados.</Text>

      <Link href="/reporte/nuevo" asChild>
        <Pressable style={styles.boton}>
          <Text style={styles.textoBoton}>Nuevo reporte</Text>
        </Pressable>
      </Link>
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
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vacio: {
    marginBottom: 25,
  },
  boton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
