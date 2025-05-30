var task = "stiffness";   // or mass
var WAITTIME = 6000;
var INSTUCT_WAITTIME = 3000;
var EXP_DURATION = 30;



// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var mycondition = condition; // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance; // which condition you have been assigned to

// Names of elements used in the experiment
var INS_INSTRUCTS = "instruct";
var FULL_CONTAINER = "full-container";
var MOVIESCREEN = "moviescreen";
var REGISTER = "register";
var TRIAL_INST = "qspan";
var RES_SLIDER = "trialRes";
var NEXTBUTTON = "nextbutton";
var PROGRESS = "progress";
var RELOAD = "reloadbutton";

var WINDOW_HEIGHT = $(window).height();
var WINDOW_WIDTH = $(window).width();
var MOVIE_resX = 1080;
var MOVIE_resY = 1080;

var condlist_total;
var fmovnm_left = '';
var fmovnm_mid = '';
var fmovnm_right = '';
var id_left = "thisvideo_left";
var id_mid = "thisvideo_mid";
var id_right = "thisvideo_right";
var correct_res;
var instructionPageLen = 9;   //6
var CATCH_PER_TRIAL = 10;    // one catch trial every 10 trials


/****************
 * Prolific ID  *
 ****************/

var participant_prolificID;

var ProlificID = function(fullcondlist, CATCH_PER_TRIAL, catch_wrong, task) {
    while (true) {
        participant_prolificID = prompt("Please enter (or copy/paste) your Prolific ID to proceed:");
        // a small check on length
        if (participant_prolificID){
	    if (participant_prolificID.length == 24) {
            	psiTurk.recordTrialData({
                	'prolific_id': participant_prolificID,
            	});
            	console.log("prolific_id recorded:", participant_prolificID);
            	InstructionRunner(fullcondlist, CATCH_PER_TRIAL, catch_wrong, task);
            	return;
	    }
        }
        alert("Make sure you enter the Prolific ID correctly, please try again.");
    }
}


// All pages to be loaded
var pages = [
    `instructions_${task}/instructions.html`,
    `instructions_${task}/instruct-1.html`,
    `instructions_${task}/instruct-2.html`,
    `instructions_${task}/instruct-3.html`,
    `instructions_${task}/instruct-4.html`,
    `instructions_${task}/instruct-5.html`,
    `instructions_${task}/instruct-6.html`,
    `instructions_${task}/instruct-7.html`,
    `instructions_${task}/instruct-8.html`,
    `instructions_${task}/instruct-9.html`,
    `instructions_${task}/instruct-10.html`,
    `congrates_page.html`,
    `quiz_${task}.html`,
    "restart.html",
    "stage.html",
    "postquestionnaire.html",
    "thanks.html"
];


psiTurk.preloadPages(pages);


var instructionPages = [ // add as a list as many pages as you like
    `instructions_${task}/instruct-1.html`,
    `instructions_${task}/instruct-2.html`,
    `instructions_${task}/instruct-3.html`,
    `instructions_${task}/instruct-4.html`,
    `instructions_${task}/instruct-5.html`,
    `instructions_${task}/instruct-6.html`,
    `instructions_${task}/instruct-7.html`,
    `instructions_${task}/instruct-8.html`,
    `instructions_${task}/instruct-9.html`,
    `instructions_${task}/instruct-10.html`,
];


// used to shuffle the array of trials: In-place generating randomized trials
var shuffle = function(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};


