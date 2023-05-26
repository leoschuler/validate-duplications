MauticFormCallback['replaceWithFormName'] = {
    onResponse: function (response) {
         // called to process the response to the form submission
    },

    onValidate: function() {
        // before form validation
        var formIsGood = True;
        var dontUpdate = False;
        if(dontUpdate){
            return null; //continue with out-of-the-box validation
        }else if(formIsGood){
            return True; // form is Valid
        }else if(!formIsGood){
            return False; // form is invalid
        }
    },
   onErrorMark: function (messageObject) {
    // called prior to default message insertion
    },
};
