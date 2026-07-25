# -*- coding: utf-8 -*-
"""
ساختِ عکسِ بنرِ پنل: قالبِ آماده‌ی «self panel» (assets/panel_banner.jpg) رو
برمی‌داره و عکسِ پروفایلِ خودِ کاربر رو به‌صورتِ دایره‌ای وسطِ همون قاب
(جای متنِ «محل جایگذاری عکس») می‌چسبونه و یک فایلِ خروجیِ موقت می‌سازه.

مختصاتِ دایره (مرکز و شعاع) با اندازه‌گیریِ دستیِ روی خودِ تصویرِ قالب به
دست اومده (تصویر ۱۲۸۰×۷۲۰ هست).
"""
import os
import tempfile

from PIL import Image, ImageDraw, ImageOps

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "panel_banner.jpg")

# مرکز و شعاعِ دایره‌ی داخلِ قالب (اندازه‌گیری‌شده روی تصویرِ ۱۲۸۰×۷۲۰)
CIRCLE_CENTER = (652, 310)
CIRCLE_RADIUS = 148


def build_panel_banner(avatar_path: str, output_path: str | None = None) -> str:
    """
    avatar_path: مسیرِ فایلِ عکسِ پروفایلِ دانلودشده (هر فرمتی، PIL خودش باز می‌کنه)
    output_path: مسیرِ خروجی؛ اگه ندی، یک فایلِ موقتِ jpg ساخته می‌شه.
    خروجی: مسیرِ فایلِ نهایی که آماده‌ی ارسال با send_file هست.
    """
    template = Image.open(TEMPLATE_PATH).convert("RGBA")

    diameter = CIRCLE_RADIUS * 2
    try:
        avatar = Image.open(avatar_path).convert("RGB")
    except Exception:
        avatar = None

    if avatar is not None:
        # عکس رو مربعی و بدون کج‌شدن (fit) به اندازه‌ی دایره برش می‌زنیم
        avatar = ImageOps.fit(avatar, (diameter, diameter), method=Image.LANCZOS)

        # ماسکِ دایره‌ای برای گردکردنِ لبه‌ها
        mask = Image.new("L", (diameter, diameter), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, diameter, diameter), fill=255)

        avatar_rgba = avatar.convert("RGBA")
        avatar_rgba.putalpha(mask)

        top_left = (CIRCLE_CENTER[0] - CIRCLE_RADIUS, CIRCLE_CENTER[1] - CIRCLE_RADIUS)
        template.paste(avatar_rgba, top_left, avatar_rgba)

    final_img = template.convert("RGB")

    if output_path is None:
        fd, output_path = tempfile.mkstemp(suffix=".jpg", prefix="panel_banner_")
        os.close(fd)

    final_img.save(output_path, "JPEG", quality=92)
    return output_path