//
var make_mov = function(movname, is_intro, has_ctr) {
    if (typeof(is_intro) === 'undefined') {is_intro = false};
    if (typeof(has_ctr) === 'undefined') {has_ctr = true};
    var mcl = "movieobj_loading";
    var ctr = "";
    var movie_height = Math.floor($(window).height()*0.25);
    
    
    // scale the video if it is too wide for the screen
    if (MOVIE_resX*(movie_height/MOVIE_resY)*2+0.02*MOVIE_resX > $(window).height()) {
        movie_height = Math.floor(MOVIE_resY*$(window).height()/(MOVIE_resX*2.5));
    }
    
    
    var fmovnm_mid = "static/data/movies/" + movname[1];
    var fmovnm_left = "static/data/movies/" + movname[0];
    var fmovnm_right = "static/data/movies/" + movname[2];
    var foggnm_mid = fmovnm_mid.substr(0, fmovnm_mid.lastIndexOf('.')) + ".ogg";    
    var foggnm_left = fmovnm_left.substr(0, fmovnm_left.lastIndexOf('.')) + ".ogg";    
    var foggnm_right = fmovnm_right.substr(0, fmovnm_right.lastIndexOf('.')) + ".ogg";
  
    
    // get the correct answer
    if (task == 'stiffness') {
        if (fmovnm_left.split("_")[4] == fmovnm_mid.split("_")[4]) {
            correct_res = 1;
        } else {
            correct_res = -1;
        } 
    } else {
        if (fmovnm_left.split("_")[2] == fmovnm_mid.split("_")[2]) {
            correct_res = 1;
        } else {
            correct_res = -1;
        }   
    }
    
    
    var ret = `<div style="margin-left:0%">` +
      `<video id="${id_mid}" class="${mcl}" style="float:center; height:${movie_height}pt" preload loop>` +
      `<source src="${fmovnm_mid}" type="video/mp4"/>` +
      `<source src="${fmovnm_mid}" type="video/ogg">` +
      `Your browser does not support HTML5 mp4 video.</video>` +
      `</div>` + 
      `<div style="margin-left:0%">` +
      `<video id="${id_left}" class="${mcl}" style="height:${movie_height}pt; margin-right:2%" preload loop>` +
      `<source src="${fmovnm_left}" type="video/mp4" />` +
      `<source src="${fmovnm_left}" type="video/ogg">` +
      `Your browser does not support HTML5 mp4 video.</video>` + 
      `<video id="${id_right}" class="${mcl}" style="height:${movie_height}pt" preload loop>` +
      `<source src="${fmovnm_right}" type="video/mp4" />` +
      `<source src="${fmovnm_right}" type="video/ogg">` +
      `Your browser does not support HTML5 mp4 video.</video>` +
      `</div>`;
    
    return ret;
};



/********************
 * HTML manipulation
 *
 * All HTML files in the templates directory are requested
 * from the server when the PsiTurk object is created above. We
 * need code to get those pages from the PsiTurk object and
 * insert them into the document.
 *
 ********************/

var allowNext = function () {
    var button = document.getElementById(NEXTBUTTON);
    button.disabled = false;
    button.style.display = "inline-block";
};


var instRegion = function () {
    return `<h4> Which fabric, left or right, is more similar in its &nbsp <span style=\"color:blue;\"> ${task} </span> &nbsp to the center? </h4>`;
};   


var choiceRegion = function () {
    var choice_test = `<ul>`+ 
        `<li id="left-choice">`+
        `<input id="choiceA" type="radio" name="clothchoice" value="1"/>` +
        `<div class="check"></div>`+
        `<label for="choiceA"><i>Left</i></label>` +
        `</li>` +
        `<li id="right-choice">` +
        `<input id="choiceB" type="radio"  name="clothchoice" value="-1"/>` +
        `<div class="check"></div>` +
        `<label for="choiceB"><i>Right</i></label>` +    
        `</li>` +
        `</ul>`;
    return choice_test;
}





/**********************************************************************
       * Page: handles media representation and scale handling  *
 **********************************************************************/
class Page {
    /*******************
    * Public Methods  *
    *******************/
    constructor(text, mediatype, mediapath, show_response = false) {
        // page specific variables
        this.text = text;
        this.mediatype = mediatype;
        this.mediapath = mediapath;
        this.showResponse = show_response;    
        // html elements
        this.instruct = document.getElementById(INS_INSTRUCTS);     // =>"instruct"  
        this.mvsc = document.getElementById(MOVIESCREEN);         // => "moviescreen"
        this.inst = document.getElementById(TRIAL_INST);
        this.choice = document.getElementById(RES_SLIDER);
        this.next = document.getElementById(NEXTBUTTON);           // =>"nextbutton"
        this.next.disable = true;
        this.reloadbtn = document.getElementById(RELOAD);
        this.mediascreen = document.getElementById("mediascreen");
        if (this.mediascreen != null) {
            console.log(this.mediascreen)
            this.mediascreen.innerHTML = "";
        }
    }
    
    // Loads content to the page
    // The `callback` argument can be used to handle page progression
    // or subject responses
    showPage(callback) {
        // create callback to progress when done
        this.next.onclick = function() {
            callback();
        };

        if (this.mediatype !== 'fullscreen') {
            this.addText();           
        }

        // If there is a slider, then progression is contingent
        // on complete presentation of the media.
        this.addMedia();                                                        
    }
    
    
    // Returns the value of the slider
    retrieveResponse() {
        var rep = $('input[name=clothchoice]:checked', `#${RES_SLIDER}`).val();  
        return rep;
    }


