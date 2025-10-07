import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="https://b91d300f29870176c8f05b114d8ca558@o4510128361963520.ingest.us.sentry.io/4510145722056704",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)

app = Flask(__name__)

@app.route("/")
def hello_world():
    1/0  # raises an error
    return "<p>Hello, World!</p>"