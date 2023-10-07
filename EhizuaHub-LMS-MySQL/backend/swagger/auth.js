
const options = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "EhizuaHub Upskill LMS API Documentation",
        description: "This is the documentation for Ehizuahub upskill lms api.",
        version: 'v2',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT}`,
        }
      ]
    },
    apis: ['./app.js'],

  };
  
  




module.exports = options;
