# Economia III Bot de Discord

Este repositorio contiene un bot de Discord diseñado para gestionar un sistema de economía dentro de Discord. Incluye comandos para que los usuarios trabajen, roben, depositen, retiren, vean su saldo e interactúen con una tienda dentro del juego. A continuación, se indican los pasos para desplegar tu propio bot utilizando este repositorio.

## Requisitos Previos

Antes de configurar el bot, asegúrate de tener:

- Node.js instalado en tu máquina. [Descargar Node.js](https://nodejs.org/)
- Un token de bot de Discord. Puedes crear uno siguiendo los pasos a continuación.

## Pasos para Configurar tu Propio Bot de Discord

### 1. Crear un Bot de Discord

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).
2. Haz clic en "New Application" (Nueva aplicación).
3. Nombra tu aplicación (este será el nombre de tu bot) y crea la aplicación.
4. En la pestaña "Bot", haz clic en "Add Bot" (Añadir bot).
5. Guarda el token para usarlo más tarde (lo necesitarás en el archivo `.env`).

### 2. Clonar el Repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/blueberry170502/economia-III
cd economia-III
```

### 3. Instalar Dependencias

Ve a la carpeta del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

### 4. Configurar tu Token de Bot

Para que tu bot funcione, necesitas configurar tu token de Discord. Sigue estos pasos:

1. Dirígete a la carpeta raíz de tu proyecto.
2. Crea un archivo llamado `.env`.
3. Dentro de este archivo, agrega la siguiente línea:
   ```env
   TOKEN_BOT=tu-token-de-bot-aqui
   ```

### 5. Personalizar el Bot (Opcional)

Si deseas personalizar el comportamiento del bot, puedes editar los archivos dentro de la carpeta `src`. Aquí puedes modificar cómo funcionan los comandos, los mensajes que se envían y ajustar otras configuraciones del bot.

Revisa el código en el repositorio y adapta las funcionalidades según tus necesidades. Si no estás seguro de qué archivo editar, comienza con `src/main.js`, que es el archivo principal donde se configura la ejecución del bot.

La personalización puede incluir la modificación de las respuestas, la creación de nuevos comandos, o incluso integrar nuevas funcionalidades.

### 6. Ejecutar el Bot

Una vez todo esté configurado, puedes ejecutar el bot utilizando el siguiente comando en la terminal:

```bash
node src/main.js
```

O para ejecutar en caliente, puedes usar el siguiente comando en tu terminal:

```bash
npm run dev
```

## Comandos Disponibles

- `!work` - Gana dinero trabajando. Este comando permite al usuario obtener una cantidad de dinero virtual. Se puede usar cada 15 segundos.
- `!rob <@usuario>` - Roba a otro usuario. Permite intentar robar dinero de otro usuario del servidor. Se puede usar cada 30 segundos.
- `!dep <cantidad / "all">` - Deposita dinero en tu banco. Puedes guardar dinero virtual de forma segura.
- `!ret <cantidad / "all">` - Retira dinero de tu banco. Puedes retirar el dinero que has depositado previamente.
- `!bal <@usuario?>` - Muestra tu saldo actual o el de otro jugador. Consulta la cantidad de dinero que tienes disponible.
- `!shop` - Muestra la tienda con los objetos disponibles.
- `!buy <itemID> <cantidad>` - Compra un objeto de la tienda. Puedes adquirir artículos en el juego utilizando tu dinero.
- `!inv <@usuario?>` - Muestra tu inventario o el de otro jugador. Muestra todos los artículos que has adquirido.
- `!sell <itemID> <cantidad>` - Vende objetos de tu inventario. Permite deshacerte de artículos que ya no necesites.
- `!coll` - Recoge las ganancias de todos tus objetos. Se puede usar cada día.
- `!help` - Muestra la lista de comandos disponibles.

### Comandos para Moderadores

- `!add <"money"/"item"> <itemID (para item) / "wallet/bank" (para money)> <cantidad> <@usuario>` - Añadir dinero, objetos o roles a un usuario.
- `!remove <"money"/"item"> <itemID (para item) / "wallet/bank" (para money)> <cantidad> <@usuario>` - Eliminar dinero u objetos de un usuario.

Estos comandos permiten interactuar con el sistema de economía y la tienda del bot.
