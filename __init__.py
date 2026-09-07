import os
from flask import Flask, send_from_directory, send_file

from routes import ecommerce_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="/static")

    app.register_blueprint(ecommerce_bp, url_prefix="/api")

    @app.route("/store/images/<path:filename>")
    def serve_images(filename):
        return send_from_directory(os.path.join(BASE_DIR, "images"), filename)

    @app.route("/store/<path:filename>")
    def serve_store_assets(filename):
        return send_from_directory(BASE_DIR, filename)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_app(path):
        full_path = os.path.join(BASE_DIR, path)
        if path and os.path.isfile(full_path):
            return send_from_directory(BASE_DIR, path)
        return send_file(os.path.join(BASE_DIR, "index.html"))

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
