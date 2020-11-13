import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import config from '@app/config';
import axios from 'axios';

const apiKey = '_';
const endpoint = 'https://api.weatherbit.io/v2.0/current';

// Create new express application
const app = express();

// Define graphQl schema
const schema = gql`
  type Query {
    currentWeatherInfo(city: String!, country: String): Weather
  }

  type Weather {
    description: String!
    pressure: Float!
    windSpeed: Float!
    windDirection: String!
    temperature: Float!
    cloudCoverage: String!

    aqi: Float!
    pm10: Float!
    pm25: Float!
  }
`;

// Resolvers will help us solve the queries
const resolvers = {
  Query: {
    currentWeatherInfo: async (_: any, { city, country }: any) => {
      let weatherURL;
      let airQualityURL;
      if (country) {
        weatherURL = `${endpoint}?city=${city}&country=${country}&key=${apiKey}`;
        airQualityURL = `${endpoint}/airquality?city=${city}&country=${country}&key=${apiKey}`;
      } else {
        weatherURL = `${endpoint}?city=${city}&key=${apiKey}`;
        airQualityURL = `${endpoint}/airquality?city=${city}&key=${apiKey}`;
      }

      console.log('CALLING : ', weatherURL, airQualityURL);

      const [weather, airQuality] = await Promise.all([
        axios.get(weatherURL).catch(() => {
          return { data: undefined };
        }),
        axios.get(airQualityURL).catch(() => {
          return { data: undefined };
        }),
      ]);

      if (!weather.data || !airQuality.data) {
        return null;
      }
      const weatherResult = weather.data.data[0];
      const airQualityResult = airQuality.data.data[0];

      return {
        description: weatherResult.weather.description,
        pressure: weatherResult.pres,
        windSpeed: weatherResult.wind_spd,
        windDirection: weatherResult.wind_cdir_full,
        temperature: weatherResult.temp,
        cloudCoverage: `${weatherResult.clouds}%`,

        aqi: airQualityResult.aqi,
        pm10: airQualityResult.pm10,
        pm25: airQualityResult.pm25,
      };
    },
  },
};

// Create new Apollo server, with the previously defined schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

// Connect Apollo (graphQL) server to the Express app
server.applyMiddleware({ app, path: config.GRAPHQL.PATH });

// Start server
app.listen(config.NODE.PORT, () =>
  console.log(`GraphQl server is running on http://localhost:${config.NODE.PORT}/graphql`),
);
