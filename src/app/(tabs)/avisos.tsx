import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '@/context/AppContext';

export default function Avisos() {
  const { avisos, marcarAvisoLeido } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Avisos</Text>
      <Text style={styles.subtitulo}>
        Canal interno de novedades y resoluciones de reportes, disponible incluso si las notificaciones del sistema están desactivadas.
      </Text>

      {/* lista de avisos o mensaje vacio */}
      {avisos.length === 0 ? (
        <View style={styles.cajaVacia}>
          <Text style={styles.vacio}>Todavía no hay avisos.</Text>
          <Text style={styles.detalleVacio}>
            Cuando se resuelva un reporte y no tengas notificaciones habilitadas, aparecerá aquí.
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
              <View style={styles.filaHeader}>
                <Text style={styles.avisoTitulo}>{aviso.titulo}</Text>
                {!aviso.leido && (
                  <View style={styles.badgeNuevo}>
                    <Text style={styles.textoBadgeNuevo}>Nuevo</Text>
                  </View>
                )}
              </View>

              <Text style={styles.avisoFecha}>
                {new Date(aviso.fecha).toLocaleString()}
              </Text>

              <Text style={styles.avisoMensaje}>{aviso.mensaje}</Text>

              {!aviso.leido && (
                <Pressable
                  style={styles.botonLeido}
                  onPress={() => marcarAvisoLeido(aviso.id)}
                >
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 20,
  },
  cajaVacia: {
    padding: 30,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginVertical: 10,
  },
  vacio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  detalleVacio: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
  listaAvisos: {
    gap: 12,
  },
  tarjetaAviso: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tarjetaNoLeida: {
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff',
  },
  filaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  avisoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  badgeNuevo: {
    backgroundColor: '#208AEF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoBadgeNuevo: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  avisoFecha: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  avisoMensaje: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 10,
  },
  botonLeido: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
  },
  textoBotonLeido: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
});
