#!/bin/bash -e
############################################################################
# @ Filename      : setup.sh
# @ Description   : Setup the experimental environment
# @ Arguments     : 
# @ Date          : 
############################################################################

. config/config_setup_load.sh


## ==========================================================================
## ------------------------- Take User Input ----------------------------- ##
## ==========================================================================
step=0

step=$(($step+1))
while true; do
    read -p "=== $step. How to set up the singularity container? <default:''> [build|pull|'']"  BUILDCONT
    # Check paras
    if [[ $BUILDCONT = "pull" ]] || [[ $BUILDCONT = "build" ]] || [ -z $BUILDCONT ]; then
        echo_blue "BUILDCONT=$BUILDCONT"    
        break
    fi
done


step=$(($step+1))
while true; do
    read -p "=== $step. Download the videos? [true|FALSE]"  SETUPDATA
    [ -z $SETUPDATA ] && SETUPDATA=false
    # Check paras
    if [ $SETUPDATA = true ] || [ $SETUPDATA = false ]; then
        echo_blue "SETUPDATA=$SETUPDATA"
        break
    fi  
done


if [ $SETUPDATA = true ]; then
    step=$(($step+1))
    while true; do
        read -p "=== $step. Which video dataset to download? [EXP1|exp2|exp3|exp4]"  VIDEO_DATASET
        [ -z $VIDEO_DATASET ] && VIDEO_DATASET="exp1"
        # Check paras
        if [[ $VIDEO_DATASET = "exp1" ]] || [[ $VIDEO_DATASET = "exp2" ]] || 
            [[ $VIDEO_DATASET = "exp3" ]] || [[ $VIDEO_DATASET = "exp4" ]]; then
            echo_blue "VIDEO_DATASET=$VIDEO_DATASET"
            break
        fi
    done
fi


step=$(($step+1))
while true; do
    read -p "=== $step. Run on amazon ec2? [true|FALSE]"  RUN_ON_EC2
    [ -z $RUN_ON_EC2 ] && RUN_ON_EC2=false
    # Check paras
    if [ $RUN_ON_EC2 = true ] || [ $RUN_ON_EC2 = false ]; then
        echo_blue "RUN_ON_EC2=$RUN_ON_EC2"
        break
    fi 
done


step=$(($step+1))
while true; do
    read -p "=== $step. Which experiment to run? [STIFFNESS|mass]"  THIS_EXP
    [ -z $THIS_EXP ] && THIS_EXP="stiffness"
    # Check paras
    if [[ $THIS_EXP = "stiffness" ]] || [[ $THIS_EXP = "mass" ]]; then
        echo_blue "THIS_EXP=$THIS_EXP"
        break
    fi
done


step=$(($step+1))
while true; do
    read -p "=== $step. Have catch trials? [true|FALSE]"  HAS_CATCH_TRIALS
    [ -z $HAS_CATCH_TRIALS ] && HAS_CATCH_TRIALS=false
    # Check paras
    if [ $HAS_CATCH_TRIALS = true ] || [ $HAS_CATCH_TRIALS = false ]; then
        echo_blue "HAS_CATCH_TRIALS=$HAS_CATCH_TRIALS"
        break
    fi 
done


step=$(($step+1))
while true; do
    read -p "=== $step. Generate condition files? [true|FALSE]"  GENERATE_CONDITION_FILES
    [ -z $GENERATE_CONDITION_FILES ] && GENERATE_CONDITION_FILES=false
    # Check paras
    if [ $GENERATE_CONDITION_FILES = true ] || [ $GENERATE_CONDITION_FILES = false ]; then
        echo_blue "GENERATE_CONDITION_FILES=$GENERATE_CONDITION_FILES"
        break
    fi 
done

echo " "

## ==========================================================================
## ------------------------- Config params ------------------------------- ##
## ==========================================================================
curDir=$PWD
curFile="${curDir}/$0"