    goFullscreen() {
        this.mediascreen.innerHTML = make_fullscreen_button();
        
        var fs_button = document.getElementById("fullscreen_button");
        let self = this;
        this.next.style.display = "none";
        if (this.text !== "") {
            this.instruct.innerHTML = this.text;
        }
        fs_button.onclick = function() {
            console.log("click registered for FS");
            openFullscreen();
            allowNext();
            //self.addResponse();
        }
    }


    /*********************************
              * Helpers  *
    ********************************/

    // injects text into page's inner html
    addText() {
        if (this.text !== "") {
            this.instruct.innerHTML = this.text;
            this.next.style.display = "none";
            setTimeout(function(){allowNext();}, INSTUCT_WAITTIME);
        }
    }
    
    
    // add videos
    addMedia() {
        if (this.mediatype === 'movie') {
            this.mvsc.innerHTML = make_mov(this.mediapath, true);
            
            var leftReady = false;
            var midReady = false;
            var rightReady = false;
            
            $(`#${id_mid}`)[0].onloadeddata = function() {
                if (leftReady == true && rightReady == true) {
                    $(`#${FULL_CONTAINER}`).removeClass("hide_elements");
                    $(`#${REGISTER}`).removeClass("hide_elements");
                    $(`#${id_mid}`)[0].play();
                    $(`#${id_left}`)[0].play();
                    $(`#${id_right}`)[0].play();
                } else {
                    midReady = true;
                }
            };
            
            $(`#${id_left}`)[0].onloadeddata = function() {
                if (midReady == true && rightReady == true) {
                    $(`#${FULL_CONTAINER}`).removeClass("hide_elements");
                    $(`#${REGISTER}`).removeClass("hide_elements");
                    $(`#${id_mid}`)[0].play();
                    $(`#${id_left}`)[0].play();
                    $(`#${id_right}`)[0].play();
                } else {
                    leftReady = true;
                }
            };
            
            $(`#${id_right}`)[0].onloadeddata = function() {
                if (midReady == true && leftReady == true) {
                    $(`#${FULL_CONTAINER}`).removeClass("hide_elements");
                    $(`#${REGISTER}`).removeClass("hide_elements");
                    $(`#${id_mid}`)[0].play();
                    $(`#${id_left}`)[0].play();
                    $(`#${id_right}`)[0].play();
                } else {
                    rightReady = true;
                } 
            } 

            this.showMovie();
        } else if (this.mediatype == 'fullscreen'){
            this.goFullscreen();
            // if (this.text !== "") {
            //     this.instruct.innerHTML = this.text;
            //     this.next.style.display = "none";
            //     setTimeout(function(){allowNext();}, INSTUCT_WAITTIME);
            // }
        }
    }
    
    addInst() {
        this.inst.innerHTML = instRegion();
    }
    
    addChoice() {
        this.choice.innerHTML = choiceRegion();
    }
    
    
    // The form will automatically enable the next button
    enableResponse() {
        allowNext();    
    }
    
    //
    clearMovies() {
        this.mvsc.innerHTML = "";
        
        // disable the left and right choice
        if (this.choice != null){
            this.choice.innerHTML = "";
        }   
    }
    
    
    // plays movie
    showMovie() {
        let me = this; 
        // The "next" botton will only activate after recording a response
        if (this.showResponse) {
            // show slider
            me.addInst();
            me.next.style.display = "none";
            
            setTimeout(function(){ 
                // show left and right choice options
                me.addChoice();
                // show "next" button when the slider has been moved
                $(`#${RES_SLIDER} input`).on('change', function() {
                    me.enableResponse();
                    //console.log($('input[name=clothchoice]:checked', '#trialRes').val()); 
                })}, WAITTIME);
      }
  }
};
      
      

/**********************************************************************
                            * Instructions *
 **********************************************************************/
