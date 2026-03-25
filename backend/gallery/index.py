"""
Галерея семейных фото: загрузка (POST) и получение списка (GET).
Фото сохраняются в S3, метаданные — в БД.
"""
import json
import os
import uuid
import base64
import psycopg2
import boto3
from datetime import datetime


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p67328840_family_card_game_app")
CDN_BASE = f"https://cdn.poehali.dev/projects/{os.environ.get('AWS_ACCESS_KEY_ID', '')}/bucket"


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")

    # ─── GET: список фото ────────────────────────────────────────────────────
    if method == "GET":
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, filename, cdn_url, caption, uploaded_at FROM {SCHEMA}.photos ORDER BY uploaded_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        photos = [
            {"id": r[0], "filename": r[1], "url": r[2], "caption": r[3], "uploadedAt": r[4].isoformat()}
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"photos": photos})}

    # ─── POST: загрузка фото ─────────────────────────────────────────────────
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        data_b64 = body.get("data", "")
        content_type = body.get("contentType", "image/jpeg")
        caption = body.get("caption", "")
        original_name = body.get("filename", "photo.jpg")

        ext = original_name.rsplit(".", 1)[-1] if "." in original_name else "jpg"
        s3_key = f"gallery/{uuid.uuid4().hex}.{ext}"

        image_bytes = base64.b64decode(data_b64)
        s3 = get_s3()
        s3.put_object(
            Bucket="files",
            Key=s3_key,
            Body=image_bytes,
            ContentType=content_type,
        )

        cdn_url = f"{CDN_BASE}/files/{s3_key}"

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.photos (filename, s3_key, cdn_url, caption) VALUES (%s, %s, %s, %s) RETURNING id",
            (original_name, s3_key, cdn_url, caption),
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"id": photo_id, "url": cdn_url, "caption": caption}),
        }

    # ─── DELETE: удалить фото ────────────────────────────────────────────────
    if method == "DELETE":
        body = json.loads(event.get("body") or "{}")
        photo_id = body.get("id")
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT s3_key FROM {SCHEMA}.photos WHERE id = %s", (photo_id,))
        row = cur.fetchone()
        if row:
            s3 = get_s3()
            s3.delete_object(Bucket="files", Key=row[0])
            cur.execute(f"DELETE FROM {SCHEMA}.photos WHERE id = %s", (photo_id,))
            conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}
