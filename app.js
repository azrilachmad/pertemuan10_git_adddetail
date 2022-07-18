// Use Express
const express = require("express");
const app = express();
const port = 3000;

// Utils
const {
  loadContact,
  findContact,
  saveContact,
  duplicateNameCheck,
  deleteContact,
  updateData
} = require("./utils/contacts");

// user express-ejs=layouts
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

// Use EJS
app.set("view engine", "ejs");

// User Morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// User Static File (Build in middleware)
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));

// User express=validator
const {
  body,
  validationResult,
  check
} = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// Config Flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: {
    maxAge: 6000
  },
  secret: 'secreet',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

// Routes
app.use("/api", express.static("public"));
app.use

// Application level middleware
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// Index (Home) Page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Webserver EJS",
    layout: "layouts/main-layout",
  });
});

// About Page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Webserver EJS",
    layout: "layouts/main-layout",
  });
});

// Contact Page
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  console.log(contacts);
  res.render("contact", {
    title: "User Contact List",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash('msg')
  });
});

// Add Data Page
app.get("/contact/add", (req, res) => {
  res.render("addContact", {
    title: "Form Add Contact",
    layout: "layouts/main-layout",
  });
});

// Submit Form Data Contact
app.post(
  "/contact",
  [
    body("name").custom((value) => {
      const duplicate = duplicateNameCheck(value);
      if (duplicate) {
        throw new Error("Contact name already exist!");
      }
      return true;
    }),
    check("email", "Invalid Email").isEmail(),
    check("mobile", "Invalid Phone Number").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('addContact', {
        title: "Form Add Contact",
        layout: "layouts/main-layout",
        errors: errors.array()
      })
    } else {
      saveContact(req.body)
      // Kirimkan flash message
      req.flash('msg', 'Success Input Data!')
      res.redirect('/contact')
    }
  }
);

// Detail Contact Page
app.get("/contact/:name", (req, res) => {
  console.log(req.params.name);
  const contacts = findContact(req.params.name);
  res.render("contactDetail", {
    title: "User Contact Detail",
    layout: "layouts/main-layout",
    contacts,
  });
});

// Delete user contact
app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name)

  // Check contact
  if (!contact) {
    res.status(404)
    res.send('<h1>404</h1>')
  } else {
    deleteContact(req.params.name)
    req.flash('msg', 'Contact has been deleted')
    res.redirect('/contact')
  }
})

// Edit data contact
app.get('/contact/edit/:name', (req, res) => {
  const contact = findContact(req.params.name)


  res.render('editContact', {
    title: 'Edit Data Contact',
    layout: 'layouts/main-layout',
    contact,
  })
})


// Update Data Contact
app.post('/contact/update', [
  body('name').custom((value, {
    req
  }) => {
    const duplicate = duplicateNameCheck(value);
    if (value !== req.body.oldName && duplicate) {
      throw new Error('Contact Name Already Exist! ');
    }

    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('mobile', 'No HP tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    res.render('editContact', {
      title: 'Form Ubah Data Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body
    });

  } else {

    updateData(req.body);
    req.flash('msg', 'Success Change Data')
    res.redirect('/contact');
  }


});


app.use("/", (req, res) => {
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});