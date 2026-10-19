import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "@/context/AppContext";
import { CategoriaReporte } from "@/lib/types";
import { theme } from "@/lib/theme";

function getCategoriaConfig(categoria: CategoriaReporte): {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
} {
  switch (categoria) {
    case 'electricidad':
      return { icon: 'flash-outline', color: '#d97706', label: 'Electricidad' };
    case 'agua':
      return { icon: 'water-outline', color: '#0284c7', label: 'Agua' };
    case 'mobiliario':
      return { icon: 'construct-outline', color: '#7c3aed', label: 'Mobiliario' };
    case 'equipos':
      return { icon: 'desktop-outline', color: '#475569', label: 'Equipos' };
    default:
      return { icon: 'document-text-outline', color: '#64748b', label: categoria };
  }
}

//pantalla principal con lista de reportes
export default function Inicio() {
  const { reportes } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/*barra superior con logo institucional*/}
      <View style={styles.topBar}>
        <View style={styles.headerIzquierda}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.titulo}>Mantenimiento IPF</Text>
            <Text style={styles.descripcion}>Reportá desperfectos del Instituto.</Text>
          </View>
        </View>

        {/*boton hacia ajustes de notificaciones*/}
        <Pressable
          style={styles.botonAjustesTop}
          onPress={() => router.push('/ajustes-app')}
        >
          <Ionicons name="settings-outline" size={15} color="#334155" />
          <Text style={styles.textoBotonAjustesTop}>Ajustes</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitulo}>Mis reportes</Text>

      {/*lista de reportes o mensaje vacio*/}
      {reportes.length === 0 ? (
        <View style={styles.tarjetaVacia}>
          <Ionicons name="clipboard-outline" size={38} color={theme.colors.textLight} />
          <Text style={styles.vacio}>Todavía no hay reportes cargados.</Text>
          <Text style={styles.vacioDetalle}>Tocá el botón inferior para registrar el primero.</Text>
        </View>
      ) : (
        <View style={styles.lista}>
          {reportes.map((rep) => {
            const estadoConfig = theme.colors.status[rep.estado];
            const catConfig = getCategoriaConfig(rep.categoria);
            const ubicacionTexto =
              rep.aula ? `Aula ${rep.aula}` : rep.ubicacion?.sectorManual ? `Sector ${rep.ubicacion.sectorManual}` : null;

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
                {/*encabezado con titulo y chip de estado*/}
                <View style={styles.filaHeader}>
                  <Text style={styles.reporteTitulo} numberOfLines={1}>
                    {rep.titulo}
                  </Text>
                  <View
                    style={[
                      styles.chipEstado,
                      {
                        backgroundColor: estadoConfig.bg,
                        borderColor: estadoConfig.border,
                      },
                    ]}
                  >
                    <Text style={[styles.textoChipEstado, { color: estadoConfig.text }]}>
                      {estadoConfig.label}
                    </Text>
                  </View>
                </View>

                {/*descripcion breve*/}
                <Text style={styles.reporteDescripcion} numberOfLines={2}>
                  {rep.descripcion}
                </Text>

                {/*fila informativa con categoria y aula*/}
                <View style={styles.filaInfo}>
                  <View style={styles.badgeInfo}>
                    <Ionicons name={catConfig.icon} size={13} color={catConfig.color} />
                    <Text style={styles.infoTexto}>{catConfig.label}</Text>
                  </View>

                  {ubicacionTexto && (
                    <View style={styles.badgeInfo}>
                      <Ionicons name="location-outline" size={13} color={theme.colors.textMuted} />
                      <Text style={styles.infoTexto}>{ubicacionTexto}</Text>
                    </View>
                  )}

                  <View style={styles.contenedorDetalle}>
                    <Text style={styles.textoVerDetalle}>Ver detalle</Text>
                    <Ionicons name="chevron-forward" size={13} color={theme.colors.primary} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/*boton para crear nuevo reporte*/}
      <Link href="/reporte/nuevo" asChild>
        <Pressable style={styles.boton}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Nuevo reporte</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  descripcion: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  botonAjustesTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  textoBotonAjustesTop: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: theme.colors.textPrimary,
  },
  tarjetaVacia: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
    borderStyle: 'dashed',
  },
  vacio: {
    marginTop: 10,
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  vacioDetalle: {
    marginTop: 4,
    color: theme.colors.textLight,
    fontSize: 13,
    textAlign: 'center',
  },
  lista: {
    marginBottom: 24,
    gap: 14,
  },
  tarjetaReporte: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  filaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  reporteTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  chipEstado: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  textoChipEstado: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  reporteDescripcion: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 19,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoTexto: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  contenedorDetalle: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  textoVerDetalle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  boton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    gap: 8,
    padding: 15,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.button,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
