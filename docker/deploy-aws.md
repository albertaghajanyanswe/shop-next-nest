# Руководство по созданию EC2 инстанса и настройке Security Group в AWS

## 1️⃣ Создание EC2 инстанса

1. Зайти в AWS Management Console → **EC2** → **Instances** → **Launch Instances**.
2. Выбрать нужный **AMI** (например, `Amazon Linux 2`).
3. Выбрать тип инстанса (например, `t3.small` для теста).
4. В разделе **Key Pair**:
   - Создать новый ключ (если нет) → скачать `.pem` файл.
5. В разделе **Network / Security**:
   - Выбрать существующую Security Group или создать новую.
   - Разрешить **SSH, HTTP, HTTPS Anywhere** (0.0.0.0/0).

---

## 2️⃣ Настройка Security Group

1. В списке инстансов кликнуть на **Instance ID** → пролистать вниз до раздела **Security** → кликнуть на **Security Group ID**.
2. Перейти в **Inbound Rules** → **Edit inbound rules**.
3. Если нужно открыть новый порт (например, для фронтенда на порту 3000):
   - **Add Rule** → Protocol: `TCP`, Port Range: `3000`, Source: `Anywhere (0.0.0.0/0)` → **Save Rules**.

---

## 3️⃣ Подключение к инстансу по SSH

```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ec2-user@<EC2_PUBLIC_IP>
Example - ssh -i "mystore-frankfurt.pem" ubuntu@ec2-18-184-69-253.eu-central-1.compute.amazonaws.com
```

## Setup HTTPS

1. sudo apt install certbot python-certbot-nginx
2. sudo certbot --nginx -d <your domain name>
   1. example: sudo certbot --nginx -d staging.myshop.com
3. Add this setting on nginx.conf file
   1. listen 443 ssl;
   2. ssl_certificate /etc/letsencrypt/live/<your domain>/fullchain.pem
   3. ssl_certificate_key /etc/letsencrypt/live/<your domain>/private.pem
   4. include /etc/letsencrypt/options-ssl-nginx.conf
   5. ssl_dhparam /etc/letsencrypt/ssl-dhparam.pem

