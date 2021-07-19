const TAB_KEYCODE = 9;
const ENTER_KEYCODE = 13;
const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;
const CAPSLOCK_KEYCODE = 20;
const ESCAPE_KEYCODE = 27;
const PAGEUP_KEYCODE = 33;
const PAGEDOWN_KEYCODE = 34;
const END_KEYCODE = 35;
const HOME_KEYCODE = 36;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const RIGHTARROW_KEYCODE = 39;
const DOWNARROW_KEYCODE = 40;
const V_KEYCODE = 86;
const Y_KEYCODE = 89;
const Z_KEYCODE = 90;
const ALTGR_KEYCODE = 225;

const unaffectingKeys = [TAB_KEYCODE,
                        ENTER_KEYCODE,
                        SHIFT_KEYCODE,
                        CTRL_KEYCODE,
                        ALT_KEYCODE,
                        CAPSLOCK_KEYCODE,
                        ESCAPE_KEYCODE,
                        LEFTARROW_KEYCODE,
                        PAGEUP_KEYCODE,
                        PAGEDOWN_KEYCODE,
                        END_KEYCODE,
                        HOME_KEYCODE,
                        LEFTARROW_KEYCODE,
                        UPARROW_KEYCODE,
                        RIGHTARROW_KEYCODE,
                        DOWNARROW_KEYCODE,
                        ALTGR_KEYCODE];

function UndoRedoManager(pMathLineInput) {
    this.mathLineInput = pMathLineInput;
    this.typedHistory = [this.mathLineInput.mathField.latex()];
    this.ctrlIsDown = false;
    this.altIsDown = false;
    this.YIsDown = false;
    this.ZIsDown = false;
    this.currentState = 0;
    this.buffSize = 50;

    this.insertStr = (pStr) => {
        this.mathLineInput.mathField.typedText(pStr);
    };

    this.rearrangeTypedArray = () => {
        if (this.typedHistory.length > this.buffSize) {
            let sizeOverflow = this.typedHistory.length - this.buffSize;
            this.currentState = this.currentState - sizeOverflow;
            this.typedHistory = this.typedHistory.slice(this.buffSize * (-1));
        }
    };

    this.isKeyIsUnaffecting = (pKey) => {
        return unaffectingKeys.includes(pKey);
    };

    this.checkIfSpecialKeysAreUpAndSetStates = (pUppedKey) => {
        switch (pUppedKey) {
            case CTRL_KEYCODE:
                this.ctrlIsDown = false;
                break;

            case ALT_KEYCODE:
                this.altIsDown = true;
                break;

            case Y_KEYCODE:
                this.YIsDown = false;
                break;

            case Z_KEYCODE:
                this.ZIsDown = false;
                break;
        }
    }

    this.checkIfSpecialKeysAreDownAndSetStates = (pDownedKey) => {
        switch (pDownedKey) {
            case CTRL_KEYCODE:
                this.ctrlIsDown = true;
                break;

            case ALT_KEYCODE:
                this.altIsDown = true;
                break;

            case Y_KEYCODE:
                this.YIsDown = true;
                break;

            case Z_KEYCODE:
                this.ZIsDown = true;
                break;
        }
    }

    this.saveState = () => {
        if (this.currentState !== (this.typedHistory.length - 1)) {
            this.typedHistory = this.typedHistory.slice(0, (this.currentState + 1));
        }   
        
        this.typedHistory.push(this.mathLineInput.mathField.latex());
        this.rearrangeTypedArray();
        this.currentState++;
    };

    this.undo = () => {
        if (this.currentState !== 0) {
            this.currentState--;
            this.mathLineInput.mathField.latex(this.typedHistory[this.currentState]);
        }  else {
            //console.log('do nothing');
        }
    };

    this.simulateKeyPress = (pCode) => {
        jQuery.event.trigger({ type : 'keypress', which : pCode });
      }

    this.redo = () => {
        if (this.currentState < (this.typedHistory.length - 1)) {
            this.currentState++;
            this.mathLineInput.mathField.latex(this.typedHistory[this.currentState]);
        } else {
            //console.log('do nothing');
        }
    };

    this.setEvents = () => {
        this.mathLineInput.jQEl.on('keyup', (e) => {
            this.checkIfSpecialKeysAreUpAndSetStates(e.which);
            
            //log in typedHistory
            if ((this.isKeyIsUnaffecting(e.which) === false)
                && (this.ctrlIsDown === false || (this.ctrlIsDown && e.which === V_KEYCODE))) {
                this.saveState();
            }
        });
    
        this.mathLineInput.jQEl.on('keydown', (e) => {
            //console.log(e.which)
            console.log(this.mathLineInput.mathField.latex());
            this.checkIfSpecialKeysAreDownAndSetStates(e.which);

            if (e.which === ESCAPE_KEYCODE) {
                if (!(this.mathLineInput.autocompleter.AutoCompleterManager.autoCompletionWidget.isVisible)) {
                    this.mathLineInput.mathField.blur();
                }
            }

            //set shortcuts
            if (this.ctrlIsDown) {
                e.preventDefault();

                switch (e.which) {
                    //ctrl + D
                    case 68:
                        this.mathLineInput.mathField.write('\\partial ');
                        break;

                    //ctrl + F
                    case 70:
                        this.mathLineInput.mathField.write('\\forall');
                        break;

                    //ctrl + right
                    case 39:
                        this.mathLineInput.mathField.write('\\rightarrow');
                        break;
        
                    //ctrl + left
                    case 37:
                        this.mathLineInput.mathField.write('\\leftarrow');
                        break;
        
                    //ctrl + B
                    case 66:
                        this.mathLineInput.mathField.typedText('\\vec ');
                        break;

                    //ctrl + S
                    case 83:
                        this.mathLineInput.mathField.write('\\sum');
                        break;

                    //ctrl + P
                    case 80:
                        this.mathLineInput.mathField.write('\\prod');
                        break;
        
                    //ctrl + I
                    case 73:
                        this.mathLineInput.mathField.write('\\in');
                        break;

                    //ctrl + R
                    case 82:
                        this.mathLineInput.mathField.write('\\R');
                        break;

                    //ctrl + Q
                    case 81:
                        this.mathLineInput.mathField.write('\\Q');
                        break;

                    //ctrl + Z
                    case 90:
                        this.mathLineInput.mathField.write('\\Z');
                        break;

                    //ctrl + N
                    case 78:
                        this.mathLineInput.mathField.write('\\N');
                        break;
                }
            }
                
            //ctrl+z
            if (this.ctrlIsDown && this.ZIsDown) {
                e.preventDefault();
                this.undo();
            }
    
            //ctrl + y
            if (this.ctrlIsDown && this.YIsDown) {
                e.preventDefault();
                this.redo();
            }
        });
    };

    this.init = () => {
        this.setEvents();
    }

    this.init();
}

(function getCursorPosition() {
    
})();