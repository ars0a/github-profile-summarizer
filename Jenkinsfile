pipeline {
  agent any

  environment {
    IMAGE_NAME = "theshubhamgour/github-profile-summarizer"
    IMAGE_TAG = "v${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build (Node)') {
      agent { docker { image 'node:20-alpine' } }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
      }
    }

    stage('Docker Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
        sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
        sh 'docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest'
        sh 'docker push $IMAGE_NAME:latest'
      }
    }
  }

  post {
    always {
      echo "✅ Image pushed: $IMAGE_NAME:$IMAGE_TAG"
    }
  }
}

