import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '@/context/AppContext';
import { theme } from '@/lib/theme';

//pantalla de avisos y novedades internas
export default function Avisos() {
  const insets = useSafeAreaInsets();
  const { avisos, marcarAvisoLeido } = useApp();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 28,
        },
      ]}
    >
      <Text style={styles.titulo}>Avisos</Text>
      <Text style={styles.subtitulo}>
        Bandeja interna de novedades y resoluciones de reportes, activa incluso sin notificaciones push.
      </Text>

      {/*empty state si no existen avisos*/}
      {avisos.length === 0 ? (
        <View style={styles.tarjetaVacia}>
          <View style={styles.iconoVacioWrapper}>
            <Ionicons name="notifications-off-outline" size={36} color={theme.colors.textLight} />
          </View>
          <Text style={styles.vacio}>No tenés avisos por ahora</Text>
          <Text style={styles.vacioDetalle}>
            Cuando se resuelva un reporte o cambie de estado, vas a recibir el aviso acá.
          </Text>
        </View>
      ) : (
        <View style={styles.listaAvisos}>
          {avisos.map((aviso) => (
            <View
              key={aviso.id}
              style={[
                styles.tarjetaAviso,
                !aviso.leido && styles.tarjetaNoLeida,
              ]}
            >
              {/*encabezado con icono, titulo e indicador de lectura*/}
              <View style={styles.filaHeader}>
                <View style={styles.tituloContenedor}>
                  <View
                    style={[
                      styles.iconoAvisoCirculo,
                      !aviso.leido ? styles.iconoNoLeido : styles.iconoLeido,
                    ]}
                  >
                    <Ionicons
                      name={!aviso.leido ? "mail-unread-outline" : "mail-open-outline"}
                      size={18}
                      color={!aviso.leido ? theme.colors.primary : theme.colors.textMuted}
                    />
                  </View>
                  <View style={styles.textosHeader}>
                    <Text style={styles.avisoTitulo} numberOfLines={1}>
                      {aviso.titulo}
                    </Text>
                    <Text style={styles.avisoFecha}>
                      {new Date(aviso.fecha).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/*chip indicador de leido o no leido*/}
                <View
                  style={[
                    styles.chipLectura,
                    !aviso.leido ? styles.chipNoLeido : styles.chipLeido,
                  ]}
                >
                  <Text
                    style={[
                      styles.textoChipLectura,
                      !aviso.leido ? styles.textoChipNoLeido : styles.textoChipLeido,
                    ]}
                  >
                    {!aviso.leido ? "No leído" : "Leído"}
                  </Text>
                </View>
              </View>

              {/*cuerpo del mensaje*/}
              <Text style={styles.avisoMensaje}>{aviso.mensaje}</Text>

              {/*accion para marcar como leido*/}
              {!aviso.leido && (
                <Pressable
                  style={styles.botonLeido}
                  onPress={() => marcarAvisoLeido(aviso.id)}
                  hitSlop={8}
                >
                  <Ionicons name="checkmark-outline" size={15} color={theme.colors.primary} />
                  <Text style={styles.textoBotonLeido}>Marcar como leído</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 19,
    marginBottom: 20,
  },
  tarjetaVacia: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  iconoVacioWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  vacio: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  vacioDetalle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  listaAvisos: {
    gap: 12,
  },
  tarjetaAviso: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  tarjetaNoLeida: {
    borderColor: '#bfdbfe',
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  filaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  tituloContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconoAvisoCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoNoLeido: {
    backgroundColor: theme.colors.primaryLight,
  },
  iconoLeido: {
    backgroundColor: theme.colors.borderLight,
  },
  textosHeader: {
    flex: 1,
  },
  avisoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  avisoFecha: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  chipLectura: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipNoLeido: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: '#bae6fd',
  },
  chipLeido: {
    backgroundColor: theme.colors.borderLight,
    borderColor: theme.colors.border,
  },
  textoChipLectura: {
    fontSize: 11,
    fontWeight: '700',
  },
  textoChipNoLeido: {
    color: theme.colors.primary,
  },
  textoChipLeido: {
    color: theme.colors.textMuted,
  },
  avisoMensaje: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  botonLeido: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.borderLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
    minHeight: 36,
  },
  textoBotonLeido: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
