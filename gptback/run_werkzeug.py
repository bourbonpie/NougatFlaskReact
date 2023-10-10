from werkzeug.serving import run_simple
from app import application

if __name__ == '__main__':
    run_simple('localhost', 3400, application, use_reloader=True, use_evalex=True, use_debugger=True)