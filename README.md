# Cloth Psiturk

This is the psiturk component of the cross-domain-cloth project

## Overview

Following the current `psiturk` api, the folder located at `/psiturk` contains
all the necessary bits to host a psiturk experiment

The main components are:

<!-- 
1. `static/js/task.jl`: Contains the logic for the experiment (ie pre-test
   staircasing) -->
1. `movies`: Collection of downloaded media including stimuli and
   condition lists.
2. `cloth-psiturk-*/static/data/condlist_*.json`: Describes which stimuli should be presented in a
   random order for a given condition 

## Setup

### dependencies

- singularity (optional)
- psiturk
- wget
- unzip

Singularity is not mandadatory but may be the most streamline for deployment


### ConfigFile

1. `default.conf`:  Defines the path and download links
2. `options/config_default`: Defines parameters for the experiment

### setup

simply run 

```bash
chmod +x setup.sh
bash -e setup.sh
```

This setup file will, by default, pull a container and data files from dropbox.


## Running psiturk

If using singularity, just do:

```bash
chmod +x start_psiturk.sh
./start_psiturk.sh --exp=stiffness|mass
```
prolidic ID: 000000000000000000000000
   
             
Otherwise


Navigate to the psiturk folder

```bash
cd cloth-psiturk-stiffness/psiturk
```

and run psiturk

```bash
psiturk -c
```

If you get an error about config run the following and try again

```bash
psiturk -C
```

## API

### task.js

The majority of the experiment's functionality is described in `psiturk/static/js/task.js` 

The main class used to setup pages for both the experiment and instructions is defined as `Page`.
`Page` handles both media presentation and scale setup. See the docstrings for more info.

There are three other main elements, `InstructionRunner`, `Quiz`, and `Experiment`. 


### css and html

The main html files are located under `psiturk/templates/` and css is under `psiturk/static/css`.

Notabley, `stage.html` describes the pages for experimental trials and `slider.css` describes some of the elements found in the scale. 


## Note
1. The .ai images used in the web pages can be downloaded [here](https://yale.box.com/s/gxb3hkrwt3d1chpzbr1gkk8s7aaommqi)
