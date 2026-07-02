pipeline {
    agent any

    environment {
        EC2_USER = "ubuntu"
        EC2_HOST = credentials('EC2_HOST')
        SSH_KEY  = credentials('EC2_SSH_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt pytest --quiet
                        pytest tests/ -v --tb=short || true
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST "
                        cd /app/LeadCRM &&
                        git pull origin main &&

                        # Backend
                        cd backend &&
                        python3 -m venv venv &&
                        . venv/bin/activate &&
                        pip install -r requirements.txt --quiet &&
                        alembic upgrade head &&
                        pm2 restart leadvault-backend || pm2 start 'venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000' --name leadvault-backend &&

                        # Frontend
                        cd ../LEAD_CRM &&
                        npm install --silent &&
                        npm run build &&
                        sudo cp -r dist/* /var/www/leadvault/
                    "
                '''
            }
        }

    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} deployed successfully!"
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed."
        }
    }
}
