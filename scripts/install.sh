# Ensure outgoing connections are enabled or switch to hotspot
# Download zip file
echo "Downloading the release..."
curl -O https://codeload.github.com/DylanHobbs/CS4098-Group4/zip/dev
echo "Download complete"

echo "Unzipping the files"
unzip dev
echo "Unzipping complete"
cd CS4098-Group4-dev

# Set enviroment vars
# Replace hash below with password provided
echo "Setting enviroment variables"
export API_KEY="password1"
# Check that password was set correctly
echo "Should be password1:"
echo $API_KEY

echo "Installing node dependacies"
# Run install script
npm install

echo "Installing run time enviroment"
# Install nodemon to run server
sudo npm install -g nodemon

echo "Populating database"
./popDB.sh

echo "Running the server. Navigate to http://localhost:8080"
# Start the server
nodemon server.js