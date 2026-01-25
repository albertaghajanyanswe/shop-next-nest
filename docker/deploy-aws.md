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
