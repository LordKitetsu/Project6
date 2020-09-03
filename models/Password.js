const passwordValidator = require('password-validator');
 
// création d'un schema pour le mot de passe, pour renforcer la sécurité
const passwordSchema = new passwordValidator();
 
// ajout de propriétés que le mot de passe doit respecter
passwordSchema
.is().min(8)                                    // Minimum length 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema;