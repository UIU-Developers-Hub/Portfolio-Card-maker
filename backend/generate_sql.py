import os
import subprocess
import sys
import django
from django.core.management import call_command

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

def generate_sql_file():
    try:
        # Run the sqlmigrate command and capture its output
        result = subprocess.run(
            ['python3', 'manage.py', 'sqlmigrate', 'portfolio', '0001_initial'],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Write the output to a file
        with open('portfolio_migration.sql', 'w') as f:
            f.write(result.stdout)
        print("SQL file 'portfolio_migration.sql' has been generated successfully!")
    
    except subprocess.CalledProcessError as e:
        print(f"Error generating SQL: {e}")
        print(f"Error output: {e.stderr}")

if __name__ == '__main__':
    generate_sql_file()
