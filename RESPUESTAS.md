# Parte A

## A1

### a)
Un permiso es una autorización de seguridad explícita que el sistema operativo concede a una aplicación para acceder a hardware protegido (cámara, micrófono, sensores) o a datos personales sensibles de la persona usuaria (ubicación geográfica, fotos, contactos).

Los tres actores cumplen roles claramente diferenciados:
- **La aplicación**: solicita acceso al recurso sensible en el momento oportuno en que lo requiere para una funcionalidad concreta y provee una alternativa si no se lo otorgan.
- **El sistema operativo**: actúa como guardián y árbitro de seguridad. Dibuja y controla los diálogos nativos de autorización, registra la decisión tomada y restringe físicamente las APIs si la app carece del permiso.
- **La persona usuaria**: es la dueña del dispositivo y de su privacidad; decide libremente si concede, restringe o deniega el acceso a sus datos y hardware.

### b)
La caja de arena (*sandbox*) es el mecanismo de aislamiento fundamental de los sistemas operativos móviles modernos (Android e iOS) mediante el cual cada aplicación se ejecuta en su propio proceso aislado, con un espacio de almacenamiento privado y sin privilegios para interactuar directamente con la memoria, archivos de otras aplicaciones o el hardware del dispositivo.

La relación con los permisos es directa: los permisos representan los canales controlados y fiscalizados por el sistema operativo que permiten a una aplicación salir temporalmente de su *sandbox* para interactuar con recursos compartidos o sensibles del sistema.

Sin ningún permiso, una aplicación puede:
- Ejecutar lógica interna de cómputo y algoritmos en JavaScript/TypeScript y código nativo.
- Renderizar componentes de interfaz de usuario en pantalla (textos, listas, botones, modales).
- Almacenar datos en su directorio privado local (archivos privados o caché de la app).
- Reproducir animaciones y sonidos empaquetados en sus propios assets.
- En Android, conectarse a Internet si declaró `android.permission.INTERNET` (que es un permiso de instalación que no requiere autorización en tiempo de ejecución), o en iOS acceder a la red pública sin requerir permiso alguno.
- Utilizar componentes del sistema que corren fuera de su proceso, como el selector nativo de imágenes (*Photo Picker*).

### c)
Las cuatro razones por las que existen los permisos son:
1. **Privacidad**: Proteger la información íntima y sensible de la persona.  
   *Ejemplo*: Evitar que una aplicación lea silenciosamente los contactos de la agenda personal o la biblioteca de fotos privadas sin el consentimiento explícito del usuario.
2. **Seguridad**: Prevenir acciones maliciosas, espionaje o fraudes.  
   *Ejemplo*: Impedir que una aplicación encienda el micrófono o la cámara en segundo plano para escuchar conversaciones confidenciales.
3. **Consumo de recursos y costos**: Proteger la duración de la batería, el rendimiento del hardware y la factura de datos móviles.  
   *Ejemplo*: El uso ininterrumpido del sensor GPS con máxima precisión consume batería de forma acelerada; el permiso garantiza que solo se active bajo conocimiento del usuario.
4. **Transparencia y control**: Garantizar que el usuario sepa con precisión qué capacidades utiliza cada app y pueda revocar accesos en cualquier momento desde Ajustes.  
   *Ejemplo*: Poder permitir la ubicación geográfica solo mientras la app está abierta en pantalla y revocarla al finalizar el viaje.

### d)
En la analogía del portero del edificio:
- **La visita**: es la aplicación que solicita entrar a utilizar un recurso.
- **El portero**: es el sistema operativo (Android o iOS) que vigila el acceso en la entrada del edificio.
- **El dueño del departamento**: es la persona usuaria, quien decide si autoriza o deniega el paso.

Que “el portero se acuerda de la respuesta” significa que el sistema operativo almacena en su registro interno la decisión tomada por la persona usuaria. Si el dueño ya respondió "No permitir" definitivamente (o "Permitir siempre"), ante futuros intentos de la visita, el portero ya no vuelve a tocar el timbre para consultar de nuevo: directamente deniega el acceso sin mostrar ningún diálogo (o permite el acceso inmediato).

---

## A2

| Pregunta | Declarar (al compilar) | Solicitar (al ejecutar) |
| --- | --- | --- |
| **¿Qué se hace?** | Se informa formalmente al sistema operativo durante la etapa de compilación qué recursos sensibles y APIs protegidas podría llegar a utilizar la app. | Se invoca la API en tiempo de ejecución (*runtime*) en el momento exacto en que se requiere la función para consultar el estado o desplegar el diálogo nativo de autorización. |
| **¿Dónde / cómo en Android?** | En `AndroidManifest.xml` mediante etiquetas `<uses-permission android:name="..." />`. | Mediante métodos de la API de Android (`ActivityCompat.requestPermissions()`). |
| **¿Dónde / cómo en iOS?** | En el archivo `Info.plist`, registrando la clave de uso específica (*UsageDescription*) junto al texto de propósito obligatorio. | Mediante los métodos de los frameworks nativos correspondientes (`AVCaptureDevice.requestAccess()`, `CLLocationManager.requestWhenInUseAuthorization()`). |
| **¿Dónde / cómo en Expo?** | En `app.json` (o `app.config.ts`), configurando el bloque `plugins` de cada módulo con los textos de propósito y opciones de permisos. | Llamando a las funciones asíncronas de cada módulo (ej. `Camera.requestCameraPermissionsAsync()`) o a la función `pedir()` de sus hooks correspondientes. |
| **¿Qué pasa si se omite?** | En Android, la solicitud falla silenciosamente o se deniega de inmediato sin mostrar diálogo; en iOS, la app crashea al instante (*crash* por SIGABRT) y el binario es rechazado en App Store Connect. | La app no obtiene acceso al recurso en tiempo de ejecución, por lo que la operación protegida falla arrojando una excepción de seguridad o denegación de acceso. |

---

## A3

### a) Falso
El diálogo de permiso lo dibuja única y exclusivamente el sistema operativo de forma nativa fuera del árbol de vistas de React Native. Se diseñó así por estrictas razones de seguridad para impedir que las aplicaciones puedan suplantar, modificar o interceptar las decisiones de privacidad del usuario mediante código propio.

### b) Verdadero
En el flujo gestionado de Expo (*Continuous Native Generation*), `app.json` es la única fuente de verdad; los archivos nativos `AndroidManifest.xml` e `Info.plist` son generados automáticamente al compilar o ejecutar `expo prebuild`.

