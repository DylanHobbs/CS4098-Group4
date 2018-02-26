# Group Project - Party Planner

## Install
To install the app download the scripts from the following command:
```bash
wget -r -np -nH --cut-dirs=1 -R index.* https://dylanhobbs.me/assets/scripts/
```
Please run the scripts from outside the script folder.

The following script will install the dependancies of the app
**Dependancies**
```bash
# Install generals deps
./scripts/installDeps.sh
```

This will install the app itself
**Installing the App**
```bash
./scripts/install.sh
```

Navigate your browser to:
http://localhost:8080

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

To change password details
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

To change usernames
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

To view a report of an event
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "View" button in the event's row
4. You will see a list of people confirmed to be attending the event
5. You will see a list of people you are invited to the event
6. This page can be printed by using your browsers print functions
        "ctrl-p" in windows
        "cmd-p" in mac
```

**Event Menus**
```
PREREQUISITES
- Logged in 
- Activated account
- Admin privileges
- At least 1 event created

To create an event
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "View" button in the event's row
4. Under the top section there will be a table containing the event information. 
5. Click the menu link.
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
