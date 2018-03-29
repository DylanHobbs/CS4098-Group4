# Group Project - Party Planner

## Install
To install the app download the scripts from the following command:
```bash
wget -r -np -nH --cut-dirs=1 -R index.* https://dylanhobbs.me/assets/scripts/
# Make the scripts excecutable
chmod -R 755 scripts/
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
#Ctrl-C to stop running server
cd CS4098-Group4-dev
npm test
# ctrl-C to exit
```
**Restarting the server**
```bash
nodemon server.js
```


**I want to be able to login (change password/details/create account) [ Backlog number: 1 ]**
**Create an account/register [ Backlog number: 62]**

***1.0 - Registering a User***
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

***1.1 - Logging in***
```
PREREQUISITES
- Registered account. See 1.0
- Activated account. See 1.0

To login
1. Click on the "Login" button in the top right hand menu
2. Enter your username and password
3. Click login to continue
4. This account will have "user privilages"
```

***1.2 - Change Password Details***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1

To change password details
1. Click the "Hello [your username]" button in the top right hand menu
2. Click the "Edit" icon beside the field marked "Password"
3. Enter your original username and password
4. Enter your new password
5. Click the "Edit" button
```

**1.3 - Change Username Details**
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1

To change usernames
1. Click the "Hello [your username]" button in the top right hand menu
2. Click the "Edit" icon beside the field marked "Username"
3. Enter your original username and password
4. Enter your new username
5. Click the "Edit" button
```

**I would like to be able to create an event e.g. a dinner [Product Backlog Number: 4]**

***4.0 - Creating an Event***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1

To create an event
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "Create Event" button
4. Fill in all the fields for the event you wish to create. All fields are required except for menu, which is optional.
5. On screen instructions will inform you of requirements for each field
6. Hover over the "Question Mark" icon for help in a particular field
7. Click the create button when done
8. You will be brought back the event index screen
```

**I want to create menus [Product Backlog Number: 29]**

***29.0 - Event Menus***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0

A menu can be added to an event when creating. [See story 4.0. Step 4 through 6]

To view an events menu
1. Click on the "Events" tab in the top left menu
2. This screen will show all events, past and future
3. Click on the "View" button in the event's row
4. Under the top section there will be a table containing the event information. 
5. Click the menu link.
```
**I want to be able to give admin access to other people [Product Backlog Number: 2]**

***2.0 - Grant Users Admin Access***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1

To grant users admin access
1. Click on the "Management" tab in the top left menu
2. This screen will show all users
3. Use the search box to search for the desired user
3.a The search box is a white box with a magnifying glass in the right of it
4. Click on the "Edit" button
5. This screen can change any detail of the user
6. Click on the "Permissions" tab in the edit box in the middle of the screen
7. You can see the user's current permissions here
8. Click on the red "Admin" button to change their permissions
9. After a brief rerfresh, you can see that their permissions were updated
```

**I want to see guests contact details [Product Backlog Number: 11]**
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0
- At least 1 user invited to the event. See 28.0

To view guest contact details for an event:

1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Click the blue view button beside the event that the guest is invited to/attending.
4a.(optional) Use search feature for the invited list to find guest in the invited list. 
or
4b.(optional) Use search feature for the attending list to find guest in the attending list
5.There contact email will be in the middle column of the table.

```
**I want to see the invite list [Product Backlog Number: 10]**

