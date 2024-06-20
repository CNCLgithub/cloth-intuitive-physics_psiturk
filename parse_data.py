from sqlalchemy import create_engine, MetaData, Table
import json
import pandas as pd
import os
import argparse

############################################################################
# @ Filename      : parse_data.py
# @ Description   : parse .db data fuke to .csv
# @ Arguments     : --exp_name=stiffness|mass
# @ Date          : 
############################################################################

parser = argparse.ArgumentParser(description='')
parser.add_argument('--exp_name', type=str, default='stiffness', 
    help='The name of the experiment (stiffness|mass).')
args,_ = parser.parse_known_args()

exp_condition = args.exp_name
db_url = "sqlite:///cloth-psiturk-"+exp_condition+"/psiturk/participants.db"
table_name = 'exp1_debug'
data_column_name = 'datastring'
QOUT = os.path.join("analysis", exp_condition, "parsed_questions.csv")
# boilerplace sqlalchemy setup
engine = create_engine(db_url)
metadata = MetaData()
metadata.bind = engine
table = Table(table_name, metadata, autoload=True)
# make a query and loop through
s = table.select()
rows = s.execute()

data = []
#status codes of subjects who completed experiment
statuses = [3,4,5,7]
statuses = [2,3,4,5,7]
# if you have workers you wish to exclude, add them here
exclude = []
for row in rows:
    # only use subjects who completed experiment and aren't excluded
    if row['status'] in statuses and row['uniqueid'] not in exclude:
        data.append(row[data_column_name])

# Now we have all participant datastrings in a list.
# Let's make it a bit easier to work with:

# parse each participant's datastring as json object
# and take the 'data' sub-object
data = [json.loads(part)['data'] for part in data]

# insert uniqueid field into trialdata in case it wasn't added
# in experiment:
for part in data:
    for record in part:
        record['trialdata']['uniqueid'] = record['uniqueid']

# flatten nested list so we just have a list of the trialdata recorded
# each time psiturk.recordTrialData(trialdata) was called.
data = [record['trialdata'] for part in data for record in part if ('IsInstruction' in record['trialdata'] and
                               not record['trialdata']['IsInstruction'])]


#### Option #############################
for i in range(len(data)):
    data[i]['left'] = data[i]['TrialName'][0]
    data[i]['mid'] = data[i]['TrialName'][1]
    data[i]['right'] = data[i]['TrialName'][2]

    data[i]['scene_left'] = data[i]['left'].split("_")[0]
    data[i]['scene_mid'] = data[i]['mid'].split("_")[0]
    data[i]['scene_right'] = data[i]['right'].split("_")[0]
    data[i]['b_left'] = data[i]['left'].split("_")[4]
    data[i]['b_mid'] = data[i]['mid'].split("_")[4]
    data[i]['b_right'] = data[i]['right'].split("_")[4]
    data[i]['m_left'] = data[i]['left'].split("_")[2]
    data[i]['m_mid'] = data[i]['mid'].split("_")[2]
    data[i]['m_right'] = data[i]['right'].split("_")[2]
    if 'participant_ID' in data[i].keys():
        data[i]['participant_ID']= data[i]['participant_ID']

# ########################################

# Put all subjects' trial data into a dataframe object from the
# 'pandas' python library: one option among many for analysis
data_frame = pd.DataFrame(data)
data_frame.to_csv(QOUT, index=False)