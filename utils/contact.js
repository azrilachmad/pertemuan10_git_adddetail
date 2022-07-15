// node modules
const fs = require('fs');
const validator = require('validator')

// Path file contacts.json
const dataPath= './data/contacts.json'

// Function to load contact data
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts= JSON.parse(file);
    return contacts;
}

// Function to show list of JSON data
const detailContact = (name) => {
    const contacts = loadContact()
    const findName = contacts.find(contact => contact.name === name)
    return findName
   
};
// Export
module.exports = { 
    loadContact, 
    detailContact,
}