### c) Falso
Las actualizaciones OTA (*Over-The-Air*, como EAS Update) únicamente permiten distribuir modificaciones del bundle de JavaScript y assets estáticos. Cualquier cambio en permisos, manifiestos nativos o `Info.plist` modifica la estructura del binario compilado y requiere generar y distribuir una nueva versión instalable (.apk / .aab / .ipa).

### d) Falso
Si un permiso no fue declarado previamente en el manifiesto de Android, el sistema operativo no muestra ningún diálogo al usuario; la promesa se resuelve de inmediato como denegada (`status: 'denied'`, `canAskAgain: false`).

### e) Falso
El paquete unificado `expo-permissions` se encuentra completamente discontinuado y obsoleto desde Expo SDK 41. En Expo SDK 57 cada librería provee sus propios métodos y hooks específicos (ej. `expo-camera`, `expo-location`, `expo-notifications`).

### f) Verdadero
En iOS, las notificaciones locales y remotas no requieren una clave descriptiva en `Info.plist`; su autorización se gestiona directamente en tiempo de ejecución a través del framework nativo `UserNotifications` (`UNUserNotificationCenter`).

### g) Verdadero
Cuando el usuario en iOS concede acceso limitado a fotografías ("Seleccionar fotos"), el sistema asigna `status: 'granted'`, y la restricción se expresa mediante la propiedad `accessPrivileges: 'limited'`.

### h) Verdadero
Al desinstalar y volver a instalar la aplicación en el dispositivo, el sistema operativo borra por completo los registros internos de permisos vinculados al paquete, regresando el estado de todos los recursos a "sin decidir" (`undetermined`).

---

## A4

### a)
**Diagrama de estados:**

- **Android (Android 11+)**:
  1. `Sin decidir (undetermined)`: Estado inicial. Al solicitar por primera vez, el sistema muestra el diálogo nativo.
  2. Si el usuario toca "No permitir" por primera vez, pasa a `Denegado preguntable (denied, canAskAgain: true)`. En este estado aún es posible desplegar el diálogo nativo una segunda vez.
  3. Si el usuario toca "No permitir" por segunda vez, pasa a `Bloqueado (denied, canAskAgain: false)`. El sistema asume "no volver a preguntar" y no volverá a mostrar diálogos. Solo puede reactivarse desde Ajustes del sistema.
  4. Si en cualquier diálogo toca "Permitir", pasa a `Concedido (granted)`.
- **iOS**:
  1. `Sin decidir (undetermined)`: Estado inicial. La app tiene una única oportunidad para mostrar el diálogo del sistema.
  2. Si el usuario toca "No permitir", pasa directamente a `Bloqueado (denied, canAskAgain: false)`. Nunca más se puede desplegar un diálogo en tiempo de ejecución; solo se puede revertir guiando a la persona a los Ajustes del sistema.
  3. Si toca "Permitir", pasa a `Concedido (granted)`.

**Diferencia central**:
La diferencia fundamental radica en la cantidad de oportunidades que ofrece el sistema para interactuar con el diálogo nativo: iOS otorga **una única oportunidad** (un rechazo bloquea definitivamente el diálogo en tiempo de ejecución), mientras que Android (a partir de la versión 11) otorga **dos oportunidades** antes de considerar el permiso bloqueado de forma definitiva (`canAskAgain: false`).

### b)

| Estado | status | canAskAgain | ¿Puede aparecer el diálogo? |
| --- | --- | --- | --- |
| Sin decidir | `'undetermined'` | `true` | Sí |
| Concedido | `'granted'` | `true` | No (el recurso ya se encuentra autorizado) |
| Denegado (se puede volver a pedir) | `'denied'` | `true` | Sí |
| Bloqueado | `'denied'` | `false` | No (debe derivarse al usuario a Ajustes) |

---

# Parte B

## B1

| Permiso | Tipo | ¿Cómo se obtiene? |
| --- | --- | --- |
| `INTERNET` | De instalación (normal) | Se concede automáticamente al momento de la instalación si está declarado en el manifiesto. |
| `CAMERA` | De tiempo de ejecución (*runtime / dangerous*) | Se declara en el manifiesto y se solicita en tiempo de ejecución mediante diálogo nativo al usuario. |
| `VIBRATE` | De instalación (normal) | Se concede automáticamente al momento de la instalación si está declarado en el manifiesto. |
| `SYSTEM_ALERT_WINDOW` | Especial | La app debe dirigir al usuario a la pantalla de Ajustes del sistema ("Mostrar sobre otras aplicaciones") para que lo habilite de forma manual. |
| `POST_NOTIFICATIONS` | De tiempo de ejecución (*runtime / dangerous* desde Android 13) | Se declara en el manifiesto y se solicita mediante diálogo nativo en tiempo de ejecución. |
| `ACCESS_NETWORK_STATE` | De instalación (normal) | Se concede automáticamente al momento de la instalación si está declarado en el manifiesto. |
| `READ_CONTACTS` | De tiempo de ejecución (*runtime / dangerous*) | Se declara en el manifiesto y se solicita mediante diálogo nativo en tiempo de ejecución. |
| `SCHEDULE_EXACT_ALARM` | Especial / instalación condicionado | Declarado en el manifiesto; en versiones modernas de Android (Android 13+) requiere habilitación en Ajustes o justificación bajo políticas estrictas de Google Play. |
| `RECORD_AUDIO` | De tiempo de ejecución (*runtime / dangerous*) | Se declara en el manifiesto y se solicita mediante diálogo nativo en tiempo de ejecución. |
| `MANAGE_EXTERNAL_STORAGE` | Especial | Requiere que el usuario lo habilite manualmente en la pantalla de Ajustes ("Acceso a todos los archivos"); altamente restringido por Google Play. |

---

## B2

### a)
Un grupo de permisos es una categorización lógica que hace el sistema operativo de permisos vinculados al mismo tipo de hardware o dato sensible (por ejemplo, el grupo `LOCATION` contiene a `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION`).

Si la aplicación solicita `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` simultáneamente en la misma llamada, la persona usuaria ve **un único diálogo unificado** donde puede elegir entre conceder ubicación "Precisa" o "Aproximada".

### b)
El nombre completo de un permiso en Android lleva el prefijo del paquete del sistema: `android.permission.`.  
El nombre completo del permiso de cámara es: `android.permission.CAMERA`.

