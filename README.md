## Background

This project aims to be a complete volunteer management system for the [Nowhere](www.goingnowhere.org) event. As much as possible the functionality is implemented in a general purpose [Meteor module](https://github.com/goingnowhere/meteor-volunteers), the intention of which is to be a reusable dependency for other volunteer run events and projects.

## Development

When running, the volunteer facing site is at http://localhost:3000/

The admin password is admin@example.com / apple1
A normal user account is created with normal@example.com / apple1

It was originally written in Coffeescript using Blaze as the view layer. In order to increase the pool of potential contributors and to escape the poor development experience of Blaze it is currently being ported to React and Javascript. This leads to some odd behaviour at the moment as it's currently using both technologies at the same time.

## Testing (TODO)

   meteor test --driver-package practicalmeteor:mocha --port 3100

   meteor test-packages --driver-package practicalmeteor:mocha --port 3100

### Git submodule install

To run this project you must [install meteor](https://www.meteor.com/install) and checkout all additional modules. This can be done in one step by using git submodules, though it may require you to have a Github and Gitlab accounts set up with SSH keys set up (all the code is public but since we use SSH urls for the repositories hosted on Github and Gitlab you need an account, an [alternative install method](#non-ssh-install) exists if you don't want to set this up):

``` bash
git clone git@github.com:goingnowhere/volunteers-nowhere.git --recurse-submodules
cd volunteers-nowhere
meteor npm install
meteor
```

### Non-SSH install

You'll need to clone each dependency in turn and tell Meteor where to find them when you run it:

``` bash
mkdir nowhere-volunteers
cd nowhere-volunteers
git clone https://github.com/goingnowhere/volunteers-nowhere.git
# main meteor-volunteers dependency
git clone https://github.com/goingnowhere/meteor-volunteers.git
# dependencies
git clone https://gitlab.com/abate/meteor-autoform-components.git
git clone https://github.com/abate/meteor-autoform-datetimepicker.git
git clone https://gitlab.com/abate/meteor-formbuilder.git
git clone https://github.com/piemonkey/meteor-roles.git
git clone https://gitlab.com/abate/meteor-user-profiles.git
git clone https://github.com/StorytellerCZ/meteor-mandrill.git
git clone https://github.com/abate/meteor-autoform.git
git clone https://github.com/piemonkey/emailForms.git
git clone https://github.com/piemonkey/meteor-pages.git
git clone https://github.com/piemonkey/accounts-ui.git
# install npm dependencies and run
cd volunteers-nowhere
meteor npm install
METEOR_PACKAGE_DIRS=../ meteor
```

update all submodules to master except meteor-roles

```
git submodule foreach '[ "$path" = "packages/meteor-roles" ] || git pull origin master'
```

restore all the backup data for testing
run ```meteor mongo``` in a shell and then run the following command to replate the existing database with a copy from ```backups/mongo__mongodb_20180512-000008/volunteers/```

```
mongorestore -h 127.0.0.1 --port 3001 -d meteor --drop backups/mongo__mongodb_20180512-000008/volunteers/
```
