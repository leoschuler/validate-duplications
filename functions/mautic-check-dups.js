import fetch from "node-fetch";
import qs from 'querystring';

export async function handler(event, context)  {
    
    try {
        const secret = process.env.REQUEST_SECRET

        console.log(secret,event.headers.authorization )

        const body = qs.parse(event.body);
        console.log("body",body);

        if (event.httpMethod !== "POST" || event.headers.authorization !== secret) {
            return { statusCode: 500, body: "Method Not Allowed" };
        }

        const uniqueFields = event.queryStringParameters.uniqueFields || "";
        if( uniqueFields == "" ) {
            console.log("No Validation")
            return { statusCode: 200, body: "No Validation" };    
        }


        const formId = body['mautic_form[id]'];

        const BasicAuth = Buffer.from(`${process.env.MAUTIC_USER}:${process.env.MAUTIC_PASSWORD}`).toString('base64');
        const MauticHeader = {
            Authorization: `Basic ${BasicAuth}`,
            'Content-Type': "application/json",		
        };
        
        console.log(process.env.MAUTIC_URL);
        const vURL = `${process.env.MAUTIC_URL}/api/forms/${formId}/submissions`;
        console.log('url:', vURL);
        const requestSubmissions = await fetch( vURL,
        {
            method:"GET",
            headers:MauticHeader,            
        });

        const response = await requestSubmissions.json()
        
        console.log("response", response.total);
        if( response.total == 0 ) 
        { 
            console.log("No prior submission");
            return { statusCode: 200 , body: "No prior submission" };
        }
        
        
        const fields = uniqueFields.split(",");
        const fieldValues = {}
        fields.forEach( f => { fieldValues[f] = new Array();})
        
        let foundDuplicate = 0;


        for( let i = 0 ; i < response.submissions.length ; i++ ) {
            let formValues = response.submissions[i].results;
            console.log(formValues);
            for( let f = 0 ; f < fields.length ; f++) {
                if( body[fields[f]] == formValues[fields[f]] ) {
                    foundDuplicate += 1;
                    break;
                }
            }

            if( foundDuplicate > 1) break;
                
        }

        if( foundDuplicate <= 1 ) {
            console.log("No Duplication");
            return { statusCode: 200, body: "No Duplication" };
        }
            

        let errorMessage = "Uma Inscrição já foi realizada com a informação fornecida";
        if( fields.length == 1 ) {
            errorMessage = `${errorMessage} (${fields[0]})`;
        } else {

            if( fields.length > 2 ) {
                lastField = fields.splice(-1,1);
                errorMessage = `${errorMessage} (${fields.join(", ")} e/ou ${lastField[0]})`;
            } else {
                errorMessage = `${errorMessage} (${fields.join(" e/ou ")})`;
            }
        }

        console.log(errorMessage);
        return { statusCode: 500, body: errorMessage };

            

    } catch (e) {
        console.log("Execution Error");
        console.log(e)
        return { statusCode: 500, body: e.message };
    }
    // your server-side functionality update
};