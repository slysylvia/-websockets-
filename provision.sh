#!/bin/bash

# Set TimeZone to LA
sudo timedatectl set-timezone America/Los_Angeles
# old way I found
#echo "America/Los_Angeles" | sudo tee /etc/timezone && sudo dpkg-reconfigure --frontend noninteractive tzdata

# install and load nvm
if [ ! -d ~/.nvm ]; then
  curl -# https://raw.githubusercontent.com/creationix/nvm/v0.23.0/install.sh > ~/install.nvm.sh
  chmod +x ~/install.nvm.sh
  . ~/install.nvm.sh
  rm ~/install.nvm.sh
  source ~/.nvm/nvm.sh ; echo "installed nvm"
fi

# install node 0.11 via nvm
nvm install 0.11

# install set 0.11 as default for system in nvm
nvm alias default 0.11

## Install Google Chrome (NOT NEEDED FOR NOW, using chromium)
#wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
#sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#sudo apt-get update
#sudo apt-get install google-chrome-stable

# add some stuff to .profile
echo "" >> ~/.profile
echo "# Added during provision" >> ~/.profile
echo "source ~/clientapp/helpers.sh" >> ~/.profile
source ~/.profile

#echo "$ED_PROJECT_PATH"

# Create clientapp for prosperty
if [ ! -d "$ED_PROJECT_PATH" ]; then
  mkdir "$ED_PROJECT_PATH"
fi

# Create logs folder if needed
if [ ! -d "$ED_PROJECT_PATH/logs" ]; then
  mkdir "$ED_PROJECT_PATH/logs"
fi

# Create logs/gulp folder if needed
if [ ! -d "$ED_PROJECT_PATH/logs/gulp" ]; then
  mkdir "$ED_PROJECT_PATH/logs/gulp"
fi

# Create logs/xvfb folder if needed
if [ ! -d "$ED_PROJECT_PATH/logs/xvfb" ]; then
  mkdir "$ED_PROJECT_PATH/logs/xvfb"
fi
