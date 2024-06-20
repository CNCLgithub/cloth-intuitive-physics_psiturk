#!/bin/bash -e
#
############################################################################
# Filename      : config_setup_load.sh
# Description   : This script loads from config file "config/config_setup.conf"
# Arguments     : None
# Date          : 12/12/2020
############################################################################


#-------------- function definition -----------------------
#[wb]: Here defines the global functions
echo_blue () { echo -e "\033[0;36m $@ \033[0m"; }
echo_red () { echo -e "\033[0;31m $@ \033[0m"; }
echo_green_check() { echo -e "\033[0;32m \u2714 \033[0m"; }
echo_red_cross() { echo -e "\033[0;31m x \033[0m"; }
cmd(){ echo `basename $0`; }
remove_dir(){ if [ -d $1 ]; then rm -rf $1; fi }
make_dir(){ if [ ! -d $1 ]; then mkdir -p $1; fi }


#--------------  Set config file name -------------------

if [ -f "config/user.conf" ]; then
    echo "Found user config, overriding default..."
    CFGFILE="config/user.conf"
else
    # echo "No user config found, using default"
    CFGFILE="config/config_setup.conf"
fi


# if [ -z $CFGFILE ]; then
#     CFGFILE="config/config_setup.conf"
# fi
#echo $CFGFILE



#--------------  Readline -------------------------------

while read line; do
    if [[ $line =~ ^"["(.+)"]"$ ]]; then
        arrname=${BASH_REMATCH[1]}
        declare -A $arrname
    elif [[ $line =~ ^"#"(.+)$ ]]; then   #[wb]: comments start with #
        :
    elif [[ $line =~ ^([_[:alpha:]][_[:alnum:]]*)":"(.*) ]]; then
        tmpkey="${BASH_REMATCH[1]}"
        tmpvalue="${BASH_REMATCH[2]}"

        if [[ $tmpvalue =~ ^"("(.+)")"$ ]]; then
            tmp=${BASH_REMATCH[1]}
            tmp=${tmp// /} #[wb]: remove all spaces
            declare ${arrname}[$tmpkey]=${tmp[@]}
        else
            declare ${arrname}[$tmpkey]="${tmpvalue}"
        fi
    fi
done < $CFGFILE