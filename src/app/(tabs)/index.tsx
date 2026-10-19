import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useApp } from "@/context/AppContext";

export default function Inicio() {
  const { reportes } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.titulo}>Mantenimiento IPF</Text>
          <Text style={styles.descripcion}>
            Reportá desperfectos del Instituto.
          </Text>
        </View>

        {/* boton hacia ajustes de notificaciones */}
        <Pressable
          style={styles.botonAjustesTop}
          onPress={() => router.push('/ajustes-app')}
        >
          <Text style={styles.textoBotonAjustesTop}>Ajustes</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitulo}>Mis reportes</Text>

      {/* lista de reportes o mensaje vacio */}
      {reportes.length === 0 ? (
        <Text style={styles.vacio}>Todavía no hay reportes cargados.</Text>
      ) : (
        <View style={styles.lista}>
          {reportes.map((rep) => {
            const badgeColor =
              rep.estado === 'resuelto'
                ? '#16a34a'
                : rep.estado === 'en_curso'
                ? '#0284c7'
                : '#f59e0b';

            return (
              <Pressable
                key={rep.id}
                style={styles.tarjetaReporte}
                onPress={() =>
                  router.push({
                    pathname: '/reporte/[id]',
                    params: { id: rep.id },
                  })
                }
              >
                <View style={styles.filaHeader}>
                  <Text style={styles.reporteTitulo}>{rep.titulo}</Text>
                  <View style={[styles.badgeEstado, { backgroundColor: badgeColor }]}>
                    <Text style={styles.textoBadgeEstado}>{rep.estado.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.reporteDescripcion} numberOfLines={2}>
                  {rep.descripcion}
                </Text>

                <View style={styles.filaInfo}>
                  <Text style={styles.infoTexto}>Cat: {rep.categoria}</Text>
                  {rep.aula ? <Text style={styles.infoTexto}>Aula: {rep.aula}</Text> : null}
                  <Text style={styles.textoVerDetalle}>Ver detalle ›</Text>
                </View>
              </Pressable>
            );
          })}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    color: '#0f172a',
  },
  descripcion: {
    fontSize: 14,
    color: '#64748b',
  },
  botonAjustesTop: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  textoBotonAjustesTop: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoBadgeEstado: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  reporteDescripcion: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 18,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTexto: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  textoVerDetalle: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: '600',
    color: '#208AEF',
  },
  boton: {
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
