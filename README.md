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

**Registering a User**
```
PREREQUISITES
- None

To register a user
1. Click on the "Register" button in the top right hand menu
2. Fill in your details
3. On screen instructions will inform you of requirements for each field
4. Click register to continue
5. You will be brought to the home screen.
6. An email will be sent to your email address containing a link to activate your account
7. Open your email client and click our email.
8. Click the link contained in the email which will bring you back to our page.
9. Login with your username and password
```

**Logging in**
```
PREREQUISITES
- Registered account
- Activated account

To login
1. Click on the "Login" button in the top right hand menu
2. Enter your username and password
3. Click login to continue
```

**Change Password Details**
```
PREREQUISITES
- Logged in
- Activated account

To login
1. Click the "Hello [your username]" button in the top right hand menu
2. Enter your original username and password
3. Enter your new password
4. Click the "Edit" button
```

**Change Username Details**
```
PREREQUISITES
- Logged in
- Activated account

To login
1. Click the "Hello [your username]" button in the top right hand menu
2. Enter your original username and password
3. Enter your new username
4. Click the "Edit" button
```

**Creating an Event**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges

To create an event
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "Create Event" button
4. Fill in all the fields for the event you wish to create
5. On screen instructions will inform you of requirements for each field
6. Hover over the "Question Mark" icon for help in a particular field
7. Click the create button when done
8. You will be brought back the event index screen
```

**View a Report of An Event**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges
- At least 1 event created
- At least 1 user invited to the event

To create an event
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "View" button in the event's row
4. You will see a list of people confirmed to be attending the event
5. You will see a list of people you are invited to the event
6. This page can be printed by using your browsers print functions
        "ctrl-p" in windows
        "cmd-p" in mac
```

**Grant Users Admin Access**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges

To create an event
1. Click on the "Management" tab in the top left menu
2. This screen will show all users
3. Use the search box to search for the desired user
3.a The search box is a white box with a magnifying glass in the right of it
4. Click on the "Edit" button
5. This screen can change any detail of the user
6. Click on the "Permissions" tab in the edit box in the middle of the screen
7. You can see the user's current permissions here
8. Click on the red "Admin" button to change their permissions
9. After a brief redirect, you can see that their permissions were updated
```


**Testing the Guest List functionality**
```
To add a user to a list:
1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Enter the email address of a regestered user in the text bar below the word invited. (eg. groganco@tcd.ie)
4.Click add to add that user to the list of invited people.
5.This can be done with the attending list as well following steps 3 and 4 above but using the text bar below the word attending. 

To remove a user from a list:
1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Find the person you wish to remove by scrolling through the lists or using the search feature above the list you are searching.
4.Once you have located the person that you wish to remove click the remove button beside their name and email address.
```

**As a Staff member, registering guest for an event**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges
- At least 1 event created
To register a guest:
1.Click on management tab at the top of the page.
2.Click register guest button
3.Enter the guest's details, and give them a username and password which you send to the guest.
4.Click the Register button to register the guest
```

**Update Event information and submit Event updates**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges
- At least 1 event created
1.Click on events tab at the top of the page.
2.Click on the edit button beside the event you wish to update.
3.Enter the details of the event that you wish to update. 
4.Click the update event button to confirm the update
```
