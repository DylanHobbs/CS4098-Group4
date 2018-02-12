# Group Project - Party Planner

## Install

**Dependancies**

NodeJS
```bash
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Node Package Manager (npm)
```bash
sudo apt-get install -y build-essential
```
Git
```bash
sudo apt-get install -y git
```
MongoDB
```bash
# Add signing keys
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
# Create a list for Mongo repos to live in
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
# Update repo listings
sudo apt-get update
# Install mongo 
sudo apt-get install -y mongodb-org
# Start Mongo
sudo service mongod start
# Verify it is running with:
sudo service mongod status
# Press "q" to exit this prompt
```

**Installing the App**
```bash
# Ensure outgoing connections are enabled or switch to hotspot

# Download zip file
curl -O https://codeload.github.com/DylanHobbs/CS4098-Group4/zip/dev
unzip dev
cd CS4098-Group4-dev
# Set enviroment vars
# Replace hash below with password provided
export API_KEY="#"
# Check that password was set correctly
echo $API_KEY
# Run install script
npm install
# Install nodemon to run server
sudo npm install -g nodemon
# Start the server
nodemon server.js
# Navigate to homepage
http://localhost:8080
```

**Running Tests**
```bash
npm test
# ctrl-C to exit
```