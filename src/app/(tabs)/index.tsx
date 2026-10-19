import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";

export default function Inicio() {
  const { reportes } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Mantenimiento IPF</Text>

      <Text style={styles.descripcion}>
        Reportá desperfectos del Instituto.
      </Text>

      <Text style={styles.subtitulo}>Mis reportes</Text>

      {/* lista de reportes o mensaje vacio */}
      {reportes.length === 0 ? (
        <Text style={styles.vacio}>Todavia no hay reportes cargados.</Text>
      ) : (
        <View style={styles.lista}>
          {reportes.map((rep) => (
            <View key={rep.id} style={styles.tarjetaReporte}>
              <View style={styles.filaHeader}>
                <Text style={styles.reporteTitulo}>{rep.titulo}</Text>
                <View style={styles.badgeEstado}>
                  <Text style={styles.textoBadgeEstado}>{rep.estado.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.reporteDescripcion} numberOfLines={2}>
                {rep.descripcion}
              </Text>
              <View style={styles.filaInfo}>
                <Text style={styles.infoTexto}>Cat: {rep.categoria}</Text>
                {rep.aula ? <Text style={styles.infoTexto}>Aula: {rep.aula}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )}

      <Link href="/reporte/nuevo" asChild>
        <Pressable style={styles.boton}>
          <Text style={styles.textoBoton}>Nuevo reporte</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#0f172a',
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 24,
    color: '#64748b',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    color: '#1e293b',
  },
  vacio: {
    marginBottom: 25,
    color: '#94a3b8',
    fontSize: 15,
  },
  lista: {
    marginBottom: 20,
    gap: 12,
  },
  tarjetaReporte: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reporteTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  badgeEstado: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoBadgeEstado: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  reporteDescripcion: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 18,
  },
  filaInfo: {
    flexDirection: 'row',
    gap: 14,
  },
  infoTexto: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
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
