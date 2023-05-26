
  (function() { 
    var redirectFormId = "11"; //leave it undefined to not redirect submission or change to formID

    if (typeof MauticFormCallback == 'undefined') {
    window.MauticFormCallback = {};
    }
   
    

    var handleResponse = {    
        onResponse: function (response) { 
            //console.log(response);
            var mautic_formName = response.formName;
            var theForm = document.getElementById("mauticform_" + mautic_formName);
            var formIdField = document.getElementById("mauticform_" + mautic_formName + "_id")
            var globalErrors = new Array();
            for (var field in response.validationErrors) {
                //check if validation Error is not a field, but an index
                if( /^\d+$/.test(field) ) {
                    globalErrors.push( response.validationErrors[field] );
                    continue;
                }
            }
        
            if( globalErrors.length > 0 ) {
                var errorContainer = document.getElementById("mauticform_" + mautic_formName + "_error");
                if( errorContainer ) {
                    errorContainer.innerHTML = globalErrors.join('<br />');
                }
                return false;
            }


            if (response.success && redirectFormId !== undefined && formIdField.value !== redirectFormId) {
                if (response.successMessage) {
                    var messageContainer = document.getElementById("mauticform_" + mautic_formName + "_message");
                    if( messageContainer )
                        { messageContainer.innerHTML = response.successMessage ; }
                }
                var formContainer = document.getElementById('mauticform_wrapper_' + mautic_formName);
                
                if (formContainer) {                    
                    formContainer.classList.add("mauticform-post-success");
                    var formContent = formContainer.querySelector( ".mauticform-innerform");
                    if(formContent)
                      { formContent.style.display ="none"; }

            
                    formIdField.value = redirectFormId;
                      var action = theForm.getAttribute("action");
                      action = action.replace(/(.*)(formId)=(\d*)(.*)/, ("$1$2="+redirectFormId+"$4") );                      
                      theForm.setAttribute("action", action);
                      theForm.submit();
                      return true;
                }

            }
        }
    };

    var mauticForms = document.querySelectorAll("form[data-mautic-form]");
    mauticForms.forEach( function(el) {
        var formName = el.getAttribute("data-mautic-form");
        MauticFormCallback[formName] = handleResponse;
    });
  

    
})()
