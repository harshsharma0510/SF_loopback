export const CredentialsSchema ={
    type: 'object',
    required:['email', 'password'],
    properties: {
        email:{type: 'string', 
    format :'email'},
    password:{type: 'string', 
minLength:8,    
},
    },
};
export const CredentialsRequestBody = {
description:"input of login credentials",
required:true,
content:{
    'application/json':{
        schema: CredentialsSchema
    },
},

};