PSIRUTK_CONFIG=(${ENV['psiturk_config']})
CONT=(${ENV['cont']})
CONTDOWNLOAD=(${LINKS['contdownload']})
SING_RECIPE_PATH=(${ENV['sing_recipe_path']})

EXP_NAME_RAW=(${EXPCONDS['exp_name']})
EXP_NAME=(${EXP_NAME_RAW//,/ })
EXP_PATH=(${EXPCONDS['exp_path']})
EXP_PATH=(${EXP_PATH//,/ })
MOVIE_PATH=(${EXPCONDS['movies_path']})
MOVIE_PATH=(${MOVIE_PATH//,/ })
CONDITIONFILE_PATH=(${EXPCONDS['conditionfile_path']})
CONDITIONFILE_PATH=(${CONDITIONFILE_PATH//,/ })
CONDITIONFILE_LEADING=(${EXPCONDS['conditionfile_leading']})
CONDITIONFILE_LEADING=(${CONDITIONFILE_LEADING//,/ })


DATAPATH=$PWD
flag=false
exp_index=0
for i in "${EXP_NAME[@]}"; do
    if [ $THIS_EXP == "$i" ]; then 
        flag=true
        break;
    else
        exp_index=$((exp_index+1))
    fi
done

if [ $flag != true ]; then
    echo_red "[Error] `cmd`: No config for THIS_EXP=$THIS_EXP ";
    exit 1
fi

EXP_PATH=${EXP_PATH[exp_index]}
MOVIE_PATH=${MOVIE_PATH[exp_index]}
CONDITIONFILE_PATH=${CONDITIONFILE_PATH[exp_index]}
CONDITIONFILE_LEADING=${CONDITIONFILE_LEADING[exp_index]}


## ==========================================================================
## 1) Create singularity container (requires sudo)
## ==========================================================================
if [ -z $BUILDCONT ]; then
    echo_blue ">> Not touching the current singularity container..."
elif [ $BUILDCONT = "pull" ] || [ $BUILDCONT = "build" ]; then
    if [ $BUILDCONT = "pull" ]; then
        echo_blue "Downloading the container..."
        wget "$CONTDOWNLOAD" -O $CONT
    else
        echo_blue "Building singularity container (REQUIRES ROOT)..."
        remove_dir $PWD/.tmp
        mkdir $PWD/.tmp

        SINGULARITY_TMPDIR=$PWD/.tmp sudo -E singularity build $CONT $SING_RECIPE_PATH
    fi


fi

## ==========================================================================
## 2) Download dataset
## ==========================================================================

if [ $SETUPDATA = true ]; then
    if [[ $VIDEO_DATASET = 'exp1' ]]; then
        DATADOWNLOAD=(${LINKS['datadownload_exp1']})
    elif [[ $VIDEO_DATASET = 'exp2' ]]; then
        DATADOWNLOAD=(${LINKS['datadownload_exp2']})
    elif [[ $VIDEO_DATASET = 'exp3' ]]; then
        DATADOWNLOAD=(${LINKS['datadownload_exp3']})
    elif [[ $VIDEO_DATASET = 'exp4' ]]; then
        DATADOWNLOAD=(${LINKS['datadownload_exp4']})
    else
        echo_red "[ERROR: line ${LINENO}] $curFile" && exit 1
    fi

    echo $DATADOWNLOAD
    echo_blue "Downloading videos from [$VIDEO_DATASET]..."

    wget "$DATADOWNLOAD" -O "movies.zip"
    remove_dir $DATAPATH/data
    remove_dir $DATAPATH/movies
    unzip "movies.zip" -d "$DATAPATH"
    rm "movies.zip"
    remove_dir $DATAPATH/__MACOSX
else
    echo_blue ">> Not touching the current video folder..."
fi


## ==========================================================================
## 3) Create alias
## ==========================================================================
make_dir $EXP_PATH/psiturk/static/data

ln -sf "$DATAPATH/psiturk/templates" "$DATAPATH/$EXP_PATH/psiturk/"
ln -sf "$DATAPATH/movies" "$DATAPATH/$EXP_PATH/psiturk/static/data/"
ln -sf "$DATAPATH/psiturk/static/css" "$DATAPATH/$EXP_PATH/psiturk/static/"
ln -sf "$DATAPATH/psiturk/static/fonts" "$DATAPATH/$EXP_PATH/psiturk/static/"
ln -sf "$DATAPATH/psiturk/static/images" "$DATAPATH/$EXP_PATH/psiturk/static/"
ln -sf "$DATAPATH/psiturk/static/lib" "$DATAPATH/$EXP_PATH/psiturk/static/"
ln -sf "$DATAPATH/psiturk/config.txt" "$DATAPATH/$EXP_PATH/psiturk/config.txt"
ln -sf "$DATAPATH/psiturk/custom.py" "$DATAPATH/$EXP_PATH/psiturk/custom.py"
ln -sf "$DATAPATH/psiturk/server.log" "$DATAPATH/$EXP_PATH/psiturk/server.log"

if [ -e "$EXP_PATH/psiturk/participants.db" ]; then
    mv "$EXP_PATH/psiturk/participants.db" "$EXP_PATH/psiturk/participants.db_bkp_`date +%Y.%m.%d-%H.%M.%S`"
fi


## ==========================================================================
## 4)  Run on EC2
## ==========================================================================
if [ $RUN_ON_EC2 = true ]; then
    yes | cp -rf "$DATAPATH/psiturk/templates/ad_consent.html" "$DATAPATH/psiturk/templates/ad.html"
elif [ $RUN_ON_EC2 = false ]; then
    yes | cp -rf "$DATAPATH/psiturk/templates/ad_no_consent.html" "$DATAPATH/psiturk/templates/ad.html"
else
    (echo_red "[ERROR: line ${LINENO}] $curFile" && exit 1)
fi


## ==========================================================================
## 5) Set catch trials
## ==========================================================================
if [ $HAS_CATCH_TRIALS = true ]; then
    yes | cp -rf "$EXP_PATH/psiturk/static/js/task_with_catch_trial.js" "$EXP_PATH/psiturk/static/js/task.js"
elif [ $HAS_CATCH_TRIALS = false ]; then 
    yes | cp -rf "$EXP_PATH/psiturk/static/js/task_no_catch_trials.js" "$EXP_PATH/psiturk/static/js/task.js"
else
    (echo_red "[ERROR: line ${LINENO}] $curFile" && exit 1)
fi


## ==========================================================================
# 6) Check condition files & block number; 
#    If no condition files, run prepareConditionFiles_exp1.py
## ==========================================================================
count_json=`ls -1 ${CONDITIONFILE_PATH}/condlist_${THIS_EXP}*.json 2>/dev/null | wc -l`

if [ "$count_json" == "0" ] || "$GENERATE_CONDITION_FILES" = "true" ]; then
    echo_blue ">> Generating condition files ..."
    #
    read -p "=== Generating condition files for which exp? <default: exp1> [exp1|exp2|exp3|exp4]"  EXP_NUM
    if [ -z $EXP_NUM ]; then
        EXP_NUM='exp1'
    fi
    echo_blue "EXP_NUM=$EXP_NUM"
    singularity exec "cont" python3 prepareConditionFiles_${EXP_NUM}.py --exp_name=$THIS_EXP
    count_json=`ls -1 ${CONDITIONFILE_PATH}/condlist_${THIS_EXP}*.json 2>/dev/null | wc -l`
fi

echo_blue ">> Make sure that in $PSIRUTK_CONFIG, [Task Parameters] num_conds == $count_json ..."



## ==========================================================================
# 7) Done
## ==========================================================================
echo_red "Successful! Done..."