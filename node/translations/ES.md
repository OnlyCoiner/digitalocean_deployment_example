
[OnlyCoiners]: https://www.onlycoiners.com
[OnlyCoiners Email]: mailto:dev@onlycoiners.com
[OnlyCoiners Job Board]: https://www.onlycoiners.com/jobs
[OnlyCoiners WhatsApp Group For Job Posts]: https://chat.whatsapp.com/F7sWgD6fpbE5mQASiSJZND
[DigitalOcean]: https://m.do.co/c/e0d6be6820ed

Implementar una aplicación Node.js en un Droplet de DigitalOcean o en cualquier máquina virtual Linux es importante para hacer que tu proyecto esté en línea.

Esta guía utiliza **SSH**, **GitHub**, **PM2** y **Nginx** para un despliegue eficiente y confiable de una aplicación Node.js en DigitalOcean.

También puedes usarla para otras máquinas virtuales.

Usaremos PM2 principalmente porque ya está preinstalado y funcionando con la configuración predeterminada que ofrece DigitalOcean.

Sin embargo, también hay razones para usar PM2.

PM2 es un gestor de procesos poderoso para aplicaciones Node.js, diseñado para facilitar la vida al ejecutar y gestionar aplicaciones en producción. Va más allá de simplemente iniciar tu aplicación: proporciona una suite de funciones que garantizan que tu aplicación funcione de manera fluida y confiable, incluso en los entornos más exigentes.

Tenemos un [grupo de WhatsApp para ofertas de empleo][OnlyCoiners WhatsApp Group For Job Posts] usando el proceso descrito en este post.

Puedes unirte para ver las últimas ofertas de empleo. También puedes encontrar y publicar empleos en [nuestro tablón de empleo][OnlyCoiners Job Board].

## Por qué deberías usar PM2

1. **Reinicio automático**  
   PM2 reinicia automáticamente tu aplicación si se bloquea, asegurando cero tiempo de inactividad. Esto es crucial en entornos de producción donde la confiabilidad es crítica.

2. **Gestión de procesos**  
   Permite gestionar múltiples aplicaciones en un solo servidor fácilmente. Con comandos simples como `pm2 start`, `stop`, `restart` y `delete`, tienes control total sobre tus procesos.

3. **Monitorización integrada**  
   PM2 proporciona monitorización en tiempo real del rendimiento de tu aplicación, mostrando el uso de CPU y memoria. Esto te ayuda a identificar cuellos de botella y optimizar tu aplicación.

4. **Scripts de inicio**  
   Cuando reinicias tu servidor, PM2 asegura que tus aplicaciones se inicien automáticamente generando un script de inicio adaptado a tu sistema.

5. **Gestión de registros**  
   PM2 consolida los registros de todas tus aplicaciones en un solo lugar. Puedes ver, seguir o borrar registros con un solo comando, haciendo que la depuración sea mucho más manejable.

6. **Modo clúster**  
   ¿Quieres utilizar todos los núcleos de CPU de tu servidor? El modo clúster de PM2 facilita la ampliación horizontal de tu aplicación, maximizando el rendimiento.

7. **Facilidad de uso**  
   Con una CLI limpia e intuitiva, PM2 es fácil de usar para principiantes y ofrece funciones avanzadas para desarrolladores experimentados.

8. **Multiplataforma**  
   PM2 funciona perfectamente en varios sistemas operativos, incluidos Linux, macOS y Windows, lo que lo convierte en una opción versátil para cualquier entorno.

PM2 tiene características robustas y simplicidad que lo convierten en una solución preferida para despliegues en producción. Ya sea que estés ampliando una aplicación de inicio o gestionando una aplicación de alto tráfico, PM2 garantiza estabilidad y proporciona tranquilidad. Empodera a los desarrolladores para centrarse en construir funciones en lugar de preocuparse por la gestión de procesos, convirtiéndose en una herramienta invaluable en tu arsenal.

## Requisitos previos

1. **Aplicación Node.js**: Una aplicación Node.js lista para desplegar.
2. **Droplet de DigitalOcean**: Configurado con Ubuntu o similar.
3. **Acceso SSH**: Configurado para inicio de sesión seguro.
4. **Nginx**: Para la configuración de proxy inverso.

Si no tienes ninguna aplicación Node.js para probar, puedes usar nuestro ejemplo.

```bash
$git clone https://github.com/OnlyCoiner/digitalocean_deployment_examples.git
$cd node
$yarn
$yarn test
$yarn dev 
```

## Configurar SSH y GitHub

1. **Crear el Droplet**  

