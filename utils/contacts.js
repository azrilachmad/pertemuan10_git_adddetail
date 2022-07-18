const fs = require("fs");
const validator = require("validator");

// cek folder JSON
const dirPath = "./data"; // Path Folder
// Buat folder jika folder belum ada
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// cek file JSON
const filePath = "./data/contacts.json"; // Path File
// Buat file jika folder belum ada
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', "utf-8");
}

// Fungsi Load File JSON
const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// Fungsi save data file JSON
const saveContact = (data) => {
  const contacts = loadContact();
  contacts.push(data);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
  console.log("Success Input Data!");
};


// Fungsi mencari data user di file JSON
const findContact = (name) => {
  const contacts = loadContact()

  const findUser = contacts.find(user => user.name.toLowerCase() === name.toLowerCase())
  if (findUser) {
    console.log(`User ${findUser.name}`)
  } else {
    console.log('User not found')
  }
  return findUser
}

// Fungsi cek nama duplikat
const duplicateNameCheck = (name) => {
  const contacts = loadContact()
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase())
  return contact;
}

// Fungsi Hapus kontak
const deleteContact = (name) => {
  const contacts = loadContact()
  const filter = contacts.filter((contact) => contact.name !== name)

  fs.writeFileSync("data/contacts.json", JSON.stringify(filter));
}

// Membuat fungsion Update data json
// Membuat fungsion Update data json
const updateData = (contactDataBaru) => {
  const contacts = loadContact();
  // hilangkan contact lama yang anamanya sama dengan oldNama
  const filteredContacts = contacts.filter((contact) => contact.name !== contactDataBaru.oldName);
  delete contactDataBaru.oldName;
  filteredContacts.push(contactDataBaru);
  saveUpdateContact(filteredContacts);

}

const saveUpdateContact = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));

}

module.exports = {
  loadContact,
  saveContact,
  findContact,
  duplicateNameCheck,
  deleteContact,
  updateData
};