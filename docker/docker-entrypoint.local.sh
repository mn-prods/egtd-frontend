npm install --include=optional

firebase use default

firebase apps:list | grep "$APP_NAME-web"
if [ $? -eq 0 ]; then
  echo "Firebase app '$APP_NAME-web' already exists."
else
  firebase apps:create web "$APP_NAME-web"
FIREBASE_CONFIG=$(firebase apps:sdkconfig web )

# Extract required values from the configuration using sed
PROJECT_ID=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"projectId": "\([^"]*\)".*/\1/p')
APP_ID=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"appId": "\([^"]*\)".*/\1/p')
STORAGE_BUCKET=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"storageBucket": "\([^"]*\)".*/\1/p')
API_KEY=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"apiKey": "\([^"]*\)".*/\1/p')
AUTH_DOMAIN=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"authDomain": "\([^"]*\)".*/\1/p')
MESSAGING_SENDER_ID=$(echo "$FIREBASE_CONFIG" | sed -n 's/.*"messagingSenderId": "\([^"]*\)".*/\1/p')

# Create the output file
echo "export const firebase = {
projectId: \"$PROJECT_ID\",
appId: \"$APP_ID\",
storageBucket: \"$STORAGE_BUCKET\",
apiKey: \"$API_KEY\",
authDomain: \"$AUTH_DOMAIN\",
messagingSenderId: \"$MESSAGING_SENDER_ID\"
};" > "src/firebase.config.ts"
fi



npm run start