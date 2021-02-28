## Description

Voicy api is a graphql app for digital gift cards system.

## Local run

App could be run without building:

```bash
$ yarn run start
```

Or first build the app:

```bash
$ yarn run build
```

and then run passing the env file (look at `.env.example`):

```bash
$ yarn run start:prod -- dotenv_config_path=../.env # note the space between -- and the argument
```


## API Documentation

On non-production environments, API documentation is accessible at the `/swagger` endpoint.

E.g. `http://localhost:8000/swagger`

## Installation and Setup

DO steps.

---

### Dokku app creation

```bash
$ dokku apps:create voicy
```

### POSTGRES SETUP

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
$ dokku postgres:create voicy-production-pg
$ dokku postgres:link voicy-production-pg voicy
# internal DATABASE_URL: postgres://postgres:e35444147366d4e932fc455bce445f3a@dokku-postgres-voicy-production-pg:5432/voicy_production_pg
$ dokku postgres:expose voicy-production-pg 17825
# external DATABASE_URL: postgres://postgres:e35444147366d4e932fc455bce445f3a@api.voicy.ru:17825/voicy_production_pg
```
### REDIS SETUP

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
$ dokku redis:create voicy-production-redis
$ dokku redis:link voicy-production-redis voicy
# REDIS_URL: redis://voicy-production-redis:64ad3f0112717bef13b24274d37abc1615aeb11a49d073706579baba13c6f2c3@dokku-redis-voicy-production-redis:6379
```

### CICLECI SETUP
#### NEW SSH

```bash
$ ssh-keygen -m pem -t rsa -C "artgurianov@yandex.ru"
# /Users/art/.ssh/voicy-production-circleci-ssh
```

#### ADDING SSH TO DOKKU

```bash
$ cat ~/.ssh/voicy-production-circleci-ssh.pub | ssh root@164.90.224.15 "sudo sshcommand acl-add dokku voicy-production-circleci-ssh"
# EXEC RESULT - SHA256:XnPlu0irzfTA8pKy0wI3V/wZ77DbCH+iCbVn1BUMug4
```

#### ADDING SSH TO CIRCLECI

```bash
$ cat ~/.ssh/voicy-production-circleci-ssh
# using hostname voicy-production
```

---

### MANUAL FIRST DEPLOY TO DOKKU.

Locally:

```bash
$ docker build -t artgurianov/voicy:latest --no-cache .
$ docker push artgurianov/voicy:latest
```

On dokku server:

```bash
$ ssh root@164.90.224.15
$ docker pull artgurianov/voicy:latest
$ docker tag artgurianov/voicy:latest dokku/voicy:latest
$ dokku tags:deploy voicy latest
$ dokku apps:report voicy
$ dokku logs voicy
```

---

### DOKKU SET ENV VARIABLES

```bash
$ dokku config:set voicy NODE_ENV=production SERVER_PORT=8000 FRONTEND_HOST_URL=http://localhost:3000 WITAI_KEY=MCPD2GSCYO77BINHZN7TGOPPQV5OPTHZ JWT_ACCESS_SECRET=secret1 JWT_REFRESH_SECRET=secret2 SUPER_ADMIN_EMAIL=artgurianov@yandex.ru SUPER_ADMIN_PASSWORD=Qwerty123 S3_BUCKET_URL=https://aws.s3/user15132/ S3_BUCKET_NAME=voicy2020 AWS_ACCESS_KEY_ID=AKIAJ2FPUL67J2BKE75A AWS_SECRET_ACCESS_KEY=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 AWS_REGION=eu-central-1
```

---

### DOCKER COMPOSE

```bash
$ docker-compose up --build -V --force-recreate
$ # docker-compose --env-file .env exec postgres psql -U postgres
$ exec postgres env
```

### DOMAIN SETUP

```bash
$ dokku domains:report voicy
$ dokku domains:clear-global
$ dokku domains:set voicy api.voicy.ru
$ dokku proxy:report voicy #need to change 5000 to whatever port we set
$ dokku proxy:ports-set voicy http:80:8000
```

### LETSENCRYPT SETUP

```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
$ dokku config:set --no-restart voicy DOKKU_LETSENCRYPT_EMAIL=artgurianov@yandex.ru
$ dokku letsencrypt voicy
$ # ports are configured automatically
$ dokku letsencrypt:cron-job --add
```

## Stay in touch

- Author - [Art Gurianov](https://github.com/artgurianov)
