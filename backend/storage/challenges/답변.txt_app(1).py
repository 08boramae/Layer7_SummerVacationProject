from flask import Flask, session, request, render_template, redirect, url_for
from vuln import get_db_conn
import js2py
from js2py.base import PyJsException
import io
import sys
import os

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key_for_development_only')

try:
    with open("./flag.txt", "r") as f:
       FLAG = f.readline()
except:
    FLAG = "yisf{test_flag}"

def required_login():
    return "username" in session

class FakeModule:
    def __init__(self, module_name):
        self._module_name = module_name

    def __getattr__(self, attr_name):
        def method_that_prints_error(*args, **kwargs):
            print(f"SecurityError: '{attr_name}' on the disallowed module '{self._module_name}' is not permitted.")
            return None
        return method_that_prints_error


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":
        return render_template("index.html", result="SUCCESS")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template("login.html", error=request.args.get('error'))

    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return render_template("login.html", error="Username and password required")

    conn = get_db_conn()
    if not conn:
        return render_template("login.html", error="Database connection failed. Please contact an administrator.")

    with conn:
        with conn.cursor() as cursor:
            sql = "SELECT username, is_admin FROM users WHERE username=%s AND password=%s"
            cursor.execute(sql, (username, password))
            user = cursor.fetchone()

    if user:
        session['username'] = user['username']

        is_admin_raw = user.get('is_admin')

        try:
            if isinstance(is_admin_raw, bytes):
                is_admin = int.from_bytes(is_admin_raw, byteorder='little')
            else:
                is_admin = int(is_admin_raw)
        except Exception:
            is_admin = 0

        session['is_admin'] = is_admin == 1

        if session['is_admin']:
            return redirect(url_for('admin_page'))
        else:
            return redirect(url_for('js'))

    else:
        return render_template("login.html", error="Invalid credentials")


@app.route('/js', methods=['GET', 'POST'])
def js():
    if not required_login():
        return redirect(url_for("login", error="Login required"))

    result = ''
    code = ''
    if request.method == 'POST':
        code = request.form.get('code')

        try:
            old_stdout = sys.stdout
            sys.stdout = io.StringIO()

            context = js2py.EvalJs()
            
            def safe_importer(module_name):
                allowed_modules = ['vuln']
                if module_name in allowed_modules:
                    return __import__(module_name)
                return FakeModule(module_name)

            def js_import_wrapper(name):
                if hasattr(name, 'to_python'):
                    name = name.to_python()
                return safe_importer(name)

            context = js2py.EvalJs()
            context.__import__ = js_import_wrapper
            context.require = js_import_wrapper
            context.execute(code)

            result = sys.stdout.getvalue().strip()
            if not result:
                result = "[+] Executed. No output."

        except PyJsException as e:
            result = f"[!] Error: {str(e)}"
        except Exception as e:
            result = f"[!] Error: {e}"
        finally:
            sys.stdout = old_stdout

    return render_template("jsbox.html", result=result, code=code)

@app.route('/admin')
def admin_page():
    if not required_login():
        return redirect(url_for("login", error="Login required"))
    if session.get('is_admin') is not True:
        return redirect(url_for("js"))
    return render_template("admin.html", flag=FLAG)

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('is_admin', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)