### c)
Los permisos de firma (*signature permissions*) son permisos especiales que el sistema operativo concede únicamente si la aplicación solicitante está firmada con el mismo certificado digital criptográfico que la aplicación o módulo que declaró el permiso (típicamente el fabricante del sistema o la imagen del firmware).

No se utilizan en aplicaciones comunes de terceros porque desarrolladores independientes poseen certificados de firma diferentes, por lo que el sistema denegaría la solicitud; están reservados para comunicación segura entre apps del mismo desarrollador o para componentes propios del sistema operativo.

---

## B3

### a)
- **Se conceden solos al instalar**: `android.permission.INTERNET`, y condicionalmente `android.permission.READ_EXTERNAL_STORAGE` (en dispositivos con Android 12 o inferior).
- **Hay que pedir además en tiempo de ejecución**: `android.permission.CAMERA`, `android.permission.ACCESS_COARSE_LOCATION`, `android.permission.ACCESS_FINE_LOCATION` y `android.permission.POST_NOTIFICATIONS`.

### b)
`android:maxSdkVersion="32"` indica que dicho permiso solo se registrará y aplicará en dispositivos cuya versión de Android sea igual o inferior a Android 12L (API 32); a partir de Android 13 (API 33) el sistema ignora por completo esa directiva.

A partir de Android 13, `READ_EXTERNAL_STORAGE` se reemplaza por los permisos multimedia granulares:
- `android.permission.READ_MEDIA_IMAGES` (para fotos)
- `android.permission.READ_MEDIA_VIDEO` (para videos)
- `android.permission.READ_MEDIA_AUDIO` (para música y audios)

### c)
`tools:node="remove"` es una directiva de fusión (*manifest merger*) que le ordena al compilador de Android eliminar dicho permiso del `AndroidManifest.xml` final, incluso si alguna librería de terceros (como `expo-camera`) lo incluía por defecto en su propio manifiesto empaquetado.

