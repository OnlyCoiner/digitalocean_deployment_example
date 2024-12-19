
[OnlyCoiners]: https://www.onlycoiners.com
[OnlyCoiners Email]: mailto:dev@onlycoiners.com
[OnlyCoiners Job Board]: https://www.onlycoiners.com/jobs
[OnlyCoiners WhatsApp Group For Job Posts]: https://chat.whatsapp.com/F7sWgD6fpbE5mQASiSJZND
[DigitalOcean]: https://m.do.co/c/e0d6be6820ed

Implantar uma aplicação Node.js em um Droplet da DigitalOcean ou em qualquer máquina virtual Linux é importante para colocar seu projeto online.

Este guia utiliza **SSH**, **GitHub**, **PM2** e **Nginx** para uma implantação eficiente e confiável de uma aplicação Node.js na DigitalOcean.

Você também pode usá-lo para outras máquinas virtuais.

Usaremos o PM2 principalmente porque já está pré-instalado e funcionando com a configuração padrão fornecida pela DigitalOcean.

No entanto, há também razões para usar o PM2.

PM2 é um poderoso gerenciador de processos para aplicações Node.js, projetado para facilitar sua vida ao executar e gerenciar aplicativos em produção. Vai além de simplesmente iniciar sua aplicação: fornece um conjunto de recursos que garantem que sua aplicação funcione de forma tranquila e confiável, mesmo nos ambientes mais exigentes.

Temos um [grupo no WhatsApp para postagens de empregos][OnlyCoiners WhatsApp Group For Job Posts] usando o processo descrito neste post.

Você pode participar para ver as últimas vagas. Você também pode encontrar e postar empregos no [nosso quadro de empregos][OnlyCoiners Job Board].

## Por que usar o PM2

1. **Reinício Automático**  
   O PM2 reinicia automaticamente sua aplicação caso ela falhe, garantindo zero tempo de inatividade. Isso é essencial em ambientes de produção onde a confiabilidade é crítica.

2. **Gerenciamento de Processos**  
   Permite gerenciar várias aplicações em um único servidor de forma fácil. Com comandos simples como `pm2 start`, `stop`, `restart` e `delete`, você tem controle total sobre seus processos.

3. **Monitoramento Integrado**  
   O PM2 fornece monitoramento em tempo real do desempenho da sua aplicação, exibindo o uso de CPU e memória. Isso ajuda a identificar gargalos e otimizar sua aplicação.

4. **Scripts de Inicialização**  
   Quando você reinicia seu servidor, o PM2 garante que suas aplicações iniciem automaticamente gerando um script de inicialização adaptado ao seu sistema.

5. **Gerenciamento de Logs**  
   O PM2 consolida logs de todas as suas aplicações em um único local. Você pode visualizar, seguir ou limpar logs com um único comando, tornando a depuração muito mais gerenciável.

6. **Modo de Cluster**  
   Quer utilizar todos os núcleos de CPU do seu servidor? O modo de cluster do PM2 facilita a escalabilidade horizontal da sua aplicação, maximizando o desempenho.

7. **Fácil de Usar**  
   Com uma CLI limpa e intuitiva, o PM2 é amigável para iniciantes e ainda oferece recursos avançados para desenvolvedores experientes.

8. **Multiplataforma**  
   O PM2 funciona perfeitamente em vários sistemas operacionais, incluindo Linux, macOS e Windows, tornando-o uma escolha versátil para qualquer ambiente.

O PM2 possui recursos robustos e simplicidade que o tornam uma solução preferida para implantações em produção. Seja escalando um aplicativo inicial ou gerenciando uma aplicação de alto tráfego, o PM2 garante estabilidade e proporciona tranquilidade. Ele capacita os desenvolvedores a focarem na criação de recursos em vez de se preocuparem com o gerenciamento de processos, tornando-se uma ferramenta inestimável no seu arsenal.

## Pré-requisitos

1. **Aplicação Node.js**: Uma aplicação Node.js pronta para implantação.
2. **Droplet da DigitalOcean**: Configurado com Ubuntu ou similar.
3. **Acesso SSH**: Configurado para login seguro.
4. **Nginx**: Para configuração de proxy reverso.

Se você não tem nenhuma aplicação Node.js para testar, pode usar nosso exemplo.

```bash
$git clone https://github.com/OnlyCoiner/digitalocean_deployment_examples.git
$cd node
$yarn
$yarn test
$yarn dev 
```

## Configurar SSH e GitHub

1. **Criar o Droplet**  

