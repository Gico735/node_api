const hapi = require("hapi");
const mongoose = require("mongoose");
const Painting = require("./models/Painting");
const { graphqlHapi, graphiqlHapi } = require("apollo-server-hapi");
const schema = require("./graphql/schema");
const Inert = require("inert");
const Vision = require("vision");

mongoose.connect(
  "mongodb+srv://Gic0:qwe@dbfornodeapi-gkb8c.mongodb.net/test?retryWrites=true"
);
mongoose.connection.once("open", () => console.log("connected to DB"));

const server = hapi.server({ port: 3000, host: "localhost" });

const init = async () => {
  server.route([
    {
      method: "GET",
      path: "/",
      handler: () => "<h1>Our new API</h1>"
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      handler: () => Painting.find()
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
      handler: (req, reply) => {
        const { name, url, technique } = req.payload;
        const painting = new Painting({
          name,
          url,
          technique
        });
        return painting.save();
      }
    }
  ]);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Paintings API Documentation",
          version: Pack.version
        }
      }
    }
  ]);
  await server.register({
    plugin: graphqlHapi,
    options: {
      path: "/graphql",
      graphqlOptions: {
        schema
      },
      route: { cors: true }
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