El fragmento de `app.json` que lo genera es:
```json
{
  "expo": {
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

### d)
Se agrega en la propiedad `android.permissions` dentro del objeto `expo` en `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.SCHEDULE_EXACT_ALARM"
      ]
    }
  }
}
```

### e)
En Expo no conviene editar `android/app/src/main/AndroidManifest.xml` a mano porque en el modelo de generación continua de nativo (*CNG*), ese archivo es generado automáticamente por el comando `npx expo prebuild`. Cualquier modificación manual se perderá al regenerar el código nativo o al compilar en EAS Build.

`blockedPermissions` **no funciona en Expo Go** porque Expo Go es un cliente nativo genérico ya precompilado que incluye todos los permisos universales en su propio manifiesto. Solo tiene efecto en una *development build* o compilación nativa propia.

---

## B4

### a)
No, el diálogo del sistema operativo en Android no admite textos personalizados provistos por la aplicación. Por esta razón, la justificación del uso del recurso debe brindarse **antes** de abrir el diálogo nativo, utilizando una pantalla previa explicativa propia (*in-app rationale* o modal informativa) o en la propia pantalla en contexto antes de presionar el botón de activación.

### b)
- **Mientras la app está en uso**: Otorga un permiso persistente que permite a la app utilizar el recurso siempre que esté en primer plano (o en un servicio en primer plano autorizado).
- **Solo esta vez**: Otorga un permiso de un solo uso que expira automáticamente cuando la persona usuaria sale de la aplicación o tras un breve período de inactividad; al reabrir la app, el permiso regresa al estado "sin decidir".

Esta última opción existe para los recursos críticos de hardware y privacidad introducidos en Android 11: **Cámara**, **Micrófono** y **Ubicación**.

### c)
Si la persona usuaria toca "No permitir" dos veces consecutivas en Android 11 o superior, el sistema operativo interpreta la negativa como un rechazo permanente equivalente a "No volver a preguntar". A partir de ese momento, `canAskAgain` toma el valor `false` y cualquier llamada posterior a solicitar el permiso se deniega de forma inmediata sin mostrar diálogo alguno.

### d)
- **Función que funciona bien con ubicación aproximada**: Consulta del pronóstico meteorológico por ciudad o visualización de un catálogo de ofertas comerciales en la localidad o barrio.
- **Función que NO funciona bien con ubicación aproximada**: Navegación guiada paso a paso por GPS (como Waze o Google Maps) o cálculo de velocidad y distancia exacta en una app de entrenamiento atlético.

### e)
Si la persona usuaria suspende la aplicación, se dirige a los Ajustes del sistema y revoca un permiso mientras la app permanece abierta en segundo plano, **Android termina (mata) de forma inmediata el proceso de la aplicación**. Esto garantiza la seguridad del sistema y evita que la app continúe ejecutando operaciones en memoria con permisos inconsistentes; al regresar a la aplicación, esta se inicia desde cero o restaura su estado guardado.

---

## B5

| Cambio | Versión (API) | Qué implica para el código |
| --- | --- | --- |
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | Ya no basta con declarar en el manifiesto; el código debe verificar y solicitar los permisos en tiempo de ejecución antes de acceder a APIs sensibles y contemplar el camino si el usuario los deniega. |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29) | Se crea `ACCESS_BACKGROUND_LOCATION`. No se puede solicitar junto con primer plano: el código debe pedir primero primer plano y, solo tras ser concedido, solicitar segundo plano de forma escalonada con justificación explícita. |
| Dos rechazos equivalen a “no volver a preguntar” | Android 11 (API 30) | La app no puede insistir de forma continua con diálogos; al segundo rechazo `canAskAgain` pasa a `false`. El código debe detectar este estado y guiar a la persona a Ajustes. Se añaden permisos temporales ("Solo esta vez"). |
| Ubicación precisa o aproximada | Android 12 (API 31) | El diálogo del sistema permite al usuario elegir entre precisión exacta o aproximada. El código de la app debe solicitar ambos permisos juntos y adaptarse a operar si solo se concede ubicación aproximada sin romperse. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Mostrar notificaciones locales o push requiere declarar `POST_NOTIFICATIONS` y solicitar autorización explícita al usuario mediante diálogo nativo. Obliga a definir canales de notificación previos. |
| Acceso parcial a fotos y videos (“Seleccionar fotos”) | Android 14 (API 34) | Se incorpora `READ_MEDIA_VISUAL_USER_SELECTED`, permitiendo al usuario otorgar acceso únicamente a fotos seleccionadas puntualmente sin entregar toda su biblioteca multimedia. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 16 (API 36) | La búsqueda, descubrimiento y comunicación con dispositivos en la misma red local Wi-Fi requerirá autorización explícita de la persona usuaria, similar al modelo de iOS. |

**targetSdkVersion**:  
Es la propiedad del manifiesto de Android que especifica para qué versión de la API del sistema operativo fue diseñada y probada la aplicación; le indica a Android qué comportamientos modernos de seguridad, privacidad y ciclo de vida debe exigir y aplicar a la app.

Expo SDK 57 usa:
- `compileSdkVersion 36`
- `targetSdkVersion 36`
- **Android 16 / API 36**

Google Play exige que a partir del 31 de agosto de 2026, para aplicaciones móviles normales, tanto las aplicaciones nuevas como las actualizaciones enviadas a la tienda apunten obligatoriamente a **Android 16 / API 36** o superior como `targetSdkVersion` para poder ser publicadas.

---

# Parte C

## C1

| Recurso | Clave en Info.plist |
| --- | --- |
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | No lleva clave en `Info.plist` (se solicita vía `UNUserNotificationCenter`). |

---

## C2

### a)
Si falta el texto de propósito en `Info.plist` y la app intenta acceder a la cámara en un dispositivo iOS, el sistema operativo termina el proceso inmediatamente provocando un **cierre forzoso (*crash*) instantáneo** (señal SIGABRT con mensaje de terminación por violación de privacidad).

Al subir el binario a App Store Connect, el procesamiento es **rechazado automáticamente** por Apple con el error **ITMS-90683: Missing Purpose String in Info.plist**.

### b)
iOS muestra el diálogo del sistema para un permiso **exactamente una sola vez** durante toda la vida de la app en el dispositivo.

Si la persona dice "No permitir", la app ya no puede volver a invocar el diálogo nativo. La única opción disponible es explicar la situación al usuario y ofrecerle un botón que lo dirija a la sección de Ajustes de la aplicación mediante la función `Linking.openSettings()` para que lo active manualmente.

### c)
- **Parte que arma el sistema**: El encabezado con el título estándar del diálogo, el nombre de la aplicación y los botones del sistema ("No permitir", "Permitir").
- **Parte que escribe la app**: El texto de propósito (*usage description*), que es el cuerpo central del diálogo donde se explica la razón específica del pedido.

En Expo, este texto se configura en `app.json` dentro de la propiedad correspondiente de cada plugin en el arreglo `plugins` (por ejemplo, en `plugins: [["expo-camera", { "cameraPermission": "Texto explicativo..." }]]`).

### d)
Esto ocurre porque el proceso de revisión de Apple realiza un análisis estático de los símbolos binarios y frameworks vinculados en la aplicación compilada. Si una librería de terceros incluye llamadas a APIs protegidas de Apple (por ejemplo, llamadas a la libreta de contactos o captura de video), el analizador de Apple detecta las referencias y exige el texto de propósito correspondiente en `Info.plist`, sin importar que la app nunca ejecute ese camino de código.

Se resuelve configurando la clave requerida en `app.json` con una justificación transparente, o configurando las opciones del plugin de dicha librería (por ejemplo, `microphonePermission: false`) para que el proceso de compilación excluya el módulo nativo innecesario.

---

## C3

| Texto propuesto | ¿Aprobado? | Versión mejorada |
| --- | --- | --- |
| “Necesitamos tu ubicación.” | No | “Usamos tu ubicación para georreferenciar tu reporte dentro del edificio del instituto.” |
| “Para mejorar tu experiencia.” | No | “Usamos tu ubicación para sugerir de forma automática el aula o sector donde te encontrás.” |
| “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” | Sí | “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” |
| “La app no funciona sin ubicación.” | No | “Usamos tu ubicación para ubicar en el mapa el desperfecto que querés reportar.” |
| “Ubicación requerida por el sistema.” | No | “Usamos tu ubicación para asignarle coordenadas precisas al desperfecto reportado.” |

---

## C4

| Caso | iOS | En Expo |
| --- | --- | --- |
| Fotos limitadas (“Seleccionar fotos”) | iOS 14 | `status: 'granted'` con `accessPrivileges: 'limited'` en la respuesta de `getMediaLibraryPermissionsAsync()`. |
| Ubicación aproximada (interruptor “Precisa”) | iOS 14 | `status: 'granted'` con `ios.accuracy: 'reduced'` en la respuesta de `Location.getForegroundPermissionsAsync()`. |
| “Permitir una vez” (ubicación) | iOS 13 | `status: 'granted'` durante la sesión activa de la app; al cerrarse y reabrirse vuelve a `undetermined`. |
| Ubicación escalonada: de “al usar la app” a “Siempre” | iOS 13+ | Primero solicitar `Location.requestForegroundPermissionsAsync()` y luego `Location.requestBackgroundPermissionsAsync()`. |
| Notificaciones provisionales | iOS 12 | `Notifications.requestPermissionsAsync({ ios: { allowProvisional: true } })`, devolviendo `status: 'granted'` con entrega silenciosa al Centro de Notificaciones. |
| Rastreo entre apps (App Tracking Transparency) | iOS 14.5 | Mediante el módulo `expo-tracking-transparency` invocando `requestTrackingPermissionsAsync()`. |

**Versión mínima de iOS en Expo SDK 57**:  
Expo SDK 57 exige como versión mínima **iOS 16.4+**.  
La consecuencia práctica sobre la tabla anterior es que **el 100% de los dispositivos iOS compatibles con Expo SDK 57 ya soportan todas estas funcionalidades modernas de acceso gradual y parcial** (ya que todas fueron introducidas entre iOS 12 e iOS 14.5, siendo anteriores a iOS 16.4). Por ende, no es necesario escribir bifurcaciones ni código de retrocompatibilidad para versiones antiguas de iOS.

---

## C5

| Aspecto | Android | iOS |
| --- | --- | --- |
| **¿Dónde se declara?** | En `AndroidManifest.xml` mediante etiquetas `<uses-permission>` y directivas de manifiesto. | En `Info.plist` mediante claves descriptivas de uso (*UsageDescription*). |
| **Texto en el diálogo** | Estándar y fijado por el sistema operativo. La app no puede personalizar el contenido del diálogo nativo. | Personalizado por la app: incluye de forma destacada el texto de propósito redactado en `Info.plist`. |
| **Oportunidades para preguntar** | Hasta 2 veces (tras el primer rechazo sigue siendo preguntable; al segundo pasa a bloqueado en Android 11+). | 1 sola vez en toda la vida de la app (un rechazo bloquea definitivamente el diálogo). |
| **“Solo esta vez” / “Permitir una vez”** | Opción "Solo esta vez" disponible para cámara, micrófono y ubicación; expira al salir de la app. | Opción "Permitir una vez" disponible para ubicación; otorga acceso temporal mientras dure la sesión actual. |
| **Notificaciones** | Permiso de tiempo de ejecución `POST_NOTIFICATIONS` (Android 13+). Exige configurar Canales de Notificación obligatorios. | Permiso solicitado al centro de notificaciones nativo (`UNUserNotificationCenter`). No usa canales de notificación; soporta notificaciones provisionales. |
| **Ubicación en segundo plano** | Permiso separado `ACCESS_BACKGROUND_LOCATION`; requiere haber concedido primer plano y redirige a la pantalla de Ajustes. | Flujo escalonado nativo: primero se solicita "Al usar la app" y luego el sistema ofrece escalar a "Siempre". |
| **Si falta la declaración** | La petición falla silenciosamente o se devuelve como denegada sin mostrar diálogo. | La app crashea de inmediato en tiempo de ejecución (SIGABRT) y el binario es rechazado en App Store Connect. |

---

# Parte D

## D1

| Necesidad | Módulo | Hook / función de permiso |
| --- | --- | --- |
| Escanear un QR con la cámara | `expo-camera` | `useCameraPermissions()` o `Camera.requestCameraPermissionsAsync()` |
| Grabar video con sonido | `expo-camera` | `Camera.requestCameraPermissionsAsync()` y `Camera.requestMicrophonePermissionsAsync()` |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions()` o `Location.requestForegroundPermissionsAsync()` |
| Seguir un envío con la app en segundo plano | `expo-location` | `Location.requestForegroundPermissionsAsync()` seguido de `Location.requestBackgroundPermissionsAsync()` |
| Mostrar un recordatorio | `expo-notifications` | `usePermissions()` o `Notifications.requestPermissionsAsync()` |
| Grabar una nota de voz | `expo-audio` | `Audio.requestRecordingPermissionsAsync()` |
| Galería propia dentro de la app | `expo-media-library` | `usePermissions()` o `MediaLibrary.requestPermissionsAsync()` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()` |

Si un tutorial utiliza `import * as Permissions from 'expo-permissions'`, nos indica que el tutorial está **completamente desactualizado y obsoleto**, ya que dicha librería centralizada fue retirada en Expo SDK 41 en favor de APIs de permisos independientes integradas en cada paquete modular.

---

## D2

### a)
`getForegroundPermissionsAsync()` es una función de solo lectura que consulta el estado actual del permiso registrado en el sistema operativo; **nunca muestra un diálogo** al usuario. Por su parte, `requestForegroundPermissionsAsync()` evalúa el estado y, si el permiso se encuentra en estado preguntable, **solicita al sistema operativo que despliegue el diálogo nativo** interactivo de autorización.

### b)
El hook devuelve una tupla con tres elementos:
1. `permiso`: objeto de respuesta (`PermissionResponse`) con el estado actual del permiso, o `null` durante la carga inicial.
2. `pedirPermiso`: función asíncrona que solicita el permiso desplegando el diálogo nativo si corresponde.
3. `consultarPermiso`: función asíncrona que vuelve a consultar el estado del permiso ante el sistema operativo sin desplegar diálogo.

En el primer render, `permiso` vale `null` mientras se efectúa la consulta asíncrona inicial. La pantalla debe mostrar un indicador de carga (`ActivityIndicator` o vista de espera) para evitar parpadeos de interfaz o evaluar condiciones erróneas antes de conocer el estado real.

### c)
Si `canAskAgain` es `false`, al llamar a `request...()` el sistema operativo no muestra ningún diálogo: la promesa se resuelve inmediatamente devolviendo el estado actual denegado.  
Si se invoca en un bucle o dentro del cuerpo de un componente sin control, provocará un ciclo infinito de re-renderizados que bloqueará el hilo de ejecución de la interfaz, congelará la aplicación y provocará un consumo excesivo de batería y CPU.

---

## D3

| Respuesta (`PermissionResponse`) | Qué hace la app |
| --- | --- |
| `null` | Muestra un indicador de carga mientras se resuelve la consulta asíncrona inicial con el sistema operativo. |
| `{ status: 'granted', granted: true }` | Habilita y ejecuta normalmente la funcionalidad que requiere el recurso (ej. abrir cámara, capturar GPS). |
| `{ status: 'undetermined', canAskAgain: true }` | Muestra la pantalla previa explicativa en contexto con el botón "Continuar" para solicitar el permiso. |
| `{ status: 'denied', canAskAgain: true }` | Permiso rechazado pero aún preguntable (típico de Android tras un primer rechazo). Habilita la alternativa manual y permite reintentar explicando mejor el motivo. |
| `{ status: 'denied', canAskAgain: false }` | Permiso bloqueado. Muestra aviso explicativo, ofrece el botón "Abrir Ajustes" y activa el camino alternativo manual. |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Concede acceso a fotos en modo limitado (iOS). Procesa las fotos habilitadas y ofrece interfaz para que el usuario añada más si lo desea. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Concede ubicación aproximada (Android). Registra la zona general o barrio y adapta la interfaz sin exigir coordenadas exactas. |

**Los dos campos que deciden casi todo son:**
1. `status` (o `granted`): responde a la pregunta **"¿Tiene la app autorización para acceder al recurso en este instante?"** (`'granted'`, `'denied'`, `'undetermined'`).
2. `canAskAgain`: responde a la pregunta **"¿Permite el sistema operativo mostrar el diálogo nativo si la app lo solicita nuevamente?"** (`true` o `false`).

---

## D4

### Simulación en Android 14 (app recién instalada, `expo-location`):

| # | Acción | status | canAskAgain | ¿Diálogo? |
| --- | --- | --- | --- | --- |
| 1 | `getForegroundPermissionsAsync()` | `'undetermined'` | `true` | No |
| 2 | `requestForegroundPermissionsAsync()` → “No permitir” | `'denied'` | `true` | Sí |
| 3 | `requestForegroundPermissionsAsync()` → “No permitir” | `'denied'` | `false` | Sí |
| 4 | `requestForegroundPermissionsAsync()` | `'denied'` | `false` | No |
| 5 | `Linking.openSettings()` → habilita “Mientras la app está en uso” → vuelve y la app consulta | `'granted'` | `true` | No |
| 6 | Igual que el 5, pero la app no vuelve a consultar: ¿qué muestra? | Muestra la pantalla previa de permiso bloqueado, ya que el estado en memoria de React quedó estancado en el valor previo al viaje a Ajustes. |

### Repetición de pasos 1 a 4 en iOS:
En iOS, el resultado cambia en el **paso 2**: al primer rechazo ("No permitir"), `status` pasa a `'denied'` y `canAskAgain` pasa inmediatamente a `false`. Por lo tanto, en el paso 3 ya no aparece diálogo (`¿Diálogo?: No`).

Si la persona elige **“Permitir una vez”** en iOS y luego cierra y reabre la app:  
El permiso de sesión expira. Al reabrir la app, `getForegroundPermissionsAsync()` vuelve a devolver `status: 'undetermined'` y `canAskAgain: true`, otorgando una nueva oportunidad de solicitar permiso en la siguiente sesión.

---

## D5

### Configuración de `app.json`:
```json
{
  "expo": {
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para escanear los códigos QR de los puntos de reciclaje.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos a tu ubicación actual."
        }
      ]
    ]
  }
}
```

### ¿Por qué `expo-camera` agrega `RECORD_AUDIO` en Android aunque la app no grabe sonido?
Porque el código nativo de la biblioteca `expo-camera` está diseñado para soportar tanto fotografía como grabación de video con sonido en un único módulo. En su archivo de manifiesto empaquetado de Android incluye por defecto la declaración `<uses-permission android:name="android.permission.RECORD_AUDIO" />`. Al momento de compilar, el proceso de fusión de manifiestos (*manifest merger*) añade automáticamente el permiso de audio salvo que se lo bloquee explícitamente mediante `recordAudioAndroid: false` o mediante la directiva `blockedPermissions`.

---

## D6

### a)
Porque Expo Go es una aplicación ya compilada y distribuida a través de las tiendas con su propio archivo `Info.plist` y `AndroidManifest.xml` inmutable. Los textos de propósito declarados en el `app.json` de un proyecto local solo se incorporan al compilar el binario nativo propio de la app.

### b)
- **Se puede probar en Expo Go**: Interfaces de usuario de permisos, lectura de códigos QR, selector de fotos del sistema (*photo picker*), geolocalización básica en primer plano y notificaciones locales simples.
- **Necesita una development build**: Reglas de `blockedPermissions`, eliminación de permisos del manifiesto nativo, textos de propósito propios visibles en los diálogos de iOS, notificaciones push remotas (APNs / FCM) en Android y ubicación en segundo plano (`ACCESS_BACKGROUND_LOCATION`).

### c)
- Para inspeccionar los archivos nativos generados:
  ```bash
  npx expo prebuild
  ```
- Para compilar una *development build* local en Android:
  ```bash
  npx expo run:android
  ```

### d)
- **En Android (adb)**:
  ```bash
  adb shell pm reset-permissions <package_name>
  ```
  *(o restablecer completamente los datos de la app con `adb shell pm clear <package_name>`)*
- **En el simulador de iOS (xcrun simctl)**:
  ```bash
  xcrun simctl privacy booted reset all <bundle_identifier>
  ```
  *(o específicamente para la cámara: `xcrun simctl privacy booted reset camera <bundle_identifier>`)*

---

# Parte E

## E1

### Problemas encontrados en el código original:
1. **Crash en el primer render por valor nulo**: En el renderizado inicial el hook `useCameraPermissions()` devuelve `permiso = null`. El código intenta acceder directamente a `permiso.status`, lo que genera un error fatal no capturado (`TypeError: Cannot read properties of null`).
2. **Falta de manejo del estado bloqueado**: No evalúa `canAskAgain === false`. Cuando el permiso queda bloqueado, el botón "Permitir" sigue ejecutando `pedirPermiso` en vano sin que el sistema muestre ningún diálogo, dejando al usuario atrapado sin posibilidad de abrir Ajustes.
3. **Ausencia de alternativa manual**: Si el usuario decide denegar la cámara, la interfaz no ofrece ningún camino alternativo para que pueda ingresar el identificador del aula manualmente por teclado.
4. **No distingue el estado inicial de carga**: La interfaz parpadea o muestra la vista de solicitud antes de conocer si el permiso ya estaba concedido previamente.

### Versión corregida (`src/app/escanear.tsx`):
```tsx
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';

