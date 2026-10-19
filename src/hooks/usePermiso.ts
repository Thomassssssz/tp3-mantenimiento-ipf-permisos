import { abrirAjustesDispositivo } from "@/lib/permisos";
import { EstadoPermiso, TipoRecurso } from "@/lib/types";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

export interface UsePermisoResult {
  estado: EstadoPermiso;
  parcial: boolean;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
  consultar: () => Promise<EstadoPermiso>;
}

export function usePermiso(recurso: TipoRecurso | null): UsePermisoResult {
  const [estado, setEstado] = useState<EstadoPermiso>("cargando");
  const [parcial, setParcial] = useState<boolean>(false);

  const consultar = useCallback(async (): Promise<EstadoPermiso> => {
    if (!recurso) {
      setEstado("bloqueado");
      setParcial(false);
      return "bloqueado";
    }

    try {
      if (recurso === "camera") {
        const res = await Camera.getCameraPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        setEstado(nuevoEstado);
        setParcial(false);

        return nuevoEstado;
      }

      if (recurso === "location") {
        const res = await Location.getForegroundPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        const esAproximada =
          res.status === "granted" &&
          (res.android?.accuracy === "coarse" ||
            res.ios?.accuracy === "reduced");

        setEstado(nuevoEstado);
        setParcial(esAproximada);

        return nuevoEstado;
      }

      if (recurso === "photos") {
        const res = await ImagePicker.getMediaLibraryPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        const esLimitada =
          res.status === "granted" && res.accessPrivileges === "limited";

        setEstado(nuevoEstado);
        setParcial(esLimitada);

        return nuevoEstado;
      }

      if (recurso === "notifications") {
        const res = await Notifications.getPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        setEstado(nuevoEstado);
        setParcial(false);

        return nuevoEstado;
      }

      return "bloqueado";
    } catch (error) {
      console.warn(`Error al consultar permiso de ${recurso}:`, error);

      setEstado("bloqueado");
      setParcial(false);

      return "bloqueado";
    }
  }, [recurso]);

  const pedir = useCallback(async (): Promise<EstadoPermiso> => {
    if (!recurso) {
      return "bloqueado";
    }

    try {
      if (recurso === "camera") {
        const res = await Camera.requestCameraPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        setEstado(nuevoEstado);
        setParcial(false);

        return nuevoEstado;
      }

      if (recurso === "location") {
        const res = await Location.requestForegroundPermissionsAsync();
        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        const esAproximada =
          res.status === "granted" &&
          (res.android?.accuracy === "coarse" ||
            res.ios?.accuracy === "reduced");

        setEstado(nuevoEstado);
        setParcial(esAproximada);

        return nuevoEstado;
      }

      if (recurso === "photos") {
        return await consultar();
      }

      if (recurso === "notifications") {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("reportes", {
            name: "Reportes de Mantenimiento",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#208AEF",
          });
        }

        const res = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });

        const nuevoEstado = mapearEstado(res.status, res.canAskAgain);

        setEstado(nuevoEstado);
        setParcial(false);

        return nuevoEstado;
      }

      return "bloqueado";
    } catch (error) {
      console.warn(`Error al solicitar permiso para ${recurso}:`, error);

      setEstado("bloqueado");
      setParcial(false);

      return "bloqueado";
    }
  }, [recurso, consultar]);

  const abrirAjustes = useCallback(async () => {
    await abrirAjustesDispositivo();
  }, []);

  useEffect(() => {
    consultar();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        consultar();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [consultar]);

  return {
    estado,
    parcial,
    pedir,
    abrirAjustes,
    consultar,
  };
}

function mapearEstado(status: string, canAskAgain?: boolean): EstadoPermiso {
  if (status === "granted") {
    return "concedido";
  }

  if (status === "undetermined") {
    return "preguntable";
  }

  if (status === "denied") {
    if (canAskAgain === true) {
      return "preguntable";
    }

    return "bloqueado";
  }

  return canAskAgain === false ? "bloqueado" : "preguntable";
}