**I want to be able to see the rsvp list [Product Backlog Number: 22]**
**I want confirmation that people are registered to attend (RSVP'd) in order to have the correct number of staff for the event [Product Backlog Number: 25]**

***22.0 - See RSVP list***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0

To view rsvp/invite list:

1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Click the blue view button beside the event that you wish to view.
4.List of people attending and invited will be displayed side by side.
```

**I want to be able to manage the guest list [Product Backlog Number: 27]**
**I need to be able to manage  the responses so I can know who is attending [Product Backlog Number: 12]**
**I want to be able to add/remove attendees from the guest list [Product Backlog Number: 28]**
```
(NOTE: The attending list is a list of people who have responded and said that they are going to the event, the invited list is people who have been invited but have not yet responded. Someone cannot be on both lists at the same time.)

PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0

To add a user to a list:

1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Click the blue view button beside the event that you wish to add the user to.
4.Enter the email address of a regestered user in the text bar below the word invited. (eg. groganco@tcd.ie)
5.Click add to add that user to the list of invited people.
6.This can be done with the attending list as well following steps 4 and 5 above but using the text bar below the word attending.


To remove a user from a list:

1.Login with user who has admin access.
2.Click on events tab at the top of the page.
3.Click the blue view button beside the event that the guest you wish to remove is invited to/attending.
4.Find the person you wish to remove by scrolling through the lists or using the search feature above the list you are searching.
5.Once you have located the person that you wish to remove click the remove button beside their name and email address.
```

**I want to be able to see a report of who is attending an event [Product Backlog Number: 24]**

***24.0 - View a Report of An Event***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0
- At least 1 user invited to the event. See

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

**As staff, I need to register a guest for one event (including their details), so I can track what is needed for the event (dietary, ...) [Product Backlog Number: 13]**

***13.0 - As a Staff member, registering guest for an event***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0
- Know guest's details, including ID of event they will be attending, eg. ID = 42 for Trinity Dinner event
          The ID of the event can be found by doing the following:
          Click the "events tab" at the top of the page. 
          Search for the event the guest will be attending, then view the ID in the "ID" column.
          

To register a guest:
1. Click on management tab at the top of the page.
2. Click 'register guest for an event'
3. Enter the guest's details. Email address is optional but phone number is required.
4. Click the Register button to register the guest
5. The guest's (anonymised) dietary requirements will be displayed upon viewing the event, as will their name in the guest list. To view the event:
        Click the events tab at the top of the page
        Click the 'view' button beside the event the guest was registered for
6. The guest's name and phone number will be shown in the 'Attending' list, and their anonymised dietary requirements are shown in the dietary column at the top of the page
```

**I want to be able to update event information and submit event updates [Product Backlog Number: 5]**

***5.0 - Update Event information and submit Event updates***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
- At least 1 event created. See 4.0
1.Click on events tab at the top of the page.
2.Click on the edit button beside the event you wish to update.
3.Enter the details of the event that you wish to update. 
4.Click the update event button to confirm the update
5.You will be redirected to events page where you can view updated details.
6.Click 'view' button on event you updated to view more in depth details of event.
```


**Accounts associated as guests can change their rsvp status as an attendee [Product Backlog Number: 118]**

***118.0 - Guests can change RSVP status***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in as guest attending/invited to event: 
        To login as guest attending/invited to event, logout (if logged in already) and login with the credentials:
        username: johnbrien
        password: Password*1
1. Click on events tab at the top of the page.
2. Click on the view button beside the event you wish to change status (Trinity Dinner).
3.1 To RSVP to event (if not already RSVP'd), click 'RSVP to this event' button 
3.2 To Un-RSVP to event (if already RSVP'd), click 'Un-RSVP to this event' button
4. The page will refresh, and will show the 'Un-RSVP button' and 'You're attending' text if you're RSVP'd, otherwise just the 'RSVP button' if you're not RSVP'd
5. The guest's RSVP status can also be viewed by logging into an admin account and viewing the guest list of the event, ie:
        To login as admin, logout (if logged in already) and login with the credentials:
        username: dhobbs
        password: Password*1
6. Click 'events' tab at top of page, then click 'view' button beside event guest is registered for (Trinity Dinner)
7. The guest will be show in the "Attending" list if RSVP'd, and the "Invited" list if not RSVP'd
```

**I want to track current amount raised [Product Backlog Number: 54]**

***54.0 - Track current amount raised***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on management tab at the top of the page.
2. Click on the 'Donation Stats' button towards the top of the page
3. The page shows the current total amount raised, total number of donations, as well as the most generous donors and the most frequent donors.
4. Click the donate button at the top of the page.
5. Enter an amount to donate (eg. 100000) and click the donate button. 
6. Follow steps 1-3, to view the updated donation stats after donating.
```

***54.1 - To track the current amount raised for a given event***
```
- Activated account. See 1.0
- Logged in. See 1.1
- At least 1 event created. See 4.0
1. Click the events tab in the top left menu
2. Type the name of the event into the search bar or look at the list to find the event you want
3. The current amount raised for that event is displayed there.
4. Alternitivly you can go to the live tracker for that event. See 53.0
```

**Keep track of possible/previous guests [Product Backlog Number: 6]**

***6.0 - Track users***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on management tab at the top of the page.
2. A list of users will be viewable on this page

```

**I want to send invitations to a mailing list, so that people know to come and that they are invited [Product Backlog Number: 8]**

***8.0 - Create Mailing List***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on management tab at the top of the page.
2. Click on the "Mailing Lists" button.
3. ON the mailing lists screen, click "Create Mail List".
4. Enter a name for your mail list in the "name" field.
5. Add users to the mail list by clicking the "Add" button for each user.
6. When all users have been added and the list has been named, click "Create List".

```

***8.1 - Send Mail using a Mailing List***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
- Prior Mail List created. See 8.0
1. Click on management tab at the top of the page.
2. Click on the "Mailing Lists" button.
3. For the mailing list you wish to use, click the "Send Mail" button.
4. Enter a subject for your email in the "subject" field, and the body of your email in the "body" field.
5. Click on "Mailing Lists" and select your desired mail list from the dropdown menu.
6. Click Send Email.

```

***8.2 - Send Mail to people invited to an event***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on events tab at the top of the page.
2. For the event you wish to send mail for, click on the "View Event" button.
3. Click on the "Send Mail" button.
4. Enter a subject for your email in the "subject" field, and the body of your email in the "body" field.
5. Click on "Invited Lists" and select your desired event from the dropdown menu.
6. Click Send Email.

```

**I would like to email legitimately subscribed users [Product Backlog Number: 20]**

***20.0 - Email Users***
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Navigate to the "send mail" screen, through either the management or events tab.
2. Enter a subject for your email in the "subject" field, and the body of your email in the "body" field.
3. Click on a mailing list or a list of attendees/invitees you wish to use in the dropdown menu.
4. Click Send Email.

```

**Follow up with attendees (queries) [Product Backlog Number: 61]**
***61.0 - Follow up with RSVP'd Users***
```
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on events tab at the top of the page.
2. For the event you wish to send mail for, click on the "View Event" button.
3. Click on the "Send Mail" button.
4. Enter a subject for your email in the "subject" field, and the body of your email in the "body" field.
5. Click on "RSVP Lists" and select your desired event from the dropdown menu.
6. Click Send Email.
```

**Have a tracker/ live count that updates with donations throughout the event [Product Backlog Number: 53]**
***53.0 - View an events live tracker**
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- User privileges.
        To login as a user, logout (if logged in already) and login with the credentials:
        username: johnbrien
        password: Password*1
- At least 1 event created. See 4.0
1. Click on the events tab in the top left menu
2. Click on the view button for a given event
3. Click the button labled "View Live Donation Tracker"
4. The thermometer style donation tracker updates every 15 seconds without refreshing
5. To see this change do 53.1 and repeat 53.0
```
***53.1 - Donating to an event**
```
PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- User privileges.
        To login as a user, logout (if logged in already) and login with the credentials:
        username: johnbrien
        password: Password*1
- At least 1 event created. See 4.0
1. Click on the events tab in the top left menu
2. Click on the view button for a given event
3. Click the button labled "Donate to Event"
4. Enter an amount to donate
5. This will update information in 53.0 and 54.1
```

**Track which guests are big spenders and/or regular donors [Product Backlog Number: 7]**

***7.0 - Track big spenders and/or regular donors***
```
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on management tab at the top of the page.
2. Click on the 'Donation Stats' button towards the top of the page
3. The page shows the current total amount raised, total number of donations, as well as the most generous donors and the most frequent donors.
4. Click the donate button at the top of the page.
5. Enter an amount to donate (eg. 100000) and click the donate button. 
6. Follow steps 1-3, to view the updated donation stats after donating.

If you wish to look for a specific person to find their donation total and number of donations follow the following instructions:

PREREQUISITES
- Activated account. See 1.0
- Logged in. See 1.1
- Admin privileges.
        To login as admin, logout (if logged in already), refresh page and login with the credentials:
        username: dhobbs
        password: Password*1
1. Click on management tab at the top of the page.
2. Click on the search bar and type the name of person you wish to view.
3. The person shall be displayed with their donation total and number of donations. 

The table on the management screen is also sortable so if you wish to sort is it by amount donated or number of donations click on the respective column heading. This is useful to see who has donated the most or least number of times or who has donated the most or least.

(eg. if you want to sort by amount donated click on "amount donated" at the top of the table, the first click will sort lowest to highest, a second click will sort highest to lowest, every click after will change the sorting to the opposite)

```