export default function Escanear() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [aulaManual, setAulaManual] = useState('');

  //1. estado cargando
  if (!permiso) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#208AEF" />
        <Text>Comprobando cámara...</Text>
      </View>
    );
  }

  //2. estado concedido
  if (permiso.status === 'granted') {
    return <CameraView style={StyleSheet.absoluteFillObject} facing="back" />;
  }

  //3. estado bloqueado
  if (permiso.status === 'denied' && !permiso.canAskAgain) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Cámara bloqueada</Text>
        <Text style={styles.texto}>
          El acceso a la cámara está bloqueado. Podés habilitarlo desde Ajustes o ingresar el aula manualmente.
        </Text>
        <Button title="Abrir Ajustes" onPress={() => void Linking.openSettings()} />
        <View style={styles.separador} />
        <TextInput
          style={styles.input}
          placeholder="Código de aula manual"
          value={aulaManual}
          onChangeText={setAulaManual}
        />
      </View>
    );
  }

  //4. estado preguntable
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Permiso de cámara</Text>
      <Text style={styles.texto}>Usamos la cámara para leer el QR del aula.</Text>
      <Button title="Continuar" onPress={() => void pedirPermiso()} />
      <View style={styles.separador} />
      <Text style={styles.texto}>O ingresá el aula a mano si preferís no usar la cámara:</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de aula manual"
        value={aulaManual}
        onChangeText={setAulaManual}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedor: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  texto: {
    fontSize: 15,
    marginBottom: 16,
    color: '#333',
  },
  separador: {
    height: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
});
```

---

## E2

### a)
El código solicita el permiso de segundo plano (`requestBackgroundPermissionsAsync`) antes de haber obtenido el permiso de primer plano (`requestForegroundPermissionsAsync`).  
En **Android 11+** y en **iOS**, el sistema prohíbe terminantemente solicitar segundo plano directamente: en Android la llamada arroja una excepción o se rechaza de inmediato, mientras que en iOS las directivas de autorización incremental exigen que primero se autorice "Al usar la app" para poder luego ofrecer la transición a "Siempre".

### b) Función corregida:
```ts
import * as Location from 'expo-location';

