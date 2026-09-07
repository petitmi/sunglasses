from flask import Blueprint, jsonify, request
import os
import json
import socket
import smtplib
from email.mime.text import MIMEText
import tomllib

ecommerce_bp = Blueprint("ecommerce", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_FILE = os.path.join(BASE_DIR, "data", "products.json")


def load_config():
    """Load configuration from secrets.toml"""
    with open(os.path.join(BASE_DIR ,"secrets.toml"), "rb") as f:
        return tomllib.load(f)


def send_email(message):
    """Send email with the given message"""
    original_timeout = socket.getdefaulttimeout()
    
    try:
        config = load_config()
        email_config = config["email"]
        
        socket.setdefaulttimeout(30)
        
        msg = MIMEText(message)
        msg['Subject'] = "New Inquiry from SunStyle Wholesale"
        msg['From'] = email_config["sender_email"]
        msg['To'] = email_config["recipient_email"]
        
        with smtplib.SMTP(
            os.getenv("SMTP_SERVER", "smtp.gmail.com"),
            int(os.getenv("SMTP_PORT", "587")),
            timeout=30
        ) as server:
            server.starttls()
            server.login(email_config["sender_email"], email_config["sender_password"])
            server.send_message(msg)
        
        print("Email sent successfully!")
        return True
        
    except socket.timeout:
        print("Email error: Connection timeout - SMTP server unreachable")
        return False
    except smtplib.SMTPException as e:
        print(f"SMTP error: {e}")
        return False
    except Exception as e:
        print(f"Email error: {e}")
        return False
    finally:
        socket.setdefaulttimeout(original_timeout)

def load_products():
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


@ecommerce_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with their first variant for display"""
    products_db = load_products()
    
    result = []
    for product in products_db.values():
        # Get the first variant for display images
        first_variant = product["variants"][0] if product.get("variants") else {}
        
        result.append({
            "id": product["id"],
            "model": product["model"],
            "name": product["name"],
            "price": product["price"],
            "description": product["description"],
            "moq": product.get("moq", 50),  
            "imageFront": first_variant.get("imageFront", ""),
            "imageSide": first_variant.get("imageSide", ""),
            "colorway": first_variant.get("colorway"),
            "variants": product["variants"]
        })
    
    return jsonify(result)


@ecommerce_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    """Get detailed product information including all variants"""
    products_db = load_products()
    
    # Find product by id
    product = next(
        (p for p in products_db.values() if p["id"] == product_id),
        None
    )
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Add MOQ if not present
    if "moq" not in product:
        product["moq"] = 50
    
    return jsonify(product)


@ecommerce_bp.route('/inquiry', methods=['POST'])
def submit_inquiry():
    """Handle inquiry submission"""
    data = request.json
    
    if not data.get('name') or not data.get('email') or not data.get('phone'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Build email message
    message = f"""
New inquiry from SunStyle Wholesale website:

Customer Information:
Name: {data.get('name')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Company: {data.get('company', 'N/A')}

Products of Interest:
"""
    
    for item in data.get('cartItems', []):
        message += f"- {item.get('name')} x{item.get('quantity')} (${item.get('price')}/unit)\n"
    
    if data.get('message'):
        message += f"\nAdditional Details:\n{data.get('message')}"
    
    # Send email (won't fail if email doesn't work)
    send_email(message)
    
    return jsonify({
        'success': True,
        'message': 'Thank you! We will contact you shortly.'
    })


@ecommerce_bp.route('/contact-info', methods=['GET'])
def get_contact_info():
    """Get company contact information"""
    return jsonify({
        'email': 'funxter.van@gmail.com',
        'phone': '+1 (236) 970-0608',
        'companyName': 'FUNXTER'
    })