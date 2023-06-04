
const Ajv = require("ajv");
const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) console.log(validate.errors);
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
addFormats(ajv);

const signupSchema = {
  type: "object",
  properties: {
    userName: { type: "string", minLength: 2 },
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
    repassword: { type: "string", format: "password" },
  },
  required: ["userName", "email", "password"],
  additionalProperties: true,
};

const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
  required: ["email", "password"],
  additionalProperties: true,
};