var InstructionRunner = function(condlist, CATCH_PER_TRIAL, catch_wrong, task) {    
    
    psiTurk.showPage(`instructions_${task}/instructions.html`);
    
    var instruct = document.getElementById(INS_INSTRUCTS);   //[wb]: the instruction container
    var reloadbtn = document.getElementById(RELOAD);   //[wb]:RELOAD = "reloadbutton";
    var nTrials = condlist.length;
    
    if (task=='stiffness') {
        var taskIns = ' Stiffness indicates the firmness and hardness of the cloth, and how easy the cloth generates wrinkles. ';
        // Each instruction is an array of 4 elements
        // 1: The text to be shown (if any)
        // 2: The type of format (image, movie, text, scale)
        // 3: Any media needed (can be an empty string, "left.mov")
        // 4: Whether to show the response div (true/false)
        var instructions = [
            [
                "Hi! This experiment requires you to be using a <b>desktop browser</b>. The program should have automatically detected whether you are using a phone or a tablet. If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now. " +
                "If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.<br>" +
                "If you are on a desktop browser -- great! Click <b>Next</b> to continue.",
                "", "", false],
            [
                "Thank you for volunteering to help out with our study.<br>" +
                "<ul>" +
                "<li><span>&#10145;</span> Please take a moment to adjust your seating so that you can comfortably watch the monitor and use the keyboard/mouse." +
                "<li><span>&#10145;</span> Feel free to dim the lights as well." +
                "<li><span>&#10145;</span> Close the door or do whatever is necessary to minimize disturbance during the experiment." +
                "<li><span>&#10145;</span> Please also take a moment to silence your phone so that you are not interrupted by any messages mid-experiment." +
                "</ul><br>" +
                "Click <b>Next</b> when you are ready to continue.",
                "", "", false],
            [
                "This experiment requires you to be in <b>full screen</b> mode. The experiment will switch to full screen mode when you press the button below.<br>" +
                "Don't worry, we will return your browser to its normal size later. If you do need to leave in the middle, you can press the ESC key -- but please avoid this. Your responses are only useful to us if you stay in this mode until the end of the experiment.<br>"+
                "Click <b>Switch to full screen</b> and then <b>Next</b> to continue.",
                "fullscreen", "", false],
            [
                "The study is designed to be <i>challenging</i>. Sometimes, you'll be certain about what you saw. Other times, you won't be -- and this is okay! Just give your best guess each time.",
                "", "", false],
            [
                `I know it is also difficult to stay focused for so long, especially when you are doing the same thing over and over. But remember, the experiment will be all over in less than ${EXP_DURATION} minutes. Please do your best to remain focused! Your responses will only be useful to me if you remain focused.`,
                "", "", false]
        ];
    } else if (task=='mass') {
        var taskIns = ' Mass indicates how heavy the cloth is.';
        
        var instructions = [
            // ["Your task in this experiment is to judge the cloth mass. <br> Mass describes how heavy the cloth is. <br>" +
            //  "Stiffer cloth tends to be less likely to wrinkle. <br>",
            //  "", "", false],
            
            // ["The cloth you will see in the experiment will not vary in their mass but they will also have different stiffness values: some cloth will be softer and some will be stiffer. <br>" +
            //  "In the next few slides, we will show you some of the examples of cloth that you might see in this experiment.",
            //  "", "", false]
             ];
        }

        
    var ninstruct = instructions.length;
    
    
    // Plays next instruction or exits.
    // If there is another page, it is reach via callback in `page.showPage`
    var do_page = function(i) {
        if (i < ninstruct) {
            var page = new Page(...instructions[i]); //[wb]:...change an array to a list of parameters
            page.showPage(function() {
                page.clearMovies();
                do_page(i + 1);
            });
        } else {
            // show instruct-2.html ~ instruct-n.html
            showInsList(1, instructionPageLen);

        };
    };


    var showInsList = function (i, n) {
        psiTurk.showPage(`instructions_${task}/instruct-${i}.html`);
        this.next = document.getElementById(NEXTBUTTON); 
        this.next.style.display = "none";

        setTimeout(function(){allowNext();}, INSTUCT_WAITTIME);

        // [wb]: Open the pop-up box
        $(".showAnswerA").click(function(){
            var answers = document.getElementById("answers");
            console.log(answers);
            answers.innerHTML ="<span style=\"color:red;\">Wrong!</span>"
        })
        
        $(".showAnswerB").click(function(){
            var answers = document.getElementById("answers");
            console.log(answers);
            answers.innerHTML ="<span style=\"color:green;\">Correct! </br></span> <span>Click \"Next\" to move on.</span>"
        })

        $('#nextbutton').click(function(){
            if (i < n) {
                showInsList(i+1, n);
            } else {
                end();
            }
        });
    };   


    // end of instruction
    var end = function() {
        psiTurk.finishInstructions();
        //[wb]: Do quiz first
        quiz(condlist,
            function() {InstructionRunner(condlist, CATCH_PER_TRIAL, catch_wrong, task)},
            function() {currentview = new Experiment(condlist, CATCH_PER_TRIAL, catch_wrong, task)})
//        currentview = new Experiment(condlist);   // [wb]: skip the practice
    };
    
    
    // run the loop
    do_page(0);
};



