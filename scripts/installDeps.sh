echo "Installing deps"
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo apt-get install -y git
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