export async function activarSeguimiento(): Promise<boolean> {
  //pedir primero ubicacion en primer plano
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) {
    return false;
  }

  //pedir segundo plano de forma escalonada
  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

### c) Función `obtenerUbicacion()`:
```ts
import * as Location from 'expo-location';

export interface ResultadoUbicacion {
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  aproximada: boolean;
}

export async function obtenerUbicacion(): Promise<ResultadoUbicacion | null> {
  try {
    const estado = await Location.getForegroundPermissionsAsync();
    if (!estado.granted) {
      return null;
    }

    //detectar si la precision es aproximada en android o ios
    const esAproximada =
      estado.android?.accuracy === 'coarse' ||
      estado.ios?.accuracy === 'reduced';

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: esAproximada
        ? Location.LocationAccuracy.Balanced
        : Location.LocationAccuracy.High,
    });

    return {
      coordenadas: {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      },
      aproximada: esAproximada,
    };
  } catch (error) {
    //evitar romper la app ante errores de hardware o rechazos
    console.warn('Error al obtener la ubicacion:', error);
    return null;
  }
}
```

### d)
Para la función "farmacias cercanas" **NO hace falta ubicación en segundo plano**: la consulta se realiza en tiempo real cuando el usuario abre la aplicación y busca locales próximos a su posición actual en primer plano.