/**********************************************************************
                            * Quiz *
 **********************************************************************/
// Describes the comprehension check
var loop = 1;
var quiz = function(condlist, goBack, goNext) {
    function record_responses() {
        var allRight = true;
        $('select').each(function(i, val) {
            psiTurk.recordTrialData({
                'phase': "INSTRUCTQUIZ",
                'question': this.id,
                'answer': this.value
            });
            
            if (this.id === 'trueFalse1' && this.value != 'c') {
                allRight = false;
            } else if (this.id === 'trueFalse2' && this.value != 'a') {
                allRight = false;
            }
        });
        
        return allRight;
    };
    
    
    if (task=='stiffness') {
        psiTurk.showPage('quiz_stiffness.html');
    } else if (task=='mass') {
        psiTurk.showPage('quiz_mass.html');
    } else {
        console.error("Wrong task type!");
    };
    
    
    
    $('#nextbutton').click(function() {
        if (record_responses()) {
            // Record that the user has finished the instructions and
            // moved on to the experiment. This changes their status code
            // in the database.
            psiTurk.recordUnstructuredData('instructionloops', loop);
            psiTurk.finishInstructions();
            console.log('Finished instructions');

            psiTurk.showPage(`congrates_page.html`);
            document.getElementById('trialNumber').innerHTML = condlist.length;

            // Show congratulations page.
            $('#nextbutton').click(function(){
                goNext()
            });
        } else {
            // Otherwise, replay the instructions...
            loop++;
            psiTurk.showPage('restart.html');
            $('.continue').click(function() {
                //psiTurk.doInstructions(instructionPages, goBack)
                goBack();
            });
        }
    });
};




/**********************************************************************
                            * Experiment *
 **********************************************************************/
var Experiment = function(triallist, CATCH_PER_TRIAL, catch_wrong, task) {
    psiTurk.showPage('stage.html');
    
    var screen = document.getElementById(MOVIESCREEN);
    var button = document.getElementById(NEXTBUTTON);
    var prog = document.getElementById(PROGRESS);
    var reloadbtn = document.getElementById(RELOAD);
    var curidx = 0;
    var starttime = -1;
    var isCatch = false;
    
    // uses `Page` to show a single trial
    var runTrial = function(curIdx) {
        // We've reached the end of the experiment
        if (curIdx === triallist.length) {
            end();
        }
        
        // // If get 2 trials wrong in line
        // if (catch_wrong >= MAX_WRONG_CATCH) {
        //     end();
        // }
            
        
        // the catch trial
        // if (curIdx > 0 && (curIdx+1)%(CATCH_PER_TRIAL+1)== 0) {
        //     isCatch = true;
        // } else {
        //     isCatch = false;
        // }
        
        isCatch=false;  
        
        var flnm = triallist[curIdx];
        show_progress(curIdx);
        starttime = new Date().getTime();

        var pg = new Page("", "movie", flnm, true);

        // `Page` will record the subject responce when "next" is clicked
        // and go to the next trial
        pg.showPage(function() {
            //$("full-container").style.width = WINDOW_WIDTH;
            register_response(pg, curIdx);
            pg.clearMovies();
            $(`#${FULL_CONTAINER}`).addClass("hide_elements");
            $(`#${REGISTER}`).addClass("hide_elements");
            runTrial(curIdx + 1);
        });
    };
    
    
    // Record the subject's response for a given trial.
    var register_response = function(trialPage, cIdx) {
        var rt = new Date().getTime() - starttime;
        var rep = trialPage.retrieveResponse(); 
        
        //console.log(cIdx, rep, isCatch);
        
        
        
        if (isCatch == true ) {
            if (rep != correct_res) {
                catch_wrong = catch_wrong + 1;
            } else {
                catch_wrong = 0;
            }
        }
        //console.log(correct_res);
        
        psiTurk.recordTrialData({
            'TrialName': triallist[cIdx],
            'isCatch': isCatch,
            'Res': rep,
            'Correct_Res': correct_res,
            'ReactionTime': rt,
            'WaitTime': WAITTIME,
            'IsInstruction': false,
            'TrialOrder': cIdx,
            'leftVid':fmovnm_left,
            'midVid':fmovnm_mid,
            'rightVid':fmovnm_right,
            'participant_ID':participant_prolificID
        });
    };

    
    //
    var end = function() {
        psiTurk.saveData({
            success: function(){console.log("Successfully logged data.")},
            error: function(){console.log("Failed to log data.")}
        });
        new Questionnaire();
    };

    // show current trial number
    var show_progress = function(cIdx) {
        prog.innerHTML = (cIdx + 1) + " / " + (triallist.length);
    };

    
    // Let's begin!
    runTrial(0);
};




