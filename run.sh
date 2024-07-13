#!/bin/bash -e
############################################################################
# @ Filename      : run.sh
# @ Description   : Loads from config file "config/config_setup.conf"
# @ Arguments     : --exp=stiffness|mass
# @ Date          : 
############################################################################

. config/config_setup_load.sh


## ==========================================================================
## ------------------------- Config paras ----===------------------------- ##
## ==========================================================================
EXP_NAME_RAW=(${EXPCONDS['exp_name']})
EXP_NAME=(${EXP_NAME_RAW//,/ })
# echo ${EXP_NAME[@]}
EXP_PATH=(${EXPCONDS['exp_path']})
EXP_PATH=(${EXP_PATH//,/ })
# echo ${EXP_PATH[@]}
CONDITIONFILE_PATH=(${EXPCONDS['conditionfile_path']})
CONDITIONFILE_PATH=(${CONDITIONFILE_PATH//,/ })
# echo ${CONDITIONFILE_PATH[@]}
CONDITIONFILE_LEADING=(${EXPCONDS['conditionfile_leading']})
CONDITIONFILE_LEADING=(${CONDITIONFILE_LEADING//,/ })


## [wb]: Default paras
EXPCONDITION=${EXP_NAME[0]}
exp_index=0


## ==========================================================================
## ------------------------- Take User Input ----------------------------- ##
## ==========================================================================
usage(){
echo "\
Usage: `cmd` [OPTION...]
--exp=;[${EXP_NAME_RAW//,/|}] (default: $EXPCONDITION)
" | column -t -s ";"
}


#<--[wb]-- Check arguments
for i in "$@"
do
    case $i in
        --exp=*)
            flag=false
            for j in "${EXP_NAME[@]}"; do
                if [ "${i#*=}" == "$j" ]; then
                    flag=true
                    break;
                else
                    exp_index=$((exp_index+1))
                fi
            done

            if [ $flag != true ]; then
                echo_red "`cmd`: invalid option '$i' ";
                echo_red "`usage`"
                # echo -e "\033[0;31m `usage` \n\033[0m"
                exit 1
            fi

            EXPCONDITION="${i#*=}"
            shift
            ;;
        *)   # Unknown arguments/options
            if [[ $i == --* ]]; then
                echo_red "`cmd`: invalid option '$i' "
            else
                echo_red "`cmd`: extra arguments '$i' "
            fi
            echo_red "`usage`"
            exit 1
            ;;
    esac
done
echo_blue "==> Running experiment: [${EXPCONDITION}]"


## ==========================================================================
## ------------------------- Check experiment folder --------------------- ##
## ==========================================================================
if [ ! -e "${CONDITIONFILE_PATH[exp_index]}" ]; then
    echo_red "[Error] Path does not exist: ${CONDITIONFILE_PATH[exp_index]}"
    echo_red "        Run 'setup.sh' first. "
    exit 1
fi 


## ==========================================================================
## ------------------------- Generate condition files -------------------- ##
## ==========================================================================
count_json=`ls -1 ${CONDITIONFILE_PATH[exp_index]}/${CONDITIONFILE_LEADING[exp_index]}*.json 2>/dev/null | wc -l`

if [ $count_json == 0 ]; then
    echo_red "[Error] Condition files do not exist: ${CONDITIONFILE_PATH[exp_index]}/${CONDITIONFILE_LEADING[exp_index]}*.json."
    echo_red "        Run 'setup.sh'."
    exit 1 
fi


## ==========================================================================
## ------------------------- Run ----------------------------------------- ##
## ==========================================================================
singularity exec "cont" bash -c "cd ${EXP_PATH[exp_index]}/psiturk && psiturk"