Si se solicita segundo plano, Google Play exige una declaración estricta de políticas: demostrar que la función principal de la app se vuelve inutilizable sin ubicación en segundo plano, someter la app a revisión manual con un video demostrativo de uso y justificar el cumplimiento de la política de ubicación en segundo plano de Google Play.

---

## E3

### a)
En Android 13+ (API 33), el sistema operativo exige que la aplicación cree al menos un Canal de Notificaciones (`NotificationChannel`) **antes** de solicitar el permiso `POST_NOTIFICATIONS`. Si no existe ningún canal registrado previamente mediante `Notifications.setNotificationChannelAsync()`, el sistema no muestra el diálogo de autorización.

### b)
En Android 12 o versiones anteriores, el permiso de notificaciones no requería autorización en tiempo de ejecución: se concedía automáticamente al momento de instalar la aplicación.

### c)
En iOS se puede utilizar la opción de **Notificaciones provisionales**, solicitándolas con `allowProvisional: true`.  
En código se detecta consultando el estado y verificando si `status === 'granted'` y `ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL`.

### d)
- **Buen momento**: Al finalizar una acción específica donde el usuario espera novedades directas (por ejemplo, justo después de crear un reporte de avería o al activar conscientemente el interruptor "Avisarme cuando se resuelva mi reporte" en Ajustes).
- **Mal momento**: Al iniciar la aplicación por primera vez en la pantalla de bienvenida (*onboarding*), sin que el usuario comprenda aún el valor de la app.

---

## E4

| Necesidad | Herramienta | Permiso |
| --- | --- | --- |
| Elegir una foto de perfil | Selector del sistema (`ImagePicker.launchImageLibraryAsync`) | Ninguno |
| Sacar una foto en el momento | Cámara (`CameraView` o `ImagePicker.launchCameraAsync`) | Cámara (`CAMERA` / `NSCameraUsageDescription`) |
| Editor que muestra toda la galería | Biblioteca multimedia (`expo-media-library`) | Galería completa (`READ_MEDIA_IMAGES` / `NSPhotoLibraryUsageDescription`) |
| Adjuntar la foto de un comprobante | Selector del sistema (`ImagePicker.launchImageLibraryAsync`) | Ninguno |

### Restricciones de Google Play y "el mejor permiso":
Google Play restringe severamente `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO` desde **2023/2024** bajo la política *Photo and Video Permissions*, exigiendo que las aplicaciones utilicen el selector del sistema si solo requieren seleccionar fotos o videos de manera ocasional.

La máxima **"el mejor permiso es ningún permiso"** significa que la arquitectura más segura y respetuosa de la privacidad es aquella donde la aplicación no solicita privilegios persistentes sobre todos los archivos del usuario, sino que delega la selección a un componente del sistema operativo (*Photo Picker*). De este modo, la app solo recibe el archivo puntual que la persona eligió voluntariamente, sin invadir su biblioteca.

---

## E5

### Hook completado:
```ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = /inactive|background/.test(anterior.current);
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });

    return () => sub.remove();
  }, [revisar]);
}
```

### a)
Porque la pantalla de Ajustes del sistema es un proceso externo a la aplicación. Cuando el usuario modifica un permiso en Ajustes, el sistema operativo no emite un evento de cambio hacia el hilo de JavaScript de React Native; la app solo puede enterarse volviendo a consultar activamente la API nativa cuando retoma el foco en primer plano (`active`).

### b)
Se le pasaría la función de consulta del hook (`consultarPermiso` o `getCameraPermissionsAsync`), ya que solo verifica el estado actual en el sistema operativo sin desplegar diálogos invasivos.

### c)
Porque la persona usuaria puede minimizar la app en cualquier momento, ingresar a Ajustes del sistema y revocar o conceder el permiso de forma manual. Si el valor queda guardado en un estado global inmutable "para siempre", la app mantendrá un dato desactualizado respecto a la realidad del sistema operativo.

---

# Parte F

## F1

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
| --- | --- | --- |
| **Delivery · ubicación** | Al confirmar la dirección de entrega o presionar "Localizarme". | Ingresar la calle, número y localidad manualmente en un buscador. |
| **Billetera virtual · cámara** | Al presionar "Pagar con QR" o "Escanear tarjeta". | Digitar el código de pago o los datos de la tarjeta a mano. |
| **Red social · contactos** | Al presionar explícitamente "Buscar amigos de mi agenda". | Buscar amistades por nombre de usuario, correo electrónico o enlace de invitación. |
| **Mensajería · micrófono** | Al mantener presionado el botón de grabar nota de voz. | Escribir mensajes de texto o enviar notas mecanografiadas. |
| **Turnos médicos · notificaciones** | Al confirmar la reserva de un turno o activar recordatorios. | Consultar los turnos programados en la sección "Mis turnos" de la app o recibir recordatorios por correo / SMS. |
| **Editor de fotos · galería completa** | Al entrar a la herramienta de administración masiva o álbumes de la galería local. | Usar el selector del sistema para elegir y editar fotos de a una. |