/****************
 * Questionnaire *
 ****************/

var Questionnaire = function() {
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";
    
    record_responses = function() {
        psiTurk.recordTrialData({
            'phase': 'postquestionnaire',
            'status': 'submit'
        });
        
        $('textarea').each(function(i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        
        $('select').each(function(i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
    };
    
    
    prompt_resubmit = function() {
        document.body.innerHTML = error_message;
        $("#resubmit").click(resubmit);
    };
    
    resubmit = function() {
        document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
        reprompt = setTimeout(prompt_resubmit, 10000);
        
        psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
                psiTurk.computeBonus('compute_bonus', function() {
                    finish()
                });
            },
            error: prompt_resubmit
        });
    };

  // Load the questionnaire snippet
    psiTurk.showPage('postquestionnaire.html');
    psiTurk.recordTrialData({
        'phase': 'postquestionnaire',
        'status': 'begin'
    });
    
    $("#next").click(function() {
        record_responses();
        psiTurk.saveData({
        success: function() {
            console.log("Successfully logged the Questionnaire data.");
//            setTimeout(function(){psiTurk.completeHIT()}, 1000);
            psiTurk.completeHIT(); // when finished saving compute bonus, the quit
        },
            error: function(){
                console.log("Failed to log the Questionnaire data");
                prompt_resubmit;
            }
        });
    });
};



/*************************************************************************
                            * Main: Ran Task *
 ************************************************************************/
$(window).load(function() {
    // Load in the conditions
    function do_load() {
        if (task == "stiffness") {
            theURL = "static/data/condlist_stiffness_" + mycondition +".json";
        } else if (task == "mass"){
            theURL = "static/data/condlist_mass_" + mycondition +".json";       
        };
        
        $.ajax({
            dataType: 'json',
            url: theURL,
            async: false,   //[wb]: will get a warning?
            success: function(data) {
                //console.log(data.condition)
                //condlist = shuffle(data.condition);
                condlist = (data.condition);
                if (task != data.task) {console.error("Wrong task type!")};
                //InstructionRunner(condlist, data.task);
                ProlificID(condlist, 0, 0, task);   
            },
            error: function() {
                setTimeout(500, do_load)
            },
            failure: function() {
                setTimeout(500, do_load)
            }
        });
  
        
        // $.ajax({
        //     dataType: 'json',
        //     url: "static/data/catch_trials.json",
        //     async: false,
        //     success: function(data1) {
        //         //console.log(data.condition)
        //         condlist_catch_trials = data1.condition;
        //         fullcondlist=[];
        //         catchN = 1;
                
        //         catchTotal = Math.floor(condlist.length/CATCH_PER_TRIAL);
        //         catch_wrong = 0;
                
        //         while (catchN <= catchTotal) {
        //             fullcondlist = fullcondlist.concat(condlist.slice((catchN-1)*CATCH_PER_TRIAL, catchN*CATCH_PER_TRIAL));
        //             fullcondlist = fullcondlist.concat([condlist_catch_trials[catchN-1]]);
        //             catchN = catchN + 1;
        //         }
                
        //         fullcondlist = fullcondlist.concat(condlist.slice((catchN-1)*CATCH_PER_TRIAL, condlist.length));
        //         //InstructionRunner(fullcondlist, CATCH_PER_TRIAL, catch_wrong, task);  
        //         ProlificID(fullcondlist, CATCH_PER_TRIAL, catch_wrong, task);   
        //     },
        //     error: function() {
        //         setTimeout(5000, do_load())
        //     },
        //     failure: function() {
        //         setTimeout(5000, do_load())
        //     }
        // });
        
        
       
    };
 

    if (isMobileTablet()){
        console.log("mobile browser detected");
        alert(`Sorry, but mobile or tablet browsers are not supported. Please switch to a desktop browser or return the hit.`);
        return;
    }   
    
    do_load();
});
