import numpy as np
import json
import os
import argparse
from itertools import permutations 
import random
from pathlib import Path


class ConfigParser:
    def __init__(self, conf_file_path=None, vid_num='exp1'):
        '''
        Args:
                :param  conf_file_path = full path to the configuration file
                        vid_num = 'exp1'|'exp2'|'exp3'|'exp4' (video stimuli are different)
        '''
        self._set_conf_file_path(conf_file_path)
        self._vid_num = vid_num
        self._opt = None

    def _set_conf_file_path(self, conf_file_path):
        cur_path = Path(os.path.dirname(os.path.realpath(__file__)))
        parent_path = cur_path.parent.absolute()
        if not conf_file_path:
            conf_file_path = os.path.join(parent_path, "config_exp.json")
        self._conf_file_path = conf_file_path

    def get_config(self):
        with open(self._conf_file_path , 'r') as f:
            loaded_data = json.load(f)
        self._opt = loaded_data[self._vid_num]
        self._opt['vid_num'] = self._vid_num
        return self._opt


# if __name__ == '__main__':
    # cur_path = Path(os.path.dirname(os.path.realpath(__file__)))
    # parent_path = cur_path.parent.absolute()
    # default_conf_file_path = os.path.join(parent_path, "config_exp.json")
    # # Take user-input
    # parser = argparse.ArgumentParser(description='')
    # parser.add_argument('--conf_file_path', type=str, default=default_conf_file_path, 
    #     help='Full path to config file <default: config_exp.json>')
    # parser.add_argument('--vid_num', type=str, default='exp1', 
    #     help='Defines which sets of videos to be used (exp1<default>|exp2|exp3|exp4).')
    # args,_ = parser.parse_known_args()
    # ConfigParser(conf_file_path=args.conf_file_path, vid_num=args.vid_num).get_config()