### ¿Por qué pedir cuatro permisos apenas se abre la app “entrena el No permitir automático”?
Porque al iniciar la app el usuario todavía no conoce su funcionamiento ni ha establecido confianza. Al ser bombardeado por múltiples diálogos consecutivos fuera de contexto, experimenta molestia, desconfianza y fatiga de decisión, lo que lo lleva a presionar compulsivamente "No permitir" en todos los avisos para despejar la pantalla.

---

## F2

### a)
Los tres elementos de una buena pantalla previa son:
1. **El beneficio concreto y tangible para la persona** explicado en lenguaje claro y comprensible.
2. **La aclaración del momento y propósito** específico en que se utilizará el recurso.
3. **Un botón de acción unívoco ("Continuar")** acompañado de la aclaración de que la preferencia puede administrarse en los Ajustes del dispositivo.

### b)
El botón debe decir **"Continuar"** y no "Permitir" porque esa pantalla previa no otorga el permiso; el permiso formal lo otorgará únicamente el diálogo nativo del sistema operativo que se mostrará a continuación. Poner "Permitir" genera falsas expectativas y confunde a la persona usuaria haciéndole creer que ya concedió el acceso.

### c)
La pauta 5.1.1(iv) de Apple exige que las pantallas previas sean honestas y no condicionen ni engañen al usuario. Prohíbe incluir botones como "Ahora no" o "Cerrar" si estos buscan desviar o disuadir al usuario de interactuar con el diálogo del sistema, o si generan interfaces engañosas que intentan adelantarse a la decisión nativa.

### d)
Si el permiso ya está bloqueado (`canAskAgain: false`), la pantalla previa ya no debe mostrar "Continuar" (porque el diálogo del sistema no volverá a aparecer). Debe informar claramente que el permiso se encuentra bloqueado, ofrecer un botón **"Abrir Ajustes"** para derivar al usuario a la configuración del sistema operativo y habilitar visiblemente la alternativa manual.

---

## F3

### a) Ubicación aproximada
*Justificación*: Para ubicar puntos de reciclaje en el barrio basta con conocer el área geográfica general o sector comunal (unos 3 km²); no se precisa precisión satelital milimétrica, protegiendo así la privacidad domiciliaria del usuario y ahorrando batería.

### b) Ubicación “en uso” (con servicio en primer plano)
*Justificación*: La carrera es una actividad deliberada iniciada conscientemente por el deportista. Se satisface con un servicio en primer plano (*foreground service*) mientras la app registra la actividad física, sin requerir el permiso invasivo de ubicación "Siempre" permanente.

### c) Selector del sistema
*Justificación*: Solo se necesita adjuntar una imagen puntual (el DNI). El selector del sistema no exige ningún permiso sobre la galería completa del usuario y le otorga a la app únicamente el archivo seleccionado.

### d) expo-camera sin micrófono
*Justificación*: El escaneo de códigos QR es una operación estrictamente óptica de procesamiento de imagen; no se graba audio, por lo que solicitar acceso al micrófono viola el principio de mínimo privilegio.

---

## F4

### a)
- **Google Play**:
  1. Declaración obligatoria en la consola de Play y política de privacidad transparente para cualquier permiso sensible o de ubicación en segundo plano.
  2. Prohibición expresa de solicitar permisos de almacenamiento amplio (`READ_MEDIA_IMAGES`) cuando la funcionalidad se satisface mediante el selector del sistema (*Photo Picker*).
- **App Store**:
  1. Obligatoriedad de incluir textos de propósito (*UsageDescription*) específicos y honestos en `Info.plist` para cada API protegida utilizada.
  2. Cumplimiento de la política *App Tracking Transparency* (ATT), solicitando autorización explícita si se vinculan datos entre apps de distintas empresas para fines publicitarios.

### b)
`PrivacyInfo.xcprivacy` es el archivo de manifiesto de privacidad exigido por Apple para declarar qué categorías de datos recopila la app y justificar el uso de APIs con motivos requeridos (*Required Reason APIs*, como `UserDefaults` o marcas de tiempo del sistema).  
En Expo se configura en `app.json` dentro de la propiedad `ios.privacyManifests`.

### c)
A partir de Android 17 y con exigencia de Google Play a partir del **27/01/2027**, las aplicaciones no podrán solicitar el permiso de tiempo de ejecución `READ_CONTACTS` de forma generalizada si no constituyen la app principal de llamadas o contactos del sistema. Deberán utilizar obligatoriamente el **selector de contactos del sistema (*Contact Picker*)**, que permite elegir únicamente el contacto específico que el usuario desea compartir.

---

## F5

### a)
- **Causa**: La aplicación intentó invocar una API protegida en iOS (la cámara) sin haber definido la clave correspondiente (`NSCameraUsageDescription`) en el archivo `Info.plist`.
- **Solución**: Configurar el plugin de la cámara en `app.json` con el texto de propósito adecuado (`cameraPermission: "..."`) y ejecutar `npx expo prebuild` para actualizar los archivos nativos.

### b)
- **Causa**: Expo Go tiene todos los permisos universales preconfigurados en su manifiesto compilado, pero en la *development build* el permiso de cámara no fue declarado en el `AndroidManifest.xml` (o fue excluido en `blockedPermissions`), lo que hace que Android deniegue la solicitud de inmediato sin mostrar diálogo.
- **Solución**: Verificar que el plugin `expo-camera` esté registrado en el arreglo `plugins` de `app.json` y que `android.permission.CAMERA` no se encuentre listado dentro de `blockedPermissions`.

### c)
- **Causa**: La aplicación no vuelve a interrogar al sistema operativo cuando retoma el foco luego de que el usuario regresa de Ajustes.
- **Solución**: Implementar una suscripción a `AppState.addEventListener('change')` que invoque a la función `consultar()` tan pronto como el estado de la app cambie a `'active'`.

### d)
- **Causa**: Se colocó la invocación a `request...()` dentro del cuerpo del componente o en un `useEffect` que carece de dependencias correctas o que modifica un estado local, provocando una llamada en bucle en cada re-renderizado.
- **Solución**: Vincular la solicitud a una acción explícita del usuario (por ejemplo, en el manejador `onPress` del botón "Continuar") o estabilizar el efecto con dependencias adecuadas.

### e)
- **Causa**: Se programó una barrera artificial que bloquea el acceso general a la aplicación si no se conceden las notificaciones, violando las buenas prácticas de diseño centrado en el usuario y las directrices de las tiendas.
- **Solución**: Diseñar las notificaciones como una mejora no excluyente. Si el usuario las deniega, permitir el uso completo del sistema y ofrecer las novedades a través de una bandeja interna de avisos (como `/avisos`).
