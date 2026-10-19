import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function NuevoReporte() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nuevo reporte</Text>

      <Text style={styles.label}>Titulo</Text>

      <TextInput style={styles.input} placeholder="Ej: Luz quemada" />

      <Text style={styles.label}>Descripcion</Text>

      <TextInput
        style={[styles.input, styles.descripcion]}
        placeholder="Describe el problema"
        multiline
      />

      <Text style={styles.label}>Aula</Text>

      <TextInput style={styles.input} placeholder="Ej: Aula 5" />

      <Text style={styles.label}>Categoria</Text>

      <Text style={styles.categoria}>Todavia sin seleccionar</Text>

      <Pressable style={styles.botonSecundario}>
        <Text>Escanear QR</Text>
      </Pressable>

      <Pressable style={styles.botonSecundario}>
        <Text>Adjuntar foto</Text>
      </Pressable>

      <Pressable style={styles.botonSecundario}>
        <Text>Marcar ubicacion</Text>
      </Pressable>

      <Pressable style={styles.botonPrincipal}>
        <Text style={styles.textoBoton}>Crear reporte</Text>
      </Pressable>
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
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  descripcion: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  categoria: {
    marginBottom: 15,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  botonPrincipal: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