![Alt text](https://res.cloudinary.com/dlvpwtfzs/image/upload/v1734637462/user/file/n5tfnnvag76njc0v7c4o.png)
   
Crie uma conta ou faça login no [DigitalOcean] e crie um Droplet para Node.js. Você pode usar o console e executar os comandos abaixo.

![Alt text](https://res.cloudinary.com/dlvpwtfzs/image/upload/v1734637895/user/file/a8qbehqypwpivux342ej.png)
   
Use o script padrão `nodesource_setup.sh` e você terá a maioria dos requisitos prontos, incluindo git, node, yarn ou npm, etc. Caso contrário, você pode instalá-los manualmente, como fez no seu laptop.
     
```bash
./nodesource_setup.sh
```

2. **Transferir a chave SSH**  

Salve sua chave SSH `~/.ssh/your_private_key` no Droplet ou sua máquina virtual para baixar seu projeto do GitHub ou outros com o comando $git pull.

Você pode criar uma aqui https://github.com/settings/keys para o GitHub, caso ainda não tenha.

```bash
$scp ~/.ssh/your_private_key root@<your-droplet-ip>:~/.ssh/
$chmod 600 ~/.ssh/your_private_key
```

3. **Configurar o acesso SSH**  
   
Edite o arquivo de configuração SSH no seu servidor.

Dessa forma, você também pode enviar suas atualizações para um repositório git, se desejar.

```bash
$vim ~/.ssh/config
```

Edite com o texto abaixo.

```text
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/your_private_key
  AddKeysToAgent yes
```

4. **Clonar o repositório**  

Clone sua aplicação do GitHub.

```bash
git clone https://github.com/OnlyCoiners/digitalocean_deployment_examples.git
```

## Usar o PM2 para gerenciar sua aplicação Node.js

1. **Parar aplicações padrão**  

A aplicação Node.js padrão da DigitalOcean pode estar em execução. Pare-a e exclua-a primeiro.

```bash
$pm2 list
$pm2 stop hello
$pm2 delete hello
$pm2 save
$pm2 save --force
```

2. **Iniciar sua aplicação Node.js**  

Dependendo da sua configuração, use um dos comandos abaixo

```bash
$pm2 start npx --name onlycoiners_node -- tsx ./src/index.ts
```

Você verá alguns logs do **pm2** e outras mensagens no seu console.

```bash
O servidor da OnlyCoiners está rodando na porta 8888
```

3. **Salvar e configurar o PM2**  

```bash
$pm2 list
$pm2 save
$pm2 startup
```

Use `$pm2 list` para verificar se sua aplicação está funcionando e `$pm2 save` para salvar suas atualizações.

Use `$pm2 startup` para que sua aplicação continue funcionando após fechar sua conexão SSH com o droplet ou máquina virtual.

4. **Verificar logs**  

```bash
$pm2 logs
$pm2 logs onlycoiners_node
```

Sua aplicação pode não funcionar na primeira tentativa. Use `$pm2 logs` ou `$pm2 logs <yourappname>` para depurar. 

## Configurar o Nginx como proxy reverso

1. **Editar configuração do Nginx**  

```bash
$sudo vim /etc/nginx/sites-available/default
```

Edite para usar o trecho de código abaixo e inclua o número da porta da sua aplicação.

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

Dessa forma, você poderá usar curl para o IP do seu projeto diretamente, em vez de atribuir o número da porta.

2. **Reiniciar o Nginx**  

Após a atualização, reinicie seu nginx para que sua atualização funcione.

```bash
$sudo systemctl restart nginx
```

## Testar sua configuração

1. **Verificar Nginx e Node.js**  

Use `curl` para testar sempre que fizer atualizações e verificar se está funcionando ou não.

```bash
$curl localhost:8888  # Aplicação Node.js
$curl localhost       # Proxy reverso Nginx

$curl <your-server-ip>
```

Eles devem mostrar os mesmos resultados com "Crie, Ganhe e Conecte-se com OnlyCoiners! Junte-se a https://www.onlycoiners.com" ou outros dependendo do seu projeto.

Use `$curl <your-server-ip>` após fechar a conexão SSH com o droplet ou máquina virtual para verificar se a aplicação ainda está funcionando após fechar a conexão.

2. **Verificar status do PM2**  

Opcionalmente, você pode testar se o PM2 está gerenciando sua aplicação corretamente com esses comandos novamente.

```bash
$pm2 list
$pm2 logs
```

## Dicas para solução de problemas

- Verifique os logs da aplicação para erros:

```bash
$pm2 logs onlycoiners_node
```

- Certifique-se de que sua chave SSH e configuração do Nginx estão corretas.

## Conclusão

Implantar uma aplicação Node.js na DigitalOcean ou em uma máquina virtual Linux com **PM2** e **Nginx** garante confiabilidade e escalabilidade. Seguindo este guia, você poderá fazer seu projeto funcionar com a DigitalOcean ou outras máquinas virtuais Linux.