![Alt text](https://res.cloudinary.com/dlvpwtfzs/image/upload/v1734637462/user/file/n5tfnnvag76njc0v7c4o.png)
   
Crea una cuenta o inicia sesión en [DigitalOcean] y crea un Droplet para Node.js. Puedes usar su consola y ejecutar los comandos a continuación.

![Alt text](https://res.cloudinary.com/dlvpwtfzs/image/upload/v1734637895/user/file/a8qbehqypwpivux342ej.png)
   
Usa su script predeterminado `nodesource_setup.sh` y tendrás la mayoría de los requisitos listos, incluidos git, node, yarn o npm, etc. De lo contrario, puedes instalarlos manualmente como lo hiciste en tu laptop.
     
```bash
./nodesource_setup.sh
```

2. **Transferir clave SSH**  

Guarda tu clave SSH `~/.ssh/your_private_key` en el Droplet o tu máquina virtual para descargar tu proyecto desde GitHub u otros con el comando $git pull.

Puedes crear una aquí https://github.com/settings/keys para GitHub si aún no la tienes.

```bash
$scp ~/.ssh/your_private_key root@<your-droplet-ip>:~/.ssh/
$chmod 600 ~/.ssh/your_private_key
```

3. **Configurar acceso SSH**  
   
Edita el archivo de configuración SSH en tu servidor.

De esta manera, también puedes enviar tus actualizaciones a un repositorio git si lo deseas.

```bash
$vim ~/.ssh/config
```

Edita con el texto a continuación.

```text
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/your_private_key
  AddKeysToAgent yes
```

4. **Clonar el repositorio**  

Clona tu aplicación desde GitHub.

```bash
git clone https://github.com/OnlyCoiners/digitalocean_deployment_examples.git
```

## Usar PM2 para gestionar tu aplicación Node.js

1. **Detener aplicaciones predeterminadas**  

La aplicación Node.js predeterminada de DigitalOcean puede estar ejecutándose. Detenla y elimínala primero.

```bash
$pm2 list
$pm2 stop hello
$pm2 delete hello
$pm2 save
$pm2 save --force
```

2. **Iniciar tu aplicación Node.js**  

Dependiendo de tu configuración, usa uno de los siguientes comandos

```bash
$pm2 start npx --name onlycoiners_node -- tsx ./src/index.ts
```

Verás algunos registros de **pm2** y otros mensajes en tu consola.

```bash
El servidor de OnlyCoiners está funcionando en el puerto 8888
```

3. **Guardar y configurar PM2**  

```bash
$pm2 list
$pm2 save
$pm2 startup
```

Usa `$pm2` list para ver si tu aplicación está funcionando y `$pm2` save para guardar tus actualizaciones.

Usa `$pm2 startup` para que tu aplicación siga funcionando después de cerrar tu conexión SSH al droplet o máquina virtual.

4. **Verificar registros**  

```bash
$pm2 logs
$pm2 logs onlycoiners_node
```

Tu aplicación podría no estar funcionando en el primer intento. Usa `$pm2 logs` o `$pm2 logs <yourappname>` para depurar. 

## Configurar Nginx como proxy inverso

1. **Editar configuración de Nginx**  

```bash
$sudo vim /etc/nginx/sites-available/default
```

Edita para usar el fragmento de código a continuación e incluye el número de puerto de tu aplicación.

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location ^~ /assets/ {
        gzip_static on;
        expires 12h;
        add_header Cache-Control public;
    }

    location / {
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://localhost:8888;
    }
}
```

De esta manera, podrás usar curl para la IP de tu proyecto directamente en lugar de asignar el número de puerto.

2. **Reiniciar Nginx**  

Después de la actualización, reinicia tu nginx para que funcione tu actualización.

```bash
$sudo systemctl restart nginx
```

## Probar tu configuración

1. **Verificar Nginx y Node.js**  

Usa `curl` para probar cada vez que hagas actualizaciones y verificar si está funcionando o no.

```bash
$curl localhost:8888  # Aplicación Node.js
$curl localhost       # Proxy inverso Nginx

$curl <your-server-ip>
```

Deberían mostrar los mismos resultados con "¡Crea, gana y conecta con OnlyCoiners! Únete a https://www.onlycoiners.com" u otros dependiendo de tu proyecto.

Usa `$curl <your-server-ip>` después de cerrar la conexión SSH al droplet o máquina virtual para verificar si la aplicación sigue funcionando después de cerrar la conexión.

2. **Comprobar estado de PM2**  

Opcionalmente, puedes probar que PM2 está gestionando tu aplicación correctamente con estos comandos nuevamente.

```bash
$pm2 list
$pm2 logs
```

## Consejos para solución de problemas

- Verifica los registros de la aplicación para errores:

```bash
$pm2 logs onlycoiners_node
```

- Asegúrate de que tu clave SSH y configuración de Nginx sean correctas.

## Conclusión

Implementar una aplicación Node.js en DigitalOcean o una máquina virtual Linux con **PM2** y **Nginx** garantiza confiabilidad y escalabilidad. Siguiendo esta guía, podrás hacer que tu proyecto funcione con DigitalOcean u otras máquinas virtuales Linux.