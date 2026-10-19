import { useApp } from "@/context/AppContext";
import { usePermiso } from "@/hooks/usePermiso";
import { obtenerEtiquetaEstado } from "@/lib/permisos";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function AjustesAppScreen() {
  const { estado, consultar, abrirAjustes } = usePermiso("notifications");
  const { notificacionesHabilitadas, setNotificacionesHabilitadas } = useApp();

  //bandera para recordar que el usuario activo el switch
  const [intentandoActivar, setIntentandoActivar] = useState(false);

  //sincronizar preferencia cuando termina de consultar el permiso
  useEffect(() => {
    if (
      estado !== "cargando" &&
      estado !== "concedido" &&
      notificacionesHabilitadas
    ) {
      setNotificacionesHabilitadas(false);
    }
  }, [estado, notificacionesHabilitadas, setNotificacionesHabilitadas]);

  //activar preferencia si el usuario intento encender el switch y concedio el permiso
  useEffect(() => {
    if (intentandoActivar && estado === "concedido") {
      setNotificacionesHabilitadas(true);
      setIntentandoActivar(false);
    } else if (intentandoActivar && estado === "bloqueado") {
      setIntentandoActivar(false);
    }
  }, [intentandoActivar, estado, setNotificacionesHabilitadas]);

  //manejar activacion o desactivacion del switch
  const handleToggleSwitch = async (nuevoValor: boolean) => {
    if (nuevoValor) {
      //consultar permiso antes de activar
      const estadoActual = await consultar();

      if (estadoActual === "concedido") {
        //activar preferencia si ya esta concedido
        setNotificacionesHabilitadas(true);
        setIntentandoActivar(false);
      } else if (estadoActual === "preguntable") {
        //recordar intento y pasar por pantalla explicativa modal
        setIntentandoActivar(true);
        router.push({
          pathname: "/permisos/[recurso]",
          params: { recurso: "notifications" },
        });
      } else if (estadoActual === "bloqueado") {
        //ofrecer abrir ajustes si esta bloqueado
        setIntentandoActivar(true);
        Alert.alert(
          "Permiso bloqueado",
          "Las notificaciones están bloqueadas en la configuración del dispositivo. Podés habilitarlas desde Ajustes.",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setIntentandoActivar(false),
            },
            {
              text: "Abrir Ajustes",
              onPress: () => void abrirAjustes(),
            },
          ],
        );
      }
    } else {
      //apagar switch sin revocar permiso nativo
      setIntentandoActivar(false);
      setNotificacionesHabilitadas(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Ajustes de la Aplicación</Text>
      <Text style={styles.subtitulo}>
        Configurá las preferencias de avisos y notificaciones de mantenimiento.
      </Text>

      {/* tarjeta de notificaciones */}
      <View style={styles.tarjeta}>
        <View style={styles.filaSwitch}>
          <View style={styles.textosSwitch}>
            <Text style={styles.labelSwitch}>
              Avisarme cuando se resuelva mi reporte
            </Text>
            <Text style={styles.descripcionSwitch}>
              Recibirás una notificación automática cuando el reporte sea
              marcado como resuelto.
            </Text>
          </View>

          <Switch
            value={notificacionesHabilitadas && estado === "concedido"}
            onValueChange={handleToggleSwitch}
            trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
            thumbColor={
              notificacionesHabilitadas && estado === "concedido"
                ? "#208AEF"
                : "#f8fafc"
            }
          />
        </View>

        <View style={styles.separador} />

        {/* estado del permiso nativo */}
        <View style={styles.filaEstado}>
          <Text style={styles.estadoLabel}>
            Estado del permiso del sistema:
          </Text>
          <View
            style={[
              styles.badgeEstado,
              {
                backgroundColor:
                  estado === "concedido"
                    ? "#16a34a"
                    : estado === "bloqueado"
                      ? "#dc2626"
                      : "#0284c7",
              },
            ]}
          >
            <Text style={styles.textoBadgeEstado}>
              {obtenerEtiquetaEstado(estado)}
            </Text>
          </View>
        </View>

        <Text style={styles.detallePlataforma}>
          Plataforma: {Platform.OS.toUpperCase()}{" "}
          {Platform.OS === "android" ? '(Canal "reportes")' : ""}
        </Text>

        {estado === "bloqueado" && (
          <Pressable
            style={styles.botonAjustes}
            onPress={() => void abrirAjustes()}
          >
            <Text style={styles.textoBotonAjustes}>
              Abrir Ajustes del dispositivo
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.botonVolver} onPress={() => router.back()}>
        <Text style={styles.textoBotonVolver}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 20,
  },
  tarjeta: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
  },
  filaSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  textosSwitch: {
    flex: 1,
  },
  labelSwitch: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  descripcionSwitch: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  separador: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 14,
  },
  filaEstado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  estadoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  badgeEstado: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  textoBadgeEstado: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  detallePlataforma: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
  },
  botonAjustes: {
    marginTop: 10,
    backgroundColor: "#334155",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotonAjustes: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  botonVolver: {
    backgroundColor: "#208AEF",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotonVolver: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
