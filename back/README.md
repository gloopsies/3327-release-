# Starting the server

## 1. Download required software

For this server to work make sure that you have installed the following software:

1. Postgresql
2. Redis (For Windows users it is recommended to use WSL for Redis since new versions don't natively support Windows)
3. ssh-keygen
4. Go toolchain

## 2. Setting up the database

1. Create the user to use database

```postgresql
-- in the psql commandline
CREATE ROLE database WITH LOGIN PASSWORD 'password';
```

2. Create database with ownership of newly created user

```postgresql
-- in the psql commandline
CREATE DATABASE database WITH OWNER role ENCODING 'UTF-8';
```

3. Test connection to the database

```shell
# in shell
psql -U role -h localhost
```

+ If connection doesn't work you probably need to set configuration to allow password login
     
    1. Open the *pg_hba.conf* (There are multiple locations this file can be at, on Fedora 34 it's in */var/lib/pgsql/data/pg_hba.conf*) file with any text editor and admin rights
    2. Edit lines that specifies login rights to look like
        ```
        # IPv4 local connections:
        host    all             all             127.0.0.1/32            password
        # IPv6 local connections:
        host    all             all             ::1/128                 password
        ```
	3. restart postgre service
		```shell
		systemctl restart postgresql.service
		```

4. Create tables from sql/create.sql
		```shell
		psql -U role -h localhost -f sql/create.sql
		```

## 3. Configuring redis
   
1. Set password login for Redis
    1. Open redis.conf file (Usually in */etc/redis/redis.conf*)
    2. Add the **requirepass** option with your new password
  
2. Check connection with redis-cli
    ```shell
    redis-cli -a "password" 
    ```

## 4. generate RSA private keys for JWT signing

1. Generate PEM keys
```shell
ssh-keygen -t rsa -f keys/key.pem -m pem
```

Optionally if you changed the default file name remember to save it in the *config.json* file later

## 5. Set-up config file

1. Copy *config.json.example* file into *config.json*
2. *config.example* file already has default ports and configuration for all needed software but if you changed any of the settings please make sure the settings match
3. Please fill all the empty parameters with adequate values

## 6. running the server

1. Build server executable
```shell
go build -o "./build/backend"
```

2. Run the server
```shell
./build/backend
```
